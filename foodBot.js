const dotenv=require('dotenv');
dotenv.config()
const fs=require('fs');
const path=require('path');
const {Client, Collection, Events, GatewayIntentBits}=require('discord.js');
const cron = require('node-cron');

const client=new Client({intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
]});

global.botChannels=new Collection; //create a new empty collection that will be used to store the server:channel pairs that are set to receive automatic updates
client.once('ready', async()=>{ //once when the bot client has logged in
	async function updateBotChannels(){ //read the 'botChannels.json' file and load it into the global 'botChannels' collection
		const data=await fs.promises.readFile(__dirname+'/data/botChannels.json', 'utf8')
		botChannels=new Collection(Object.entries(JSON.parse(data)));
		console.log("Loaded server + channel pairs opted in to autoList");
	}
	console.log(`Logged in as ${client.user.tag}`);
	await updateBotChannels();
});

client.commands = new Collection(); //create a new empty collection that will be used to keep track of all of the commands the bot has available to it
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) { //populate the commands collection
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
};

client.cooldowns = new Collection(); //make a new empty collection that will keep track of command cooldowns
client.on(Events.InteractionCreate, async interaction => { //whenever a new interaction happens
	const { cooldowns } = client;

	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const defaultCooldownDuration = 3;
	const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

	if (timestamps.has(interaction.guildId)) { //base cooldowns on how often the command has been used on the server
		const expirationTime = timestamps.get(interaction.guildId) + cooldownAmount;

		if (now < expirationTime) {
			const expiredTimestamp = Math.round(expirationTime / 1000);
			return interaction.reply({ content: `Komentoa \`${command.data.name}\` on käytetty serverillä vastikään. Kokeile uudelleen <t:${expiredTimestamp}:R>.`, ephemeral: true });
		}
	}

	timestamps.set(interaction.guildId, now);
	setTimeout(() => timestamps.delete(interaction.guildId), cooldownAmount);

	try {
		//await command.execute(interaction);
		await interaction.deferReply();
		const result = await command.execute(interaction);
		await interaction.editReply(result);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

//cron scheduled task goes here
async function autoList(){
	const guilds = client.guilds.cache.map(guild => guild.id); //get a collection of all the servers the bot is on

	guilds.forEach(key=>{ //loop through all the servers the bot is on
		if(botChannels.has(key)){ //if the botChannels collection has the serverID
			const kanava=client.channels.cache.get(botChannels.get(key)); //get the channelID associated with the server
			client.commands.get('ruokalista').execute(null, kanava); //execute the '/ruokalista' command, leaving the interaction null (meaning it wasn't evoked by a user)
		}
	});
};

//cron syntax: minutes hours something something days
cron.schedule('15 9 * * 1-5', async() => {
	try{
		await autoList();
	}
	catch(error){
		console.log(error)
	}
	console.log('Cron job executed at:', new Date().toLocaleString());
});


client.login(process.env.CLIENT_TOKEN);