import { icons as syncIcons } from "./modules/sync";

(async function main() {
  console.log(syncIcons);
  const { icons: asyncIcons } = await import("./modules/async");
  console.log(asyncIcons);
})();
