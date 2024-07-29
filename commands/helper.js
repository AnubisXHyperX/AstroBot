const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');

const choices = [
  { name: 'Question', value: 'yellow' },
  { name: 'Technical', value: 'dark_green' },
  { name: 'Advice', value: 'green' },
  { name: 'Software', value: 'purple' },
  { name: 'Acquisition', value: 'teal' },
  { name: 'Image Processing', value: 'red' },
  { name: 'Equipment', value: 'dark_blue' },
  { name: 'Solar System / Lunar', value: 'gold' },
];

const getColor = (value) => {
  switch (value) {
    case 'yellow':
      return Colors.Yellow;
    case 'dark_green':
      return Colors.DarkGreen;
    case 'green':
      return Colors.Green;
    case 'purple':
      return Colors.Purple;
    case 'teal':
      return Colors.Teal;
    case 'red':
      return Colors.Red;
    case 'dark_blue':
      return Colors.DarkBlue;
    case 'gold':
      return Colors.Gold;
    default:
      return Colors.Default;
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('helper')
    .setDescription('Tags a question in an embed')
    .addStringOption(option => {
      const opt = option.setName('tag')
        .setDescription('Select a tag')
        .setRequired(true);

      choices.forEach(choice => opt.addChoices(choice));
      return opt;
    })
    .addStringOption(option =>
      option
        .setName('description')
        .setDescription('Provide a description')
        .setRequired(true)
    ),

  async execute(interaction) {
    const tagValue = interaction.options.getString('tag');
    const description = interaction.options.getString('description');

    const selectedChoice = choices.find(choice => choice.value === tagValue);
    const tagName = selectedChoice ? selectedChoice.name : 'Unknown';
    const color = getColor(tagValue);

    const embed = new EmbedBuilder()
      .setTitle('__Help__')
      .setDescription(`#${tagName}`)
      .setColor(color)
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields({ name: '\u200B', value: description });

    await interaction.reply({ embeds: [embed] });
  }
};