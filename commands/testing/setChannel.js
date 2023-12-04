const { SlashCommandBuilder, ChannelType } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('aseta_automaattipäivitys')
    .setDescription('Määrittää mille kanavalle botti listaa ruokia automaattisesti')
    .addChannelOption(option =>
      option.setName('kanava')
        .setDescription('Valittu kanava')
        // Ensure the user can only select a TextChannel for output
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanava'); //get the desired channel from the option passed on to the command
    const guild = interaction.guild; //get the server from seeing which server the interaction is taking place at
    botChannels.set(guild.id, channel.id); //add a new serverID:channelID pair into the global collection that keeps track of them

    const json = JSON.stringify(Object.fromEntries(botChannels)); //turn the global collection first into an object and then into json format
    await writeToJSON(json);

    await interaction.reply(`Automaattinen ruokalistastus asetettu kanavalle ${channel}`) //send feedback about the command to the user
      .then(console.log(`Added channel "${channel.name}" on server "${guild.name}" to receive automatic updates`)); //and log it so we can see these things "server side" too

  }
};
async function writeToJSON(json){ //writes a json passed to the function into 'foodBot/data/botChannels.json'
  await fs.promises.writeFile(__dirname + '/../../data/botChannels.json', json, { flag: 'w+' });
};