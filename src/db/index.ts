import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect, Migrator } from "kysely";
import debug from "../log";
import { up, down } from "./migration";
import { DB } from "./types";

const log = debug("db");
log.enabled = true;

const db = new Kysely<DB>({
	dialect: new SqliteDialect({
		database: new SQLite("data/db.sqlite"),
	}),
});

let _migrated: Promise<void> | undefined;
export async function ready() {
	if (!_migrated) {
		log("migrating database ...");
		_migrated = migrate(db).then(async () => {
			const tables = await db.introspection.getTables();
			log("migrated", tables);
		});
	}
	await _migrated;

	return db;
}

async function migrate(db: Kysely<DB>) {
	const migrator = new Migrator({
		db,
		provider: {
			async getMigrations() {
				return {
					init: { up, down },
				};
			},
		},
	});

	await migrator.migrateToLatest();
}

export * from "./migration";
export * from "./types";
