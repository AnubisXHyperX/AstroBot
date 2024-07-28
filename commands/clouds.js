const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clouds')
    .setDescription('Displays cloud coverage for today')
    .addStringOption(option =>
      option
        .setName('latitude')
        .setDescription('Latitude of the location')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('longitude')
        .setDescription('Longitude of the location')
        .setRequired(true)
    ),

  async execute (interaction) {
    const { default: random } = await import('random')
    const latitude = interaction.options.getString('latitude')
    const longitude = interaction.options.getString('longitude')
    const rand = random.int(1, 1000)

    const embed = new EmbedBuilder()
      .setTitle('Cloud chart')
      .setDescription(`This is a cloud cover chart for ${interaction.user}`)
      .setColor('Blue')
      .setThumbnail(
        'https://cdn.discordapp.com/attachments/899248238056591401/1009783389051686932/jwst.png'
      )
      .setImage(
        `https://clearoutside.com/forecast_image_large/${latitude}/${longitude}/forecast/${rand}.png`
      )

    await interaction.reply({ embeds: [embed], ephemeral: true })
  }
}
