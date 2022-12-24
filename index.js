import {
  ActivityType,
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";

import { config } from "dotenv";

import { readdirSync } from "node:fs";

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const rest = new REST({ version: 10 }).setToken(process.env.TOKEN);

async function initialize() {
  console.clear();

  console.log("Initializing Haruko...");
  console.log("Reading command files...");

  const commandsDir = "./src/commands/";
  const commandFiles = readdirSync(commandsDir).filter((file) =>
    file.endsWith(".js")
  );

  const commands = [];

  for (const commandFile of commandFiles) {
    await import(`${commandsDir}${commandFile}`).then(
      (command) => {
        client.commands.set(command.default.info["name"], command.default);

        commands.push(command.default.info.toJSON());
      }
    );
  }

  try {
    console.log("Registering commands to Discord API...");

    await rest.put(Routes.applicationCommands(process.env["CLIENTID"]), {
      body: commands,
    });

    console.log("Completed without errors.");
    console.log(`Haruko running on version ${process.env.npm_package_version}`);
  } catch (error) {
    console.log(error);
  }
}

initialize();

client.once(Events.ClientReady, () => {
  client.user.setActivity("you ;)", { type: ActivityType.Watching });
  client.user.setStatus("idle");
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  await command.execute(client, interaction);
});

client.login(process.env.TOKEN);
