import { Deal } from "./deal";

export interface SortMode {
  name: string;
  sort: (deals: Deal[]) => Deal[]
}

export const sortModes: SortMode[] = [
  {
    name: "Original Order",
    sort(deals: Deal[]) {
      return deals
    }
  },
  {
    name: "New On Top",
    sort(deals: Deal[]) {
     return deals.filter((d) => d.isNew).concat(deals.filter((d) => !d.isNew))
    }
  },
  {
    name: "Reverse",
    sort(deals: Deal[]) {
      deals.reverse()
      return deals
    }
  },
  {
    name: "Price",
    sort(deals: Deal[]) {
      deals.sort((a, b) => a.price - b.price)
      return deals
    }
  },
  {
    name: "Price (Desc.)",
    sort(deals: Deal[]) {
      deals.sort((a, b) => b.price - a.price)
      return deals
    }
  },
]
