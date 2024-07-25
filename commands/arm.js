const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Function to fetch armament choices
async function fetchArmamentChoices() {
  const response = await fetch(
    'https://vtol-vr.fandom.com/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:Armament&cmlimit=max'
  );

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data)

  if (!data.query || !data.query.categorymembers) {
    throw new Error('No data found in the response');
  }

  const filteredArmaments = data.query.categorymembers.filter(
    armament => armament.ns === 0
  );

  return filteredArmaments.map(armament => ({
    name: armament.title,
    value: armament.title
  }));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('arm')
    .setDescription('Choose an armament to get detailed information')
    .addStringOption(option =>
      option
        .setName('armament')
        .setDescription('Select an armament')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    console.log('Autocomplete triggered');
    const focusedValue = interaction.options.getFocused();
    console.log('Focused value:', focusedValue);
    let armamentChoices;

    try {
      armamentChoices = await fetchArmamentChoices();
      console.log('Fetched armament choices:', armamentChoices);
    } catch (error) {
      console.error('Error fetching armament choices:', error);
      await interaction.respond([]);
      return;
    }

    const filtered = armamentChoices
      .filter(choice =>
        choice.name.toLowerCase().includes(focusedValue.toLowerCase())
      )
      .slice(0, 25); // Limit to 25 choices

    console.log('Filtered choices:', filtered);

    await interaction.respond(
      filtered.map(choice => ({ name: choice.name, value: choice.value }))
    );
  },

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const armamentName = interaction.options.getString('armament');
      console.log('Selected armament:', armamentName);

      const armamentResponse = await fetch(
        `https://vtol-vr.fandom.com/api.php?action=query&format=json&prop=extracts&exintro&titles=${encodeURIComponent(
          armamentName
        )}`
      );

      if (!armamentResponse.ok) {
        throw new Error(`Error fetching armament data: ${armamentResponse.statusText}`);
      }

      const armamentData = await armamentResponse.json();
      const pages = armamentData.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];
      console.log('Fetched armament data:', page);

      const armamentEmbed = new EmbedBuilder()
        .setTitle(armamentName)
        .setURL(`https://vtol-vr.fandom.com/wiki/${encodeURIComponent(armamentName)}`)
        .setColor('Gold')
        .setThumbnail('https://static.wikia.nocookie.net/vtol-vr/images/e/e6/Site-logo.png/revision/latest?cb=20210601180206')
        .setDescription(page.extract || 'No description available.');

      await interaction.editReply({
        embeds: [armamentEmbed]
      });
    } catch (error) {
      console.error('Error:', error);
      await interaction.editReply(`Failed to fetch data: ${error.message}`);
    }
  }
};