// import mongoose, { Schema, Document } from 'mongoose';

// export interface Message extends Document {
//   content: string;
//   createdAt: Date;
// }

// const MessageSchema: Schema<Message> = new mongoose.Schema({
//   content: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     required: true,
//     default: Date.now,
//   },
// });

// export interface User extends Document {
//   username: string;
//   email: string;
//   password: string;
//   verifyCode: string;
//   verifyCodeExpiry: Date; 
//   isVerified: boolean;
//   isAcceptingMessages: boolean;
//   messages: Message[];
// }

// // Updated User schema
// const UserSchema: Schema<User> = new mongoose.Schema({
//   username: {
//     type: String,
//     required: [true, 'Username is required'],
//     trim: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     match: [/.+\@.+\..+/, 'Please use a valid email address'],
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//   },
//   verifyCode: {
//     type: String,
//     required: [true, 'Verify Code is required'],
//   },
//   verifyCodeExpiry: {
//     type: Date,
//     required: [true, 'Verify Code Expiry is required'],
//   },
//   isVerified: {
//     type: Boolean,
//     default: false,
//   },
//   isAcceptingMessages: {
//     type: Boolean,
//     default: true,
//   },
//   messages: [MessageSchema],
// });

// const UserModel =
//   (mongoose.models.User as mongoose.Model<User>) ||
//   mongoose.model<User>('User', UserSchema);

// export default UserModel;









import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

export interface User extends Document {
  username: string;
  email: string;
  password?: string; // Optional for Google Auth
  googleId?: string; // Optional for non-Google users
  verifyCode?: string; // Optional for Google Auth
  verifyCodeExpiry?: Date; // Optional for Google Auth
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  password: { type: String, required: false }, // Optional for Google Auth
  googleId: { type: String, unique: true, sparse: true }, // Optional for non-Google users
  verifyCode: { type: String, required: false }, // Optional for Google Auth
  verifyCodeExpiry: { type: Date, required: false }, // Optional for Google Auth
  isVerified: { type: Boolean, default: false },
  isAcceptingMessages: { type: Boolean, default: true },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema);

export default UserModel;