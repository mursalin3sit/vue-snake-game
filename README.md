# Vue Snake Game

## Introduction

We built this game during the Zweitag [Hack-Teams](https://www.zweitag.de/en/blog/hack-teams/) for fun. You can try it out in the [Zweitag advent calendar 2020](https://staging.zweitag.de/pr/advent-calendar-door-4/adventskalender-2020/#advent-calendar-door-3)! Please note that the code does not live up to our usual coding standards, but is just a quick & dirty prototype!

## Local development

Run

```sh
yarn install
yarn dev
```

and visit [localhost:3000](http://localhost:3000) to play the game!

## Building and publishing

Run `yarn build` to build the game to the `dist`-folder.

To use it on another website, include the generated `dist/_assets` files (`index.js` and `style.css`), add the images under `dist/snake` to your public folder, so that they are reachable under `/snake/xy.svg`, and add a `<div id="app" />` somewhere on your page.

## Contributors

Not everyone involved in the creation of this game made commits, as we mostly developed the game in [remote live sharing sessions](https://visualstudio.microsoft.com/de/services/live-share/). Many thanks to:

- [Frederik Delißen](https://github.com/woolfred)
- [Jonas Juchim](https://github.com/jjuchim)
- [Johannes Hollekamp](https://github.com/00cc00)
- [Oliver Liebsch](https://github.com/oliverliebsch)
- [Tim Landwerth](https://github.com/timmitry)
