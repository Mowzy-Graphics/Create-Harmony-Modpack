// kubejs/server_scripts/cravings.js

// ============================================================================
// Craving System – Refactored & Organized
// ============================================================================
// Features:
// • Players randomly get cravings for food items
// • Eating the craved item grants beneficial effects
// • Admins can assign or clear cravings via /crave
// • Tracks craving satisfaction to prevent repeated rewards
// ============================================================================

// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  MIN_CRAVING_TICKS: 20 * 60 * 10, // 10 minutes
  MAX_CRAVING_TICKS: 20 * 60 * 30, // 30 minutes
  CRAVING_DURATION_MIN: 20 * 60 * 5, // 5 minutes
  CRAVING_DURATION_MAX: 20 * 60 * 15, // 15 minutes

  // Effects granted when craving is satisfied (weighted random)
  BENEFICIAL_EFFECTS: [
    // ── Combat (common → rare)
    { id: "minecraft:strength", level: 1, minDuration: 20 * 60 * 5, maxDuration: 20 * 60 * 7, weight: 8 },
    { id: "minecraft:strength", level: 2, minDuration: 20 * 60 * 1.5, maxDuration: 20 * 60 * 2.5, weight: 3 },
    { id: "minecraft:regeneration", level: 1, minDuration: 20 * 60 * 2.5, maxDuration: 20 * 60 * 4, weight: 7 },
    { id: "minecraft:resistance", level: 1, minDuration: 20 * 60 * 2.5, maxDuration: 20 * 60 * 3.5, weight: 6 },

    // ── Mobility / Work
    { id: "minecraft:speed", level: 1, minDuration: 20 * 60 * 2.5, maxDuration: 20 * 60 * 4, weight: 8 },
    { id: "minecraft:jump_boost", level: 1, minDuration: 20 * 60 * 2, maxDuration: 20 * 60 * 3, weight: 6 },
    { id: "minecraft:haste", level: 1, minDuration: 20 * 60 * 2.5, maxDuration: 20 * 60 * 4, weight: 7 },

    // ── Utility / Exploration
    { id: "minecraft:night_vision", level: 0, minDuration: 20 * 60 * 6, maxDuration: 20 * 60 * 10, weight: 10 },
    { id: "minecraft:water_breathing", level: 0, minDuration: 20 * 60 * 5, maxDuration: 20 * 60 * 7.5, weight: 9 },
    { id: "minecraft:fire_resistance", level: 0, minDuration: 20 * 60 * 4, maxDuration: 20 * 60 * 6, weight: 9 },
    { id: "minecraft:luck", level: 0, minDuration: 20 * 60 * 3, maxDuration: 20 * 60 * 5, weight: 8 },
    { id: "minecraft:saturation", level: 0, minDuration: 20 * 60 * 2, maxDuration: 20 * 60 * 3, weight: 8 },

    // ── Modded food effects
    { id: "brewinandchewin:sweet_heart", level: 0, minDuration: 20 * 60 * 4, maxDuration: 20 * 60 * 6, weight: 5 },
    { id: "farmersdelight:comfort", level: 0, minDuration: 20 * 60 * 5, maxDuration: 20 * 60 * 7.5, weight: 6 },
    { id: "farmersdelight:nourishment", level: 0, minDuration: 20 * 60 * 5, maxDuration: 20 * 60 * 7.5, weight: 6 },

    // ── Rare / Epic
    { id: "minecraft:absorption", level: 2, minDuration: 20 * 60 * 1, maxDuration: 20 * 60 * 1.5, weight: 2 },
    { id: "minecraft:strength", level: 3, minDuration: 20 * 60 * 0.5, maxDuration: 20 * 60 * 1, weight: 1 },
  ],

  DEBUG: true,
};

// ============================================================================
// DEBUG & UTILITIES
// ============================================================================
function debug(player, message) {
  if (CONFIG.DEBUG && player) player.tell(`§7[DEBUG] ${message}`);
}

function randomBetween(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

// Picks a weighted random effect from an array
function pickWeightedEffect(effects) {
  const totalWeight = effects.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const e of effects) {
    roll -= e.weight;
    if (roll <= 0) return e;
  }
  return effects[0]; // fallback
}

// ============================================================================
// CRAVING SCHEDULING
// ============================================================================
function scheduleNextCraving(player, currentTick) {
  if (typeof currentTick !== "number") currentTick = player.server.ticks || 0;
  player.persistentData.nextCravingTick = currentTick + randomBetween(CONFIG.MIN_CRAVING_TICKS, CONFIG.MAX_CRAVING_TICKS);
  debug(player, `Next craving scheduled at tick ${player.persistentData.nextCravingTick}`);
}

// ============================================================================
// ACTION BAR MANAGEMENT
// ============================================================================
const activeActionBars = {}; // key: player username -> { text, ticksRemaining }

function sendActionBar(player, text, durationTicks) {
  if (!durationTicks) durationTicks = 60; // default 3 seconds
  activeActionBars[player.username] = { text: text, ticksRemaining: durationTicks };
}

// Tick handler for updating action bars
ServerEvents.tick((event) => {
  const players = event.server.players;
  for (const player of players) {
    const bar = activeActionBars[player.username];
    if (bar && bar.ticksRemaining > 0) {
      player.server.runCommandSilent(`title ${player.username} actionbar {"text":"${bar.text}"}`);
      bar.ticksRemaining--;
      if (bar.ticksRemaining <= 0) delete activeActionBars[player.username];
    }
  }
});

// ============================================================================
// CRAVING APPLICATION
// ============================================================================
function applyCraving(player, craving) {
  player.persistentData.craving = craving.id;
  player.persistentData.cravingSatisfied = false;

  const duration = randomBetween(CONFIG.CRAVING_DURATION_MIN, CONFIG.CRAVING_DURATION_MAX);
  player.potionEffects.add("kubejs:craving", duration, 0, false, false);

  // Immersive feedback
  player.tell(`§6[Craving] §f${craving.message}`);
  player.server.runCommandSilent(`particle minecraft:happy_villager ${player.x} ${player.y + 1} ${player.z} 0.5 0.5 0.5 0.02 10`);
  player.server.runCommandSilent(`playsound minecraft:entity.player.levelup block @a[name=${player.username}] ${player.x} ${player.y + 1} ${player.z} 1 1`);
  sendActionBar(player, `§f${craving.message}`, 200);

  debug(player, `Craving applied: ${craving.id}, duration ${duration}`);
}

// Check if craving expired
function checkCravingExpiration(player) {
  if (!player.persistentData.craving) return;
  if (!player.potionEffects.isActive("kubejs:craving")) {
    debug(player, `Craving expired: ${player.persistentData.craving}`);

    // Immersive feedback
    player.server.runCommandSilent(`particle minecraft:smoke ${player.x} ${player.y + 1} ${player.z} 0.3 0.3 0.3 0.01 8`);
    player.server.runCommandSilent(`playsound minecraft:block.bell.use block @a[name=${player.username}] ${player.x} ${player.y + 1} ${player.z} 1 0.8`);
    sendActionBar(player, `§7Craving expired… §f${player.persistentData.craving}`, 120);

    player.persistentData.craving = undefined;
    player.persistentData.cravingSatisfied = false;

    scheduleNextCraving(player);
  }
}

// ============================================================================
// FOOD CONSUMPTION HANDLER
// ============================================================================
function handleFoodEaten(player, item) {
  if (!player.persistentData.craving) return;

  const craving = global.cravings.find((c) => c.id === player.persistentData.craving);
  if (!craving) return;

  const eatenId = Item.of(item).id.toLowerCase();
  if (eatenId !== craving.item.toLowerCase()) return;

  debug(player, "Craving satisfied! Applying effects...");

  const effect = pickWeightedEffect(CONFIG.BENEFICIAL_EFFECTS);
  const duration = randomBetween(effect.minDuration, effect.maxDuration);

  player.potionEffects.add(effect.id, duration, effect.level, false, false);

  // Immersive feedback
  player.server.runCommandSilent(`particle minecraft:heart ${player.x} ${player.y + 1} ${player.z} 0.5 0.5 0.5 0.05 8`);
  player.server.runCommandSilent(`playsound minecraft:entity.player.levelup block @a[name=${player.username}] ${player.x} ${player.y + 1} ${player.z} 1 1.2`);
  sendActionBar(player, `§aCraving satisfied! §7 Gained ${effect.id} Lv.${effect.level} for ${Math.floor(duration / 20)}s`, 120);

  debug(player, `Applied effect ${effect.id} level ${effect.level} for ${duration} ticks`);

  player.removeEffect("kubejs:craving");
  player.persistentData.craving = undefined;
  player.persistentData.cravingSatisfied = true;

  scheduleNextCraving(player);
  player.tell("§aYou satisfied your craving!");
}

// ============================================================================
// TICK CHECK – APPLY OR EXPIRE CRAVINGS
// ============================================================================
function tickCravingCheck(player, currentTick) {
  if (player.persistentData.craving) {
    checkCravingExpiration(player);
    return;
  }

  if (!player.persistentData.nextCravingTick) {
    scheduleNextCraving(player);
    return;
  }

  if (currentTick >= player.persistentData.nextCravingTick) {
    if (!global.cravings || global.cravings.length === 0) return;
    const craving = global.cravings[Math.floor(Math.random() * global.cravings.length)];
    applyCraving(player, craving);
  }
}

// Tick event
ServerEvents.tick((event) => {
  const tick = event.server.ticks;
  event.server.players.forEach((player) => tickCravingCheck(player, tick));
});

// ============================================================================
// FOOD EATEN EVENT
// ============================================================================
ItemEvents.foodEaten((event) => handleFoodEaten(event.player, event.item));

// ============================================================================
// ADMIN COMMAND: /crave
// ============================================================================
ServerEvents.commandRegistry((event) => {
  const Commands = event.commands;
  const Arguments = event.arguments;

  const isOp = (src) => {
    try {
      return src.getServer().getPlayerList().isOp(src.getPlayer().getGameProfile());
    } catch (e) {
      return false;
    }
  };

  const cravingSuggestions = () => global.cravings.map((c) => c.id).concat(["clear"]);

  event.register(
    Commands.literal("crave")
      .requires(isOp)
      .then(
        Commands.argument("target", Arguments.PLAYER.create(event)).then(
          Commands.argument("craving_id_or_clear", Arguments.STRING.create(event))
            .suggests((ctx, builder) => {
              cravingSuggestions().forEach((id) => builder.suggest(id));
              return builder.buildFuture();
            })
            .executes((ctx) => {
              const admin = ctx.source.player;
              const target = Arguments.PLAYER.getResult(ctx, "target");
              const arg = Arguments.STRING.getResult(ctx, "craving_id_or_clear").toLowerCase();

              if (arg === "clear") {
                target.persistentData.craving = undefined;
                target.persistentData.cravingSatisfied = false;
                target.removeEffect("kubejs:craving");
                scheduleNextCraving(target);

                admin.tell(`§aCraving cleared for ${target.username}`);
                target.tell("§eYour craving has been cleared by an admin!");

                // Immersive feedback
                target.server.runCommandSilent(`particle minecraft:cloud ${target.x} ${target.y + 1} ${target.z} 0.3 0.3 0.3 0.01 8`);
                target.server.runCommandSilent(`playsound minecraft:block.note_block.bell block @a[name=${target.username}] ${target.x} ${target.y + 1} ${target.z} 1 1`);
                sendActionBar(target, `§7Craving cleared by §a${admin.username}`, 100);

                return 1;
              }

              const craving = global.cravings.find((c) => c.id === arg);
              if (!craving) {
                admin.tell(`§cCraving '${arg}' not found.`);
                return 0;
              }

              applyCraving(target, craving);
              admin.tell(`§aCraving '${craving.id}' applied to ${target.username}`);
              return 1;
            })
        )
      )
  );
});
