import mongoose from 'mongoose';
import validator from 'validator';

const clientSchema = mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'projectModel',
  },
  clientName: {
    type: String,
    required: [true, 'Please provide a client name'],
    minlength: [6, 'Client name must be at least 6 characters'],
    maxlength: [64, 'Client name must be at most 32 characters'],
  },
  clientEmail: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  clientContact: {
    type: Number,
    required: [true, 'Please provide client contact no.'],
    minlength: [10, 'Contact no. must be at least 10 characters'],
    maxlength: [11, 'Contact no. must be at most 11 characters'],
  },
  clientLocation: {
    type: String,
    required: [true, 'Please provide client location.'],
    minlength: [12, 'Client location must be at least 12 characters'],
    maxlength: [64, 'Client location must be at most 64 characters'],
  },
  accountProfileUploaded: {
    type: String,
  },
  lastUpdate: {
    date: { type: Date, default: Date.now },
    account: { type: String },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const clientModel = mongoose.model('clientModel', clientSchema);

export default clientModel;
