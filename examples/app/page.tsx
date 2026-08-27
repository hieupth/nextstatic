import { Link } from "@hieupth/nextstatic";

export default function Landing() {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100vh", gap: "1.5rem" }}>
      <h1>nextstatic</h1>
      <p>The path &amp; asset layer for Next.js static exports.</p>
      <nav style={{ display: "flex", gap: "2rem", fontSize: "1.2rem" }}>
        <Link href="/en/">English</Link>
        <Link href="/vi/">Tiếng Việt</Link>
      </nav>
    </main>
  );
}
