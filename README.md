# edukoFoodbot
A small school project built with Node.js, a discord bot with slash commands that scrapes the EDUKO lunch menu for the current day's lunch.
Includes an option for making the bot automatically check the lunch menu every day and posting the result on a channel of user's choice, as well as opting a server out of the automatic updates if they have been turned on on the server.

## Commands
### /ruokalista
Fetches the current day's lunch menu and posts it as a reply to the command
### /aseta_automaattipäivitys
Configure the bot to post the lunch menu to a channel of the user's choice daily
### /poista_automaattipäivitys
If automatic lunch menu posts are turned on any channel on the server, turns them off on the entire server

## Hosting your own version
- Clone the repo
- Create a .env file in the foodBot root folder with CLIENT_TOKEN and CLIENT_ID variables
    - In Discord Developer Portal, make a new bot application
        - Find the Application ID and Token, fill in the values to the .env file
- Create a 'data' folder inside the foodBot root folder, and inside that folder create an empty 'botChannels.json' file
- Run 'npm install' to install all the project dependencies
- Run 'node deploy_commands.js' to register the slash commands to your bot
- Start up the bot with 'node foodBot.js'
    - Alternatively, something like PM2 can keep the bot running even after closing the command prompt window and 'PM2-installer' can be used to upgrade PM2 into a service on windows to automatically start it up whenever the machine it's being run on boots up