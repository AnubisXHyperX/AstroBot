const { PermissionsBitField } = require('discord.js')

module.exports = {
  async execute (interaction, client) {
    const { customId, user, guild } = interaction

    if (customId === 'close-modmail') {
      const channel = interaction.channel
      const onDutyRole = guild.roles.cache.find(role => role.name === 'OnDuty')

      if (
        channel.name.includes('-modmail') &&
        channel.topic === user.id.toString()
      ) {
        await interaction.message.delete()
        const msg = await channel.send(
          `>>> ${user} This ticket will close in <t:${
            Math.floor(Date.now() / 1000) + 21
          }:R>\nThank you for contacting Astro staff.`
        )

        setTimeout(async () => {
          await msg.delete()
          const closeMessage = await channel.send(
            `>>> This ticket is now closed. Thank you for contacting Astro staff.`
          )

          await channel.permissionOverwrites.edit(user.id, {
            ViewChannel: false,
            SendMessages: false,
            ReadMessageHistory: false
          })
          setTimeout(async () => {
            await channel.send(
              `>>> **${onDutyRole}: This modmail is now closed. Staff may communicate freely.**`
            )
          }, 3000)
        }, 21000)
      } else {
        await interaction.reply({
          content:
            "This isn't a ticket or you don't have permission to close it!",
          ephemeral: true
        })
        setTimeout(() => interaction.deleteReply(), 5000)
      }
    }

    if (customId === 'need-assistance') {
      const ownerRole = guild.roles.cache.find(role => role.name === 'Owner')
      const adminRole = guild.roles.cache.find(role => role.name === 'Admin')
      const onDutyRole = guild.roles.cache.find(role => role.name === 'OnDuty')

      await interaction.message.delete()
      await interaction.reply({
        content: `>>> ${ownerRole} ${adminRole} ${onDutyRole}\n${user} - Thank you for contacting the Astro staff.\nYou may use this channel to communicate with staff privately.\n\nHow may we help you today?`,
        ephemeral: true
      })
    }
  }
}
