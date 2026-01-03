// kubejs/server_scripts/recipes/custom_item_crafts.js

// ===========================================================================
// Custom Item Crafts
// ============================================================================
// This file contains custom item crafts that are not part of the vanilla game.
// ===========================================================================

ServerEvents.recipes((event) => {
  // Railway Bedding - Dirt + Gravel
  event.shapeless("2x kubejs:railway_bedding", ["minecraft:dirt", "minecraft:gravel"]);
  // Railway Bedding - Coal + Gravel
  event.shapeless("2x kubejs:railway_bedding", ["minecraft:coal", "minecraft:gravel"]);
  // Railway Bedding - Black Dye + Gravel
  event.shapeless("2x kubejs:railway_bedding", ["minecraft:black_dye", "minecraft:gravel"]);
  // Railway Bedding - Crush Basalt
  event.recipes.create.crushing(["2x kubejs:railway_bedding", CreateItem.of("kubejs:railway_bedding", 0.5)], "minecraft:basalt");

  // Railway Bedding Slab
  event.shaped("6x kubejs:railway_bedding_slab", ["BBB"], { B: "kubejs:railway_bedding" });
});
