const puppeteer=require('puppeteer');
const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    cooldown:60,
	data: new SlashCommandBuilder()
		.setName('ruokalista')
		.setDescription('Hakee EDUKOn tämän päivän ruuan'),
	async execute(interaction, channel) {
        if(day<=5){
            console.log(`scraping https://www.eduko.fi/eduko/ruokalistat/ @ ${new Date()}`)
            await haeRuuat();
            if(!interaction){
                channel.send(`----\n${ruokalista}\n----`)
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
            console.log(ruoka);
            ruokalista=ruoka;
        };
    });

    await browser.close();

        /*
        const ruokat=await page.evaluate(()=>{
            const ma=document.querySelector('[data-id="8f2a9b1"]').childNodes[1].innerText;
    
            const ti=document.querySelector('[data-id="9b07bb8"]').childNodes[1].innerText;
    
            const ke=document.querySelector('[data-id="3ab40bd"]').childNodes[1].innerText;
    
            const to=document.querySelector('[data-id="eb19dd3"]').childNodes[1].innerText;
    
            const pe=document.querySelector('[data-id="47f3af9"]').childNodes[1].innerText;
    
            const lista=[ma, ti, ke, to, pe];
    
            return lista;
        });
        */
    //ruokalista=ruokat;
};