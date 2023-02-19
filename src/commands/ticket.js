import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export default {
  info: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Create a new ticket to the admin(s).")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type of the ticket.")
        .setRequired(true)
        .setChoices({ name: "Suggestion", value: "Suggestion" })
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Message of the ticket.")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    const options = interaction.options;

    const id = Math.random().toString(16).slice(2).toUpperCase();

    await client.channels.cache.get(process.env.TICKETCHANNELID).send({
      embeds: [
        new EmbedBuilder()
          .setColor("Purple")
          .setTitle(`${options.getString("type")}:`)
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setDescription(options.getString("message"))
          .setTimestamp()
          .setFooter({
            text: `ID: ${id}`,
          }),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("accept")
            .setLabel("Accept")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("decline")
            .setLabel("Decline")
            .setStyle(ButtonStyle.Danger)
        ),
      ],
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Purple")
          .setTitle("Ticket sent!")
          .setDescription(
            "Please wait patiently for a bureaucrat to review your ticket."
          )
          .setTimestamp()
          .setFooter({
            text: `ID: ${id}`,
          }),
      ],
      ephemeral: true,
    });
  },
};
