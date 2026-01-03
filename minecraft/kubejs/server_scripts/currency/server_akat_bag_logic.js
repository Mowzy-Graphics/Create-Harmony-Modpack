// kubejs/server_scripts/server_akat_bag_logic.js
// ============================================================================
// Akat Bag (server-side)
// ----------------------------------------------------------------------------
// • Handles right-clicking kubejs:akat_bag items.
// • Converts the bag into kubejs:akat items based on its NBT "Akats" value.
// • Plays sounds, shows animations, and drops leftovers if inventory is full.
// ============================================================================

ItemEvents.rightClicked("kubejs:akat_bag", function (event) {
  const player = event.player;
  const akatBag = event.item;
  const akatAmount = akatBag.customData.Akats; // number of Akats stored

  // Player position (no need for px/py/pz prefix)
  const x = player.x;
  const y = player.y;
  const z = player.z;

  // ========================================================================
  // Bag contains Akats
  // ========================================================================
  if (akatAmount) {
    // ---- play open sound
    event.server.runCommandSilent(`playsound minecraft:block.ender_chest.open player ${player.username} ${x} ${y} ${z} 1 0.7`);

    // ---- add cooldown
    player.addItemCooldown(akatBag, 5);

    // ---- totem animation
    player.sendData("totemAnimation", { item: akatBag.id });

    // ---- remove the bag
    akatBag.count--;

    // ---- create stack of Akats
    const akatStack = Item.of("kubejs:akat", akatAmount);

    // ---- try to give to player
    const leftover = player.give(akatStack);

    // ---- drop leftovers if inventory full
    if (!leftover.isEmpty()) {
      player.drop(leftover, true); // true = at feet, no pickup delay
    }
    return;
  }

  // ========================================================================
  // Bag empty (count = 0 or missing)
  // ========================================================================
  // ---- play error sound
  event.server.runCommandSilent(`playsound supplementaries:block.crank player ${player.username} ${x} ${y} ${z} 1 1.2`);

  // ---- add cooldown
  player.addItemCooldown(akatBag, 5);

  // ---- notify player
  player.tell({
    text: "Looks like this bag is empty...",
    italic: true,
    color: "gray",
  });

  // ---- remove the bag
  akatBag.count--;
});
