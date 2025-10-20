export type CurrencyCode = string; // ISO-4217 or crypto ticker

export interface SymbolInfo {
	symbol: string; // e.g., EUR/USD or AAPL or XAUUSD
	base: string;   // e.g., EUR
	quote: string;  // e.g., USD
	venue?: string; // exchange or provider
	kind: "forex" | "stock" | "commodity" | "crypto";
	tickSize?: number; // price precision
	lotSize?: number;  // quantity precision
}

export interface QuoteTick {
	symbol: string;
	bid?: number;
	ask?: number;
	last?: number;
	ts: number; // epoch ms
}

export interface Candle {
	symbol: string;
	timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d";
	open: number;
	high: number;
	low: number;
	close: number;
	volume?: number;
	ts: number;
}
