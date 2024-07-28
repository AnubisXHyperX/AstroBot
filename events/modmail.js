const { EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
  async execute (interaction, client) {
    const { customId, user, guild } = interaction

    if (customId === 'open-modmail') {
      const existingChannel = guild.channels.cache.find(
        c => c.topic === `${user.id}`
      )

      if (existingChannel) {
        await interaction.reply({
          content: `You already have an open ticket at ${existingChannel}!`,
          ephemeral: true
        })
        setTimeout(() => interaction.deleteReply(), 5000)
        return
      }

      const modmailCategory = guild.channels.cache.find(
        c => c.name === 'modmails' && c.type === 4
      ) // 4 for category

      const permissions = [
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.AttachFiles,
            PermissionsBitField.Flags.EmbedLinks
          ]
        },
        {
          id: guild.members.me.roles.highest.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        }
      ]

      const channel = await guild.channels.create({
        name: `${user.username}-modmail`,
        type: 0, // 0 for text
        topic: `${user.id}`,
        parent: modmailCategory ? modmailCategory.id : null,
        permissionOverwrites: permissions
      })

      const ownerRole = guild.roles.cache.find(role => role.name === 'Owner')
      const adminRole = guild.roles.cache.find(role => role.name === 'Admin')
      const onDutyRole = guild.roles.cache.find(role => role.name === 'OnDuty')

      const embed = new EmbedBuilder()
        .setTitle('Modmail Ticket')
        .setDescription(
          `Thank you for contacting the Astro staff.\nYou may use this channel to communicate with staff privately.\n\n**How may we help you today?**`
        )
        .setColor('Blue')
        .setTimestamp()

      await channel.send({
        content: `${ownerRole} ${adminRole} ${onDutyRole}`,
        embeds: [embed]
      })

      await interaction.reply({
        content: `Ticket created: ${channel}`,
        ephemeral: true
      })
      setTimeout(() => interaction.deleteReply(), 5000)
    }

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
          }:R>\nThank you for contacting Astro staff <:jwst:1009707101360242720>.`
        )

        // Use a setTimeout to wait before deleting the message and sending the follow-up message
        setTimeout(async () => {
          await msg.delete()
          const closeMessage = await channel.send(
            `>>> This ticket is now closed. Thank you for contacting Astro staff <:jwst:1009707101360242720>.`
          )

          await channel.permissionOverwrites.edit(user.id, {
            ViewChannel: false,
            SendMessages: false,
            ReadMessageHistory: false
          })
          // Wait for 1 second before sending the staff communication message
          setTimeout(async () => {
            await channel.send(
              `>>> **${onDutyRole}: This modmail is now closed. Staff may communicate freely.**`
            )
          }, 3000)
        }, 21000) // wait for 21 seconds before deleting the message

        // Here you can add logic to archive the modmail if needed, e.g. saving the message content to a database.
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
