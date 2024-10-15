import { Deal } from "./deal";

export interface FetchMode {
  name: string;
  code: string;
  index: number;
}

export const fetchModes: FetchMode[] = [
  {
    name: "Suggested",
    code: "",
    index: 0,
  },
  {
    name: "Distance: Nearest First",
    code: "distance_ascend",
    index: 1,
  },
  {
    name: "Date Listed: Newest First",
    code: "creation_time_descend",
    index: 2,
  },
]
