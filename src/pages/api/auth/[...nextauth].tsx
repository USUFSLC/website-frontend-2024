import NextAuth, { AuthOptions, Session } from "next-auth";

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    {
      id: "fslc",
      name: "USU FSLC",
      type: "oauth",
      wellKnown:
        "https://idm.linux.usu.edu/oauth2/openid/oidc_main_website/.well-known/openid-configuration",
      authorization: { params: { scope: "openid profile" } },
      checks: ["pkce", "state"],
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          username: profile.preferred_username,
          roles: profile.roles,
        };
      },
      client: {
        authorization_signed_response_alg: "ES256",
        id_token_signed_response_alg: "ES256",
      },
      clientId: "oidc_main_website",
      clientSecret: process.env.OIDC_CLIENT_SECRET,
    },
  ],

  callbacks: {
    async session({ session, token }) {
      // TypeScript checker hates this but it is the officially endorsed method.
      // https://github.com/nextauthjs/next-auth/discussions/3526
      const s = session as unknown as Record<string, unknown>;
      const u = token.user as Record<string, unknown>;
      s.user = {
        id: u.sub,
        long_name: u.name,
        name: u.preferred_username,
        roles: u.roles,
      };

      return s as unknown as Session;
    },
    async jwt({ token, profile }) {
      const t = token;
      if (profile) {
        t.user = profile;
      }

      return t;
    },
  },
};

export default NextAuth(authOptions);
