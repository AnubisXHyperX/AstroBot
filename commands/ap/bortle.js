const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bortle')
    .setDescription('Assign bortle to a user')
    .addStringOption(option =>
      option
        .setName('bortle')
        .setDescription('Select your Bortle class')
        .setRequired(true)
        .addChoices(
          { name: 'Bortle 1', value: '1' },
          { name: 'Bortle 2', value: '2' },
          { name: 'Bortle 3', value: '3' },
          { name: 'Bortle 4', value: '4' },
          { name: 'Bortle 5', value: '5' },
          { name: 'Bortle 6', value: '6' },
          { name: 'Bortle 7', value: '7' },
          { name: 'Bortle 8', value: '8' },
          { name: 'Bortle 9', value: '9' }
        )
    ),

  async execute (interaction) {
    const bortleValue = interaction.options.getString('bortle')
    const roleName = `Bortle-${bortleValue}`
    const bortleRole = interaction.guild.roles.cache.find(
      role => role.name === roleName
    )
    const userRoles = interaction.member.roles
    const bortleRoles = [
      'Bortle-1',
      'Bortle-2',
      'Bortle-3',
      'Bortle-4',
      'Bortle-5',
      'Bortle-6',
      'Bortle-7',
      'Bortle-8',
      'Bortle-9'
    ]

    // Remove previous Bortle roles
    for (const role of bortleRoles) {
      const roleToRemove = interaction.guild.roles.cache.find(
        r => r.name === role
      )
      if (roleToRemove && userRoles.cache.has(roleToRemove.id)) {
        await interaction.member.roles.remove(roleToRemove)
      }
    }

    // Add the new Bortle role
    await interaction.member.roles.add(bortleRole)

    await interaction.reply({
      content: `You have assigned yourself as: <@&${bortleRole.id}>`,
      ephemeral: true
    })
    setTimeout(() => interaction.deleteReply(), 5000)
  }
}
