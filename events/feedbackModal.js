const { EmbedBuilder } = require('discord.js')

module.exports = {
  async execute (interaction) {
    const message = interaction.fields.getTextInputValue('message')

    const channel = interaction.guild.channels.cache.get('1100261196638199838') // Replace with your channel ID

    const embed = new EmbedBuilder()
      .setTitle('Feedback')
      .setDescription(`by ${interaction.user}\n\n${message || 'No Message'}`)
      .setColor('Yellow')
      .setTimestamp()
      // .addFields({
      //   name: 'Feedback',
      //   value: message || 'No Message'
      // })
      .setThumbnail(
        'https://cdn.discordapp.com/attachments/899248238056591401/1009783389051686932/jwst.png'
      )
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL()
      })

    await channel.send({ embeds: [embed] })
    await interaction.reply({ content: 'Feedback sent!', ephemeral: true })
  }
}
