
export interface Book {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  rating: number;
  purchaseUrl?: string;
}