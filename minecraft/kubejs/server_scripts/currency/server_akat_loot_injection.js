// kubejs/server_scripts/loot/server_akat_loot_injection.js

// ============================================================================
// Akat Loot Injection (server-side)
// ----------------------------------------------------------------------------
// Injects Akat Fragments and rare full Akats into various loot tables.
// Optimized for clarity, consistency, and easy tuning.
// ============================================================================

// ============================================================================
// Constants
// ============================================================================
const FRAGMENT_ITEM = "kubejs:akat_fragment";
const FULL_AKAT_ITEM = "kubejs:akat";
const DEFAULT_ADDITIONAL_ROLLS = 1;

// ============================================================================
// Loot Table Rules
// ============================================================================
const LOOT_RULES = [
  // Overworld basic
  { table: "minecraft:chests/abandoned_mineshaft", weight: 5, range: [1, 3], akatChance: 0 },
  { table: "minecraft:chests/simple_dungeon", weight: 4, range: [1, 3], akatChance: 0 },
  { table: "minecraft:chests/desert_pyramid", weight: 3, range: [2, 4], akatChance: 0 },
  { table: "minecraft:chests/jungle_temple", weight: 3, range: [2, 3], akatChance: 0 },
  { table: "minecraft:chests/shipwreck_treasure", weight: 4, range: [2, 3], akatChance: 0 },
  { table: "minecraft:chests/ruined_portal", weight: 3, range: [2, 3], akatChance: 0 },
  { table: "minecraft:chests/igloo_chest", weight: 2, range: [1, 2], akatChance: 0 },

  // Villages
  { table: "minecraft:chests/village_armorer", weight: 2, range: [2, 3], akatChance: 0 },
  { table: "minecraft:chests/village_toolsmith", weight: 2, range: [2, 3], akatChance: 0 },
  { table: "minecraft:chests/village_weaponsmith", weight: 2, range: [2, 3], akatChance: 0 },
  { table: "minecraft:chests/village_temple", weight: 2, range: [1, 2], akatChance: 0 },

  // Overworld advanced
  { table: "minecraft:chests/woodland_mansion", weight: 3, range: [3, 5], akatChance: 0.02 },
  { table: "minecraft:chests/ancient_city", weight: 2, range: [3, 6], akatChance: 0.03 },
  { table: "minecraft:chests/buried_treasure", weight: 2, range: [3, 6], akatChance: 0.04 },

  // RealmRPG Balloons
  { table: "realmrpg_balloons:chests/common_balloon", weight: 3, range: [1, 2], akatChance: 0 },
  { table: "realmrpg_balloons:chests/uncommon_balloon", weight: 4, range: [1, 3], akatChance: 0.01 },
  { table: "realmrpg_balloons:chests/rare_balloon", weight: 5, range: [2, 6], akatChance: 0.05 },
  { table: "realmrpg_balloons:chests/epic_balloon", weight: 6, range: [3, 7], akatChance: 0.1 },
  { table: "realmrpg_balloons:chests/legendary_balloon", weight: 8, range: [4, 9], akatChance: 0.2 },

  // Nether
  { table: "minecraft:chests/nether_bridge", weight: 3, range: [2, 4], akatChance: 0.01 },
  { table: "minecraft:chests/bastion_bridge", weight: 2, range: [3, 6], akatChance: 0.02 },
  { table: "minecraft:chests/bastion_treasure", weight: 1, range: [4, 7], akatChance: 0.05 },

  // End
  { table: "minecraft:chests/end_city_treasure", weight: 2, range: [3, 7], akatChance: 0.2 },
];

// ============================================================================
// RealmRPG Skeletons
// ============================================================================
const SKELETONS = [
  "acrobat",
  "arrow",
  "basic",
  "bow",
  "buried",
  "burnt",
  "cactus",
  "chorus",
  "chorus_tangled",
  "common",
  "corrupted",
  "devastated",
  "dragon_burnt",
  "dripstone",
  "duelist",
  "dungeon_crawler",
  "dusty",
  "explorer",
  "frozen_waterdrop",
  "fungus_gatherer",
  "headache",
  "headless",
  "hunted",
  "lucky",
  "mossy",
  "mushroomer",
  "neutralized",
  "pierced",
  "powder_snow",
  "quicksand",
  "rookie",
  "shot",
  "shroom",
  "slain",
  "snow",
  "spider_victim",
  "stalactite",
  "swimmer",
  "thief",
  "unsaved",
  "vines_tangled",
  "waterdrop",
  "webbed",
  "winter",
];

SKELETONS.forEach((name) => {
  LOOT_RULES.push({ table: `realmrpg_skeletons:blocks/${name}_skeleton`, weight: 3, range: [1, 2], akatChance: 0.01 });
});

// ============================================================================
// Helper Function
// ============================================================================
function addAkatPool(pool, weight, range, akatChance) {
  pool.rolls(DEFAULT_ADDITIONAL_ROLLS);

  // Add fragments
  pool.addEntry(LootEntry.of(FRAGMENT_ITEM, range).withWeight(weight));

  // Add rare jackpot full Akat
  if (akatChance > 0) {
    pool.addEntry(
      LootEntry.of(FULL_AKAT_ITEM, [1, 4])
        .withWeight(1)
        .when((ctx) => ctx.randomChance(akatChance))
    );
  }
}

// ============================================================================
// LootJS Integration
// ============================================================================
LootJS.modifiers((event) => {
  LOOT_RULES.forEach((rule) => {
    event.addTableModifier(rule.table).pool((pool) => {
      addAkatPool(pool, rule.weight, rule.range, rule.akatChance);
    });
  });
});
