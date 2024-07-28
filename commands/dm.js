const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Direct Message a specific user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Select a user to send a dm')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('text')
        .setDescription('a text that you would like to send to the user')
        .setRequired(true)
    ),

  async execute (interaction) {
    try {
      const user = interaction.options.getUser('user')
      const msg = interaction.options.getString('text')
      await user.send(msg)
      await interaction.reply({
        content: `DM has been sent to <@${user.id}>`,
        ephemeral: true
      })
      setTimeout(() => interaction.deleteReply(), 5000)
    } catch (error) {
      await interaction.reply({
        content: `DM has not sent to <@${user.id}> due to error: ${error}`,
        ephemeral: true
      })
      setTimeout(() => interaction.deleteReply(), 5000)
    }
  }
}
