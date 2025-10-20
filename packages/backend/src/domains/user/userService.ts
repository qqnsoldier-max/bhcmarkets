import { randomUUID } from "node:crypto";
import type { Logger } from "../../config/logger.js";
import type {
  CreateCredentialParams,
  CreateSessionParams,
  CreateUserParams,
  DeviceMetadata,
  SessionInvalidationReason,
  SessionView,
  User,
  UserCredential,
  UserCredentialRepository,
  UserRepository,
  UserRole,
  UserSession,
  UserSessionRepository,
  UserStatus,
  UUID,
} from "./user.types.js";

const DEFAULT_ACCESS_TOKEN_TTL_SECONDS = 15 * 60; // 15 minutes
const DEFAULT_REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days
const DEFAULT_MAX_SESSIONS_PER_USER = 10;

export type AuthErrorCode =
  | "EMAIL_ALREADY_REGISTERED"
  | "INVALID_CREDENTIALS"
  | "USER_NOT_ACTIVE"
  | "USER_SUSPENDED"
  | "SESSION_NOT_FOUND"
  | "SESSION_REVOKED"
  | "SESSION_EXPIRED"
  | "REFRESH_TOKEN_INVALID"
  | "REFRESH_TOKEN_REUSED"
  | "REFRESH_TOKEN_EXPIRED"
  | "UNKNOWN_USER"
  | "PASSWORD_MISMATCH";

export class AuthError extends Error {
  constructor(public readonly code: AuthErrorCode, message?: string) {
    super(message ?? code);
    this.name = "AuthError";
  }
}

export interface SecretHasher {
  hash(plain: string): Promise<string>;
  verify(plain: string, hashed: string): Promise<boolean>;
}

export interface Clock {
  now(): Date;
}

export type IdFactory = () => UUID;

export interface AccessTokenClaims {
  sub: UUID;
  sessionId: UUID;
  role: UserRole;
  version: number;
  issuedAt: string;
  expiresAt: string;
}

export interface RefreshTokenClaims {
  sub: UUID;
  sessionId: UUID;
  sessionVersion: number;
  passwordVersion: number;
  issuedAt: string;
  expiresAt: string;
}

export interface TokenManager {
  issueAccessToken(payload: AccessTokenClaims, ttlSeconds: number): Promise<string>;
  issueRefreshToken(payload: RefreshTokenClaims, ttlSeconds: number): Promise<string>;
  parseRefreshToken(token: string): Promise<RefreshTokenClaims | null>;
}

export interface UserServiceConfig {
  accessTokenTtlSeconds: number;
  refreshTokenTtlSeconds: number;
  maxSessionsPerUser: number;
}

export interface UserServiceDependencies {
  userRepository: UserRepository;
  credentialRepository: UserCredentialRepository;
  sessionRepository: UserSessionRepository;
  passwordHasher: SecretHasher;
  tokenHasher?: SecretHasher;
  tokenManager: TokenManager;
  clock?: Clock;
  idFactory?: IdFactory;
  logger?: Logger;
  config?: Partial<UserServiceConfig>;
}

export interface AuthTokens {
  tokenType: "Bearer";
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface AuthenticationResult {
  user: User;
  session: SessionView;
  tokens: AuthTokens;
}

export interface RegistrationInput {
  email: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
  device?: DeviceMetadata;
  issueSession?: boolean;
}

export interface AuthenticationInput {
  email: string;
  password: string;
  device?: DeviceMetadata;
}

export interface RefreshSessionInput {
  refreshToken: string;
  device?: DeviceMetadata;
}

export interface LogoutInput {
  sessionId: UUID;
  userId?: UUID;
  reason?: SessionInvalidationReason;
}

export interface LogoutAllInput {
  userId: UUID;
  excludeSessionId?: UUID;
  reason?: SessionInvalidationReason;
}

export interface UpdatePasswordInput {
  userId: UUID;
  currentPassword?: string;
  newPassword: string;
  invalidateOtherSessions?: boolean;
}

export interface UserService {
  register(input: RegistrationInput): Promise<AuthenticationResult | { user: User }>;
  authenticate(input: AuthenticationInput): Promise<AuthenticationResult>;
  refreshSession(input: RefreshSessionInput): Promise<AuthenticationResult>;
  logout(input: LogoutInput): Promise<void>;
  logoutAll(input: LogoutAllInput): Promise<void>;
  updatePassword(input: UpdatePasswordInput): Promise<void>;
  getUserById(id: UUID): Promise<User | null>;
  listActiveSessions(userId: UUID): Promise<SessionView[]>;
}

const defaultClock: Clock = { now: () => new Date() };
const defaultIdFactory: IdFactory = () => randomUUID();

const toSessionView = (session: UserSession): SessionView => {
  const { refreshTokenHash: _hash, ...rest } = session;
  return rest;
};

const ensureUserActive = (user: User): void => {
  if (user.status === "pending" || user.status === "deleted") {
    throw new AuthError("USER_NOT_ACTIVE");
  }
  if (user.status === "suspended") {
    throw new AuthError("USER_SUSPENDED");
  }
};

const verifyRefreshTokenFreshness = (
  session: UserSession,
  claims: RefreshTokenClaims,
): void => {
  if (session.refreshTokenVersion !== claims.sessionVersion) {
    throw new AuthError("REFRESH_TOKEN_INVALID");
  }
  if (session.passwordVersion !== claims.passwordVersion) {
    throw new AuthError("REFRESH_TOKEN_INVALID");
  }
};

const pruneSessions = async (
  sessionRepository: UserSessionRepository,
  userId: UUID,
  limit: number,
  excludeSessionId: UUID | undefined,
  clock: Clock,
): Promise<void> => {
  if (!limit || limit < 1) return;
  const sessions = await sessionRepository.listActiveByUser(userId);
  if (sessions.length <= limit) return;

  const ordered = sessions
    .filter((session) => (excludeSessionId ? session.id !== excludeSessionId : true))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const surplus = ordered.slice(0, Math.max(0, ordered.length - limit));
  if (!surplus.length) return;

  const closedAt = clock.now().toISOString();
  await Promise.all(
    surplus.map((session) =>
      sessionRepository.markInactive(session.id, "session_limit", closedAt),
    ),
  );
};

export const createUserService = (deps: UserServiceDependencies): UserService => {
  const {
    userRepository,
    credentialRepository,
    sessionRepository,
    passwordHasher,
    tokenHasher = passwordHasher,
    tokenManager,
    clock = defaultClock,
    idFactory = defaultIdFactory,
    logger,
  } = deps;

  const config: UserServiceConfig = {
    accessTokenTtlSeconds: deps.config?.accessTokenTtlSeconds ?? DEFAULT_ACCESS_TOKEN_TTL_SECONDS,
    refreshTokenTtlSeconds: deps.config?.refreshTokenTtlSeconds ?? DEFAULT_REFRESH_TOKEN_TTL_SECONDS,
    maxSessionsPerUser: deps.config?.maxSessionsPerUser ?? DEFAULT_MAX_SESSIONS_PER_USER,
  };

  const normalizeEmail = (email: string): string => email.trim().toLowerCase();

  const issueInitialSession = async (
    user: User,
    credential: UserCredential,
    device?: DeviceMetadata,
  ): Promise<AuthenticationResult> => {
    const issuedAt = clock.now();
    const refreshExpiresAt = new Date(issuedAt.getTime() + config.refreshTokenTtlSeconds * 1000);
    const accessExpiresAt = new Date(issuedAt.getTime() + config.accessTokenTtlSeconds * 1000);
    const sessionId = idFactory();

    const refreshToken = await tokenManager.issueRefreshToken(
      {
        sub: user.id,
        sessionId,
        sessionVersion: 1,
        passwordVersion: credential.version,
        issuedAt: issuedAt.toISOString(),
        expiresAt: refreshExpiresAt.toISOString(),
      },
      config.refreshTokenTtlSeconds,
    );

    const refreshTokenHash = await tokenHasher.hash(refreshToken);

    const sessionRecord: CreateSessionParams = {
      id: sessionId,
      userId: user.id,
      refreshTokenHash,
      refreshTokenVersion: 1,
      passwordVersion: credential.version,
      status: "active",
      ipAddress: device?.ipAddress,
      userAgent: device?.userAgent,
      createdAt: issuedAt.toISOString(),
      lastSeenAt: issuedAt.toISOString(),
      expiresAt: refreshExpiresAt.toISOString(),
    };

    const storedSession = await sessionRepository.create(sessionRecord);
    const accessToken = await tokenManager.issueAccessToken(
      {
        sub: user.id,
        sessionId: storedSession.id,
        role: user.role,
        version: storedSession.refreshTokenVersion,
        issuedAt: issuedAt.toISOString(),
        expiresAt: accessExpiresAt.toISOString(),
      },
      config.accessTokenTtlSeconds,
    );

    return {
      user,
      session: toSessionView(storedSession),
      tokens: {
        tokenType: "Bearer",
        accessToken,
        accessTokenExpiresAt: accessExpiresAt.toISOString(),
        refreshToken,
        refreshTokenExpiresAt: refreshExpiresAt.toISOString(),
      },
    };
  };

  const rotateSession = async (
    session: UserSession,
    user: User,
    device?: DeviceMetadata,
  ): Promise<AuthenticationResult> => {
    const issuedAt = clock.now();
    const refreshExpiresAt = new Date(issuedAt.getTime() + config.refreshTokenTtlSeconds * 1000);
    const accessExpiresAt = new Date(issuedAt.getTime() + config.accessTokenTtlSeconds * 1000);
    const nextVersion = session.refreshTokenVersion + 1;

    const refreshToken = await tokenManager.issueRefreshToken(
      {
        sub: user.id,
        sessionId: session.id,
        sessionVersion: nextVersion,
        passwordVersion: session.passwordVersion,
        issuedAt: issuedAt.toISOString(),
        expiresAt: refreshExpiresAt.toISOString(),
      },
      config.refreshTokenTtlSeconds,
    );

    const refreshTokenHash = await tokenHasher.hash(refreshToken);

    const updatedSession = await sessionRepository.replaceRefreshToken({
      sessionId: session.id,
      refreshTokenHash,
      refreshTokenVersion: nextVersion,
      expiresAt: refreshExpiresAt.toISOString(),
      lastSeenAt: issuedAt.toISOString(),
      ipAddress: device?.ipAddress,
      userAgent: device?.userAgent,
    });

    if (!updatedSession) {
      throw new AuthError("SESSION_NOT_FOUND");
    }

    const accessToken = await tokenManager.issueAccessToken(
      {
        sub: user.id,
        sessionId: updatedSession.id,
        role: user.role,
        version: updatedSession.refreshTokenVersion,
        issuedAt: issuedAt.toISOString(),
        expiresAt: accessExpiresAt.toISOString(),
      },
      config.accessTokenTtlSeconds,
    );

    return {
      user,
      session: toSessionView(updatedSession),
      tokens: {
        tokenType: "Bearer",
        accessToken,
        accessTokenExpiresAt: accessExpiresAt.toISOString(),
        refreshToken,
        refreshTokenExpiresAt: refreshExpiresAt.toISOString(),
      },
    };
  };

  const register: UserService["register"] = async (input) => {
    const email = normalizeEmail(input.email);
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AuthError("EMAIL_ALREADY_REGISTERED");
    }

    const timestamp = clock.now().toISOString();
    const userId = idFactory();

    const userRecord: CreateUserParams = {
      id: userId,
      email,
      role: input.role ?? "user",
      status: input.status ?? "pending",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const user = await userRepository.create(userRecord);

    const passwordHash = await passwordHasher.hash(input.password);
    const credentialRecord: CreateCredentialParams = {
      userId: user.id,
      passwordHash,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
      passwordUpdatedAt: timestamp,
    };

    const credential = await credentialRepository.create(credentialRecord);

    if (input.issueSession === false) {
      return { user };
    }

    const result = await issueInitialSession(user, credential, input.device);
    await pruneSessions(sessionRepository, user.id, config.maxSessionsPerUser, result.session.id, clock);
    await userRepository.updateLastLogin?.(user.id, result.session.createdAt);
    return result;
  };

  const authenticate: UserService["authenticate"] = async (input) => {
    const email = normalizeEmail(input.email);
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AuthError("INVALID_CREDENTIALS");
    }

    ensureUserActive(user);

    const credential = await credentialRepository.getByUserId(user.id);
    if (!credential) {
      throw new AuthError("INVALID_CREDENTIALS");
    }

    const passwordMatches = await passwordHasher.verify(input.password, credential.passwordHash);
    if (!passwordMatches) {
  await credentialRepository.recordFailedAttempt?.(user.id, clock.now().toISOString());
  logger?.warn("Invalid login attempt", { userId: user.id });
      throw new AuthError("INVALID_CREDENTIALS");
    }

    await credentialRepository.resetFailedAttempts?.(user.id);

    const result = await issueInitialSession(user, credential, input.device);
    await pruneSessions(sessionRepository, user.id, config.maxSessionsPerUser, result.session.id, clock);
    await userRepository.updateLastLogin?.(user.id, result.session.createdAt);
    return result;
  };

  const refreshSession: UserService["refreshSession"] = async ({ refreshToken, device }) => {
    const claims = await tokenManager.parseRefreshToken(refreshToken);
    if (!claims) {
      throw new AuthError("REFRESH_TOKEN_INVALID");
    }

    const session = await sessionRepository.getById(claims.sessionId);
    if (!session) {
      throw new AuthError("SESSION_NOT_FOUND");
    }

    if (session.status !== "active") {
      throw new AuthError("SESSION_REVOKED");
    }

    const now = clock.now();
    if (new Date(session.expiresAt) <= now) {
      await sessionRepository.markInactive(session.id, "expired", now.toISOString());
      throw new AuthError("SESSION_EXPIRED");
    }

    const tokenMatches = await tokenHasher.verify(refreshToken, session.refreshTokenHash);
    if (!tokenMatches) {
      await sessionRepository.markInactive(session.id, "suspicious_activity", now.toISOString());
      throw new AuthError("REFRESH_TOKEN_REUSED");
    }

    verifyRefreshTokenFreshness(session, claims);

    const user = await userRepository.findById(session.userId);
    if (!user) {
      throw new AuthError("UNKNOWN_USER");
    }

    ensureUserActive(user);

    return rotateSession(session, user, device);
  };

  const logout: UserService["logout"] = async ({ sessionId, userId, reason }) => {
    const session = await sessionRepository.getById(sessionId);
    if (!session) return;
    if (userId && session.userId !== userId) {
      throw new AuthError("SESSION_NOT_FOUND");
    }
    if (session.status !== "active") return;
    await sessionRepository.markInactive(session.id, reason ?? "manual", clock.now().toISOString());
  };

  const logoutAll: UserService["logoutAll"] = async ({ userId, excludeSessionId, reason }) => {
    await sessionRepository.markInactiveByUser(userId, reason ?? "logout_all", clock.now().toISOString(), {
      excludeSessionId,
    });
  };

  const updatePassword: UserService["updatePassword"] = async ({
    userId,
    currentPassword,
    newPassword,
    invalidateOtherSessions = true,
  }) => {
    const credential = await credentialRepository.getByUserId(userId);
    if (!credential) {
      throw new AuthError("UNKNOWN_USER");
    }

    if (currentPassword) {
      const matches = await passwordHasher.verify(currentPassword, credential.passwordHash);
      if (!matches) {
        throw new AuthError("PASSWORD_MISMATCH");
      }
    }

    const nextHash = await passwordHasher.hash(newPassword);
    const timestamp = clock.now().toISOString();
    const nextVersion = credential.version + 1;

    await credentialRepository.updatePassword(userId, {
      passwordHash: nextHash,
      version: nextVersion,
      passwordUpdatedAt: timestamp,
      updatedAt: timestamp,
    });

    if (invalidateOtherSessions) {
      await sessionRepository.markInactiveByUser(userId, "password_rotated", timestamp);
    }
  };

  const getUserById: UserService["getUserById"] = (id) => userRepository.findById(id);

  const listActiveSessions: UserService["listActiveSessions"] = async (userId) => {
    const sessions = await sessionRepository.listActiveByUser(userId);
    return sessions.map(toSessionView);
  };

  return {
    register,
    authenticate,
    refreshSession,
    logout,
    logoutAll,
    updatePassword,
    getUserById,
    listActiveSessions,
  };
};

export type { UserService as AuthDomainService };
