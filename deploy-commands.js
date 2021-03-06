const fs = require("node:fs");
const path = require("node:path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const Config = require("./config.json");

const globalCommands = [];
const localCommands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command.global) {
    globalCommands.push(command.data.toJSON());
  } else {
    localCommands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: "9" }).setToken(Config.TOKEN);

// global commands
rest.put(Routes.applicationCommands(Config.APP_ID), {
  body: globalCommands,
});

// local commands
rest.put(Routes.applicationGuildCommands(Config.APP_ID, Config.GUILD_ID), {
  body: localCommands,
});

console.log("Successfully registered global and local commands");
