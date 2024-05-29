import { searchAPI } from "./modules/search/search.api";
export async function routes(app: any) {
  await searchAPI(app);
}
