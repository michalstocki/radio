const readline = require('readline');
const { exec } = require('child_process');
const {join} = require('path');
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
    default:
      console.log(`Received: ${input}`);
  }
});
