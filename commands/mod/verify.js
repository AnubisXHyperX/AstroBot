const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
  } = require('discord.js')
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('verify')
      .setDescription('Displays the verification embed'),
  
    async execute (interaction) {
      const embed = new EmbedBuilder()
        .setTitle('Verification')
        .setDescription(
          'Click the button below to verify yourself to Astrophotography discord server.'
        )
        .setColor('Green')
  
      const button = new ButtonBuilder()
        .setCustomId('verify')
        .setLabel('Verify')
        .setStyle(ButtonStyle.Success)
  
      const row = new ActionRowBuilder().addComponents(button)
  
      await interaction.reply({
        embeds: [embed],
        components: [row]
      })
    }
  }
  