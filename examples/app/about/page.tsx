import { Link } from "@hieupth/nextstatic";

export default function About() {
  return (
    <main>
      <h1>About</h1>
      <p>Route reached through a prefixed Link.</p>
      <Link href="/">← Home</Link>
    </main>
  );
}
