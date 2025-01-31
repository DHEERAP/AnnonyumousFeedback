// import { NextAuthOptions } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import bcrypt from 'bcryptjs';
// import dbConnect from '@/lib/dbConnect';
// import UserModel from '@/model/User';

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       id: 'credentials',
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'text' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials: any): Promise<any> {
//         await dbConnect();
//         try {
//           const user = await UserModel.findOne({
//             $or: [
//               { email: credentials.identifier },
//               { username: credentials.identifier },
//             ],
//           });
//           if (!user) {
//             throw new Error('No user found with this email');
//           }
//           if (!user.isVerified) {
//             throw new Error('Please verify your account before logging in');
//           }
//           const isPasswordCorrect = await bcrypt.compare(
//             credentials.password,
//             user.password
//           );
//           if (isPasswordCorrect) {
//             return user;
//           } else {
//             throw new Error('Incorrect password');
//           }
//         } catch (err: any) {
//           throw new Error(err);
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token._id = user._id?.toString(); // Convert ObjectId to string
//         token.isVerified = user.isVerified;
//         token.isAcceptingMessages = user.isAcceptingMessages;
//         token.username = user.username;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user._id = token._id;
//         session.user.isVerified = token.isVerified;
//         session.user.isAcceptingMessages = token.isAcceptingMessages;
//         session.user.username = token.username;
//       }
//       return session;
//     },
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: '/sign-in',
//   },
// };



import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [{ email: credentials.identifier }, { username: credentials.identifier }],
          });
          if (!user) {
            throw new Error('No user found with this email');
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password || '');
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username; // Include the username
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username; // Include the username
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await dbConnect();
        let existingUser = await UserModel.findOne({ email: user.email });
    
        if (!existingUser) {
          // Generate a base username from the user's name or email
          const baseUsername = user.name?.replace(/\s+/g, '').toLowerCase() || user.email?.split('@')[0];
          let username = baseUsername;
          let isUnique = false;
    
          // Check if the username already exists and make it unique
          while (!isUnique) {
            const userWithSameUsername = await UserModel.findOne({ username });
            if (!userWithSameUsername) {
              isUnique = true; // Username is unique
            } else {
              // Append a random number to the username
              username = `${baseUsername}${Math.floor(Math.random() * 1000)}`;
            }
          }
    
          // Create a new user for Google Auth
          existingUser = new UserModel({
            email: user.email,
            username: username, // Use the unique username
            googleId: account.providerAccountId, // Store Google ID
            isVerified: true, // Mark as verified since it's Google Auth
          });
    
          await existingUser.save({ validateBeforeSave: false }); // Skip validation for optional fields
        }

        // Attach the username to the user object
        user.username = existingUser.username;
        user._id = existingUser._id;
        user.isVerified = existingUser.isVerified;
        user.isAcceptingMessages = existingUser.isAcceptingMessages;

        return true;
      }
      return true;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};