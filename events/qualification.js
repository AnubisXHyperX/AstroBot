const {
  EmbedBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js')

module.exports = {
  async execute (interaction) {
    const { customId, user, guild } = interaction
    const [action, studentId] = customId.split('-')
    const student = await guild.members.fetch(studentId)

    if (!['join', 'leave', 'lock'].includes(action)) return

    const adminRoleId = '1009518652913098882'
    const fixedChannelId = '1113829045600276510'

    let instructorTags = []
    const message = interaction.message
    let embed = message.embeds[0]

    if (embed) {
      embed = EmbedBuilder.from(embed)
      const description = embed.data.description
      const instructors = description.match(/<@\d+>/g) || []
      instructorTags = instructors.filter(tag => tag !== `<@${studentId}>`)
    } else {
      await interaction.reply({
        content: 'No embed found in the message.',
        ephemeral: true
      })
      return
    }

    if (!interaction.member.roles.cache.has(adminRoleId)) {
      await interaction.reply({
        content: 'You do not have permission to use these buttons.',
        ephemeral: true
      })
      return
    }

    if (action === 'join') {
      if (!instructorTags.includes(`<@${user.id}>`)) {
        instructorTags.push(`<@${user.id}>`)
      }
      embed.setDescription(
        `**Instructor:** ${instructorTags.join(', ')}\n**Student:** <@${
          student.id
        }>`
      )
      await interaction.update({
        embeds: [embed],
        components: message.components
      })
    } else if (action === 'leave') {
      instructorTags = instructorTags.filter(tag => tag !== `<@${user.id}>`)
      embed.setDescription(
        `**Instructor:** ${instructorTags.join(', ')}\n**Student:** <@${
          student.id
        }>`
      )
      await interaction.update({
        embeds: [embed],
        components: message.components
      })
    } else if (action === 'lock') {
      const modal = new ModalBuilder()
        .setCustomId(`qualificationModal-${studentId}-${user.id}`)
        .setTitle('Qualification Details')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('timeInput')
              .setLabel('Qualification Time')
              .setStyle(TextInputStyle.Short)
              .setPlaceholder(
                'Enter qualification time (e.g. 2024-07-26T15:00:00)'
              )
              .setRequired(true)
          )
        )

      await interaction.showModal(modal)
    }
  }
}
