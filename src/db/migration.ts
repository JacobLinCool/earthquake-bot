import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("History")
		.addColumn("identifier", "text", (col) => col.primaryKey())
		.addColumn("number", "integer", (col) => col.notNull())
		.addColumn("time", "text", (col) => col.notNull())
		.addColumn("lat", "real", (col) => col.notNull())
		.addColumn("lon", "real", (col) => col.notNull())
		.addColumn("depth", "real", (col) => col.notNull())
		.addColumn("magnitude", "real", (col) => col.notNull())
		.execute();

	await db.schema
		.createTable("Subscription")
		.addColumn("chan", "text", (col) => col.primaryKey())
		.addColumn("user", "text", (col) => col.notNull())
		.addColumn("guild", "text", (col) => col.notNull())
		.addColumn("created", "text", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("History").execute();
	await db.schema.dropTable("Subscription").execute();
}
