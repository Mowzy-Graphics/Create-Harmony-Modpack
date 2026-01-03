// priority: 100

// Items and Functionalities unlocked at each phase

global.phasedProgress = [
  {
    phaseId: 0,
    phaseName: "First Pulse",
    phaseDesc: "A faint heartbeat answers your arrival.",
    phaseItemUnlocks: ["minecraft:wooden_+TOOLTYPE", "minecraft:stone_+TOOLTYPE", "minecraft:leather_+ARMORTYPE"],
    phaseInteractionUnlocks: ["minecraft:crafting_table", "carved_wood:+WOODTYPE_crafting_table"],
    phaseDimensionUnlocks: [],
    phaseInputBoosts: {
      "minecraft:diamond": 6,
      "minecraft:emerald": 6,
      "minecraft:gold_ingot": 3,
      "minecraft:iron_ingot": 3,
      "minecraft:coal": 2,
      "kubejs:ferroflux_dust": 10, // Ferroflux Dust Collected in stations scattered around the world
      "kubejs:arcstone": 10, // Randomly spawning Arcstone in the world
      "kubejs:verdant_pressure_bulb": 30, // Crafted through Create Mod process using Arcstone Nixie Tubes and Ferroflux Dust
    },
  },
  {
    phaseId: 1,
    phaseName: "Foundation",
    phaseDesc: "The Core steadies itself, learning your rhythm.",
    phaseItemUnlocks: [],
    phaseInteractionUnlocks: [],
    phaseDimensionUnlocks: [],
    phaseInputBoosts: {},
  },
  {
    phaseId: 2,
    phaseName: "Bloom",
    phaseDesc: "“Its light grows, reaching toward your path.",
    phaseItemUnlocks: [],
    phaseInteractionUnlocks: [],
    phaseDimensionUnlocks: [],
    phaseInputBoosts: {},
  },
  {
    phaseId: 3,
    phaseName: "Resonance",
    phaseDesc: "Your strength echoes within the Core.",
    phaseItemUnlocks: [],
    phaseInteractionUnlocks: [],
    phaseDimensionUnlocks: [],
    phaseInputBoosts: {},
  },
  {
    phaseId: 4,
    phaseName: "Synchrony",
    phaseDesc: "Its voice aligns with worlds beyond sight.",
    phaseItemUnlocks: [],
    phaseInteractionUnlocks: [],
    phaseDimensionUnlocks: [],
    phaseInputBoosts: {},
  },
  {
    phaseId: 5,
    phaseName: "Harmony",
    phaseDesc: "You and the Core move as one.",
    phaseItemUnlocks: [],
    phaseInteractionUnlocks: [],
    phaseDimensionUnlocks: [],
    phaseInputBoosts: {},
  },
];
