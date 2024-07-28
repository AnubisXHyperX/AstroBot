const { EmbedBuilder } = require('discord.js')

module.exports = {
  async execute (interaction) {
    const sgTitle = interaction.fields.getTextInputValue('sgTitle')
    const message = interaction.fields.getTextInputValue('message')

    const channel = interaction.guild.channels.cache.get('1009769943597854750') // Replace with your channel ID

    const embed = new EmbedBuilder()
      .setTitle('Suggestion')
      .setDescription(`by ${interaction.user}`)
      .setColor('Blue')
      .setTimestamp()
      .addFields({
        name: sgTitle || 'No Title',
        value: message || 'No Message'
      })
      .setThumbnail(
        'https://cdn.discordapp.com/attachments/899248238056591401/1009783389051686932/jwst.png'
      )
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
      })

    await channel.send({ embeds: [embed] })
    await interaction.reply({ content: 'Suggestion sent!', ephemeral: true })
  }
}
