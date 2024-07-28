const {
  SlashCommandBuilder,
  PermissionsBitField,
  ChannelType
} = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('supersummon')
    .setDescription('DM a user to join channel')
    .addUserOption(option =>
      option.setName('user').setDescription('User to summon').setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for summoning')
        .setRequired(true)
    )
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel to join')
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildVoice)
    ),

  async execute (interaction) {
    const user = interaction.options.getUser('user')
    const reason = interaction.options.getString('reason')
    let channel = interaction.options.getChannel('channel')

    if (!channel) {
      channel = interaction.guild.channels.cache.find(
        c => c.name === 'Staff VC' && c.type === ChannelType.GuildVoice
      )
    }

    if (!channel || channel.type !== ChannelType.GuildVoice) {
      await interaction.reply({
        content:
          'The specified channel is not a voice channel or could not be found.',
        ephemeral: true
      })
      return
    }

    try {
      await user.send(
        `>>> You have been summoned by ${interaction.user}\n\nReason: \`${reason}\`\n\nPlease join ${channel} whenever you can.`
      )

      await interaction.reply({
        content: `You have summoned ${user} to ${channel}!`,
        ephemeral: true
      })
    } catch (error) {
      console.error('Failed to send DM:', error)
      await interaction.reply({
        content: 'Failed to send the summon DM.',
        ephemeral: true
      })
    }
  }
}
