const {
  ContextMenuCommandBuilder,
  EmbedBuilder,
  Colors
} = require('discord.js')

module.exports = {
  data: new ContextMenuCommandBuilder().setName('Scan User').setType(2),

  async execute (interaction) {
    const user = await interaction.guild.members.fetch(interaction.targetId)
    const com = interaction.guild.channels.cache.find(
      channel => channel.name === 'modmail-commands'
    )

    const embed = new EmbedBuilder()
      .setTitle(`User info - ${user.user.username}#${user.user.discriminator}`)
      .setDescription(
        `This is information about ${user} in **__${interaction.guild.name}__ Server**.\n\nUser stats requested by ${interaction.user}`
      )
      .setColor(Colors.Green)
      .setTimestamp()
      .addFields(
        {
          name: 'User Info',
          value: `Created On: <t:${Math.floor(
            user.user.createdTimestamp / 1000
          )}:D> (<t:${Math.floor(
            user.user.createdTimestamp / 1000
          )}:R>)\nJoined On: <t:${Math.floor(
            user.joinedTimestamp / 1000
          )}:D> (<t:${Math.floor(
            user.joinedTimestamp / 1000
          )}:R>)\nUser ID: \`${user.id}\``,
          inline: false
        },
        {
          name: 'User Roles',
          value:
            user.roles.cache
              .map(role => role)
              .join(' ')
              .replace('@everyone', '') || 'No Roles',
          inline: false
        },
        {
          name: 'Voice Channel',
          value: user.voice.channel
            ? user.voice.channel.toString()
            : 'Not in a voice channel',
          inline: true
        },
        {
          name: 'Game',
          value: user.presence?.activities[0]?.name || 'None',
          inline: true
        },
        {
          name: 'Status',
          value: user.presence?.status || 'Offline',
          inline: true
        }
      )
      .setThumbnail(user.user.displayAvatarURL())

    if (interaction.channel.id !== com.id) {
      await com.send({ embeds: [embed] })
      await interaction.reply({
        content: `Scanned to ${com.toString()}`,
        ephemeral: true
      })
    } else {
      await interaction.reply({ embeds: [embed] })
    }
  }
}
