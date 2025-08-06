import { SessionProvider } from "next-auth/react";
import Header from "@/components/header.tsx";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SessionProvider refetchInterval={600}>
        <header>
          <Header />
        </header>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}
