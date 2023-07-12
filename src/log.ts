import debug from "debug";

const log = debug("bot");
debug.enable("bot:*");

export default (name: string) => log.extend(name);
