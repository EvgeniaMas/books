var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String
        
        
    },
    author: {
        type: [String]
    },

       
    thumbnail:  {
        type: String
        
    },

    
    description: 
    {
        type: String
    },

    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Books', bookSchema);



