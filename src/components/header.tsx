import styles from "@/styles/Header.module.css";
import Link from "next/link";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

type NavbarEntry = { text: string; link: string };

const NAVBAR_ENTRIES: NavbarEntry[] = [
  {
    text: "Home",
    link: "/",
  },
  {
    text: "Streams",
    link: "/stream",
  },
];

export default function Header() {
  const [hidden, setHidden] = useState(true);

  const { data: session } = useSession();

  function toggleNavbar() {
    setHidden(!hidden);
  }

  return (
    <nav className={`${styles.navbar} ${hidden ? styles.hidden : ""}`}>
      <div className={styles.left}>
        <div className={styles.logo}>
          {session?.user?.name ?? "guest"}@usufslc %
        </div>
        <ul className={styles.links}>
          {NAVBAR_ENTRIES.map((entry) => {
            return (
              <li key={entry.text}>
                [&nbsp;<Link href={entry.link}>{entry.text}</Link>&nbsp;]
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.right}>
        <button
          type="button"
          onClick={() => signIn("fslc", { callbackUrl: "/" })}
        >
          Sign in
        </button>
        <span className={styles.expander}>
          [&nbsp;
          <button type="button" onClick={toggleNavbar} className="link">
            {hidden ? "++" : "--"}
          </button>
          &nbsp;]
        </span>
      </div>
    </nav>
  );
}
