const {SlashCommandBuilder} = require('discord.js');
const fs=require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poista_automaattipäivitys')
		.setDescription('Poistaa automaattisen ruokien listauksen kanavalta jolle se on asetettu päälle'),
	async execute(interaction) {
        const guild=interaction.guild; //get server from seeing which server the interaction is taking place at
        if(botChannels.get(guild.id)==undefined){ //trying to query a key:value pair that does not exist in a collection returns 'undefined'
            await interaction.reply(`Serverille ei ole asetettu automaattista ruokalistastusta`)
        }
        else{
            botChannels.delete(guild.id); //botChannels is a global collection that contains all the server:channel pairs that have automatic updates turned on
            const json = JSON.stringify(Object.fromEntries(botChannels)); //turn the newly updated collection first into an object and then the object into a json format
            await writeToJSON(json);

            await interaction.reply(`Automaattinen ruokalistastus poistettu serveriltä ${guild.name}`) //send feedback about the command to the user
            .then(console.log(`Removed server "${guild.name}" from receiving automatic updates`)); //and log it so we can see these things "server side" too
        }
	}
};
async function writeToJSON(json){ //writes a json passed to the function into 'foodBot/data/botChannels.json'
  await fs.promises.writeFile(__dirname+'/../../data/botChannels.json', json, { flag: 'w+' });
};