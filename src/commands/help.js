import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
  info: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show all commands available."),
  async execute(client, interaction) {
    const fields = [];

    await client.commands.forEach((value, key) => {
      fields.push({
        name: key,
        value: value["info"]["description"],
        inline: true,
      });
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Purple")
          .setTitle(`Commands:`)
          .setFields(fields)
          .setTimestamp(),
      ],
      ephemeral: true,
    });
  },
};
