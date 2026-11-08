// Shape: { [regionGroup]: { [milestoneName]: { plan, actual } } }
export const sampleDataByRegionGroup = {
  Alborz: {
    'Site Survey':   { plan: 120, actual: 118 },
    'Civil Work':    { plan: 80,  actual: 52 },
    'Installation':  { plan: 60,  actual: 20 },
    'Commissioning': { plan: 40,  actual: 0 }
  },
  Tehran: {
    'Site Survey':   { plan: 300, actual: 300 },
    'Civil Work':    { plan: 250, actual: 190 },
    'Installation':  { plan: 200, actual: 95 },
    'Commissioning': { plan: 150, actual: 30 }
  },
  Country: {
    'Site Survey':   { plan: 1500, actual: 1320 },
    'Civil Work':    { plan: 1200, actual: 760 },
    'Installation':  { plan: 900,  actual: 410 },
    'Commissioning': { plan: 0,    actual: 5 }   // plan = 0 to test the edge case
  }
}
