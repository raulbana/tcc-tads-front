export interface ContentCategory {
  id: string;
  name: string;
  auditable: boolean;
}

export interface Comment {
  id: string;
  contentId: string;
  text: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount?: number;
  isLikedByCurrentUser?: boolean;
  repliesCount?: number;
  replies?: Comment[];
}

export interface Content {
  id: string;
  title: string;
  description: string;
  subtitle?: string;
  subcontent?: string;
  createdAt: Date;
  updatedAt: Date;
  coverUrl: string;
  images?: string[];
  video?: string;
  category: ContentCategory;
  isReposted?: boolean;
  isLiked?: boolean;
  likesCount?: number;
  repostsCount?: number;
  authorId: string;
  repostedFromContentId?: string;
  repostedByUserId?: string;
  commentsCount: number;
  comments: Comment[];
}
