const mongoose = require('mongoose');
const LinkSchema = new mongoose.Schema(
    {
    slug: {
        type: String,
        required: true,
        unique: true,      
        trim: true,        
        lowercase: true,   
        index: true,       
      },
  
      destination: {
        type: String,
        required: true,    
      },
  
      createdBy: {
        type: String,      
        required: true,
      },
  
      clickCount: {
        type: Number,
        default: 0,        
      },
  
      isActive: {
        type: Boolean,
        default: true,    
      },
  
      expiresAt: {
        type: Date,
        default: null,    
      },
    },
    {
      timestamps: true,   
    }
);

module.exports = mongoose.model('Link', LinkSchema);