import type { CommentItem } from "../types";

const mockPool = [
  "Còn voucher không shop?",
  "Cho xin mã giảm giá với ạ",
  "Mẫu này có màu đen không?",
  "Có freeship không ạ?",
];

export const createManualComment = async (
  user: string,
  text: string
): Promise<CommentItem> => {
  return {
    id: Date.now(),
    user,
    text,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
};

export const getMockIncomingComment = async (): Promise<CommentItem> => {
  const text = mockPool[Math.floor(Math.random() * mockPool.length)];

  return {
    id: Date.now() + Math.random(),
    user: `viewer_${Math.floor(Math.random() * 100)}`,
    text,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
};