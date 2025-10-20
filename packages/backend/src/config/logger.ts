/*
	Minimal logger facade; swap with pino later.
*/

export interface Logger {
	info: (msg: string, meta?: Record<string, unknown>) => void;
	error: (msg: string, meta?: Record<string, unknown>) => void;
	warn: (msg: string, meta?: Record<string, unknown>) => void;
}

export const logger: Logger = {
	info: (msg, meta) => console.log(JSON.stringify({ level: "info", msg, ...meta })),
	error: (msg, meta) => console.error(JSON.stringify({ level: "error", msg, ...meta })),
	warn: (msg, meta) => console.warn(JSON.stringify({ level: "warn", msg, ...meta })),
};

