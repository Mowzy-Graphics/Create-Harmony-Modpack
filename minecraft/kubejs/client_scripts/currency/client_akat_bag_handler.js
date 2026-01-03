// kubejs/client_scripts/client_akat_bag_handler.js

// ============================================================================
// Akat Bag Display (client-side)
// ----------------------------------------------------------------------------
// • Shows dynamic tooltip info for kubejs:akat_bag (number of Akats inside).
// • Uses a custom dynamic tooltip key 'akat_value'.
// • Plays a totem-like animation when receiving a 'totemAnimation' packet.
// ============================================================================

// ============================================================================
// Tooltip: register dynamic field for akat_bag
// ============================================================================
ItemEvents.modifyTooltips(function (event) {
  event.modify("kubejs:akat_bag", function (tooltip) {
    tooltip.dynamic("akat_value");
  });
});

// ============================================================================
// Tooltip: provide dynamic content for 'akat_value'
// ============================================================================
ItemEvents.dynamicTooltips("akat_value", function (event) {
  var amount = event.item.customData.Akats;
  if (amount && amount > 0) {
    event.add(Text.gray("Akats Inside : ").append(Text.white(amount)));
  } else {
    event.add(Text.darkPurple("Empty").italic());
  }
});

// ============================================================================
// Network: show client-side totem animation
// ============================================================================
NetworkEvents.dataReceived("totemAnimation", function (event) {
  Client.gameRenderer.displayItemActivation(event.data.item);
});
