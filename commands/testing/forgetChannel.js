const {SlashCommandBuilder} = require('discord.js');
const fs=require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poista_automaattipäivitys')
		.setDescription('Poistaa automaattisen ruokien listauksen kanavalta jolle se on asetettu päälle'),
	async execute(interaction) {
        const guild=interaction.guild;

        if(botChannels.get(guild.id)==undefined){
            await interaction.reply(`Serverille ei ole asetettu automaattista ruokalistastusta`)
        }
        else{
            botChannels.delete(guild.id);
            const json = JSON.stringify(Object.fromEntries(botChannels));
            await writeToJSON(json);

            await interaction.reply(`Automaattinen ruokalistastus poistettu serveriltä ${guild.name}`)
            .then(console.log(`Removed server "${guild.name}" from receiving automatic updates`));
        }
	}
};
async function writeToJSON(json){
  await fs.promises.writeFile(__dirname+'/../../data/botChannels.json', json, { flag: 'w+' });
};