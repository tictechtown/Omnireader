import * as cheerio from "cheerio";

export default async function getFeedUrl(url: string): Promise<string | null> {
  const res = await fetch(url);
  if (res.ok) {
    const htmlText = await res.text();
    const $ = cheerio.load(htmlText);
    const rssNode = $('head link[type="application/rss+xml"]');
    if (rssNode) {
      return rssNode.attr("href");
    }
    const atomNode = $('head link[type="application/atom+xml"]');
    if (atomNode) {
      return atomNode.attr("href");
    }
  }

  return null;
}
