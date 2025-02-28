export function printReport(baseURL: string, pages: Record<string, number>) {
  console.log("========================");
  console.log(`REPORT for ${baseURL}`);
  console.log("========================");
  const sortedPages = sortPages(pages);
  for (const [link, count] of sortedPages) {
    console.log(`Found ${count} internal links to ${link}`);
  }
}

function sortPages(pages: Record<string, number>) {
  const entries = Object.entries(pages);
  return entries.sort((a, b) => {
    return b[1] - a[1];
  });
}
