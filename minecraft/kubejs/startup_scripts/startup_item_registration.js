// priority: 5

// kubejs/startup_scripts/startup_item_registration.js

// ============================================================================
// Item Creation (startup-side)
// ----------------------------------------------------------------------------
// • Registers custom items
// • Applies display names, rarities, and stack size rules.
// ============================================================================

StartupEvents.registry("item", (event) => {
  // ========================================================================
  // Bags
  // ========================================================================
  event.create("loot_bag").displayName("Bag of Loot").rarity("epic");

  event.create("akat_bag").displayName("Bag of Akats").rarity("epic");

  event.create("candy_bag").displayName("Bag of Candies").rarity("rare");

  event.create("kit_bag").displayName("Bag of Kits").rarity("rare");

  // ========================================================================
  // Currency
  // ========================================================================
  event.create("akat_fragment").displayName("Akat Fragment").rarity("common");

  event.create("akat").displayName("Akat").rarity("rare");

  event.create("candy").displayName("Candy").rarity("uncommon");

  event.create("soul").displayName("Soul").rarity("uncommon");
});

console.info("[startup_item_registration] Custom items registered.");
