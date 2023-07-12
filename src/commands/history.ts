import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { ready } from "../db";
import type { InteractionModule } from "../types";
import { EarthquakeEmbed } from "../ui/notification";

const module: InteractionModule<ChatInputCommandInteraction> = {
	data: new SlashCommandBuilder().setName("history").setDescription("Get history notifications"),
	async execute(client, interaction) {
		const db = await ready();

		const history: {
			number: number;
			identifier: string;
			time: string;
			lat: number;
			lon: number;
			depth: number;
			magnitude: number;
		}[] = await db
			.selectFrom("History")
			.selectAll()
			.limit(5)
			.orderBy("History.identifier", "desc")
			.execute();

		const embeds = history.map((h) => {
			const embed = new EarthquakeEmbed({
				id: h.identifier,
				time: new Date(h.time).getTime(),
				lat: h.lat,
				lon: h.lon,
				depth: h.depth,
				magnitude: h.magnitude,
			});

			return embed;
		});

		await interaction.reply({ embeds });
	},
};

export const data = module.data;
export const execute = module.execute;
