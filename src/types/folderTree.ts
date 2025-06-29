
export interface BlogItem {
  title: string;
  slug: string;
  path: string; // path to the JSON file
}

export interface FolderNode {
  name: string;
  type: 'folder' | 'blog';
  slug?: string;
  path?: string;
  children?: FolderNode[];
  isOpen?: boolean;
}

export interface HashtagFolderTree {
  [hashtag: string]: FolderNode[];
}
