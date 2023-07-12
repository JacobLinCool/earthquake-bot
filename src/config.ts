import { config } from "dotenv";

config();

export const TOKEN = process.env.TOKEN || "";
if (!TOKEN) {
	throw new Error("No token provided");
}

export const ID = process.env.ID || "";
if (!ID) {
	throw new Error("No ID provided");
}

export const MQTT_URL = process.env.MQTT_URL || "";
if (!MQTT_URL) {
	throw new Error("No MQTT_URL provided");
}

export const MQTT_USERNAME = process.env.MQTT_USERNAME || "";
if (!MQTT_USERNAME) {
	throw new Error("No MQTT_USERNAME provided");
}

export const MQTT_PASSWORD = process.env.MQTT_PASSWORD || "";
if (!MQTT_PASSWORD) {
	throw new Error("No MQTT_PASSWORD provided");
}

export const MQTT_TOPIC = process.env.MQTT_TOPIC || "";
if (!MQTT_TOPIC) {
	throw new Error("No MQTT_TOPIC provided");
}
