/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Perfume } from '../types/perfume';

export const PERFUMES_DATA: Perfume[] = [
  {
    id: 'obsidian-oud',
    name: 'Obsidian Oud',
    subtitle: 'Smoked Cambodian agarwood, charred cedar, and midnight leather',
    category: 'Woody & Smoky',
    concentration: 'Extrait de Parfum',
    oilPercentage: 32,
    prices: {
      '30ml': 145,
      '50ml': 210,
      '100ml': 320,
    },
    defaultSize: '100ml',
    description:
      'A nocturnal masterpiece forged in silence. Obsidian Oud pairs 25-year aged Cambodian agarwood with sacred smoked saffron and birch tar, resting on a deep foundation of charred Atlas cedar and black leather.',
    olfactoryStory:
      'Harvested from wild aquilaria trees in Koh Kong, our aged oud is distilled under low pressure to preserve its deep animalic richness without medicinal sharpness. Smoked cardamom and cold frankincense pierce the opening like a silver needle through dark velvet.',
    pyramid: {
      top: ['Smoked Saffron', 'Calabrian Bergamot', 'Cold Cardamom Pods'],
      heart: ['Cambodian Agarwood (Oud)', 'Orris Butter', 'Midnight Black Leather'],
      base: ['Charred Atlas Cedar', 'Birch Tar', 'Smoky Vetiver', 'Dark Ambergris'],
      topDesc: 'Volatile aromatic sparks lasting the first 20 minutes',
      heartDesc: 'The smoky, balsamic resinous core active for 4-6 hours',
      baseDesc: 'Deep fixative woods and leather persisting for 14+ hours',
    },
    accords: [
      { name: 'Smoky & Balsamic', percentage: 92 },
      { name: 'Precious Woods', percentage: 86 },
      { name: 'Black Leather', percentage: 74 },
      { name: 'Warm Amber', percentage: 58 },
      { name: 'Spiced Saffron', percentage: 46 },
    ],
    sillage: 'Enveloping',
    longevity: '14+ Hours on Skin',
    season: 'Autumn / Winter / Evening Noir',
    ritual: 'Mist directly on pulse points at carotid arteries and inner cuffs. Allow the resin to settle without rubbing.',
    image: '/src/assets/images/aura_obsidian_oud_1792573921525.jpg',
    isBestseller: true,
  },
  {
    id: 'celestial-rose',
    name: 'Celestial Rose',
    subtitle: 'Centifolia rose petals bathed in crystalline dew and champagne pink pepper',
    category: 'Solar & Floral',
    concentration: 'Eau de Parfum',
    oilPercentage: 22,
    prices: {
      '30ml': 125,
      '50ml': 185,
      '100ml': 275,
    },
    defaultSize: '100ml',
    description:
      'An ethereal encounter between dew-drenched May roses handpicked at dawn in Grasse and sparkling pink peppercorn. Grounded by white cashmere wood and airy ambrette seeds for an aura of timeless grace.',
    olfactoryStory:
      'Over 400 petals of Rosa Centifolia are macerated for every single 100ml flacon. Infused with tart lychee nectar and crystalline Italian mandarin, Celestial Rose reimagines classic florals into a modern, radiant luminescence.',
    pyramid: {
      top: ['Lychee Sorbet', 'Italian Mandarin', 'Pink Peppercorn'],
      heart: ['Grasse Centifolia Rose', 'Bulgarian Damascena', 'Dewy Peony'],
      base: ['White Cashmere Wood', 'Airy Ambrette', 'Clean Crystal Musk'],
      topDesc: 'Vibrant, effervescent sunrise fruit notes',
      heartDesc: 'Lush, honeyed botanical rose core lasting 3-5 hours',
      baseDesc: 'Silken, whisper-soft musky skin finish lasting 9+ hours',
    },
    accords: [
      { name: 'Floral Rose', percentage: 94 },
      { name: 'Fresh Crystalline', percentage: 80 },
      { name: 'Fruity Lychee', percentage: 55 },
      { name: 'Cashmere Musky', percentage: 48 },
    ],
    sillage: 'Moderate',
    longevity: '9 - 11 Hours on Skin',
    season: 'Spring / Summer / Golden Hour',
    ritual: 'Spritz in an arch overhead or touch upon décolletage for a luminous, petal-soft diffusion.',
    image: '/src/assets/images/aura_celestial_rose_1792573921538.jpg',
    isBestseller: true,
  },
  {
    id: 'amber-velvet',
    name: 'Amber Velvet',
    subtitle: 'Golden fossil resin, toasted Bourbon vanilla, and spiced tonka bean',
    category: 'Spiced Oriental',
    concentration: 'Extrait de Parfum',
    oilPercentage: 28,
    prices: {
      '30ml': 135,
      '50ml': 195,
      '100ml': 295,
    },
    defaultSize: '100ml',
    description:
      'Warm golden sunlight bottled into an intoxicating elixir. Amber Velvet merges aged golden benzoin tears with Bourbon vanilla pods and bitter roasted almond, enveloped in velvety spiced rum and tobacco flower.',
    olfactoryStory:
      'Formulated around natural Baltic amber resin tincture and hand-scraped vanilla beans aged in oak barrels. The perfume unfolds with luxurious warmth, creating an addictive, cocooning trail that lingers intimately.',
    pyramid: {
      top: ['Bitter Almond Glaze', 'Aged Rum Accord', 'Ceylon Cinnamon'],
      heart: ['Siam Benzoin Tears', 'Heliotrope Flower', 'Toasted Tonka Bean'],
      base: ['Madagascar Bourbon Vanilla', 'Golden Amber Resin', 'Patchouli Coeur'],
      topDesc: 'Warm boozy and nutty spice overture',
      heartDesc: 'Gourmand, golden resinous heart active for 5 hours',
      baseDesc: 'Deep, comforting vanilla and balsam skin intimacy for 12+ hours',
    },
    accords: [
      { name: 'Amber Resinous', percentage: 90 },
      { name: 'Warm Vanilla', percentage: 85 },
      { name: 'Sweet Balsamic', percentage: 70 },
      { name: 'Toasted Tonka', percentage: 62 },
      { name: 'Warm Spicy', percentage: 54 },
    ],
    sillage: 'Enveloping',
    longevity: '12 - 14 Hours on Skin',
    season: 'Autumn / Winter / Intimate Evenings',
    ritual: 'Apply behind ears and collarbones where natural body warmth will slowly awaken the vanilla and benzoin notes throughout the day.',
    image: '/src/assets/images/aura_amber_velvet_1792573921837.jpg',
  },
  {
    id: 'essence-dor',
    name: 'L’Essence d’Or',
    subtitle: 'Sunlit neroli, golden orange blossom, and luminous ambrette seed',
    category: 'Solar & Floral',
    concentration: 'Eau de Parfum',
    oilPercentage: 20,
    prices: {
      '30ml': 130,
      '50ml': 190,
      '100ml': 280,
    },
    defaultSize: '100ml',
    description:
      'The signature olfactory emblem of Maison Aura. A regal balance of Mediterranean citrus blooms, sun-drenched orange blossom absolute, and warm creamy sandalwood touched with pure gold dust particles.',
    olfactoryStory:
      'Inspired by the golden light filtering through royal palace courtyards in Southern France. L’Essence d’Or harnesses cold-pressed neroli from Cap d’Antibes to evoke eternal summer and sovereign poise.',
    pyramid: {
      top: ['Cap d’Antibes Neroli', 'Sunlit Petitgrain', 'Yellow Mandarin'],
      heart: ['Tunisian Orange Blossom', 'Royal Jasmine Sambac', 'Golden Osmanthus'],
      base: ['Blonde Mysore Sandalwood', 'White Ambergris', 'Ambrette Musk'],
      topDesc: 'Luminous solar citrus and green leaf radiance',
      heartDesc: 'Pure white floral opulence and nectar sweetness',
      baseDesc: 'Creamy sandalwood and aristocratic soft sillage',
    },
    accords: [
      { name: 'White Floral', percentage: 88 },
      { name: 'Solar Citrus', percentage: 82 },
      { name: 'Creamy Sandalwood', percentage: 64 },
      { name: 'Green Petitgrain', percentage: 48 },
    ],
    sillage: 'Moderate',
    longevity: '8 - 10 Hours on Skin',
    season: 'All Seasons / Day to Evening Transition',
    ritual: 'Mist on wrists and neck. Perfect as a daily signature scent with effortless royalty.',
    image: '/src/assets/images/hero_aura_fragrance_1792573920112.jpg',
  },
  {
    id: 'aqua-nocturne',
    name: 'Aqua Nocturne',
    subtitle: 'Bioluminescent marine accord, cold sea salt, and maritime cypress',
    category: 'Aqua & Fresh',
    concentration: 'Eau de Parfum',
    oilPercentage: 21,
    prices: {
      '30ml': 120,
      '50ml': 175,
      '100ml': 260,
    },
    defaultSize: '100ml',
    description:
      'A radical reimagining of fresh aquatic fragrances. Aqua Nocturne takes you to a rocky coastline under starlight — cold Atlantic sea salt, wild crushed maritime pine, mineral driftwood, and salty ocean ambergris.',
    olfactoryStory:
      'Stepping away from generic aquatic sweetness, Aqua Nocturne captures the untamed majesty of coastal cliffs at midnight. Ozone-rich marine minerals clash with crisp sea fennel and ancient driftwood.',
    pyramid: {
      top: ['Cold Atlantic Sea Salt', 'Wild Lime Caviar', 'Crushed Marine Mint'],
      heart: ['Bioluminescent Blue Accord', 'Maritime Cypress', 'French Clary Sage'],
      base: ['Weathered Driftwood', 'Grey Ambergris', 'Wet Sea Moss'],
      topDesc: 'Icy mineral sea spray and bracing citrus sparks',
      heartDesc: 'Deep oceanic herbs and coastal evergreen woods',
      baseDesc: 'Salty driftwood and mineral ambergris anchored to stone',
    },
    accords: [
      { name: 'Marine Mineral', percentage: 92 },
      { name: 'Salty Ozone', percentage: 84 },
      { name: 'Aromatic Cypress', percentage: 68 },
      { name: 'Clean Driftwood', percentage: 56 },
    ],
    sillage: 'Moderate',
    longevity: '8 - 10 Hours on Skin',
    season: 'Spring / Summer / Coastal Escapes',
    ritual: 'Spritz after a warm shower onto damp skin for an invigorating, meditative connection to the sea.',
    image: '/src/assets/images/hero_aura_fragrance_1792573920112.jpg',
  },
];
