import { ErrorHandler } from "../../library/error-handler.middleware";
import { BrandRepo } from "../brand/brand.repo";
import { CityRepo } from "../city/city.repo";
import { DietRepo } from "../diet/diet.repo";
import { DishTypeRepo } from "../dish-type/dish-type.repo";
import { SearchRepo } from "./search.repo";
import { prepositions } from "./search.exlusions";
import { db } from "../../config.db";

export class SearchService {
  constructor() {}
  private errorHandler: ErrorHandler = new ErrorHandler();
  repo: SearchRepo = new SearchRepo();
  brandRepo: BrandRepo = new BrandRepo();
  dietRepo: DietRepo = new DietRepo();
  dishTypeRepo: DishTypeRepo = new DishTypeRepo();
  cityRepo: CityRepo = new CityRepo();

  /*
  The method used here is to query each individual entity (City, Brand, Diet and DishType).
  The results are then passed through to a permutation function to be permuted into a single array.

  While the constraint is to use a single query to the DB, the current implementation is the most efficient
  and the least complex to implement.

  This is due to the fact that the entities are not related to each other in any way.
  This means that there is no way to combine the queries into a single query without
  a significant amount of additional complexity.

  One could use a UNION query to combine the results of multiple queries into a single result set.
  However, this would increase the processing time of the database exponentially as the data in each table grows.

  I have instead opted to query each entity concurrently using Promise.all() to reduce the time taken to query the database.
*/
  extractEntitiesConcurrent = async (searchTerm: string): Promise<any> => {
    try {
      let searchTerms = searchTerm.split(" ");
      // Remove all prepositions from searchTerms using the prepositions array
      searchTerms = searchTerms.filter((term) => !prepositions.includes(term));
      // Used to create the final object. Simpler answer is to standardise the object to have the same keys.
      const orderOfEntities = ["brand", "city", "diet", "dishType"];
      const results = await Promise.all([
        await this.brandRepo.searchBrands(searchTerms),
        await this.cityRepo.searchCities(searchTerms),
        await this.dietRepo.searchDiets(searchTerms),
        await this.dishTypeRepo.searchDishTypes(searchTerms),
      ]).then((results) => {
        let searchResults: any = {};
        results.forEach((result, i) => {
          if (result.length > 0) {
            searchResults[orderOfEntities[i]] = result;
          }
        });
        let permutations = this.generatePermutations(searchResults);
        return permutations;
      });

      return results;
    } catch (error: any) {
      this.errorHandler.passthrough(
        error,
        "Service: extractEntitiesConcurrent"
      );
    }
  };
  extractEntities = async (searchTerm: string): Promise<any> => {
    try {
      const searchTerms = searchTerm
        .split(" ")
        .filter((term) => !prepositions.includes(term))
        .map((term) => term.trim());

      const whereClause = searchTerms
        .map((term) => `name LIKE '%${term}%'`)
        .join(" OR ");

      const query = `
    SELECT 'brand' as entity, id , name FROM brands WHERE ${whereClause}
    UNION ALL
    SELECT 'city' as entity, id , name FROM cities WHERE ${whereClause}
    UNION ALL
    SELECT 'diet' as entity, id , name FROM diets WHERE ${whereClause}
    UNION ALL
    SELECT 'dishType' as entity, id , name FROM dishTypes WHERE ${whereClause};
  `;
      const [results] = await db.sequelize.query(query);

      const groupedData = results.reduce((accumulator: any, item: any) => {
        const { entity, ...rest } = item; // Destructure to remove 'entity' key
        if (!accumulator[entity]) {
          accumulator[entity] = [];
        }
        accumulator[entity].push(rest); // Push the item without the 'entity' key
        return accumulator;
      }, {});
      let permutations = this.generatePermutations(groupedData);
      return permutations;
    } catch (error: any) {
      this.errorHandler.passthrough(error, "Service: extractEntities");
    }
  };
  private generatePermutations = (data: any) => {
    const keys = Object.keys(data);
    const firstKey = keys[0];
    const restKeys = keys.slice(1);

    const permutations: any[] = [];

    const permute = (index: number, currentObject: any) => {
      if (index === restKeys.length) {
        permutations.push({ ...currentObject });
        return;
      }

      const key = restKeys[index];
      for (const value of data[key]) {
        currentObject[key] = value;
        permute(index + 1, currentObject);
      }
    };

    for (const value of data[firstKey]) {
      const currentObject: any = { [firstKey]: value };
      permute(0, currentObject);
    }

    return permutations;
  };
}
