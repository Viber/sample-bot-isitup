# Sample Viber bot

A simple starting point for creating a Node.js based Viber bot. This bot allows you to test if a website is down for everyone or just you.
You can download the [completed bot](https://github.com/Viber/sample-bot-isitup/archive/master.zip) or just follow the [**tutorial**](docs/TUTORIAL.md).

![][1]

## Prerequisites

* [Node.js 5.0+](http://nodejs.org)
* [Get your Viber Public Account authentication token](https://developers.viber.com/docs/general/getting-started-with-bots/)

## Usage

* Clone the repository

```bash
git clone https://github.com/Viber/sample-bot-isitup myviberbot
cd myviberbot
```

* Get your [Public Account authentication token](https://developers.viber.com/docs/general/getting-started-with-bots/)

* We will deploy the bot with [now CLI](https://zeit.co/now/). To get started using `now`, install it from `npm`

```bash
npm install -g now
```

* Let's deploy our bot with access token . Edit the following command with your access token and run it in the cloned repository folder

```bash
now -e VIBER_PUBLIC_ACCOUNT_ACCESS_TOKEN_KEY="YOUR_PUBLIC_ACCOUNT_TOKEN"
```

**That's it!** Now your bot is deployed. Start talking with it in your Viber app. Simply navigate to your Public Account and click on the `Message` button.

## License

See the [LICENSE](LICENSE.md) file (MIT).

[1]: output.gif
