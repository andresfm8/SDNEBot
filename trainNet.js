const brain = require('brain.js');
const fs = require('file-system');

const net = new brain.NeuralNetworkGPU;

if (fs.existsSync('net.json'))
	net.fromJSON(JSON.parse(fs.readFileSync('net.json')));

const data = fs.readFileSync('training_data.json');

