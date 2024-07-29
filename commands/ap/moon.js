const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js')
const axios = require('axios')
const cheerio = require('cheerio')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moon')
    .setDescription('Displays moon percentage embed'),

  async execute (interaction) {
    const URL = 'https://www.timeanddate.com/moon/phases/'

    try {
      const { data } = await axios.get(URL)
      const $ = cheerio.load(data)

      const retriveImg = $('#cur-moon').attr('src')
      const results = $('#cur-moon-percent').text()

      const img = 'https://www.timeanddate.com' + retriveImg
      const percentage = results.trim()

      const embed = new EmbedBuilder()
        .setTitle('Moon phase for today')
        .setColor(Colors.DarkBlue)
        .addFields(
          { name: 'Date:', value: new Date().toDateString(), inline: false },
          { name: 'Illumination:', value: percentage, inline: false }
        )
        .setImage(img)

      await interaction.reply({ embeds: [embed], ephemeral: true })
    } catch (error) {
      console.error('Error fetching moon phase:', error)
      await interaction.reply({
        content: 'Failed to fetch moon phase information.',
        ephemeral: true
      })
    }
  }
}
