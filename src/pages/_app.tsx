import { AuthSession } from "@/authUtils.ts";
import AuthProvider from "@/components/auth-context.tsx";
import Header from "@/components/header.tsx";
import "@/styles/globals.css";
import "@/styles/calendar.css";
import type { AppProps } from "next/app";
import Head from "next/head";

type StaticProps = {
  idToken: string | null;
  initialAuthSession: AuthSession | null;
};

export default function MyApp({ Component, pageProps }: AppProps<StaticProps>) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AuthProvider initialAuthSession={pageProps.initialAuthSession}>
        <header>
          <Header />
        </header>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
