const { SlashCommandBuilder, PermissionsBitField } = require('discord.js')
const { getVoiceConnection } = require('@discordjs/voice')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leavevc')
    .setDescription('Bot leaves the voice channel')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

  async execute (interaction) {
    const connection = getVoiceConnection(interaction.guild.id)

    if (!connection) {
      await interaction.reply({
        content: 'The bot is not in a voice channel!',
        ephemeral: true
      })
      return
    }

    try {
      connection.destroy()
      await interaction.reply({
        content: 'Bot has left the channel',
        ephemeral: true
      })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'There was an error disconnecting from the voice channel!',
        ephemeral: true
      })
    }
  }
}
