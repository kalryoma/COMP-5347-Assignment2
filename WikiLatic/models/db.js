var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/WikiDB', function () {
    console.log('mongodb connected');
});

module.exports = mongoose;