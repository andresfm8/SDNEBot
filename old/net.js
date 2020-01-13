const Brain = require('brain.js')
const fs = require('file-system')
const trainData = require('./net/training_data')
const serializer = require('./net/serializer')

const net = new Brain.NeuralNetwork();

const trainNet = () => {
	if (fs.existsSync(__dirname + '/net.json'))
		net.fromJSON(JSON.parse(fs.readFileSync(__dirname + '/net.json')))

	let data = serializer.fixLengths(serializer.serialize(trainData))

	net.train(data, {
		iterations: 5000,
		log: true,
	})

	fs.writeFileSync(__dirname + '/net.json', JSON.stringify(net.toJSON()))
}

const runNet = (text) => {
	if (fs.existsSync(__dirname + '/net.json'))
		net.fromJSON(JSON.parse(fs.readFileSync(__dirname + '/net.json')))

	let output = net.run(serializer.encode(text.toString().toLowerCase()))
	return output
}

module.exports = {
	run: runNet,
	train: trainNet
}