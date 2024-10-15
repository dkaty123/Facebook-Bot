import { Deal } from "./deal";

const allowList: string[] = [
  "Waterloo",
  "Kitchener",
  "Cambridge",
  "Guelph",
  "Stratford",
  "North Dumfries",
  "Woolwich",
  "Elmira",
  "Baden",
  "New Hamburg",
  "Petersburg",
  "Breslau",
  "St. Clements",
  "St. Jacobs",
  "Ayr",
  "Puslinch",
]

export function filterRegions(deals: Deal[]): Deal[] {
  return deals.filter((deal) => {
    for (const allowedLocation of allowList) {
      if (deal.location.toLowerCase().includes(allowedLocation.toLowerCase())) {
        return true
      }
    }
    return false
  })
}
