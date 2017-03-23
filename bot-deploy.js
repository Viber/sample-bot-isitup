"use strict";

let prompt = require("prompt");
let colors = require("colors/safe");
let shell = require("shelljs");
let moniker = require("moniker");

let randomBotNames = moniker.generator([moniker.verb, moniker.noun], {
	maxSize: 10,
	encoding: 'utf-8',
	glue: '-'
});

function deployToHeroku(accessToken) {
	if (!shell.which("heroku")) {
		shell.echo(colors.red.bold("Sorry, this script requires Heroku. Please follow the installment procedure at https://heroku.com"));
		shell.exit(0);
	}
	else {
		let herokuToken = shell.exec("heroku auth:token", { silent: true }).stdout;

		if (!herokuToken && shell.exec("heroku login").code !== 0) {
			shell.echo("Error: Heroku login failed");
			shell.exit(1);
			return;
		}

		if (shell.exec("heroku create " + randomBotNames.choose()).code !== 0) {
			shell.echo("Error: Heroku create project failed");
			shell.exit(1);
			return;
		}

		if (shell.exec("heroku config:set HEROKU_URL=$(heroku apps:info -s | grep web_url | cut -d= -f2)").code !== 0) {
			shell.echo("Error: Heroku failed to expose the app URL");
			shell.exit(1);
			return;
		}

		if (shell.exec("heroku config:set VIBER_PUBLIC_ACCOUNT_ACCESS_TOKEN_KEY=\'" + accessToken + "\'").code !== 0) {
			shell.echo("Error: Heroku set environment variable failed");
			shell.exit(1);
			return;
		}

		if (shell.exec("git push heroku master").code !== 0) {
			shell.echo("Error: Heroku create project failed");
			shell.exit(1);
			return;
		}

		shell.echo("Success! Your bot is deployed to Heroku!");
	}
}

function deployToNow(accessToken) {
	if (!shell.which("now")) {
		shell.echo(colors.red.bold("Sorry, this script requires now CLI. Please follow the installment procedure at https://now.sh"));
		shell.exit(0);
	}

	if (shell.exec("now -e VIBER_PUBLIC_ACCOUNT_ACCESS_TOKEN_KEY=\'" + accessToken + "\'").code !== 0) {
		shell.echo("Error: Now set environment variable failed");
		shell.exit(1);
		return;
	}

	shell.echo("Success! Your bot is deployed to now!");
}

let accessTokenSchema = {
	properties: {
		token: {
			description: "What is your Public Account access token?",
			message: "Access Token is a required field for deployment",
			required: true
		}
	}
};

prompt.message = colors.yellow.underline("Viber Sample Bot Deployment Helper");
prompt.start();

prompt.get(accessTokenSchema, function (err, result) {
	if (!err && result && result.token) {
		let deploymentMethodSchema = {
			properties: {
				option: {
					pattern: /^(1|2)$/,
					description: "How would you like to deploy the script?\n" +
					colors.green("1") + " for https://heroku.com\n" +
					colors.green("2") + " for https://now.sh\n",
					message: "Please enter a valid value (1 or 2)",
					required: true
				}
			}
		};

		var tokenToUse = result.token;

		prompt.get(deploymentMethodSchema, function (err, result) {
			if (!err && result) {
				switch (result.option) {
					case "1":
						deployToHeroku(tokenToUse);
						break;
					case "2":
						deployToNow(tokenToUse);
						break;
					default:
						console.log("Failed to extract deployment method. Abort script");
						prompt.stop();
				}
			}
			else {
				console.log("Failed to extract deployment method. Abort script");
				prompt.stop();
			}
		});
	}
	else {
		console.log("Failed to extract the access token. Abort script");
		prompt.stop();
	}
});
