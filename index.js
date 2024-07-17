const { token } = require('./config.json')
const {
  Client,
  Events,
  GatewayIntentBits,
  SlashCommandBuilder
} = require('discord.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, c => {
  console.log(`Logged in as ${c.user.tag}`)
  const ping = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('replies with pong')

  const hi = new SlashCommandBuilder()
    .setName('hello')
    .setDescription('says hello')

  client.application.commands.create(ping, '1009514812444786688')
  client.application.commands.create(hi, '1009514812444786688')
})

client.on(Events.InteractionCreate, interaction => {
  if (!interaction.isChatInputCommand()) return
  if (interaction.commandName === 'ping') {
    interaction.reply('pong!')
  }
  if (interaction.commandName === 'hello') {
    interaction.reply(`Hello ${interaction.user.tag}`)
  }
  console.log(interaction)
})

client.login(token)
