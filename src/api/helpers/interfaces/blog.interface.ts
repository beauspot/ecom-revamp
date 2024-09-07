export interface blogInterface {
  title: string;
  description: string;
  category: string;
  numViews: number;
  isLiked: boolean;
  isDisLiked: boolean;
  likes: string[];
  dislikes: string[];
  image: string[] | string;
  author: string;
}
