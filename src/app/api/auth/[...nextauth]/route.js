import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialProvider({
      name: "Credentials",
      credentials: {},
      authorize: async (credentials)=>{
        const {email, password} = credentials;
        const res = await fetch("http://tm-web.effisoftsolutions.com/online-users/signin-web", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userType: 'buyer',
            email: email,
            password: password
          })
        });
        const response = await res.json();
        if(!response.error){
          if(response.data.status==="inactive"){
            return null;
          }
          return {
            name: response.data.first_name+" "+response.data.last_name,
            email: response.data.email,
            image: response.data.image_url,
          };
        }
        else{
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({account, profile}) {
      if (account.provider==="google") {
        const res = await fetch("http://tm-web.effisoftsolutions.com/online-users/signin-google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userType: 'buyer',
            email: profile.email
          })
        });
        const response = await res.json();
        if(!response.error){
          if(response.data.status==="inactive"){
            return false;
          }
          else{
            return true;
          }
        }
        else{
          const res1 = await fetch("http://tm-web.effisoftsolutions.com/online-users/create-google", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userType: 'buyer',
              email: profile.email,
              firstName: profile.given_name,
              lastName: profile.family_name,
            })
          });
          const response1 = await res1.json();
          if(!response1.error){
            if(response1.status==="ok"){
              return true;
            }
            else{
              return false;
            }            
          }
          else{
            return false;
          }          
        }
      }
      else{
        return true;
      }
    },
    async jwt({ token, trigger, session }) {
      return token;
    },
    session: async ({session, token})=>{
      session.sub = token.sub;
      session.iat = token.iat;
      session.exp = token.exp;
      session.jti = token.jti;
      const res = await fetch("http://tm-web.effisoftsolutions.com/online-users/find-by-email-web", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: token.email
        })
      });
      const user = await res.json();
      if(!user.error){
        session.user = {
          id: user.data.id,
          userType: user.data.user_type,
          name: user.data.first_name+" "+user.data.last_name,
          email: user.data.email,
          image: user.data.image_url,
          googleImage: token.picture,
          notifyBy: user.data.notify_by,
          status: user.data.status,
        };
        return session;
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
  pages: {
    signIn: "/signin",
    error: "/signin/error",
  }
});

export { handler as GET, handler as POST };