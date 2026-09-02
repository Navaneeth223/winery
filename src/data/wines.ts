/**
 * ORÉE — the collection.
 * Every wine belongs to the same estate, the same bottle, the same
 * visual world. `tone` drives the bottle glass, foil, label and the
 * product stage — so commerce and cinema share one palette.
 */

export interface WineTone {
  bg: string
  glass: string
  glassDeep: string
  foil: string
  label: string
  ink: string
}

export interface Wine {
  id: string
  num: string
  name: string
  vintage: number
  varietal: string
  region: string
  price: number
  tag: 'Red' | 'White' | 'Rosé' | 'Reserve'
  profile: string
  notes: string[]
  story: string
  method: string
  pairing: string
  serving: string
  abv: string
  size: string
  tone: WineTone
}

export const wines: Wine[] = [
  {
    id: 'clos-aube',
    num: '01',
    name: "Clos de l'Aube",
    vintage: 2021,
    varietal: 'Pinot Noir',
    region: 'Anderson Valley',
    price: 78,
    tag: 'Red',
    profile: 'Cool fog, warm hands. Cherry skin, forest floor, a quiet finish.',
    notes: ['Morello cherry', 'Wild rosemary', 'Wet slate'],
    story:
      "The first block planted on the estate in 1962, and still the first to be picked every year. It faces north, catches the morning fog, and never hurries.",
    method: 'Hand-picked at dawn · wild yeast · 21 days on skins · 16 months in old French oak.',
    pairing: 'Duck breast, mushrooms, anything roasted slowly.',
    serving: '14–16 °C · open thirty minutes before',
    abv: '13.5%',
    size: '750 ml',
    tone: {
      bg: '#241014',
      glass: '#4a1622',
      glassDeep: '#2a0d15',
      foil: '#2c2c34',
      label: '#efe6d4',
      ink: '#2a1a10',
    },
  },
  {
    id: 'lumiere',
    num: '02',
    name: 'Lumière',
    vintage: 2022,
    varietal: 'Chardonnay',
    region: 'Anderson Valley',
    price: 64,
    tag: 'White',
    profile: 'Morning light through leaves. White peach, hazelnut, sea air.',
    notes: ['White peach', 'Toasted hazelnut', 'Sea spray'],
    story:
      'Grown on the east slope, where the fog burns off first. Whole-bunch pressed within the hour, before the fruit loses its cool.',
    method: 'Whole-bunch press · native fermentation · 10 months on fine lees, no butter, no tricks.',
    pairing: 'Dungeness crab, roast chicken, young cheeses.',
    serving: '10–12 °C · cold, not frigid',
    abv: '12.8%',
    size: '750 ml',
    tone: {
      bg: '#20241c',
      glass: '#8a7434',
      glassDeep: '#4d4018',
      foil: '#cfc4a4',
      label: '#f3ecdc',
      ink: '#3a3212',
    },
  },
  {
    id: 'terre-rouille',
    num: '03',
    name: 'Terre Rouille',
    vintage: 2020,
    varietal: 'Syrah',
    region: 'Anderson Valley',
    price: 92,
    tag: 'Red',
    profile: 'The iron-red hillside in a glass. Black olive, cracked pepper, smoke.',
    notes: ['Black olive', 'Cracked pepper', 'Woodsmoke'],
    story:
      'The soil here is rust-coloured and mean, and the vines love it. In warm years this is the darkest wine we make.',
    method: 'Destemmed, never crushed · 28 days maceration · 22 months in a mix of new and seasoned oak.',
    pairing: 'Lamb, saucisson, charred peppers.',
    serving: '16–18 °C · decant if patient',
    abv: '14.2%',
    size: '750 ml',
    tone: {
      bg: '#26120c',
      glass: '#521c14',
      glassDeep: '#310e0a',
      foil: '#1f1f26',
      label: '#ead9c0',
      ink: '#2b1a0e',
    },
  },
  {
    id: 'nuit-oree',
    num: '04',
    name: "Nuit d'Orée",
    vintage: 2019,
    varietal: 'Estate Red Blend',
    region: 'Anderson Valley',
    price: 145,
    tag: 'Reserve',
    profile: 'Our reserve, and our argument. Black fruit, cedar, ink, endurance.',
    notes: ['Blackcurrant', 'Cedar', 'Graphite'],
    story:
      'Made only in the years that earn it — five vintages in the last fifteen. The blend is decided by taste alone, in the cellar, at night.',
    method: 'Field blend of the oldest blocks · 30 days on skins · 26 months in French oak, unfined, unfiltered.',
    pairing: 'A quiet table, slow food, long conversations.',
    serving: '17 °C · decant one hour',
    abv: '14.0%',
    size: '750 ml',
    tone: {
      bg: '#1c1420',
      glass: '#42213a',
      glassDeep: '#241020',
      foil: '#b08d3f',
      label: '#f0e8d8',
      ink: '#241a10',
    },
  },
  {
    id: 'rose-aube',
    num: '05',
    name: "Rosé de l'Aube",
    vintage: 2023,
    varietal: 'Pinot Noir Rosé',
    region: 'Anderson Valley',
    price: 48,
    tag: 'Rosé',
    profile: 'Dawn, literally. Pale coral, wild strawberry, a salted finish.',
    notes: ['Wild strawberry', 'Blood orange', 'Sea salt'],
    story:
      'Bled off the Pinot at first light, when the cellar is coldest and the fruit is still asleep. Bottled young to keep the morning in it.',
    method: 'Saignée at dawn · fermented cool in steel · four months on lees · bottled unfined.',
    pairing: 'Oysters, tomatoes with good oil, long lunches.',
    serving: '8–10 °C · straight from the fridge',
    abv: '12.5%',
    size: '750 ml',
    tone: {
      bg: '#2b1a1c',
      glass: '#b26a68',
      glassDeep: '#7c4443',
      foil: '#e8dcc8',
      label: '#f6efe2',
      ink: '#4a2a26',
    },
  },
  {
    id: 'le-silence',
    num: '06',
    name: 'Le Silence',
    vintage: 2018,
    varietal: 'Late-Harvest Sémillon',
    region: 'Anderson Valley',
    price: 120,
    tag: 'White',
    profile: 'The vintage allowed it. Honey, chamomile, candied lemon, stillness.',
    notes: ['Wildflower honey', 'Chamomile', 'Candied lemon'],
    story:
      'Picked in November from grapes nobody else wanted, botrytis and all. Fermented for months because it refused to hurry.',
    method: 'Late harvest, two passes through the rows · barrel-fermented · 30 months in oak · 375 ml.',
    pairing: 'Blue cheese, foie gras, or a spoon and patience.',
    serving: '10 °C · small glasses',
    abv: '11.0%',
    size: '375 ml',
    tone: {
      bg: '#1f1a10',
      glass: '#8a6a20',
      glassDeep: '#4d3a10',
      foil: '#26262e',
      label: '#efe4c8',
      ink: '#3a2e10',
    },
  },
]

export const currency = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export const wineById = (id: string | null) => wines.find((w) => w.id === id) ?? null

