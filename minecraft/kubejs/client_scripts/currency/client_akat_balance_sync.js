// kubejs/client_scripts/client_akat_balance_sync.js

// ============================================================================
// Akat Balance Sync (client-side)
// ----------------------------------------------------------------------------
// • Listens for the 'akat_balance_sync' network packet sent by the server.
// • Extracts the balance value (supports multiple field formats).
// • Updates FancyMenu variable 'akat_balance' using a client command.
// ============================================================================

NetworkEvents.dataReceived("akat_balance_sync", function (event) {
  var bal = "0";

  // ========================================================================
  // Plain-object style fields
  // ========================================================================
  try {
    if (event.data && typeof event.data === "object") {
      if (event.data.balance_s !== undefined) {
        bal = String(event.data.balance_s);
      } else if (event.data.balance !== undefined) {
        bal = String(event.data.balance);
      } else if (event.data.balance_i !== undefined) {
        bal = String(event.data.balance_i);
      }
    }
  } catch (e) {}

  // ========================================================================
  // NBT-like accessors (STRING ONLY)
  // ========================================================================
  try {
    if (event.data && typeof event.data.getString === "function") {
      var s = event.data.getString("balance_s");
      if (s && s !== "") {
        bal = String(s);
      }
    }
  } catch (e2) {}

  // ========================================================================
  // Apply to FancyMenu variable (STRING)
  // ========================================================================
  try {
    if (Client && Client.runCommand) {
      Client.runCommand("fmvariable set akat_balance false " + bal);
    } else if (Client && Client.player && Client.player.runCommand) {
      Client.player.runCommand("fmvariable set akat_balance false " + bal);
    }
  } catch (e3) {}
});
