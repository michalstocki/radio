const readline = require('readline');
const { exec } = require('child_process');
const { join } = require('path');
const http = require('http');
const authHeader = require('basic-auth-header');
const { isMac } = require('is-os');

const HTTP_PASSWORD = 'aaa';
const SKIP_PROGRAM_AFTER = 1500;
let isPlaying = true;
let lastPress = null;
let skipProgramTimeout = null;

const vlc = getVLCCommand();
const playlistPath = join(__dirname, 'programs.m3u');

exec(`${vlc} -I http --http-password ${HTTP_PASSWORD} file://${playlistPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});

function sendCommand(commandName) {
  const requestOptions = {
    hostname: 'localhost',
    port: 8080,
    path: `/requests/status.xml?command=${commandName}`,
    method: 'GET',
    headers: {
      Authorization: authHeader('', HTTP_PASSWORD)
    }
  };
  const req = http.request(requestOptions, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
  });
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  req.end();
}

function getVLCCommand() {
  if (isMac()) {
    return '/Applications/VLC.app/Contents/MacOS/VLC';
  }
  return 'vlc';
}


const buttons = require('rpi-gpio-buttons')([12]);

buttons.on('pressed', function(pin) {
  console.log('--- pressed');
  lastPress = Date.now();
  skipProgramTimeout = setTimeout(() => {
    console.log('Playing next station');
    sendCommand('pl_next');
    skipProgramTimeout = null;
  }, SKIP_PROGRAM_AFTER);
});

buttons.on('released', function(pin) {
  console.log('--- released');
  if (lastPress && Date.now() - lastPress <= 1000) {
    if (isPlaying) {
      console.log('Stopping');
      sendCommand('pl_stop');
      isPlaying = false;
    } else {
      console.log('Playing');
      sendCommand('pl_play');
      isPlaying = true;
    }
  }
  if (skipProgramTimeout) {
    clearTimeout(skipProgramTimeout);
    skipProgramTimeout = null;
  }
  lastPress = null;
});

console.log('listening 3 click events');
