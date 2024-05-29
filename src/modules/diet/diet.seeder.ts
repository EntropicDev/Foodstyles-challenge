const diets = [
  { id: 1, name: "Vegan" },
  { id: 2, name: "Vegetarian" },
  { id: 3, name: "Pescatarian" },
  { id: 4, name: "Paleo" },
  { id: 5, name: "Ovo Vegetarian" },
  { id: 6, name: "Lacto Vegetarian" },
  { id: 7, name: "Fruitarian" },
  { id: 8, name: "Ketogenic" },
  { id: 9, name: "Gluten-Free" },
  { id: 10, name: "Dairy-Free" },
  { id: 11, name: "Egg-Free" },
  { id: 12, name: "Soy-Free" },
  { id: 13, name: "Grain-Free" },
  { id: 14, name: "Sugar-Free" },
  { id: 15, name: "Wheat-Free" },
  { id: 16, name: "Nut-Free" },
  { id: 17, name: "Carnivore" },
  { id: 18, name: "Alkaline" },
  { id: 19, name: "Pollotarian" },
  { id: 20, name: "Shellfish-Free" },
  { id: 21, name: "Red Meat-Free" },
  { id: 22, name: "Beef-Free" },
  { id: 23, name: "Pork- & Shellfish-Free" },
  { id: 24, name: "Fish-Free" },
  { id: 25, name: "Low-FODMAP" },
  { id: 26, name: "Anti Inflammatory Based" },
  { id: 27, name: "Lower Carb" },
  { id: 28, name: "Lower Glycemic Index" },
  { id: 29, name: "Lower Oxalate" },
  { id: 30, name: "Lower Histamine" },
  { id: 31, name: "Lower Lectin" },
  { id: 32, name: "Lower Salicylate" },
  { id: 33, name: "Lower Fructose" },
  { id: 34, name: "Lower Tyramine" },
  { id: 35, name: "Lower Saturated Fat" },
  { id: 36, name: "Lower Sulfur" },
  { id: 37, name: "Mustard-Free" },
  { id: 38, name: "Sesame-Free" },
  { id: 39, name: "Celery-Free" },
  { id: 40, name: "Atkins" },
  { id: 41, name: "Peanut-Free" },
  { id: 42, name: "Non-Spicy Diet" },
];
const seed = async (model: any) => {
  console.log("Seeding Diets");
  for (let i = 0; i < diets.length; i++) {
    await model.findOrCreate({
      where: { ...diets[i] },
    });
  }
  console.log("Diets Seeded");
};

export default seed;
