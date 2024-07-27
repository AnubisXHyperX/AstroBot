const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modmail')
    .setDescription('Displays the modmail button'),

  async execute (interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Contact Staff')
      .setDescription(
        'Click the button below to open a modmail ticket with the staff.'
      )
      .setColor('Red')

    const button = new ButtonBuilder()
      .setCustomId('open-modmail')
      .setLabel('Open Modmail')
      .setStyle(ButtonStyle.Danger)

    const row = new ActionRowBuilder().addComponents(button)

    await interaction.reply({
      embeds: [embed],
      components: [row]
    })
  }
}
