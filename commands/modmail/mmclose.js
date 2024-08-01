const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mmclose')
    .setDescription('Closes an open ticket'),

  async execute (interaction) {
    const channel = interaction.channel

    if (!channel.name.includes('-modmail')) {
      await interaction.reply({
        content: 'This command can only be used in a modmail channel!',
        ephemeral: true
      })
      return
    }

    const embed = new EmbedBuilder()
      .setTitle('Close Modmail')
      .setDescription('Are you sure you want to close this modmail?')
      .setColor('Red')
      .setTimestamp()

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('close-modmail')
        .setLabel('Close ModMail')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('need-assistance')
        .setLabel('I need further assistance')
        .setStyle(ButtonStyle.Primary)
    )

    await interaction.reply({
      embeds: [embed],
      components: [buttons]
    })
  }
}
