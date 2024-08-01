const { EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js')

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
        c => c.name === 'modmails' && c.type === ChannelType.GuildCategory
      )

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

      try {
        const channel = await guild.channels.create({
          name: `${user.username}-modmail`,
          type: ChannelType.GuildText,
          topic: `${user.id}`,
          parent: modmailCategory ? modmailCategory.id : null,
          permissionOverwrites: permissions
        })

        const ownerRole = guild.roles.cache.find(role => role.name === 'Owner')
        const adminRole = guild.roles.cache.find(role => role.name === 'Admin')
        const onDutyRole = guild.roles.cache.find(
          role => role.name === 'OnDuty'
        )

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
      } catch (error) {
        console.error('Error creating modmail channel:', error)
        await interaction.reply({
          content:
            'There was an error creating the modmail ticket. Please try again later.',
          ephemeral: true
        })
      }
    }
  }
}
