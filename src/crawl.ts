import { JSDOM } from "jsdom";

export function normalizeURL(url: string) {
  const urlObj = new URL(url);
  let fullPath = `${urlObj.host}${urlObj.pathname}`;
  if (fullPath.slice(-1) === "/") {
    fullPath = fullPath.slice(0, -1);
  }
  return fullPath;
}

export function getURLsFromHTML(html: string, baseURL: string) {
  const urls = [];
  const dom = new JSDOM(html);
  const anchors = dom.window.document.querySelectorAll("a");

  for (const anchor of anchors) {
    let href = anchor.getAttribute("href");
    if (href) {
      try {
        // convert any relative URLs to absolute URLs
        href = new URL(href, baseURL).href;
        urls.push(href);
      } catch (err) {
        console.log(`${(err as Error).message}: ${href}`);
      }
    }
  }

  return urls;
}

export async function getHTML(url: string) {
  try {
    const res = await fetch(url);
    // console.log("here");
    if (!res.ok) {
      console.error(`Response status: ${res.status}`);
      return "";
    }
    if (!res.headers.get("Content-Type")?.includes("text/html")) {
      console.error(`content type is not html`);
      return "";
    }
    const html = await res.text();
    // console.log(html);
    return html;
  } catch (error) {
    console.error(`in getHTML ${error}`);
    return "";
  }
}

export async function crawlPage(
  baseURL: string,
  currentURL: string,
  pages: Record<string, number> = {}
) {
  const currentHostname = new URL(currentURL).hostname;
  const baseHostname = new URL(baseURL).hostname;
  if (currentHostname != baseHostname) {
    return pages;
  }
  const normalizeCurrentURL = normalizeURL(currentURL);
  if (pages[normalizeCurrentURL]) {
    pages[normalizeCurrentURL] += 1;
    return pages;
  }
  console.log(`crawling ${currentURL}`);
  pages[normalizeCurrentURL] = 1;
  try {
    const html = await getHTML(currentURL);
    // console.log(`get html: ${html}`);
    const urls = getURLsFromHTML(html, baseURL);
    for (const url of urls) {
      pages = await crawlPage(baseURL, url, pages);
    }
    return pages;
  } catch (error) {
    console.error(`crawl page: ${error}`);
    return pages;
  }
}
