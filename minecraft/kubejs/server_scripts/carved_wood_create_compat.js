// kubejs/server_scripts/carved_wood_create_compat.js

// ===========================================================================
// Carved Wood Create Compat
// ============================================================================
// Adds compatibility for Carved Wood and Create.
// ---------------------------------------------------------------------------
// Made by adding tags to the carved wood containers
// ============================================================================

ServerEvents.tags("item", (event) => {
  global.woodVariants.forEach((variant) => {
    // Chests
    event.add("create:chest_mounted_storage", `carved_wood:${variant}_chest`);

    // Trapped Chests
    event.add("create:chest_mounted_storage", `carved_wood:trapped_${variant}_chest`);

    // Barrels
    event.add("create:copycat_allow", `carved_wood:${variant}_barrel`);
    event.add("create:simple_mounted_storage", `carved_wood:${variant}_barrel`);
    event.add("create:single_block_inventories", `carved_wood:${variant}_barrel`);
  });
});
