const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('says hello')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('the user you want to say hi to')
        .setRequired(false)
    ),

  async execute (interaction) {
    if (interaction.commandName === 'hello') {
      const user = interaction.options.getUser('user') || interaction.user
      interaction.reply(`Hello ${user.tag}`)
    }
  }
}
