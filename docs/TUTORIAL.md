# Create your first Viber bot

This tutorial will show you how to create a simple Viber bot. Download the finished product from [GitHub](https://github.com/Viber/sample-bot-isitup).

## What we're going to do

For this tutorial, we'll be using the web service [isup.me](http://isup.me) to check whether a website is running or not. We will develop a bot in Node.js and deploy it.

## What we're going to write

Our script is going to perform the following tasks

* 	Take the values that the bot command sends and extract the domain (just for text messages).
* 	Use a `request` command to query the domain name to isup.me API.
* 	Accept the results returned by `isitup` and decide what to do with them.
* 	Return the results to the user who used the bot.

![][2]

## Prerequisites

* Text editor. If you want a free one, I recommend [Visual Studio Code](https://code.visualstudio.com/)
* `Node.js` v5 or higher
* npm (which comes bundled with Node)
* git

You can check if you have Node and npm installed by typing in the terminal:

```bash
node --version && npm --version
```

If you need to upgrade or install Node, the easiest way is to use an installer for your platform. Download the .msi for Windows or .pkg for Mac from the [NodeJS website](https://nodejs.org/).

The npm package manager is bundled with Node, although you might need to update it. Some Node versions ship with rather old versions of npm. You can update npm using this command:

```bash
npm install --global npm@latest
```

You can check if you have Git installed by typing:

```bash
git --version
```

If you don't have Git, grab the installers from the [git website](https://git-scm.com/).


## Set up your Viber API Account
* Follow the steps to create a [Viber API Account](https://developers.viber.com/docs/general/get-started/#get-started-with-bots/).
* Extract the [account authentication token](https://developers.viber.com/docs/faq/#authentication-tokens) - The authentication token is a unique account identifier used to validate your account in all API requests. Once your account is created your authentication token will appear in the account’s “edit info” screen (for admins only). Each request posted to Viber by the account will need to contain the token.

![][1]

## Setting up the project

Now that we have our account authentication token we can start to setup our NodeJs project.

Create a new folder for your bot project

```bash
mkdir myviberbot
cd myviberbot
```

First thing to do is to create our `packages.json` file with the command:

```bash
npm init
```

Now let’s install our dependencies:

```bash
npm i --save viber-bot express request winston winston-console-formatter
```

Here’s the content of the package.json:

```html
{
  "name": "isitup",
  "version": "1.0.0",
  "description": "A bot interface to work with Viber API",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "dependencies": {
    "express": "4.13.4",
    "request": "^2.79.0",
    "viber-bot": "^1.0.6",
    "winston": "^2.3.0",
    "winston-console-formatter": "^0.3.1"
  },
  "license": "ISC"
}
```

## Implementing the bot

Move to your text editor and **create** the file `index.js` within our project folder.

Firstly, let's import and configure our bot with your [Account authentication token](https://developers.viber.com/docs/faq/#authentication-tokens) and logger. **Make sure** you paste the account authentication token during initialization.

```javascript
const ViberBot  = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const winston = require('winston');
const toYAML = require('winston-console-formatter');
var request = require('request');

function createLogger() {
    const logger = new winston.Logger({
        level: "debug" // We recommend using the debug level for development
    });

    logger.add(winston.transports.Console, toYAML.config());
    return logger;
}

const logger = createLogger();

// Creating the bot with access token, name and avatar
const bot = new ViberBot(logger, {
    authToken: "Your account access token goes here", // <--- Paste your token here
    name: "Is It Up",  // <--- Your bot name here
    avatar: "http://api.adorable.io/avatar/200/isitup" // It is recommended to be 720x720, and no more than 100kb.
});

if (process.env.NOW_URL || process.env.HEROKU_URL) {
    const http = require('http');
    const port = process.env.PORT || 8080;

    http.createServer(bot.middleware()).listen(port, () => bot.setWebhook(process.env.NOW_URL || process.env.HEROKU_URL));
} else {
    logger.debug('Could not find the now.sh/Heroku environment variables. Please make sure you followed readme guide.');
}
```

Now, let's add a simple helper function to send text messages on the response object:

```javascript
function say(response, message) {
    response.send(new TextMessage(message));
}
```

We'd like the bot to welcome any new user with a nice greeting. Let's register to the `onSubscribe` event and ask the bot to greet the new user:

```javascript
bot.onSubscribe(response => {
    say(response, `Hi there ${response.userProfile.name}. I am ${bot.name}! Feel free to ask me if a web site is down for everyone or just you. Just send me a name of a website and I'll do the rest!`);
});
```

Now, we should write the core function which will actually test a given url against `isup.me`.
We're going to take the text exactly as it's typed by the user, and rely on isup.me to check the validity of the domain. If it's not a valid domain, isup.me will respond with a given message.

```javascript
function checkUrlAvailability(botResponse, urlToCheck) {

    if (urlToCheck === '') {
        say(botResponse, 'I need a URL to check');
        return;
    }

    say(botResponse, 'One second...Let me check!');

    var url = urlToCheck.replace(/^http:\/\//, '');
    request('http://isup.me/' + url, function(error, requestResponse, body) {
        if (error || requestResponse.statusCode !== 200) {
            say(botResponse, 'Something is wrong with isup.me.');
            return;
        }

        if (!error && requestResponse.statusCode === 200) {
            if (body.search('is up') !== -1) {
                say(botResponse, 'Hooray! ' + urlToCheck + '. looks good to me.');
            } else if (body.search('Huh') !== -1) {
                say(botResponse, 'Hmmmmm ' + urlToCheck + '. does not look like a website to me. Typo? please follow the format `test.com`');
            } else if (body.search('down from here') !== -1) {
                say(botResponse, 'Oh no! ' + urlToCheck + '. is broken.');
            } else {
                say(botResponse, 'Snap...Something is wrong with isup.me.');
            }
        }
    })
}
```

Finally, we'd like to direct any text message to the `checkUrlAvailability` function.

```javascript
bot.onTextMessage(/./, (message, response) => {
    checkUrlAvailability(response, message.text);
}
```

## Deployment
There are several options for quick and __free__ bot deployment.

### Option 1. now.sh
Deploy the bot with [now CLI](https://zeit.co/now/). To get started using now, install it from `npm`:

```bash
npm install -g now
```

Let's deploy our bot. Run the following command in the command line

```bash
now
```

### Option 2. Heroku
Setup [Heroku CLI](https://toolbelt.heroku.com) as instructed. After that is set up, navigate on the command line to the repository and:

* `heroku login`
* `heroku create myawesomebot` - Create a Heroku app. You can replace `myawesomebot` with anything. The name of your bot is a good choice, but if the command says that name is taken, chose anything
* `heroku config:set HEROKU_URL=$(heroku apps:info -s  | grep web_url | cut -d= -f2)` - Exposes the Heroku app URL from inside the app (so the bot will be able to set the webhook)
* `git push heroku master` - Deploys your bot

## Next steps
* Explore ways to add more visual cues, replay with stickers/gifs and even videos
* Read more about our API in the [Viber developers site](https://developers.viber.com/)


## Download This Project
If you haven't downloaded the completed project yet, you can get it from [GitHub](https://github.com/Viber/sample-bot-isitup).


[1]: authToken.jpg
[2]: output.gif
