/*
	HTTP API composition layer
	- Define route registrars per domain (auth, accounts, orders, etc.)
	- Keep controller thin: validate -> call service -> map result
	- This file exports registrars for integration with the http server/router
*/

export type RouteRegistrar = (app: unknown) => void; // placeholder, replace with Fastify/Express

export const registrars: RouteRegistrar[] = [];

