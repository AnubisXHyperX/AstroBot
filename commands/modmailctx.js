const {
    ContextMenuCommandBuilder,
    EmbedBuilder,
    ApplicationCommandType,
    PermissionsBitField
  } = require('discord.js');
  
  module.exports = {
    data: new ContextMenuCommandBuilder()
      .setName('Open Modmail')
      .setType(ApplicationCommandType.User),
  
    async execute(interaction) {
      const { guild, targetUser } = interaction;
  
      const existingChannel = guild.channels.cache.find(
        c => c.topic === `${targetUser.id}`
      );
  
      if (existingChannel) {
        await interaction.reply({
          content: `The user already has an open ticket at ${existingChannel}!`,
          ephemeral: true
        });
        setTimeout(() => interaction.deleteReply(), 5000);
        return;
      }
  
      const modmailCategory = guild.channels.cache.find(
        c => c.name === 'modmails' && c.type === 4
      ); // 4 for category
  
      const permissions = [
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: targetUser.id,
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
      ];
  
      const channel = await guild.channels.create({
        name: `${targetUser.username}-modmail`,
        type: 0, // 0 for text
        topic: `${targetUser.id}`,
        parent: modmailCategory ? modmailCategory.id : null,
        permissionOverwrites: permissions
      });
  
      const ownerRole = guild.roles.cache.find(role => role.name === 'Owner');
      const adminRole = guild.roles.cache.find(role => role.name === 'Admin');
      const onDutyRole = guild.roles.cache.find(role => role.name === 'OnDuty');
  
      const embed = new EmbedBuilder()
        .setTitle('Modmail Ticket')
        .setDescription(
          `Thank you for contacting the Astro staff.\nYou may use this channel to communicate with staff privately.\n\n**How may we help you today?**`
        )
        .setColor('Blue')
        .setTimestamp();
  
      await channel.send({
        content: `${ownerRole} ${adminRole} ${onDutyRole}`,
        embeds: [embed]
      });
  
      await interaction.reply({
        content: `Ticket created: ${channel}`,
        ephemeral: true
      });
      setTimeout(() => interaction.deleteReply(), 5000);
    }
  };