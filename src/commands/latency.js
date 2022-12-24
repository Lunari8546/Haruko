import { SlashCommandBuilder } from "discord.js";

export default {
  info: new SlashCommandBuilder()
    .setName("latency")
    .setDescription("Checks the latency.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type of latency.")
        .setRequired(true)
        .addChoices(
          { name: "API", value: "API" },
          { name: "Bot", value: "Bot" }
        )
    ),
  async execute(client, interaction) {
    const value =
      interaction.options.getString("type") == "API"
        ? Math.round(client.ws.ping)
        : Math.abs(Date.now() - interaction.createdTimestamp);

    await interaction.reply({
      content: `${interaction.options.getString("type")} latency: ${value}ms`,
      ephemeral: true,
    });
  },
};
