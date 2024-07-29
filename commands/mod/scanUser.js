const { EmbedBuilder, Colors, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('scan')
    .setDescription('Scan a user')
    .addUserOption(option =>
      option.setName('user').setDescription('Select a user').setRequired(false)
    )
    .addStringOption(option =>
      option.setName('id').setDescription('User ID').setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const userId = interaction.options.getString('id');
    const com = interaction.guild.channels.cache.find(channel => channel.name === 'modmail-commands');
    let targetUser;

    if (user) {
      targetUser = await interaction.guild.members.fetch(user.id);
    } else if (userId) {
      targetUser = await interaction.guild.members.fetch(userId).catch(() => null);
      if (!targetUser) {
        await interaction.reply({
          content: 'User not found. Please provide a valid user ID.',
          ephemeral: true,
        });
        return;
      }
    } else {
      await interaction.reply({
        content: 'Please provide a user or user ID to scan.',
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`User info - ${targetUser.user.username}#${targetUser.user.discriminator}`)
      .setDescription(
        `This is information about ${targetUser} in **__${interaction.guild.name}__ Server**.\n\nUser stats requested by ${interaction.user}`
      )
      .setColor(Colors.Green)
      .setTimestamp()
      .addFields(
        {
          name: 'User Info',
          value: `Created On: <t:${Math.floor(targetUser.user.createdTimestamp / 1000)}:D> (<t:${Math.floor(targetUser.user.createdTimestamp / 1000)}:R>)\nJoined On: <t:${Math.floor(targetUser.joinedTimestamp / 1000)}:D> (<t:${Math.floor(targetUser.joinedTimestamp / 1000)}:R>)\nUser ID: \`${targetUser.id}\``,
          inline: false
        },
        {
          name: 'User Roles',
          value: targetUser.roles.cache
            .map(role => role)
            .join(' ')
            .replace('@everyone', '') || 'No Roles',
          inline: false
        },
        {
          name: 'Voice Channel',
          value: targetUser.voice.channel
            ? targetUser.voice.channel.toString()
            : 'Not in a voice channel',
          inline: true
        },
        {
          name: 'Game',
          value: targetUser.presence?.activities[0]?.name || 'None',
          inline: true
        },
        {
          name: 'Status',
          value: targetUser.presence?.status || 'Offline',
          inline: true
        }
      )
      .setThumbnail(targetUser.user.displayAvatarURL());

    if (interaction.channel.id !== com.id) {
      await com.send({ embeds: [embed] });
      await interaction.reply({
        content: `Scanned to ${com.toString()}`,
        ephemeral: true
      });
    } else {
      await interaction.reply({ embeds: [embed] });
    }
  }
};