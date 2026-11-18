import Link from "next/link";
import { notFound } from "next/navigation";
import { getPosts } from "@/lib/insights";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return getPosts().map(({slug}) => ({slug})); }
async function getPost({params}: Props) {
  const {slug} = await params;
  return getPosts().find(post => post.slug === slug) ?? notFound();
}
export async function generateMetadata(props: Props) {
  const post = await getPost(props);
  return { title: post.title, description: post.summary };
}
export default async function Article(props: Props) {
  const post = await getPost(props);
  return <article className="reading"><Link href="/insights">← All insights</Link><time dateTime={post.date}>{post.date}</time>
    <h1>{post.title}</h1><p className="intro">{post.summary}</p>{post.body.map((block,i) => block.startsWith("## ") ? <h2 key={i}>{block.slice(3)}</h2> : <p key={i}>{block}</p>)}
    {post.slug.endsWith("-reading-a-site-update-from-abroad") && <p><a className="text-action" href="/weekly-site-report.txt" download>Download the weekly site report template ↓</a></p>}
    <Link href="/contact">Discuss your project ↗</Link></article>;
}
