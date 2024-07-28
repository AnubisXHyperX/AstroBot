const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('feedback')
    .setDescription('Send a Feedback'),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('feedbackModal')
      .setTitle('Send us your Feedback');

    const message = new TextInputBuilder()
      .setCustomId('message')
      .setLabel('Message')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Type your Feedback here')
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(message)
    );

    await interaction.showModal(modal);
  }
};