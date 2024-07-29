const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection
} = require('discord.js')
const { v4: uuidv4 } = require('uuid')

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
        .setName('time_of_op')
        .setDescription('Time of the operation')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('server_name')
        .setDescription('Server name')
        .setRequired(true)
    ),

  async execute (interaction) {
    const operationName = interaction.options.getString('operation_name')
    const numPackages = interaction.options.getInteger('num_packages')
    const timeOfOp = interaction.options.getString('time_of_op')
    const serverName = interaction.options.getString('server_name')

    const operationId = uuidv4().split('-')[0] // Shortened operation ID
    const packages = []
    const buttons = []

    for (let i = 0; i < numPackages; i++) {
      const packageName = phoneticAlphabet[i]
      const packageId = uuidv4().split('-')[0] // Shortened package ID
      packages.push({ packageId, packageName, position: null })

      buttons.push(
        new ButtonBuilder()
          .setCustomId(`join_${operationId}_${packageId}`)
          .setLabel(packageName)
          .setStyle(ButtonStyle.Primary)
      )
    }

    const embed = new EmbedBuilder()
      .setTitle(`Operation: ${operationName}`)
      .setDescription(`Time: ${timeOfOp}\nServer: ${serverName}`)
      .setColor('Blue')
      .addFields(
        packages.map(pkg => ({
          name: pkg.packageName,
          value: 'Available',
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
      timeOfOp,
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
