import { Client, Events, GatewayIntentBits } from "discord.js";
import debug from "./log";

const log = debug("client");

export const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

client.on(Events.ClientReady, () => {
	log(`Logged in as ${client.user?.tag}!`);
});
