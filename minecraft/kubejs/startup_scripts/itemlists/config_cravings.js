// priority: 100

// ============================================================================
// Craving Foods Configuration
// ----------------------------------------------------------------------------
// Each object contains:
// - id: unique identifier
// - item: Minecraft or modded item ID
// - message: message displayed when craving starts
// ============================================================================

global.cravings = [
  // ── Farmer's Delight: Desserts & Sweets
  { id: "cake_slice", item: "farmersdelight:cake_slice", message: "A slice of cake sounds perfect at the moment." },
  { id: "apple_pie_slice", item: "farmersdelight:apple_pie_slice", message: "You’re craving a sweet apple pie slice." },
  { id: "sweet_berry_cheesecake_slice", item: "farmersdelight:sweet_berry_cheesecake_slice", message: "Sweet berries and creamy cheesecake call to you." },
  { id: "chocolate_pie_slice", item: "farmersdelight:chocolate_pie_slice", message: "Chocolate pie is exactly what you need." },
  { id: "sweet_berry_cookie", item: "farmersdelight:sweet_berry_cookie", message: "A sweet berry cookie would hit the spot." },
  { id: "honey_cookie", item: "farmersdelight:honey_cookie", message: "Honey cookie craving activated." },
  { id: "melon_popsicle", item: "farmersdelight:melon_popsicle", message: "A cool melon popsicle would be refreshing." },
  { id: "glow_berry_custard", item: "farmersdelight:glow_berry_custard", message: "Glow berries and custard sound delightful." },
  { id: "fruit_salad", item: "farmersdelight:fruit_salad", message: "A bowl of fruit salad is calling your name." },
  { id: "mixed_salad", item: "farmersdelight:mixed_salad", message: "You’re craving something fresh and filling — a mixed salad." },
  { id: "nether_salad", item: "farmersdelight:nether_salad", message: "A bold, spicy nether salad sounds surprisingly good." },

  // ── Farmer's Delight: Sandwiches & Wraps
  { id: "barbecue_stick", item: "farmersdelight:barbecue_stick", message: "The smell of grilled barbecue is hard to resist." },
  { id: "egg_sandwich", item: "farmersdelight:egg_sandwich", message: "A simple egg sandwich would really satisfy you." },
  { id: "chicken_sandwich", item: "farmersdelight:chicken_sandwich", message: "A hearty chicken sandwich sounds amazing right now." },
  { id: "hamburger", item: "farmersdelight:hamburger", message: "You can’t stop thinking about a juicy hamburger." },
  { id: "bacon_sandwich", item: "farmersdelight:bacon_sandwich", message: "Crispy bacon in a sandwich is calling your name." },
  { id: "mutton_wrap", item: "farmersdelight:mutton_wrap", message: "A warm mutton wrap sounds deeply satisfying." },

  // ── Farmer's Delight: Savory Dishes
  { id: "dumplings", item: "farmersdelight:dumplings", message: "Warm dumplings sound incredibly comforting." },
  { id: "stuffed_potato", item: "farmersdelight:stuffed_potato", message: "A warm stuffed potato sounds incredibly satisfying." },
  { id: "cabbage_rolls", item: "farmersdelight:cabbage_rolls", message: "Hearty cabbage rolls sound perfect right now." },
  { id: "salmon_roll", item: "farmersdelight:salmon_roll", message: "Fresh salmon rolls would really hit the spot." },
  { id: "cod_roll", item: "farmersdelight:cod_roll", message: "A light cod roll sounds surprisingly appealing." },
  { id: "kelp_roll", item: "farmersdelight:kelp_roll", message: "A simple kelp roll sounds refreshing." },
  { id: "kelp_roll_slice", item: "farmersdelight:kelp_roll_slice", message: "A slice of kelp roll would be a nice bite." },
  { id: "cooked_rice", item: "farmersdelight:cooked_rice", message: "A bowl of warm cooked rice sounds comforting." },
  { id: "bone_broth", item: "farmersdelight:bone_broth", message: "A rich bone broth sounds deeply nourishing." },
  { id: "beef_stew", item: "farmersdelight:beef_stew", message: "A hearty beef stew sounds exactly right." },

  // ── Farmer's Delight: Soups & Stews
  { id: "chicken_soup", item: "farmersdelight:chicken_soup", message: "A warm bowl of chicken soup sounds perfect right now." },
  { id: "vegetable_soup", item: "farmersdelight:vegetable_soup", message: "A comforting vegetable soup would be just right." },
  { id: "fish_stew", item: "farmersdelight:fish_stew", message: "A hearty fish stew sounds surprisingly satisfying." },
  { id: "fried_rice", item: "farmersdelight:fried_rice", message: "A plate of fried rice sounds incredibly tempting." },
  { id: "pumpkin_soup", item: "farmersdelight:pumpkin_soup", message: "A creamy pumpkin soup sounds delicious right now." },
  { id: "baked_cod_stew", item: "farmersdelight:baked_cod_stew", message: "A rich baked cod stew sounds amazing." },
  { id: "noodle_soup", item: "farmersdelight:noodle_soup", message: "A soothing bowl of noodle soup would really help." },

  // ── Farmer's Delight: Breakfast
  { id: "bacon_and_eggs", item: "farmersdelight:bacon_and_eggs", message: "Bacon and eggs sound like the perfect meal right now." },

  // ── Farmer's Delight: Pasta & Special Dishes
  { id: "pasta_with_meatballs", item: "farmersdelight:pasta_with_meatballs", message: "A hearty plate of pasta with meatballs sounds incredible." },
  { id: "roast_chicken_block", item: "farmersdelight:roast_chicken_block", message: "A hearty roast chicken sounds incredibly satisfying right now." },
  { id: "grilled_salmon", item: "farmersdelight:grilled_salmon", message: "Perfectly grilled salmon is exactly what you’re craving." },
  { id: "squid_ink_pasta", item: "farmersdelight:squid_ink_pasta", message: "A rich plate of squid ink pasta sounds tempting." },
  { id: "ratatouille", item: "farmersdelight:ratatouille", message: "A warm serving of ratatouille would be wonderfully comforting." },
  { id: "steak_and_potatoes", item: "farmersdelight:steak_and_potatoes", message: "Steak and potatoes sound like the perfect meal right now." },
  { id: "vegetable_noodles", item: "farmersdelight:vegetable_noodles", message: "A bowl of vegetable noodles sounds light yet filling." },
  { id: "roasted_mutton_chops", item: "farmersdelight:roasted_mutton_chops", message: "Juicy roasted mutton chops are calling to you." },
  { id: "mushroom_rice", item: "farmersdelight:mushroom_rice", message: "Fragrant mushroom rice sounds incredibly appealing." },
  { id: "pasta_with_mutton_chop", item: "farmersdelight:pasta_with_mutton_chop", message: "A hearty pasta topped with mutton sounds irresistible." },

  // ── Nature's Delight
  { id: "coconut_bread", item: "natures_delight:coconut_bread", message: "Fresh coconut bread sounds wonderfully comforting right now." },
  { id: "coconut_pancakes", item: "natures_delight:coconut_pancakes", message: "Fluffy coconut pancakes would be perfect at the moment." },
  { id: "fafaru", item: "natures_delight:fafaru", message: "A bold serving of fafaru is calling to you." },
  { id: "sweet_and_savory_saute", item: "natures_delight:sweet_and_savory_saute", message: "That sweet and savory sauté sounds irresistible." },

  // ── Create: Sweets
  { id: "sweet_roll", item: "create:sweet_roll", message: "A soft, sweet roll sounds absolutely delightful right now." },
  { id: "honeyed_apple", item: "create:honeyed_apple", message: "A warm honeyed apple sounds incredibly tempting." },
  { id: "chocolate_glazed_berries", item: "create:chocolate_glazed_berries", message: "Chocolate-glazed berries would hit the spot perfectly." },
  { id: "bar_of_chocolate", item: "create:bar_of_chocolate", message: "A bar of chocolate sounds impossible to resist." },

  // ── More Delight
  { id: "cooked_rice_with_porkchop", item: "moredelight:cooked_rice_with_porkchop", message: "A hearty plate of rice with porkchop sounds very satisfying." },
  { id: "creamy_pasta_with_ham", item: "moredelight:creamy_pasta_with_ham", message: "A creamy pasta with ham sounds rich and satisfying." },
  { id: "creamy_pasta_with_chicken_cuts", item: "moredelight:creamy_pasta_with_chicken_cuts", message: "Creamy pasta with chicken cuts would be perfect right now." },
  {
    id: "diced_potatoes_with_chicken_cuts",
    item: "moredelight:diced_potatoes_with_chicken_cuts",
    message: "Diced potatoes with chicken cuts sound hearty and delicious.",
  },
  { id: "diced_potatoes_with_beef", item: "moredelight:diced_potatoes_with_beef", message: "Diced potatoes with beef would make a perfect meal." },
  { id: "diced_potatoes_with_porkchop", item: "moredelight:diced_potatoes_with_porkchop", message: "Diced potatoes with porkchop sound incredibly filling." },
  {
    id: "diced_potatoes_with_egg_and_tomato",
    item: "moredelight:diced_potatoes_with_egg_and_tomato",
    message: "Diced potatoes with egg and tomato sound wonderfully comforting.",
  },
  { id: "potato_salad", item: "moredelight:potato_salad", message: "A fresh potato salad sounds very satisfying." },
  { id: "chicken_salad", item: "moredelight:chicken_salad", message: "A hearty chicken salad would hit the spot perfectly." },
  { id: "mashed_potatoes", item: "moredelight:mashed_potatoes", message: "Creamy mashed potatoes are calling your name." },
  { id: "cooked_rice_with_beef", item: "moredelight:cooked_rice_with_beef", message: "A plate of cooked rice with beef sounds hearty and satisfying." },
  { id: "cooked_rice_with_chicken_cuts", item: "moredelight:cooked_rice_with_chicken_cuts", message: "Cooked rice with chicken cuts would make a perfect meal." },
  { id: "omelette", item: "moredelight:omelette", message: "A fluffy omelette sounds delicious right now." },
  { id: "toast_with_glow_berries", item: "moredelight:toast_with_glow_berries", message: "Toast topped with glow berries looks incredibly tempting." },
  { id: "simple_hamburger", item: "moredelight:simple_hamburger", message: "A simple hamburger sounds satisfying and filling." },
  { id: "carrot_soup", item: "moredelight:carrot_soup", message: "A warm bowl of carrot soup sounds comforting." },
  { id: "toast_with_chocolate", item: "moredelight:toast_with_chocolate", message: "Toast with chocolate is calling your name." },
];
