const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js')
const { operations } = require('../../commands/op')

module.exports = {
  async execute (interaction, client) {
    if (!interaction.isButton()) return

    const [action, operationId, packageId] = interaction.customId.split('_')

    if (action === 'join') {
      const operation = operations.get(operationId)
      if (!operation) {
        console.error(`Operation not found: ${operationId}`)
        return
      }

      const pkg = operation.packages.find(pkg => pkg.packageId === packageId)
      if (!pkg) {
        console.error(`Package not found: ${packageId}`)
        return
      }

      // Remove the user from any existing package
      operation.packages.forEach(pkg => {
        if (pkg.position === interaction.user.id) {
          pkg.position = null
          const field = operation.embed.data.fields.find(
            field => field.name === pkg.packageName
          )
          if (field) {
            field.value = 'Available'
          }
        }
      })

      pkg.position = interaction.user.id

      const field = operation.embed.data.fields.find(
        field => field.name === pkg.packageName
      )
      if (!field) {
        console.error(`Field not found for package: ${pkg.packageName}`)
        return
      }

      field.value = `<@${interaction.user.id}>`

      const allFilled = operation.packages.every(pkg => pkg.position !== null)
      if (allFilled) {
        operation.embed
          .setColor('Green')
          .setFooter({ text: 'Operation Locked' })
        operation.buttons.forEach(button => button.setDisabled(true))
      }

      const actionRows = []
      for (let i = 0; i < operation.buttons.length; i += 5) {
        const actionRow = new ActionRowBuilder().addComponents(
          operation.buttons.slice(i, i + 5)
        )
        actionRows.push(actionRow)
      }

      await interaction.update({
        embeds: [operation.embed],
        components: actionRows
      })

      if (allFilled) {
        await Promise.all(
          operation.packages.map(async pkg => {
            if (pkg.position) {
              const user = await interaction.guild.members.fetch(pkg.position)
              const dmEmbed = new EmbedBuilder()
                .setTitle(`Operation: ${operation.operationName}`)
                .setDescription(
                  `Time: ${operation.timeOfOp}\nServer: ${operation.serverName}`
                )
                .setColor('Green')
                .addFields({
                  name: pkg.packageName,
                  value: `<@${pkg.position}>`,
                  inline: true
                })

              await user.send({ embeds: [dmEmbed] })
            }
          })
        )

        operations.delete(operationId)
      }
    }
  }
}
