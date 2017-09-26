# Sample Viber bot

A simple starting point for creating a Node.js based Viber bot. This bot allows you to test if a website is down for everyone or just you.
You can download the [completed bot](https://github.com/Viber/sample-bot-isitup/archive/master.zip) or just follow the [**tutorial**](docs/TUTORIAL.md).

![][1]

## Prerequisites

1. [Node.js 5.0+](http://nodejs.org)
1. An Active Viber account on a platform which supports Public Accounts/ bots (iOS/Android). This account will automatically be set as the account administrator during the account creation process.
1. [Active bot account](https://developers.viber.com).
1. Account authentication token - unique account identifier used to validate your account in all API requests. Once your account is created your authentication token will appear in the account’s “edit info” screen (for admins only). Each request posted to Viber by the account will need to contain the token.

## Usage

* Clone the repository

```bash
git clone https://github.com/Viber/sample-bot-isitup myviberbot
cd myviberbot
```

* Get your [account authentication token](https://developers.viber.com/docs/general/get-started/#get-started-with-bots/)

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
