import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connect = mongoose.connect(process.env.CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

export default connect;
