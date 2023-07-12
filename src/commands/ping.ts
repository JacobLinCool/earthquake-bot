import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import debug from "../log";
import type { InteractionModule } from "../types";

const log = debug("command:ping");

const module: InteractionModule<ChatInputCommandInteraction> = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
	async execute(client, interaction) {
		log("Pong!");
		await interaction.reply({ content: "Pong!", ephemeral: true });
	},
};

export const data = module.data;
export const execute = module.execute;
