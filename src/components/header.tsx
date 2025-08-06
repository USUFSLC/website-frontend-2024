import styles from "@/styles/Header.module.css";
import Link from "next/link";

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
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>guest@usufslc %</div>
      <ul className={styles.links}>
        {NAVBAR_ENTRIES.map((entry) => {
          return (
            <li key={entry.text}>
              [&nbsp;<Link href={entry.link}>{entry.text}</Link>&nbsp;]
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
