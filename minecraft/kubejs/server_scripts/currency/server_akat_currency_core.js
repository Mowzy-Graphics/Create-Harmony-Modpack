// kubejs/server_scripts/server_akat_currency_core.js

// ============================================================================
// Akat Currency (server-side)
// ----------------------------------------------------------------------------
// • Stores balances in world persistent data (key: 'akatbalance').
// • Syncs the player's balance to the client on login and whenever it changes.
// • Provides chat-forward, low-noise feedback with subtle coloring.
// ============================================================================

let CURRENCY_NAME = "[Akat Currency Logger]";
let CURRENCY_TAG = "akatbalance";
let DEBUG_SYNC = false;

// In-memory cache of last known balances (for quick reads / baltop formatting)
let bankBalance = {};

// ============================================================================
// Palette + tiny text utils
// ============================================================================
let PALETTE = {
  base: "#BFBFBF", // light gray
  dim: "#9A9A9A", // dim gray for separators
  money: "#FFD166", // soft gold highlight for amounts/balance
  good: "#80D27A", // green for gains/ok
  warn: "#F2A65A", // amber for warnings
  bad: "#E76F51", // red for errors
};

// Build a JSON tellraw component quickly.
function jt(parts) {
  let extra = [];
  for (let i = 0; i < parts.length; i++) {
    let p = parts[i] || {};
    let seg = { text: String(p.t || "") };
    if (p.c) seg.color = p.c;
    if (p.b) seg.bold = true;
    if (p.i) seg.italic = true;
    if (p.u) seg.underlined = true;
    if (p.ob) seg.obfuscated = true;
    extra.push(seg);
  }
  return { text: "", extra: extra };
}

function tellraw(server, username, obj) {
  try {
    server.runCommandSilent("tellraw " + username + " " + JSON.stringify(obj));
  } catch (e) {
    try {
      let p = server.getPlayer(username);
      if (p)
        p.tell(
          "[Akat] " +
            (obj && obj.extra
              ? obj.extra
                  .map(function (s) {
                    return s.text;
                  })
                  .join("")
              : "")
        );
    } catch (e2) {}
  }
}

// Minimal, tasteful prefix like “◆ Akat”
function tag() {
  return [
    { t: "◆ ", c: PALETTE.dim, i: true },
    { t: "Akat ", c: PALETTE.dim, i: true },
  ];
}

function tMoney(b) {
  return { t: formatMoney(b), c: PALETTE.money };
}
function tAkats() {
  return { t: " Akats", c: PALETTE.dim, i: true };
}
function sepDot() {
  return { t: " • ", c: PALETTE.dim };
}
function plus() {
  return { t: "+", c: PALETTE.good, b: true };
}
function minus() {
  return { t: "–", c: PALETTE.bad, b: true };
}

// ============================================================================
// Helpers
// ============================================================================
function normalizeIntString(s) {
  s = String(s || "0").replace(/[^0-9]/g, "");
  s = s.replace(/^0+/, "");
  return s === "" ? "0" : s;
}

// a + b (strings)
function addStr(a, b) {
  a = normalizeIntString(a);
  b = normalizeIntString(b);

  let carry = 0;
  let res = "";

  let i = a.length - 1;
  let j = b.length - 1;

  while (i >= 0 || j >= 0 || carry) {
    let da = i >= 0 ? a.charCodeAt(i--) - 48 : 0;
    let db = j >= 0 ? b.charCodeAt(j--) - 48 : 0;
    let sum = da + db + carry;
    carry = sum >= 10 ? 1 : 0;
    res = (sum % 10) + res;
  }
  return res;
}

// a - b (strings, assumes a >= b)
function subStr(a, b) {
  a = normalizeIntString(a);
  b = normalizeIntString(b);

  let res = "";
  let borrow = 0;

  let i = a.length - 1;
  let j = b.length - 1;

  while (i >= 0) {
    let da = a.charCodeAt(i--) - 48;
    let db = j >= 0 ? b.charCodeAt(j--) - 48 : 0;
    da -= borrow;

    if (da < db) {
      da += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    res = da - db + res;
  }

  return normalizeIntString(res);
}

// formatting
function formatMoneyStr(s) {
  s = normalizeIntString(s);
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function clampNonNegative(b) {
  return b < 0 ? 0 : b;
}

function formatMoney(amount) {
  try {
    let n = Number(amount);

    if (isNaN(n) || n < 0) n = 0;

    // Format with spaces: 1 234 567
    return Math.floor(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  } catch (e) {
    return "0";
  }
}

function playAt(server, player, sound, vol, pitch) {
  let username = player.username;
  let x = player.x,
    y = player.y,
    z = player.z;
  server.runCommandSilent("playsound " + sound + " player " + username + " " + x + " " + y + " " + z + " " + vol + " " + pitch);
}

function syncBalancePacket(player, amount) {
  try {
    let formatted = formatMoney(amount);

    player.sendData("akat_balance_sync", {
      balance_s: formatted,
    });
  } catch (e) {
    console.error(CURRENCY_NAME + " syncBalancePacket error: " + e);
  }
}

function getWorldData(player) {
  try {
    return player && player.level && player.level.getPersistentData();
  } catch (e) {
    return null;
  }
}

function ensureAkatCompound(worldData) {
  if (!worldData.contains(CURRENCY_TAG)) {
    worldData.put(CURRENCY_TAG, { type: "compound" });
  }
  return worldData.getCompound(CURRENCY_TAG);
}

function readBalance(player) {
  try {
    let worldData = getWorldData(player);
    if (!worldData) return 0;

    let comp = ensureAkatCompound(worldData);
    if (!comp.contains(player.username)) comp.putString(player.username, "0");

    let bal = Number(comp.getString(player.username)) || 0;
    bankBalance[player.username] = bal;
    return bal;
  } catch (e) {
    console.error(CURRENCY_NAME + " readBalance error: " + e);
    return 0;
  }
}

function writeBalance(player, amount) {
  try {
    if (!player) return false;

    let worldData = getWorldData(player);
    if (!worldData) return false;

    let safe = Math.max(0, Math.floor(Number(amount) || 0));
    let comp = ensureAkatCompound(worldData);

    comp.putString(player.username, String(safe));
    bankBalance[player.username] = safe;

    syncBalancePacket(player, safe);
    return true;
  } catch (e) {
    console.error(CURRENCY_NAME + " writeBalance error: " + e);
    return false;
  }
}

function logTx(type, from, to, amount) {
  try {
    console.log(CURRENCY_NAME + " " + new Date().toISOString() + " | " + type + " | From: " + from + " | To: " + to + " | Amount: " + toBig(amount) + " Akats");
  } catch (e) {}
}

// ============================================================================
// Sync on death / change dimension
// ============================================================================
// Player respawns (death)
PlayerEvents.respawned(function (event) {
  let p = event.player;
  syncBalancePacket(p, readBalance(p));
});

// ============================================================================
// Login — send immediately, plus delayed resyncs for fresh worlds/first join
// ============================================================================
PlayerEvents.loggedIn(function (event) {
  let player = event.player;
  let server = player.server;

  // 1) ensure a value exists and send right away
  let balance = readBalance(player);
  syncBalancePacket(player, balance);

  // 2) resend after short delays so the client listener/FancyMenu is ready
  //    (this solves "new world" + first-join timing issues)
  try {
    server.scheduleInTicks(20, function () {
      // ~1s
      if (player && player.isAlive && player.isAlive()) {
        syncBalancePacket(player, readBalance(player));
      }
    });
    server.scheduleInTicks(100, function () {
      // ~5s
      if (player && player.isAlive && player.isAlive()) {
        syncBalancePacket(player, readBalance(player));
      }
    });
  } catch (e) {}

  // nice chat line
  tellraw(server, player.username, jt(tag().concat([{ t: "Welcome. Balance: ", c: PALETTE.base }, tMoney(balance), tAkats()])));
});

// ============================================================================
// Commands (unified under /akat)
// ============================================================================
ServerEvents.commandRegistry(function (event) {
  let Commands = event.commands;
  let Arguments = event.arguments;

  // Helper: check if source is op
  function isOp(source) {
    try {
      return source.getServer().getPlayerList().isOp(source.getPlayer().getGameProfile());
    } catch (e) {
      return false;
    }
  }

  // Helper: unified admin change balance
  function changeBalance(admin, target, amount, mode) {
    let current = readBalance(target);
    if (mode === "remove" && current < amount) {
      tellraw(admin.server, admin.username, jt(tag().concat([{ t: target.username + " has only ", c: PALETTE.warn }, tMoney(current), tAkats()])));
      return false;
    }

    let next = clampNonNegative(mode === "add" ? current + amount : mode === "remove" ? current - amount : mode === "set" ? amount : current);

    if (!writeBalance(target, next)) return false;

    // Tell admin
    tellraw(
      admin.server,
      admin.username,
      jt(
        tag().concat([
          {
            t: mode.charAt(0).toUpperCase() + mode.slice(1) + " ",
            c: PALETTE.base,
          },
          tMoney(amount),
          tAkats(),
          {
            t: mode === "set" ? " to " : " for " + target.username,
            c: PALETTE.base,
          },
        ])
      )
    );

    // Tell target
    tellraw(target.server, target.username, jt(tag().concat([{ t: "Balance updated: ", c: PALETTE.base }, tMoney(next), tAkats()])));

    logTx("ADMIN_" + mode.toUpperCase(), admin.username, target.username, amount);
    return true;
  }

  // /akat command root
  event.register(
    Commands.literal("akat")

      // ── /akat balance [player]
      .then(
        Commands.literal("balance")
          .executes(function (ctx) {
            try {
              let player = ctx.source.player;
              let balance = readBalance(player);
              tellraw(player.server, player.username, jt(tag().concat([{ t: "Balance: ", c: PALETTE.base }, tMoney(balance), tAkats()])));
              return 1;
            } catch (e) {
              console.error(CURRENCY_NAME + " /akat balance error: " + e);
              return 0;
            }
          })
          .then(
            Commands.argument("target", Arguments.PLAYER.create(event)).executes(function (ctx) {
              try {
                let caller = ctx.source.player;
                let target = Arguments.PLAYER.getResult(ctx, "target");
                if (!target) {
                  tellraw(caller.server, caller.username, jt(tag().concat([{ t: "Invalid player.", c: PALETTE.bad }])));
                  return 0;
                }
                let bal = readBalance(target);
                tellraw(caller.server, caller.username, jt(tag().concat([{ t: target.username + "'s Balance: ", c: PALETTE.base }, tMoney(bal), tAkats()])));
                return 1;
              } catch (e) {
                console.error(CURRENCY_NAME + " /akat balance <target> error: " + e);
                return 0;
              }
            })
          )
      )

      // ── /akat withdraw <amount>
      .then(
        Commands.literal("withdraw").then(
          Commands.argument("amount", Arguments.INTEGER.create(event)).executes(function (ctx) {
            try {
              let player = ctx.source.player;
              let server = player.server;
              let amount = Arguments.INTEGER.getResult(ctx, "amount");

              if (isNaN(amount) || amount <= 0) {
                tellraw(server, player.username, jt(tag().concat([{ t: "Minimum withdrawal is 1.", c: PALETTE.warn }])));
                return 0;
              }

              let current = readBalance(player);
              if (amount > current) {
                tellraw(server, player.username, jt(tag().concat([{ t: "Insufficient funds. Balance: ", c: PALETTE.warn }, tMoney(current), tAkats()])));
                return 0;
              }

              server.runCommandSilent("give " + player.username + " kubejs:akat_bag[minecraft:custom_data={Akats:" + amount + "}] 1");

              let next = clampNonNegative(current - amount);
              if (!writeBalance(player, next)) {
                tellraw(server, player.username, jt(tag().concat([{ t: "Error updating balance.", c: PALETTE.bad }])));
                return 0;
              }

              playAt(server, player, "minecraft:block.amethyst_block.hit", 0.7, 1.4);
              tellraw(
                server,
                player.username,
                jt([minus(), { t: " " }, tMoney(amount), tAkats(), sepDot(), { t: "Balance: ", c: PALETTE.base }, tMoney(next), tAkats()])
              );

              logTx("WITHDRAW", player.username, player.username, amount);
              return 1;
            } catch (e) {
              console.error(CURRENCY_NAME + " /akat withdraw error: " + e);
              return 0;
            }
          })
        )
      )

      // ── /akat give <player> <amount> (admin)
      .then(
        Commands.literal("give")
          .requires((src) => isOp(src))
          .then(
            Commands.argument("target", Arguments.PLAYER.create(event)).then(
              Commands.argument("amount", Arguments.INTEGER.create(event)).executes(function (ctx) {
                let admin = ctx.source.player;
                let target = Arguments.PLAYER.getResult(ctx, "target");
                let amount = Arguments.INTEGER.getResult(ctx, "amount");
                if (!target || isNaN(amount) || amount <= 0) return 0;
                return changeBalance(admin, target, amount, "add") ? 1 : 0;
              })
            )
          )
      )

      // ── /akat take <player> <amount> (admin)
      .then(
        Commands.literal("take")
          .requires((src) => isOp(src))
          .then(
            Commands.argument("target", Arguments.PLAYER.create(event)).then(
              Commands.argument("amount", Arguments.INTEGER.create(event)).executes(function (ctx) {
                let admin = ctx.source.player;
                let target = Arguments.PLAYER.getResult(ctx, "target");
                let amount = Arguments.INTEGER.getResult(ctx, "amount");
                if (!target || isNaN(amount) || amount <= 0) return 0;
                return changeBalance(admin, target, amount, "remove") ? 1 : 0;
              })
            )
          )
      )

      // ── /akat set <player> <amount> (admin)
      .then(
        Commands.literal("set")
          .requires((src) => isOp(src))
          .then(
            Commands.argument("target", Arguments.PLAYER.create(event)).then(
              Commands.argument("amount", Arguments.INTEGER.create(event)).executes(function (ctx) {
                let admin = ctx.source.player;
                let target = Arguments.PLAYER.getResult(ctx, "target");
                let amount = Arguments.INTEGER.getResult(ctx, "amount");
                if (!target || isNaN(amount) || amount < 0) return 0;
                return changeBalance(admin, target, amount, "set") ? 1 : 0;
              })
            )
          )
      )

      // ── /akat top
      .then(
        Commands.literal("top").executes(function (ctx) {
          try {
            let player = ctx.source.player;
            let server = player.server;
            let worldData = getWorldData(player);
            if (!worldData || !worldData.contains(CURRENCY_TAG)) {
              tellraw(server, player.username, jt(tag().concat([{ t: "No balance data yet.", c: PALETTE.dim }])));
              return 0;
            }

            let comp = worldData.getCompound(CURRENCY_TAG);
            let names = comp.getAllKeys();
            let pairs = names.map((u) => [u, toBig(parseInt(comp.getString(u), 10))]);
            pairs.sort((a, b) => b[1] - a[1]);
            let top10 = pairs.slice(0, 10);

            tellraw(server, player.username, jt(tag().concat([{ t: "Top Balances:", c: PALETTE.base }])));
            if (top10.length === 0) {
              tellraw(server, player.username, jt([{ t: "No player balances found.", c: PALETTE.dim }]));
            } else {
              for (let i = 0; i < top10.length; i++) {
                let [u, b] = top10[i];
                tellraw(server, player.username, jt([{ t: i + 1 + ". ", c: PALETTE.dim }, { t: u + ": ", c: PALETTE.base }, tMoney(b), tAkats()]));
              }
            }
            return 1;
          } catch (e) {
            console.error(CURRENCY_NAME + " /akat top error: " + e);
            return 0;
          }
        })
      )
  );
});

// ============================================================================
// Item: right-click cash-in (single vs. crouch to cash all)
// Item ID: kubejs:akat
// ============================================================================
ItemEvents.rightClicked("kubejs:akat", function (event) {
  let player = event.player;
  let server = event.server;
  let amount = event.item.count;
  let current = readBalance(player);

  // not crouching → cash 1
  if (!player.crouching) {
    if (writeBalance(player, current + 1)) {
      playAt(server, player, "minecraft:block.amethyst_block.hit", 0.7, 1.9);
      tellraw(
        server,
        player.username,
        jt([plus(), { t: "1 ", c: PALETTE.good, b: true }, { t: "Akat", c: PALETTE.base }, sepDot(), { t: "Balance: ", c: PALETTE.base }, tMoney(current + 1), tAkats()])
      );
      logTx("ITEM_CASH_IN", player.username, player.username, 1);
      event.item.count--;
      return 1;
    }
    return 0;
  }

  // crouching → cash all in hand
  if (writeBalance(player, current + amount)) {
    playAt(server, player, "minecraft:block.amethyst_block.place", 0.7, 1.2);
    tellraw(
      server,
      player.username,
      jt([
        plus(),
        { t: formatMoney(amount) + " ", c: PALETTE.good, b: true },
        { t: "Akats", c: PALETTE.base },
        sepDot(),
        { t: "Balance: ", c: PALETTE.base },
        tMoney(current + amount),
        tAkats(),
      ])
    );
    logTx("ITEM_CASH_IN", player.username, player.username, amount);

    // drain the stack
    for (let i = 0; i < amount; i++) event.item.count--;
    return 1;
  }
  return 0;
});
