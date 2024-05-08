// pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" }
        //no password for now
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = {name: credentials.username, email: credentials.username}
        return user
      }
    })
  ],
  session: {
    jwt: true,
  },
};

export default (req, res) => NextAuth(req, res, options);
