const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType
} = require('discord.js')

module.exports = {
  async execute (interaction) {
    const { customId, user, guild } = interaction
    const [action, studentId] = customId.split('-')
    const student = await guild.members.fetch(studentId)

    if (!['join', 'leave', 'lock'].includes(action)) return

    const adminRoleId = '1009518652913098882' // Replace with your Admin role ID
    const fixedChannelId = '1113829045600276510' // Fixed voice channel ID

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
        .setCustomId('qualificationModal')
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

      const filter = modalSubmit =>
        modalSubmit.customId === 'qualificationModal' &&
        modalSubmit.user.id === user.id

      try {
        const modalSubmit = await interaction.awaitModalSubmit({
          filter,
          time: 60000
        })

        const timeInput = modalSubmit.fields.getTextInputValue('timeInput')
        const time = new Date(timeInput)
        const timestamp = `<t:${Math.floor(time.getTime() / 1000)}:F>`
        const channel = guild.channels.cache.get(fixedChannelId)

        if (!channel || channel.type !== ChannelType.GuildVoice) {
          await modalSubmit.reply({
            content: 'The specified channel is not a voice channel.',
            ephemeral: true
          })
          return
        }

        const lockEmbed = new EmbedBuilder()
          .setTitle('Qualification Locked')
          .setColor('Red')
          .setDescription(
            `The qualification request has been locked.\n\n**Instructor:** ${instructorTags.join(
              ', '
            )}\n**Student:** <@${student.id}>`
          )

        await modalSubmit.update({ embeds: [lockEmbed], components: [] })

        const dmEmbed = new EmbedBuilder()
          .setTitle('Qualification Details')
          .setColor('Green')
          .setDescription(
            `Here are the details for your qualification:\n\n**Instructor:** ${instructorTags.join(
              ', '
            )}\n**Student:** <@${
              student.id
            }>\n**Time:** ${timestamp}\n**Channel:** <#${fixedChannelId}>`
          )

        try {
          await student.send({ embeds: [dmEmbed] })
        } catch (dmError) {
          console.error('Failed to send DM:', dmError)
        }
      } catch (error) {
        console.error('Failed to submit modal:', error)
        await interaction.followUp({
          content: 'Failed to lock the qualification request.',
          ephemeral: true
        })
      }
    }
  }
}
