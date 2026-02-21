import { Events, ActivityType } from 'discord.js';
import { logger } from '../../Functions/Logger.js';

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    logger.info(`Conectado como ${client.user.tag}`);

    const activities = [{ name: 'discord.gg/mxrp', type: ActivityType.Watching }];

    setInterval(() => {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      client.user.setActivity(activity.name, { type: activity.type });
    }, 10_000);
  },
};
