const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mmforce')
    .setDescription('Force closes a modmail without archive'),

  async execute(interaction) {
    const { channel, user, guild } = interaction;

    if (channel.name.includes('-modmail')) {
      await channel.delete();
      await interaction.reply({ content: 'Modmail closed.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'This is not a modmail channel or you do not have permission to close it!', ephemeral: true });
    }
  }
};