const { Client, Collection, GatewayIntentBits } = require('discord.js')
const fs = require('node:fs')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.commands = getCommands('./commands')

module.exports = {
  name: 'interactionCreate',
  async execute (interaction) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName)

      try {
        if (interaction.replied) return
        await command.execute(interaction)
      } catch (error) {
        console.error(error)
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true
        })
      }
    } else if (interaction.isButton()) {
      const command = interaction.message.interaction.commandName
      if (fs.existsSync(`${__dirname}/buttons/${command}.js`)) {
        const buttonHandler = require(`./buttons/${command}`)
        if (buttonHandler) {
          await buttonHandler.execute(interaction, client)
        }
      } else {
        console.log('Button Handler Not Found')
      }
    } else if (interaction.isContextMenuCommand()) {
      const command = client.commands.get(interaction.commandName)
      try {
        await command.execute(interaction)
      } catch (error) {
        console.error(error)
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true
        })
      }
    } else if (interaction.isModalSubmit()) {
      const modalHandlerId = interaction.customId.split('-')[0]
      if (fs.existsSync(`${__dirname}/modals/${modalHandlerId}.js`)) {
        const modalHandler = require(`./modals/${modalHandlerId}`)
        if (modalHandler) {
          await modalHandler.execute(interaction, client)
        }
      }
    }
  }
}

function getCommands (dir) {
  let commands = new Collection()
  const commandFiles = getFiles(dir)

  for (const commandFile of commandFiles) {
    const command = require('.' + commandFile)
    commands.set(command.data.toJSON().name, command)
  }
  return commands
}

function getFiles (dir) {
  const files = fs.readdirSync(dir, {
    withFileTypes: true
  })
  let commandFiles = []

  for (const file of files) {
    if (file.isDirectory()) {
      commandFiles = [...commandFiles, ...getFiles(`${dir}/${file.name}`)]
    } else if (file.name.endsWith('.js')) {
      commandFiles.push(`${dir}/${file.name}`)
    }
  }
  return commandFiles
}
