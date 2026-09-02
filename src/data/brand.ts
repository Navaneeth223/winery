/** ORÉE — brand data. Replace everything here to rebrand the site. */

export const brand = {
  name: 'ORÉE',
  tagline: 'From the fruit of the earth to the wine in your glass.',
  established: 1962,
  region: 'Anderson Valley, California',
  address: '6000 Vineyard Road, Anderson Valley, CA 95523',
  email: 'cellar@oree.wine',
  phone: '+1 (707) 555-0198',
  winemaker: 'Elena Marchetti',
  hours: [
    'Tasting room — 10.00 to 17.00, daily',
    'Estate walks — by appointment',
    'Harvest Table — weekends, seasonally',
  ],
  /** Honest by design: this is a demonstration brand. */
  disclaimer: 'ORÉE is a fictional estate created for this cinematic experience.',
} as const

export const chapters = [
  '01 · The Land',
  '02 · The Fruit',
  '03 · The Harvest',
  '04 · The Press',
  '05 · The Cellar',
  '06 · The Craft',
  '07 · The Bottle',
  '08 · The Pour',
  '09 · The Collection',
  '10 · The Table',
  '11 · The Estate',
  '12 · The Final Moment',
] as const

export const navLinks = [
  { label: 'Story', target: '#land' },
  { label: 'Winemaking', target: '#craft' },
  { label: 'Wines', target: '#collection' },
  { label: 'Estate', target: '#estate' },
  { label: 'Visit', target: '#visit' },
] as const
