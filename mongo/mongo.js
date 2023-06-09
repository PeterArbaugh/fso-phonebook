const mongoose = require('mongoose')

const url = `mongodb+srv://fullstackopen:${password}@cluster0.u15vlll.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]

if (process.argv.length === 3) {
	console.log('phonebook:')
	Person.find({}).then(result => {
		result.forEach(person => {
			console.log(person.name, person.number)
		})
		mongoose.connection.close()
	})
} else if (process.argv[3] && process.argv[4]) {
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	})

	person.save().then(() => {
		console.log('Added', person.name, 'number', person.number, 'to phonebook')
		mongoose.connection.close()
	})
} else {
	mongoose.connection.close()
}