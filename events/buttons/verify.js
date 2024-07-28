const { EmbedBuilder } = require('discord.js')

module.exports = {
  async execute (interaction, client) {
    const { customId, guild, user } = interaction

    if (customId === 'verify') {
      const role = guild.roles.cache.find(role => role.name === 'Verified') // Replace with your role name or ID
      const lobby = guild.channels.cache.find(
        channel => channel.name === 'lobby'
      ) 

      if (!role) {
        console.error('Verification role not found')
        await interaction.reply({
          content: 'Verification role not found. Please contact an admin.',
          ephemeral: true
        })
        setTimeout(() => interaction.deleteReply(), 5000)
        return
      }

      const member = await guild.members.fetch(user.id).catch(err => {
        console.error('Failed to fetch member:', err)
        return null
      })

      if (!member) {
        console.error('Member not found:', user.id)
        await interaction.reply({
          content:
            'Failed to fetch your member details. Please try again later.',
          ephemeral: true
        })
        setTimeout(() => interaction.deleteReply(), 5000)
        return
      }

      if (member.roles.cache.has(role.id)) {
        await interaction.reply({
          content: 'You have already been verified!',
          ephemeral: true
        })
        setTimeout(() => interaction.deleteReply(), 5000)
        return
      }

      const botMember = await guild.members.fetch(client.id).catch(err => {
        console.error('Failed to fetch bot member:', err)
        return null
      })

      if (!botMember) {
        console.error('Bot member not found:', client.user.id)
        await interaction.reply({
          content:
            'Failed to fetch bot member details. Please try again later.',
          ephemeral: true
        })
        setTimeout(() => interaction.deleteReply(), 5000)
        return
      }

      try {
        await member.roles.add(role)

        const welcomeEmbed = new EmbedBuilder()
          .setTitle('Welcome!')
          .setDescription(
            `${user}, you have been verified! Make yourself comfortable in ${
              lobby ? lobby : 'the server'
            }.`
          )
          .setColor('Green')

        await user.send({ embeds: [welcomeEmbed] }).catch(dmError => {
          console.error('Failed to send DM:', dmError)
        })

        await interaction.reply({
          content:
            'You have been verified and a welcome message has been sent to your DMs!',
          ephemeral: true
        })
        setTimeout(() => interaction.deleteReply(), 5000)
      } catch (error) {
        console.error('Failed to add role or send DM:', error)
        await interaction.reply({
          content:
            'You have been verified, but I could not send you a DM. Please check your privacy settings.',
          ephemeral: true
        })
        setTimeout(() => interaction.deleteReply(), 5000)
      }
    }
  }
}
