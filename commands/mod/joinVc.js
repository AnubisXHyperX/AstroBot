const {
  SlashCommandBuilder,
  PermissionsBitField,
  ChannelType
} = require('discord.js')
const { joinVoiceChannel } = require('@discordjs/voice')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joinvc')
    .setDescription('Bot joins your voice channel')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

  async execute (interaction) {
    const channel = interaction.member.voice.channel

    if (!channel || channel.type !== ChannelType.GuildVoice) {
      await interaction.reply({
        content: 'You need to be in a voice channel to use this command!',
        ephemeral: true
      })
      return
    }

    try {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator
      })

      await interaction.reply({
        content: 'Bot has joined the channel',
        ephemeral: true
      })
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: 'There was an error connecting to the voice channel!',
        ephemeral: true
      })
    }
  }
}
