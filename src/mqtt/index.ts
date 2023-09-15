import { connect } from "mqtt";
import { client } from "../client";
import { MQTT_URL, MQTT_USERNAME, MQTT_PASSWORD, MQTT_TOPIC } from "../config";
import { ready } from "../db";
import debug from "../log";
import { EarthquakeEmbed } from "../ui/notification";

const log = debug("mqtt");
log.enabled = true;

export function MQTT() {
	const mqtt = connect(MQTT_URL, {
		username: MQTT_USERNAME,
		password: MQTT_PASSWORD,
	});

	log("connecting", MQTT_URL, MQTT_USERNAME);

	mqtt.on("connect", () => {
		log("connected");
		mqtt.subscribe(MQTT_TOPIC, { qos: 1 });
	});

	mqtt.on("message", async (topic, message) => {
		if (topic !== MQTT_TOPIC) {
			return;
		}

		try {
			const db = await ready();

			const data: Message = JSON.parse(message.toString());

			if ("cmd" in data) {
				const payload: Payload = JSON.parse(data.cmd);
				log("received", payload);

				const exists = await db
					.selectFrom("History")
					.where("History.identifier", "=", payload.identifier)
					.select("History.identifier")
					.executeTakeFirst();

				if (!exists) {
					const subscriptions = await db
						.selectFrom("Subscription")
						.select("Subscription.chan")
						.execute();

					const embed = new EarthquakeEmbed({
						id: payload.identifier,
						time: payload.originTime,
						lat: payload.epicenterLat,
						lon: payload.epicenterLon,
						depth: payload.depth,
						magnitude: payload.magnitude,
					});

					subscriptions.map(async (sub) => {
						const log = debug(`notification:${payload.identifier}:${sub.chan}`);
						log.enabled = true;
						log(
							"dilivering notification for",
							payload.identifier,
							"to",
							sub.chan,
							"...",
						);

						const chan = await client.channels.fetch(sub.chan);
						if (!chan || !chan.isTextBased()) {
							log("cannot find channel to send notification", sub.chan);
							return;
						}

						await chan.send({
							content: `**地震速報**`,
							embeds: [embed],
						});

						log("delivered notification for", payload.identifier, "to", sub.chan);
					});
				}

				await db
					.insertInto("History")
					.values({
						identifier: payload.identifier,
						number: payload.number,
						time: new Date(payload.originTime).toISOString(),
						lat: payload.epicenterLat,
						lon: payload.epicenterLon,
						depth: payload.depth,
						magnitude: payload.magnitude,
					})
					.onConflict((oc) =>
						oc.column("identifier").doUpdateSet({
							number: payload.number,
							time: new Date(payload.originTime).toISOString(),
							lat: payload.epicenterLat,
							lon: payload.epicenterLon,
							depth: payload.depth,
							magnitude: payload.magnitude,
						}),
					)
					.execute();
				log("updated into history", payload.identifier);
			}
		} catch {}
	});

	return mqtt;
}

interface Message {
	id: string;
	deviceId: string;
	time: string;
	cmd: string;
}

interface Payload {
	identifier: string;
	number: number;
	originTime: number;
	epicenterLat: number;
	epicenterLon: number;
	depth: number;
	magnitude: number;
	sendTime: number;
	pgaAdj: number;
	description: string;
}
