const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const url =
    `mongodb+srv://loberhofer:${password}@fullstackcluster.rcgsu.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=FullstackCluster`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{6,}$/.test(v)  // Validates phone number format
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})
  
const Person = mongoose.model('Person', personSchema)
if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
else if (process.argv.length === 5) {
  const person = new Person({
    name: name,
    number: number,
  })
  
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
else {
  console.log('Usage: node mongo.js <password> [name number]')
  process.exit(1)
}


















