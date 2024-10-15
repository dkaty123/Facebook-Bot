import { Deal } from "./deal";

export interface SaveMode {
  name: string
  modify: (oldDeals: Deal[], newDeals: Deal[]) => Deal[]
}

export const saveModes: SaveMode[] = [
  {
    name: "Last 800 deals",
    modify: (oldDeals, newDeals) => {
      const allDeals = [...newDeals];
      for (let i = 0; i < oldDeals.length; i++) {
        const d = oldDeals[i]
        if (newDeals.filter(n => n.link === d.link).length === 0) {
          // New deals doesn't contain old deal
          allDeals.push(d)
        }
      }
      return allDeals.slice(-800)
    }
  },
  // {
  //   name: "Last 3 hours",
  //   modify: (oldDeals, newDeals) => {
  //     const allDeals = [...newDeals];
  //     for (let i = 0; i < oldDeals.length; i++) {
  //       const d = oldDeals[i]
  //       if (newDeals.filter(n => n.link === d.link).length === 0) {
  //         // New deals doesn't contain old deal
  //         allDeals.push(d)
  //       }
  //     }
  //     return allDeals
  //       .filter(deal => deal.date ? Date.now() - deal.date?.getTime() || 0 <= 4 * 60 * 60 * 1000 : true)
  //   }
  // },
  {
    name: "All",
    modify: (oldDeals, newDeals) => {
      const allDeals = [...newDeals];
      for (let i = 0; i < oldDeals.length; i++) {
        const d = oldDeals[i]
        if (!newDeals.filter(n => n.link === d.link)) {
          // New deals doesn't contain old deal
          allDeals.push(d)
        }
      }
      return allDeals
    }
  }
]
