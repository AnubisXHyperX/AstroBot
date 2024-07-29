const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('users')
    .setDescription('Exports users in the server to an embed'),

  async execute (interaction) {
    const MAX_SIZE = 25
    try {
      await interaction.deferReply({ ephemeral: true })

      // Fetch all members from the guild
      const members = await interaction.guild.members.fetch()
      const embeds = []
      let currentEmbed = new EmbedBuilder()
        .setTitle('User Table')
        .setDescription('These are the members of the server')
        .setColor('DarkGold')

      let count = 0

      members.forEach(member => {
        if (count === MAX_SIZE) {
          currentEmbed.setFooter({
            text: `Page ${embeds.length + 1} of ${Math.ceil(members.size / MAX_SIZE)}`
          })
          embeds.push(currentEmbed)
          currentEmbed = new EmbedBuilder()
            .setTitle('User Table')
            .setDescription('These are the members of the server')
            .setColor('DarkGold')
          count = 0
        }
        currentEmbed.addFields({
          name: member.user.tag,
          value: member.id,
          inline: false
        })
        count++
      })

      if (count > 0) {
        currentEmbed.setFooter({
          text: `Page ${embeds.length + 1} of ${Math.ceil(members.size / MAX_SIZE)}`
        })
        embeds.push(currentEmbed)
      }

      const getActionRow = currentIndex => {
        return new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('prev')
            .setLabel('Previous')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(currentIndex === 0),
          new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Next')
            .setStyle(ButtonStyle.Success)
            .setDisabled(currentIndex === embeds.length - 1)
        )
      }

      let currentIndex = 0

      const filter = i => i.user.id === interaction.user.id
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 60000
      })

      collector.on('collect', async i => {
        if (i.customId === 'prev') {
          currentIndex--
        } else if (i.customId === 'next') {
          currentIndex++
        }

        await i.update({
          embeds: [embeds[currentIndex]],
          components: [getActionRow(currentIndex)]
        })
      })

      await interaction.editReply({
        embeds: [embeds[currentIndex]],
        components: [getActionRow(currentIndex)]
      })
    } catch (error) {
      console.error('Failed to fetch members or create embeds:', error)
      await interaction.editReply({
        content: 'Failed to create user DB table.',
        ephemeral: true
      })
    }
  }
}
