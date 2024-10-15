export interface Category {
  name: string
  keyword: string
  all?: boolean
  custom?: boolean
}

/*
Phone
laptop
apple
samsung
lego
monitor
gaming
ipad
herman miller
GPU
graphics card
iphone
 */

export const categories: Category[] = [
  { name: 'All', keyword: '', all: true },
  { name: 'Custom', keyword: '', custom: true },
  { name: 'Phones', keyword: 'phone' },
  { name: 'Laptops', keyword: 'laptop' },
  { name: 'Apple', keyword: 'apple' },
  { name: 'Samsung', keyword: 'samsung' },
  { name: 'Lego', keyword: 'lego' },
  { name: 'Monitors', keyword: 'monitor' },
  { name: 'Ipads', keyword: 'ipad' },
  { name: 'Herman Miller', keyword: 'herman miller' },
  { name: 'iPhones', keyword: 'iphone' },
]
