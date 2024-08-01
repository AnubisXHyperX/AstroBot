const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection
} = require('discord.js')
const { v4: uuidv4 } = require('uuid')
const dayjs = require('dayjs')

const operations = new Collection()
const phoneticAlphabet = [
  'Alpha',
  'Bravo',
  'Charlie',
  'Delta',
  'Echo',
  'Foxtrot',
  'Golf',
  'Hotel',
  'India',
  'Juliett',
  'Kilo',
  'Lima',
  'Mike',
  'November',
  'Oscar',
  'Papa',
  'Quebec',
  'Romeo',
  'Sierra',
  'Tango',
  'Uniform',
  'Victor',
  'Whiskey',
  'X-ray',
  'Yankee',
  'Zulu'
]

module.exports = {
  data: new SlashCommandBuilder()
    .setName('op')
    .setDescription('Create a new VTOL VR operation')
    .addStringOption(option =>
      option
        .setName('operation_name')
        .setDescription('Name of the operation')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('num_packages')
        .setDescription('Number of packages')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('server_name')
        .setDescription('Server name')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('day')
        .setDescription('Day of the operation')
        .setRequired(false)
    )
    .addIntegerOption(option =>
      option
        .setName('month')
        .setDescription('Month of the operation')
        .setRequired(false)
    )
    .addIntegerOption(option =>
      option
        .setName('year')
        .setDescription('Year of the operation')
        .setRequired(false)
    )
    .addIntegerOption(option =>
      option
        .setName('hours')
        .setDescription('Hours of the operation')
        .setRequired(false)
    )
    .addIntegerOption(option =>
      option
        .setName('minutes')
        .setDescription('Minutes of the operation')
        .setRequired(false)
    ),

  async execute (interaction) {
    const operationName = interaction.options.getString('operation_name')
    const numPackages = interaction.options.getInteger('num_packages')
    const day = interaction.options.getInteger('day')
    const month = interaction.options.getInteger('month')
    const year = interaction.options.getInteger('year')
    const hours = interaction.options.getInteger('hours')
    const minutes = interaction.options.getInteger('minutes')
    const serverName = interaction.options.getString('server_name')

    let timeOfOp = dayjs().add(1, 'hour')
    if (day && month && year && hours && minutes) {
      timeOfOp = dayjs()
        .year(year)
        .month(month - 1)
        .date(day)
        .hour(hours)
        .minute(minutes)
    }

    if (!timeOfOp.isValid()) {
      await interaction.reply({
        content: 'Invalid time provided.',
        ephemeral: true
      })
      return
    }

    const formattedTimeOfOp = timeOfOp.format('YYYY-MM-DDTHH:mm:ss')
    const operationId = uuidv4().split('-')[0] // Shortened operation ID
    const packages = []
    const buttons = []

    for (let i = 0; i < numPackages; i++) {
      const packageName = phoneticAlphabet[i]
      const packageId = uuidv4().split('-')[0] // Shortened package ID
      const positions = [
        { slot: '1-1', userId: null },
        { slot: '1-2', userId: null },
        { slot: '1-3', userId: null },
        { slot: '1-4', userId: null }
      ]
      packages.push({ packageId, packageName, positions })

      buttons.push(
        new ButtonBuilder()
          .setCustomId(`join_${operationId}_${packageId}`)
          .setLabel(packageName)
          .setStyle(ButtonStyle.Primary)
      )
    }

    const embed = new EmbedBuilder()
      .setTitle(`Operation: ${operationName}`)
      .setDescription(`Time: ${formattedTimeOfOp}\nServer: ${serverName}`)
      .setColor('Blue')
      .addFields(
        packages.map(pkg => ({
          name: pkg.packageName,
          value: pkg.positions.map(pos => `${pos.slot}: Available`).join('\n'),
          inline: true
        }))
      )

    const actionRows = []
    for (let i = 0; i < buttons.length; i += 5) {
      const actionRow = new ActionRowBuilder().addComponents(
        buttons.slice(i, i + 5)
      )
      actionRows.push(actionRow)
    }

    operations.set(operationId, {
      operationName,
      timeOfOp: formattedTimeOfOp,
      serverName,
      packages,
      embed,
      buttons,
      actionRows,
      interaction
    })

    await interaction.reply({ embeds: [embed], components: actionRows })
  },

  operations // Export the operations collection
}
