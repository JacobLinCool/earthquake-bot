import { EmbedBuilder } from "discord.js";

export class EarthquakeEmbed extends EmbedBuilder {
	constructor(payload: {
		id: string;
		time: number;
		lat: number;
		lon: number;
		depth: number;
		magnitude: number;
	}) {
		super();

		this.setTitle(payload.id)
			.setTimestamp(new Date(payload.time))
			.setURL(
				`https://www.google.com/maps/@${payload.lat},${payload.lon},8z?q=loc:${payload.lat},${payload.lon}`,
			);

		this.addFields(
			{
				name: "震央",
				value: `${payload.lat}, ${payload.lon}`,
			},
			{
				name: "深度",
				value: `${payload.depth} km`,
			},
			{
				name: "規模",
				value: `${payload.magnitude}`,
			},
		);
	}
}
