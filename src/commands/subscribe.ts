import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ready } from "../db";
import type { InteractionModule } from "../types";

const module: InteractionModule<ChatInputCommandInteraction> = {
	data: new SlashCommandBuilder()
		.setName("subscribe")
		.setDescription("Subscribe to notifications"),
	async execute(client, interaction) {
		const db = await ready();

		const channel = interaction.channel;
		const guild = interaction.guild;
		const user = interaction.user;
		if (!channel || !guild) {
			await interaction.reply({
				content: "You can't use this command in DMs.",
				ephemeral: true,
			});
			return;
		}

		await interaction.deferReply({ ephemeral: true });

		await db
			.insertInto("Subscription")
			.values({
				chan: channel.id,
				guild: guild.id,
				user: user.id,
			})
			.onConflict((oc) => oc.column("chan").doNothing())
			.execute();

		await interaction.editReply({ content: "Subscribed to notifications." });
	},
};

export const data = module.data;
export const execute = module.execute;
