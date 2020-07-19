
const mongoose = require ('mongoose')

if (process.argv.length != 3 && process.argv.length != 5) {
    console.log('Please enter the command in this format: node mongo.js <password> <person_name> <number>\nOr in this format: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://krithik:${password}@cluster0.w513s.mongodb.net/phonebook-app?retryWrites=true&w=majority`
  
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
    
const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {

  Person
  .find ({})
  .then (response => {

    console.log("phonebook:")

    response.forEach(person => {
      console.log (`${person.name} ${person.number}`)
    })

    mongoose.connection.close()

  })

}

else {

  const person_name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
      name: person_name,
      number: number,
  })

  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
  })

}
