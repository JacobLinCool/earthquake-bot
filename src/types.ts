import type { Client, Interaction, SlashCommandBuilder } from "discord.js";

export interface InteractionModule<I extends Interaction = Interaction> {
	data: SlashCommandBuilder;
	execute: (client: Client, interaction: I) => Promise<void>;
}
