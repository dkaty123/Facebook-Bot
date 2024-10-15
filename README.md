# Facebook Bot
A desktop app that automatically scrapes Facebook Marketplace for deals.

Built with Electron, Typescript, Vue.js, Selenium, and TailwindCSS!

![image](https://github.com/JaryJay/facebook-bot/assets/47123100/96849a80-c3bd-489a-8e77-34ab0829fc2b)

## Features

| Name                  | Description                                                                                                                        |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------|
| Auto Refresh          | The app will re-fetch Facebook Marketplace at a certain rate, customizable by the user.                                            |
| Marking Items as Seen | Hovering over an item will mark it as seen. New (unseen) items will show up at the top of the page to make the user's life easier! |
| Settings              | Users can customize the category, region, and maximum price of items that they want to fetch, all inside of the GUI.               |

## Setup

To get Facebook Bot on your computer, first clone this repository.

Git:
```console
git clone https://github.com/JaryJay/facebook-bot
```
Alternatively, you can use [GitHub Desktop](https://desktop.github.com/).

Next, open a terminal and navigate to the `facebook-bot` directory.

Finall, run `npm install` to install all necessary packages, such as Electron, Selenium, and Vue.js.

#### Setup Summary

Putting all of the commands into a neat snippet:
```console
git clone https://github.com/JaryJay/facebook-bot
cd facebook-bot
npm install
```

# Running the project

Run `npm run dev` to run the project in dev mode.

Run `npm run build` to create an installer for your OS. (Note: for some reason, Selenium stops working when you use the built version of Facebook Bot. Only dev mode works right now :P)
