import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  info: new SlashCommandBuilder()
    .setName("latency")
    .setDescription("Show the latency of API or Bot.")
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
    const type = interaction.options.getString("type");

    const value =
      type == "API"
        ? Math.round(client.ws.ping)
        : Math.abs(Date.now() - interaction.createdTimestamp);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Purple")
          .setTitle(`${type} latency:`)
          .setDescription(`${value}ms`)
          .setTimestamp(),
      ],
      ephemeral: true,
    });
  },
};
