const readline = require('readline');
const { exec } = require('child_process');
const {join} = require('path');
const http = require('http');
const authHeader = require('basic-auth-header');

const HTTP_PASSWORD = 'aaa';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const vlc = '/Applications/VLC.app/Contents/MacOS/VLC';
const playlistPath = join(__dirname, 'programs.m3u');

const vlcProcess = exec(`${vlc} -I http --http-password ${HTTP_PASSWORD} file://${playlistPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});

rl.on('line', (input) => {
  switch (input) {
    case 'exit':
      rl.close();
      vlcProcess.kill();
      process.exit(0);
      break;
    case 'next':
      handleNext();
      break;
    default:
      console.log(`Unknown command: "${input}".
Available commands:
  exit – Closes the program
  next – Switch to the next program`);
  }
});

function handleNext() {
  console.log('Playing next station');
  sendCommand('pl_next');
}

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
