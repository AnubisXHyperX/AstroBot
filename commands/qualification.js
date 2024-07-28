const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('qualification')
    .setDescription('Request for a qualification'),

  async execute (interaction) {
    await interaction.deferReply()

    try {
      const student = interaction.user
      const embed = new EmbedBuilder()
        .setTitle('Qualification Request')
        .setColor('Green')
        .setDescription(`**Instructor:** \n**Student:** <@${student.id}>`)
        .setFooter({ text: 'Admins can join or leave the qualification' })

      const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('join')
          .setLabel('Join')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('leave')
          .setLabel('Leave')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('lock')
          .setLabel('Lock')
          .setStyle(ButtonStyle.Primary)
      )

      await interaction.editReply({
        embeds: [embed],
        components: [actionRow]
      })
    } catch (error) {
      console.error('Error:', error)
      await interaction.editReply({
        content: `Failed to create qualification request: ${error.message}`,
        ephemeral: true
      })
    }
  }
}
