// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var letterSchema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    sender: {
        type: String,
        default: 'Kuku',
        trim: true,
        required: 'Your name cannot be blank'
    },
    sender_address: {
        type: String,
        default: 'Piter',
        trim: true,
        required: 'You address cannot be blank'
    },

       
    text: {
        type: String,
        default: 'Tuta ya',
        trim: true
    },


      recipient: {
        type: String,
        default: '',
        trim: true
    },

    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Letter', letterSchema);
