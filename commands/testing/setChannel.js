const {SlashCommandBuilder, ChannelType} = require('discord.js');
const fs=require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kanava')
		.setDescription('Määrittää mille kanavalle botti listaa ruokia automaattisesti')
        .addChannelOption(option =>
            option.setName('kanava')
                .setDescription('Valittu kanava')
                // Ensure the user can only select a TextChannel for output
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)),
	async execute(interaction) {
    const channel=interaction.options.getChannel('kanava');
    const guild=interaction.guild;
    botChannels.set(guild.id,channel.id);
    console.log(botChannels);

    const json=JSON.stringify(Object.fromEntries(botChannels));
    await writeToJSON(json);
    
    await interaction.reply(`Automaattinen ruokalistastus asetettu kanavalle ${channel}`)
    .then(console.log(`Added channel "${channel.name}" on server "${guild.name}" to receive automatic updates`));

	}
};
async function writeToJSON(json){
  await fs.promises.writeFile(__dirname+'/../../data/botChannels.json', json, { flag: 'w+' });
};