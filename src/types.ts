export type SessionState = "draft" | "created" | "scheduled" | "live" | "ended";
export type ActiveTab = "overview" | "products" | "comments";

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

export type DemoAccount = {
  id: number;
  role: string;
  email: string;
  password: string;
  name: string;
  shopName: string;
};

export type CommentItem = {
  id: number;
  user: string;
  text: string;
  time: string;
};

export type LogItem = {
  id: number;
  action: string;
  detail: string;
  time: string;
};

export type ShopInfo = {
  name: string;
  id: string;
  region: string;
  mode: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type ToastState = {
  message: string;
  type: "success" | "error" | "info";
};