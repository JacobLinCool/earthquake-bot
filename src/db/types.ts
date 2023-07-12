import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type History = {
	/**
	 * Earthquake ID
	 */
	identifier: string;
	/**
	 * Report number
	 */
	number: number;
	time: string;
	lat: number;
	lon: number;
	depth: number;
	magnitude: number;
};
export type Subscription = {
	/**
	 * Discord channel ID
	 */
	chan: string;
	/**
	 * Discord user ID
	 */
	user: string;
	/**
	 * Discord guild ID
	 */
	guild: string;
	created: Generated<string>;
};
export type DB = {
	History: History;
	Subscription: Subscription;
};
