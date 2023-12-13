const puppeteer=require('puppeteer');
const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    cooldown:60,
	data: new SlashCommandBuilder()
		.setName('ruokalista')
		.setDescription('Hakee EDUKOn tämän päivän ruuan'),
	async execute(interaction, kanava) {
        if(day<=5){ //if it's not weekend
            console.log(`scraping https://www.eduko.fi/eduko/ruokalistat/ @ ${new Date()}`)
            await haeRuuat();
            if(!interaction){ //If the command was not triggered by a user
                await kanava.send(`----\n${ruokalista}\n----`) //send today's lunch menu as a message to a channel that was passed to the function
            }
	        else{ //if the command was evoked by a user
                return `----\n${ruokalista}\n----`; //reply to the user with today's lunch menu 
            };
        }
        if(day>=6){ //if it's weekend
            if(!interaction){
                return; //if the command was not triggered by a user
            }
            return `Tänään on viikonloppu, koululta ei saa ruokaa.`; //reply to the user if they evoked the command
        }
	}
};

var ruokalista;
var date=new Date();
var day=new Date().getDay();

const haeRuuat=async()=>{
    let mm = date.getMonth() + 1; //months start from 0 for whatever reason, we're fixing that here
    let dd = date.getDate();
    let dayName= new Date().toLocaleDateString('fin',{weekday:"long"}).toUpperCase(); //we can get weekday names in Finnish with toLocaleDateString instead of having to translate them ourselves
    let query=`${dayName} ${dd}.${mm}`; //this'll be the string that we use to pinpoint the menu item we wish to post to discord

    const browser=await puppeteer.launch({ //start a new headless puppeteer instance
        headless:"new",
        defaultViewport:null
    });
    const page=await browser.newPage();

    await page.goto("https://www.eduko.fi/eduko/ruokalistat/", {waitUntil:"domcontentloaded"}); //go to the page the lunch menu gets posted on

    const ruoka = await page.evaluate(() => Array.from(document.querySelectorAll("b"), e => e.parentNode.innerText)); //find every <b> element within the given page, then make an array from the innerText of each <b> element's parent node
    ruoka.forEach(ruoka => { //forEach loop goes through the array of text contents of each elements that could contain today's lunch menu
        if(ruoka.includes(query)==true){ //if the loop finds the 'query' we determined earlier inside one of the innerTexts we are looping through
            ruokalista=ruoka; //Store what we assume must be today's lunch menu into a variable that the 'execute' function used by the slash command can see
        };
    });

    await browser.close();
};