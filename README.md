<h1 align="center">Welcome to Tipper! 👋</h1>

### [Hosted on](https://tipper-api-xzkf.onrender.com/)

Our cashless tipping web-app! This API allows you to register an account with Tipper, access your account and edit information, as well as receiving messages for any payments.

## Install

In order to use this repo and run it locally, you will need to do the following:

1. Clone the repo from gitHub on your local machine

```sh
$ https://github.com/Tipper-final-project/Backend
```

2. Install Packages & Dependencies
   This project uses [node](http://nodejs.org) version v20.0.0 and [npm](https://npmjs.com) version 9.6.4
   Go check them out if you don't have them locally installed.
   You can run the command below to install all the necessary packages.

```sh
$ npm install
```

## Usage
You will need to make a database with mongodb and once you have made one you will need to get a connection string which is used in the environment.

## ** IMPORTANT **

You will need to create the necessary environment variables in the top level of your folder

Please create the files:

1. .env.production
2. .env.test

---------------------------------------------------------

Inside the .env.production & .env.test files, add the following variable:

```sh
DATABASE_URL={ databse url }
```

Once the variables have been created, you will need to double check that these .env files are .gitignored. If not, add them to the .gitignored file by writing under node_modules: .env.*

## Run Tests

```sh
$ npm run test
```

## Authors

- Github: [Merin Yilmaz](https://github.com/Merin-Yilmaz)
- Github: [Anna van Ruiten](https://github.com/avr87)
- Github: [Amir Rashidinia](https://github.com/Amir-Rsh)
- Github: [Langa Lee](https://github.com/LangaLee)
- Github: [Oghenevwegba Nabofa](https://github.com/ericnabofa)
- Github: [Gyozo Vancsura (Victor)](https://github.com/gyozoke)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Tipper-final-project/Backend/issues).

## Show your support

Give a ⭐️ if this project helped you!
