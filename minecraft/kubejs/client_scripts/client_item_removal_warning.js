// kubejs/client_scripts/client_item_removal_warning.js

// ============================================================================
// Item Removal (client-side)
// ----------------------------------------------------------------------------
// • Clears tooltips for items listed in global.itemsToNuke.
// • Shows a red warning message instead.
// ============================================================================

ItemEvents.modifyTooltips((event) => {
  // Filter only items that actually exist in-game
  const validItems = global.itemsToNuke.filter((id) => Item.exists(id));

  validItems.forEach((id) => {
    event.modify(id, (tooltip) => {
      tooltip.clear();
      tooltip.add(Text.red("This item has been removed !"));
    });
  });
});
