// priority: 0

// kubejs/startup_scripts/startup_item_control.js

// ============================================================================
// Item Control (startup-side)
// ----------------------------------------------------------------------------
// • Defines global arrays for dye colors, armor types, wood types, and block
//   variants (created elsewhere like startup_item_types.js).
// • Expands placeholder patterns in itemlists (e.g. +WOODTYPE, +DYECOLOR).
// • Populates global.itemsToNuke and global.itemsForJobs with fully expanded IDs.
// ============================================================================

// ============================================================================
// Utility — Expand placeholder patterns into all variants
// ----------------------------------------------------------------------------
// Supported placeholders:
//   +WOODTYPE       → each global.woodVariants entry
//   +DYECOLOR       → each global.dyeColors entry
//   +ARMORTYPE      → each global.armorTypes entry
//   +BLOCKVARIANT   → each global.blockVariants entry
// ============================================================================

/**
 * Expands placeholders in `sourceArray` and appends results to `receivingArray`.
 *
 * @param {string[]} receivingArray - Destination array (will be filled).
 * @param {string[]} sourceArray - Source entry list (may contain placeholders).
 */
function expandPlaceholders(receivingArray, sourceArray) {
  var queue = sourceArray.slice(); // shallow copy

  while (queue.length > 0) {
    var entry = queue.shift();
    var modName = entry.split(":")[0];

    // ---- EveryCompat wood types
    if (global.everyCompat[modName] && entry.includes("+WOODTYPE")) {
      global.everyCompat[modName].forEach(function (compatPrefix) {
        let pattern = entry.substring(modName.length + 1);

        // Remove +WOODTYPE because compat mods only use +NSWOODTYPE
        pattern = pattern.replace("+WOODTYPE_", "");

        let compatEntry = compatPrefix + pattern;

        if (compatEntry.includes("+NSWOODTYPE")) {
          global.nsWoodVariants.forEach(function (nsWood) {
            queue.push(compatEntry.replace("+NSWOODTYPE", nsWood));
          });
        } else {
          queue.push(compatEntry);
        }
      });
    }

    // ---- Wood Types
    if (entry.includes("+WOODTYPE")) {
      global.woodVariants.forEach(function (wood) {
        queue.push(entry.replace("+WOODTYPE", wood));
      });
      continue;
    }

    // ---- Nature Spirit Wood Types
    if (entry.includes("+NSWOODTYPE")) {
      global.nsWoodVariants.forEach(function (wood) {
        queue.push(entry.replace("+NSWOODTYPE", wood));
      });
      continue;
    }

    // ---- Dye colors
    if (entry.includes("+DYECOLOR")) {
      global.dyeColors.forEach(function (color) {
        queue.push(entry.replace("+DYECOLOR", color));
      });
      continue;
    }

    // ---- Tiers
    if (entry.includes("+TIER")) {
      global.tiers.forEach(function (tier) {
        queue.push(entry.replace("+TIER", tier));
      });
      continue;
    }

    // ---- Armor types
    if (entry.includes("+ARMORTYPE")) {
      global.armorTypes.forEach(function (type) {
        queue.push(entry.replace("+ARMORTYPE", type));
      });
      continue;
    }

    // ---- Tool Types
    if (entry.includes("+TOOLTYPE")) {
      global.toolTypes.forEach(function (tool) {
        queue.push(entry.replace("+TOOLTYPE", tool));
      });
      // ---- Basic Weapons Compatibility
      global.basicWeapons.forEach(function (weapon) {
        queue.push(entry.replace("minecraft:", "basic_weapons:").replace("+TOOLTYPE", weapon));
      });
      continue;
    }

    // ---- Block variants
    if (entry.includes("+BLOCKVARIANT")) {
      global.blockVariants.forEach(function (variant) {
        queue.push(entry.replace("+BLOCKVARIANT", variant));
      });
      continue;
    }

    // ---- No placeholder → add final id
    receivingArray.push(entry);
  }
}

// ============================================================================
// Item lists populated from itemlists/*
// ============================================================================

// Items to be completely removed & hidden (recipes, JEI, loot)
global.itemsToNuke = [];
expandPlaceholders(global.itemsToNuke, global.itemsToRemoveAndHide);

console.log("[startup_item_control] Loaded:", global.itemsToNuke.length, "items to nuke");
