export interface Region {
  name: string,
  url: string,
  areaID: string
}

export const regions: Region[] = [
  { name: 'Kitchener', url: 'kitchener-area', areaID: '104045032964460' },
  { name: 'Waterloo', url: 'kitchener-waterloo', areaID: '112763262068685' },
  { name: 'Cambridge', url: 'cambridge', areaID: '108451139178673' },
  { name: 'Guelph', url: 'guelph', areaID: '106514426051396' },
  { name: 'Stratford', url: 'stratford', areaID: '105467729488090' },
  { name: 'Toronto', url: 'ontario', areaID: 'toronto' }
]
