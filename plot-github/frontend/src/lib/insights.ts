import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const directory = join(process.cwd(), "content", "insights");

export function getPosts() {
  return readdirSync(directory).filter(name => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(name)).sort().reverse().map(name => {
    const blocks = readFileSync(join(directory, name), "utf8").trim().split(/\r?\n\s*\r?\n/);
    const [heading, summary, ...body] = blocks;
    if (!heading.startsWith("# ") || !summary) throw new Error("Missing title or introduction in " + name);
    return { slug: name.slice(0, -3), date: name.slice(0, 10), title: heading.slice(2), summary, body };
  });
}
