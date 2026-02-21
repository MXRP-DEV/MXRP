import { Client, Partials, Options, GatewayIntentBits } from 'discord.js';
import { LoadEvents } from './src/Handlers/eventHandler.js';
import { LoadCommands } from './src/Handlers/commandHandler.js';
import { LoadComponents } from './src/Handlers/ComponentHandler.js';
import { databaseManager } from './src/Database/connection.js';
import { loadEnvFile } from 'node:process';
loadEnvFile();

const client = new Client({
  intents: [
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.DirectMessagePolls,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildExpressions,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessagePolls,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.SoundboardSound,
    Partials.ThreadMember,
    Partials.User,
  ],
  makeCache: Options.cacheWithLimits({
    MessageManager: 50,
    ThreadManager: 50,
    GuildMemberManager: {},
    UserManager: {},
    ReactionManager: 0,
    GuildBanManager: 0,
    GuildInviteManager: 0,
    StageInstanceManager: 0,
  }),
  sweepers: {
    messages: {
      interval: 300,
      lifetime: 600,
    },
    threads: {
      interval: 3600,
      lifetime: 14400,
    },
  },
});

await databaseManager.connect();

await LoadEvents(client);
await LoadComponents(client);
await LoadCommands(client);

client.login(process.env.DISCORD_TOKEN);
