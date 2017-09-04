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
        default: '',
        trim: true,
        required: 'Your name cannot be blank'
    },
    sender_address: {
        type: String,
        default: '',
        trim: true,
        required: 'You adress cannot be blank'
    },

       
    text: {
        type: String,
        default: '',
        trim: true
    },


      recipient: {
        type: String,
        default: '',
        trim: true
    }

    // user: {
    //     type: Schema.ObjectId,
    //     ref: 'User'
    // }
});

module.exports = mongoose.model('Letter', letterSchema);
