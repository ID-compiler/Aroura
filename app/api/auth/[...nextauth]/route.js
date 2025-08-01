import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"


export const authOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }
      if (user) {
        token.phone = user.phone
      }
      return token
    },
    
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.provider = token.provider
      session.phone = token.phone
      return session
    },

    async signIn({ user, account, profile, email, credentials }) {
      // Always allow sign in - errors will be handled by pages
      return true
    },

    async redirect({ url, baseUrl }) {
      // Redirect to success page after successful login
      if (url.startsWith("/") && !url.includes("error")) {
        return `${baseUrl}/login-success`
      }
      // Redirect to error page for errors
      if (url.includes("error")) {
        return `${baseUrl}/login-error${url.includes("?") ? "&" + url.split("?")[1] : ""}`
      }
      return baseUrl
    }
  },

  pages: {
    error: '/login-error', // Error page
  }
}

const handler = NextAuth(authOptions)

// Named exports for App Router
export { handler as GET, handler as POST }
