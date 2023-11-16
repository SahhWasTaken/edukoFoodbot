const {SlashCommandBuilder, ChannelType} = require('discord.js');

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
        const guild=interaction.guild.id;

        botChannel.set(guild,channel.id);

        console.log(botChannel);

        await interaction.reply(`Automaattinen ruokalistaus asetettu kanavalle ${channel}`);
        
	}
};