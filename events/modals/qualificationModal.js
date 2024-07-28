const { EmbedBuilder, ChannelType } = require('discord.js')

module.exports = {
  async execute (interaction) {
    const { customId, user, guild } = interaction
    const [modalType, studentId, instructorId] = customId.split('-')
    const student = await guild.members.fetch(studentId)

    const adminRoleId = '1009518652913098882'
    const fixedChannelId = '1113829045600276510'

    if (!interaction.member.roles.cache.has(adminRoleId)) {
      await interaction.reply({
        content: 'You do not have permission to use these buttons.',
        ephemeral: true
      })
      return
    }

    const timeInput = interaction.fields.getTextInputValue('timeInput')
    const time = new Date(timeInput)
    const timestamp = `<t:${Math.floor(time.getTime() / 1000)}:F>`
    const channel = guild.channels.cache.get(fixedChannelId)

    if (!channel || channel.type !== ChannelType.GuildVoice) {
      await interaction.reply({
        content: 'The specified channel is not a voice channel.',
        ephemeral: true
      })
      return
    }

    const message = interaction.message
    let embed = message.embeds[0]

    let instructorTags = []
    if (embed) {
      embed = EmbedBuilder.from(embed)
      const description = embed.data.description
      const instructors = description.match(/<@\d+>/g) || []
      instructorTags = instructors.filter(tag => tag !== `<@${studentId}>`)
      if (!instructorTags.includes(`<@${instructorId}>`)) {
        instructorTags.push(`<@${instructorId}>`)
      }
    }

    const lockEmbed = new EmbedBuilder()
      .setTitle('Qualification Locked')
      .setColor('Red')
      .setDescription(
        `The qualification request has been locked.\n\n**Instructor:** ${instructorTags.join(
          ', '
        )}\n**Student:** <@${student.id}>`
      )

    await interaction.update({ embeds: [lockEmbed], components: [] })

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
  }
}
