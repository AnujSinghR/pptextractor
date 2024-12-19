import Image from "next/image";
import styles from "./page.module.css";
import FileExtractorApp from "./ppt";

export default function Home() {
  return (
    <main className={styles.main}>
      <FileExtractorApp/>
    </main>
  );
}
