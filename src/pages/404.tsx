import Head from "next/head";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <>
      <Head>
        <title>404 Not Found</title>
      </Head>
      <main>
        <h1>404 Not Found</h1>
        <p>
          <Link href="/">Back to safety</Link>
        </p>
      </main>
    </>
  );
}
