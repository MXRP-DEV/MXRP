import { Client, Partials, GatewayIntentBits } from 'discord.js';
import { LoadEvents } from './src/Handlers/eventHandler.js';
import { LoadCommands } from './src/Handlers/commandHandler.js';
import { LoadComponents } from './src/Handlers/ComponentHandler.js';
import { databaseManager } from './src/Database/connection.js';
import { loadEnvFile } from 'node:process';
loadEnvFile();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
});

await databaseManager.connect();

await LoadEvents(client);
await LoadComponents(client);
await LoadCommands(client);

client.login(process.env.DISCORD_TOKEN);
