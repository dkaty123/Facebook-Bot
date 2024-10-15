import { Category } from "./categories";

export interface Deal {
  price: number;
  link: string;
  imageLink: string;
  title: string;
  description: string;
  location: string;
  date?: Date,
  datePosted: string;
  category: Category;
  isNew: boolean;
}
