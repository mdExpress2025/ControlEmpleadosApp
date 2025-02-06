import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../lib/mongodb";
import generarToken from "@/utils/generarToken";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            try {
                const client = await clientPromise;
                const db = client.db("AplicacionInformeEmpleados");
                const authorizeUser = await db.collection("usuarios").findOne({ email: user.email });
                if(authorizeUser){
                    user.role=authorizeUser.role||"user";
                    user.tokenLocal= generarToken(authorizeUser);
                }
                return !!authorizeUser;
            } catch (error) {
                console.error("Error en signIn:", error);
                return false;
            }
        },
        async jwt({ token,user, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            if(user){
                token.role=user.role;
                token.tokenLocal=user.tokenLocal
            }
            return token;
        },
        async session({ session, token }) {
            session.user.image=token.picture||session.user.image
            session.user.token = token.accessToken;
            session.user.role=token.role;
            session.tokenLocal=token.tokenLocal;
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    pages: {
        signIn: '/login',
        signOut: '/login',
        error: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
});