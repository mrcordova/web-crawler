import { argv } from "node:process";
import { getHTML } from "./crawl";
async function main() {
  const cliArgs = argv.slice(2);
  if (cliArgs.length != 1) {
    console.log("please only provide one url");
    process.exit(1);
  }
  const baseURL = cliArgs[0];
  console.log(`url given ${baseURL}`);
  await getHTML(baseURL);
  process.exit(0);
}
main();
