import fs from "node:fs";
import path from "node:path";
import { REST, Routes } from "discord.js";
import debug from "./log";
import type { InteractionModule } from "./types";

const log = debug("register");

/**
 * Read and register all commands in a directory.
 * @param token The bot token.
 * @param id The bot id.
 * @param directory The directory to read commands from.
 * @returns The registered commands.
 */
export async function register(
	token: string,
	id: string,
	directory: string,
): Promise<Map<string, InteractionModule>> {
	log("Started refreshing application (/) commands.");

	const dir = path.resolve(__dirname, directory);
	log(`Loading commands from ${dir}`);

	const commands: InteractionModule[] = [];
	for (const file of fs.readdirSync(dir).filter((file) => file.endsWith(".js"))) {
		const js = path.join(dir, file);
		log(`Loading command from ${js}`);
		const command = require(js);
		commands.push("default" in command ? command.default : command);
	}

	const rest = new REST().setToken(token);
	await rest.put(Routes.applicationCommands(id), {
		body: commands.map((command) => command.data.toJSON()),
	});

	log(`Successfully reloaded ${commands.length} application (/) commands.`);

	return new Map(commands.map((command) => [command.data.name, command]));
}
