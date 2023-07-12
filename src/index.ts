import { Events } from "discord.js";
import { client } from "./client";
import { TOKEN, ID } from "./config";
import { MQTT } from "./mqtt";
import { register } from "./register";

main();

async function main() {
	const commands = await register(TOKEN, ID, "./commands");

	client.on(Events.InteractionCreate, async (interaction) => {
		if (interaction.isChatInputCommand()) {
			const { commandName: command } = interaction;
			const cmd = commands.get(command);
			if (cmd) {
				await cmd.execute(client, interaction);
			} else {
				await interaction.reply({
					content: "Unknown command.",
					ephemeral: true,
				});
			}
		}
	});

	await client.login(TOKEN);

	const mqtt = MQTT();
}
