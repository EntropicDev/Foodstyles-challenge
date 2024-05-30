import { ErrorHandler } from "../../library/error-handler.middleware";
import { SearchService } from "./search.service";

export function searchAPI(app: any) {
  let errorHandler: ErrorHandler = new ErrorHandler();
  let searchService = new SearchService();
  app.get("/search/:searchTerm", async (req: any, res: any, next: any) => {
    try {
      res.json(await searchService.extractEntities(req.params.searchTerm));
    } catch (err: any) {
      errorHandler.apiErrorHandler(err, res);
    }
  });
  app.get(
    "/searchConcurrent/:searchTerm",
    async (req: any, res: any, next: any) => {
      try {
        res.json(
          await searchService.extractEntitiesConcurrent(req.params.searchTerm)
        );
      } catch (err: any) {
        errorHandler.apiErrorHandler(err, res);
      }
    }
  );
}
