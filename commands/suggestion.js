const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Send a suggestion'),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('suggestionModal')
      .setTitle('Send us your Suggestions');

    const sgTitle = new TextInputBuilder()
      .setCustomId('sgTitle')
      .setLabel('Title')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Give your Suggestion a title')
      .setRequired(false);

    const message = new TextInputBuilder()
      .setCustomId('message')
      .setLabel('Message')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Type your Suggestion here')
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(sgTitle),
      new ActionRowBuilder().addComponents(message)
    );

    await interaction.showModal(modal);
  }
};