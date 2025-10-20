/*
	Typed env loader placeholder. Replace with zod or valibot schema later.
*/

export type AppEnv = {
	NODE_ENV: "development" | "test" | "production";
	PORT: number;
	DATABASE_URL?: string;
	REDIS_URL?: string;
};

// Declare process to satisfy TS when @types/node isn't present in this package
// This will be removed once runtime wiring is in place.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any;

export const loadEnv = (): AppEnv => ({
	NODE_ENV: (process.env.NODE_ENV as AppEnv["NODE_ENV"]) || "development",
	PORT: parseInt(process.env.PORT || "4000", 10),
	DATABASE_URL: process.env.DATABASE_URL,
	REDIS_URL: process.env.REDIS_URL,
});

