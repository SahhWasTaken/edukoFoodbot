const puppeteer=require('puppeteer');
const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    cooldown:60,
	data: new SlashCommandBuilder()
		.setName('ruokalista')
		.setDescription('Hakee EDUKOn tämän päivän ruuan'),
	async execute(interaction, kanava) {
        if(day<=5){
            console.log(`scraping https://www.eduko.fi/eduko/ruokalistat/ @ ${new Date()}`)
            await haeRuuat();
            if(!interaction){
                await kanava.send(`----\n${ruokalista}\n----`)
            }
	        else{
                await interaction.reply(`----\n${ruokalista}\n----`);
            };
        }
        if(day>=6){
            if(!interaction){
                return;
            }
            await interaction.reply(`Tänään on viikonloppu, koululta ei saa ruokaa.`);
        }
	}
};

var ruokalista;
var date=new Date();
var day=new Date().getDay();

const haeRuuat=async()=>{
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const dayName= new Date().toLocaleDateString('fin',{weekday:"long"}).toUpperCase();
    const query=`${dayName} ${dd}.${mm}`;

    const browser=await puppeteer.launch({
        headless:"new",
        defaultViewport:null
    });

    const page=await browser.newPage();

    await page.goto("https://www.eduko.fi/eduko/ruokalistat/", {waitUntil:"domcontentloaded"});

    const ruoka = await page.evaluate(() => Array.from(document.querySelectorAll("b"), e => e.parentNode.innerText));
    ruoka.forEach(ruoka => {
        if(ruoka.includes(query)==true){
            ruokalista=ruoka;
        };
    });

    await browser.close();
};