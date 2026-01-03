// kubejs/server_scripts/server_item_removal.js

// ============================================================================
// Item Removal System (server-side)
// ----------------------------------------------------------------------------
// • Removes ANY recipe producing or consuming a blacklisted item.
// • Hides those items from recipe viewers using the tag c:hidden_from_recipe_viewers and RecipeViewerEvents.
// • Removes those items from all chest/entity loot tables via LootJS.
// ----------------------------------------------------------------------------
// This system is driven by global.itemsToNuke, which is prepared during startup.
// ============================================================================

// ============================================================================
// Load configured blacklist
// ============================================================================
const RAW_BLACKLIST = global && global.itemsToNuke ? global.itemsToNuke : [];

if (!RAW_BLACKLIST || !RAW_BLACKLIST.length) {
  console.log("[ItemRemove] No items specified in config_item_removal_list.js — skipping.");
}

let BLACKLIST = uniqueValues(RAW_BLACKLIST).filter(doItemExist);

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Deduplicates and filters empty/invalid strings.
 */
function uniqueValues(arr) {
  let seen = {};
  let cleaned = [];

  for (let i = 0; i < arr.length; i++) {
    let id = String(arr[i] || "");
    if (!id || seen[id]) continue;
    seen[id] = true;
    cleaned.push(id);
  }
  return cleaned;
}

/**
 * Checks if an item actually exists in the registry.
 */
function doItemExist(id) {
  try {
    return Item.exists(id);
  } catch (_) {
    return false;
  }
}

// ============================================================================
// Recipe Removal
// ============================================================================
ServerEvents.recipes((event) => {
  BLACKLIST.forEach((id) => {
    // Remove recipes producing this item
    event.remove({ output: id });

    // Remove recipes using this item
    event.remove({ input: id });
  });
});

// ============================================================================
// Recipe Viewer Hiding
// ============================================================================
ServerEvents.tags("item", (event) => {
  BLACKLIST.forEach((id) => {
    event.add("c:hidden_from_recipe_viewers", id);
  });
});

RecipeViewerEvents.removeEntries("item", (event) => {
  BLACKLIST.forEach((id) => {
    event.remove(id);
  });
});

// ============================================================================
// Loot Table Stripping
// ============================================================================
LootJS.modifiers((event) => {
  if (!BLACKLIST.length) return;

  BLACKLIST.forEach((id) => {
    console.log(`[ItemRemove] Removing '${id}' from all chest/entity loot tables`);

    // Remove from all chest loot tables (any mod)
    event.addTableModifier("/.*:chests.*/").removeLoot(id);

    // Remove from all entity loot tables (any mod)
    event.addTableModifier("/.*:entities.*/").removeLoot(id);
  });
});

// ============================================================================
// Check for items that don't exist
// ============================================================================
ServerEvents.loaded((event) => {
  RAW_BLACKLIST.forEach((id) => {
    if (!doItemExist(id)) {
      console.log(`[ItemRemove] WARNING: Item in blacklist does not exist: ${id}`);
    }
  });
});
