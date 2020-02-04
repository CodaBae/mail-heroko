const mongoose = require('mongoose')
module.exports = function () {
    mongoose.connect('mongodb+srv://codabae:Codabae1@mailmonsterusers-usxub.mongodb.net/test?retryWrites=true&w=majority')
        .then(() => console.log('conected to mongodb'))
        .catch(err => console.log(err))

  
}
