function getGuildConfig() {
  return {
    MXRP: {
      id: process.env.GUILD_MXRP,
      name: 'MXRP',
      description: 'Servidor principal MXRP',
      enabled: true,
      color: '#FF6B6B',
    },
    MXRPDI: {
      id: process.env.GUILD_MXRPDI,
      name: 'MXRP Departamento Interno',
      description: 'Servidor de Departamento Interno',
      enabled: true,
      color: '#4ECDC4',
    },
    MXRPDR: {
      id: process.env.GUILD_MXRPDR,
      name: 'MXRP Departamento Rol',
      description: 'Servidor de Departamento Rol',
      enabled: true,
      color: '#4ECDC4',
    },
    MXRPVA: {
      id: process.env.GUILD_MXRPVA,
      name: 'MXRP Vinculación',
      description: 'Servidor de Vinculación',
      enabled: true,
      color: '#45B7D1',
    },
    DEV: {
      id: process.env.GUILD_DEV,
      name: 'Development',
      description: 'Servidor de desarrollo',
      enabled: true,
      color: '#95E1D3',
    },
  };
}

export const GUILD_CONFIG = getGuildConfig();

export const COMMAND_SCOPES = {
  GLOBAL: 'global',
  MXRP: 'MXRP',
  MXRPDI: 'MXRPDI',
  MXRPDR: 'MXRPDR',
  MXRPVA: 'MXRPVA',
  DEV: 'DEV',
  MXRP_NETWORK: 'mxrp_network',
  ADMIN_ONLY: 'admin_only',
};

export const SCOPE_TO_GUILDS = {
  [COMMAND_SCOPES.GLOBAL]: null,
  [COMMAND_SCOPES.MXRP]: ['MXRP'],
  [COMMAND_SCOPES.MXRPDI]: ['MXRPDI'],
  [COMMAND_SCOPES.MXRPDR]: ['MXRPDR'],
  [COMMAND_SCOPES.MXRPVA]: ['MXRPVA'],
  [COMMAND_SCOPES.DEV]: ['DEV'],
  [COMMAND_SCOPES.MXRP_NETWORK]: ['MXRP', 'MXRPDI', 'MXRPVA', 'MXRPDR'],
  [COMMAND_SCOPES.ADMIN_ONLY]: ['MXRP', 'MXRPDI'],
};

export function getGuildIdsForScope(scope) {
  const guilds = SCOPE_TO_GUILDS[scope];

  if (guilds === null) {
    return null;
  }

  if (!guilds) {
    throw new Error(`Scope inválido: ${scope}`);
  }

  const currentConfig = getGuildConfig();

  return guilds.map((guildKey) => currentConfig[guildKey]?.id).filter((id) => id !== undefined);
}

export function canExecuteInGuild(commandScope, guildId) {
  if (commandScope === COMMAND_SCOPES.GLOBAL) {
    return true;
  }

  const allowedGuildIds = getGuildIdsForScope(commandScope);
  return allowedGuildIds && allowedGuildIds.includes(guildId);
}

export function getGuildInfo(guildId) {
  return Object.values(GUILD_CONFIG).find((guild) => guild.id === guildId);
}

export function getScopeForGuild(guildId) {
  const config = getGuildConfig();

  for (const [scopeKey, scopeValue] of Object.entries(COMMAND_SCOPES)) {
    if (scopeValue === 'global') continue;

    const guildIds = getGuildIdsForScope(scopeValue);
    if (guildIds && guildIds.includes(guildId)) {
      return scopeValue;
    }
  }

  return COMMAND_SCOPES.GLOBAL;
}

export function getEnabledGuilds() {
  return Object.entries(GUILD_CONFIG)
    .filter(([_, config]) => config.enabled)
    .map(([key, config]) => ({ key, ...config }));
}
