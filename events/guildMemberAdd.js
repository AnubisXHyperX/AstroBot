// module.exports = {
//   name: 'guildMemberAdd',
//   async execute (member) {
//     const welcomeRole = await member.guild.roles.cache.find(
//       role => role.name === 'Verified'
//     )
//     await member.roles.add(welcomeRole)

//     const welcomeChannel = await member.guild.channels.cache.find(
//       channel => channel.name === 'welcome'
//     )
//     await welcomeChannel.fetch()
//     welcomeChannel.send(`Welcome to the server ${member.user}`)
//   }
// }
