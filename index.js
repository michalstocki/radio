console.log('Hello world');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  switch (input) {
    case 'exit':
      rl.close();
      break;
    default:
      console.log(`Received: ${input}`);
  }
});
