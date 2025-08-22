import styles from "@/styles/Header.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { AuthContext } from "@/components/auth-context.tsx";

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

  const { session } = useContext(AuthContext);

  const router = useRouter();

  function toggleNavbar() {
    setHidden(!hidden);
  }

  return (
    <nav className={`${styles.navbar} ${hidden ? styles.hidden : ""}`}>
      <div className={styles.left}>
        <span className={styles.logo}>
          <span className={styles.expander}>
            <button type="button" onClick={toggleNavbar}>
              {hidden ? "++" : "--"}
            </button>
          </span>
          {session?.username ?? "guest"}@usufslc %
        </span>
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
          onClick={() => router.push(`/api/auth/login?after=${router.asPath}`)}
        >
          Sign in
        </button>
      </div>
    </nav>
  );
}
