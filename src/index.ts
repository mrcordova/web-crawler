import { argv } from "node:process";
function main() {
  const cliArgs = argv.slice(2);
  if (cliArgs.length != 1) {
    console.log("please only provide one url");
    process.exit(1);
  }
  console.log(`url given ${cliArgs[0]}`);
  process.exit(0);
}
main();
