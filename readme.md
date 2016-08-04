# Music Please
## Description
Listen to your personal music with your browser.
Music Please is a node.js server allowing you to listen to you music with your browser.

## Prerequite
* Install NodeJS with NPM (https://nodejs.org/en/).

## Setting up
1.   Go to your source folder with your CLI.
2.   Launch `npm install`.
3.   Run `node index.js`

## Files compatibility
As the audio tracks are played by using the `<audio>` html5 element, it will depend of your browser. So please check this list on Wikipedia: (https://en.wikipedia.org/wiki/HTML5_Audio)
(sorry for Flac (T_T))

## Configuration
The config file is _config.json_:

* `path`: path to your music library (i.e. `D:\\music` on windows).
* `pwd`: The password needed to use the music library (Currently not implemented).
* `coverFile`: The cover naming convention for albums' cover.
* In a back of my mind:
  * `cover404`: Name of the cover whom will be displayed if the server does not find the real cover.
  * `coverTypeFile`:Extension of cover (i.e. `{png,jpg,bmp}`)

## Suggested improvement
- [ ] Cleaning code. _**important**_
- [ ] Displaying only audio file _**important**_
- [ ] Displying some metadata of audio files _**important**_
- [ ] Maybe using a best glob nodejs module.
