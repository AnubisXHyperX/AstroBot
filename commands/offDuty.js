const { SlashCommandBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('offduty')
    .setDescription('Removes an onduty role')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

  async execute (interaction) {
    const lobby = interaction.guild.channels.cache.find(
      channel => channel.name === 'lobby'
    )
    const ondutyRole = interaction.guild.roles.cache.get('1009517840275095693')

    if (!interaction.member.roles.cache.has(ondutyRole.id)) {
      await interaction.reply({
        content: 'You are not on duty to do that!',
        ephemeral: true
      })
      setTimeout(() => interaction.deleteReply(), 5000)
    } else {
      if (interaction.channel.id === lobby.id) {
        await interaction.member.roles.remove(ondutyRole)
        await interaction.reply({
          content: `${ondutyRole.toString()}:${interaction.user.toString()} - is now OffDuty...`
        })
        setTimeout(() => interaction.deleteReply(), 5000)
      } else {
        await interaction.reply({
          content: `This is not the right channel, please use this command in ${lobby.toString()}`,
          ephemeral: true
        })
        setTimeout(() => interaction.deleteReply(), 5000)
      }
    }
  }
}
