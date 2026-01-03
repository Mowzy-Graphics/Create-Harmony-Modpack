// priority: 5

// kubejs/startup_scripts/startup_effects_registration.js

// ============================================================================
// Effect Creation (startup-side)
// ----------------------------------------------------------------------------
// • Registers custom effects
// ============================================================================

StartupEvents.registry("mob_effect", (event) => {
  // Craving Effect - No Real Effect
  event.create("craving").color(0x00ffff).beneficial();
});
