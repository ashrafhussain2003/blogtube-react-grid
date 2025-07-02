
export interface BlogMeta {
  title: string;
  author: string;
  publishedDate: string;
  readingTime: number;
  viewCount?: number;
  hashtags: string[];
  slug: string;
  description: string;
  featured?: boolean;
}

export interface BlogBlock {
  type: 'title' | 'heading' | 'text' | 'image' | 'note' | 'alert' | 'meta' | 'code' | 'list' | 'quote';
  content: string;
  level?: number; // for heading blocks (h1, h2, etc.)
  alt?: string; // for image blocks
  items?: string[]; // for list blocks
  ordered?: boolean; // for list blocks
}

export interface BlogPost {
  meta: BlogMeta;
  blocks: BlogBlock[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
}
