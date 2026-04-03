import type { Product, DemoAccount, CommentItem } from "./types";

export const seedProducts: Product[] = [
  { id: 1, name: "T-Shirt", price: 19.99, stock: 50 },
  { id: 2, name: "Headphones", price: 59.99, stock: 20 },
  { id: 3, name: "Sunglasses", price: 29.99, stock: 100 },
  { id: 4, name: "Bottle", price: 12.5, stock: 78 },
  { id: 5, name: "Backpack", price: 34.99, stock: 15 },
  { id: 6, name: "Desk Lamp", price: 24.5, stock: 32 },
  { id: 7, name: "Water Bottle", price: 14.9, stock: 60 },
  { id: 8, name: "Sneakers", price: 79.0, stock: 18 },
];

export const eCentricLogo = `data:image/svg+xml;utf8,
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <rect width="96" height="96" rx="24" fill="white"/>
  <g transform="translate(48,34)">
    <circle cx="0" cy="0" r="20" fill="none" stroke="%23F4C430" stroke-width="10" stroke-linecap="round" stroke-dasharray="96 40" transform="rotate(18)"/>
    <line x1="0" y1="0" x2="13" y2="0" stroke="%23F4C430" stroke-width="10" stroke-linecap="round"/>
  </g>
</svg>`;

export const demoAccounts: DemoAccount[] = [
  {
    id: 1,
    role: "Admin",
    email: "admin@ecentric.demo",
    password: "123456",
    name: "Bia Admin",
    shopName: "eCentric Demo Store",
  },
  {
    id: 2,
    role: "Operator",
    email: "operator@ecentric.demo",
    password: "123456",
    name: "Livestream Operator",
    shopName: "eCentric Demo Store",
  },
];

export const initialComments: CommentItem[] = [
  { id: 1, user: "demo_user_01", text: "Shop ơi còn size M không?", time: "10:12" },
  { id: 2, user: "demo_user_02", text: "Cho xin link sản phẩm này với", time: "10:13" },
];