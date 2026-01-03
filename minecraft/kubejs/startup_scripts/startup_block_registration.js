// priority: 5

// kubejs/startup_scripts/startup_block_registration.js

// ============================================================================
// Blocks Creation (startup-side)
// ----------------------------------------------------------------------------
// • Registers custom blocks
// • Applies display names, hardness, material, and tags
// ============================================================================

StartupEvents.registry("block", (event) => {
  event
    .create("railway_bedding", "falling")
    .displayName("Railway Bedding")
    .mapColor("terracotta_gray")
    .gravelSoundType()
    .hardness(0.6)
    .resistance(2)
    .tagBlock("minecraft:mineable/shovel")
    .tagBlock("simplest_paxels:mineable/paxel")
    .requiresTool(false)
    .renderType("solid")
    .suffocating(false);

  event
    .create("railway_bedding_slab", "slab")
    .displayName("Railway Bedding Slab")
    .mapColor("terracotta_gray")
    .gravelSoundType()
    .hardness(0.6)
    .resistance(2)
    .requiresTool(false)
    .tagBlock("minecraft:mineable/shovel")
    .tagBlock("simplest_paxels:mineable/paxel");
});
