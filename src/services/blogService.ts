
import { FolderNode } from '../types/folderTree';
import { parseMarkdown, markdownToBlocks } from '../utils/markdownParser';
import { BlogPost } from '../types/blog';

export class BlogService {
  private static instance: BlogService;
  private folderTreeCache: { [hashtag: string]: FolderNode[] } = {};
  private blogCache: { [path: string]: BlogPost } = {};

  static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  async getFolderTree(hashtag: string): Promise<FolderNode[]> {
    if (this.folderTreeCache[hashtag]) {
      return this.folderTreeCache[hashtag];
    }

    try {
      // In a real implementation, this would scan the /Blogs directory
      // For now, we'll simulate the structure based on the hashtag
      const tree = await this.buildFolderTree(hashtag);
      this.folderTreeCache[hashtag] = tree;
      return tree;
    } catch (error) {
      console.error('Error building folder tree:', error);
      return [];
    }
  }

  private async buildFolderTree(hashtag: string): Promise<FolderNode[]> {
    // This simulates reading the /Blogs directory structure
    // In a real implementation, you'd use a file system API or have the structure pre-built
    
    const structures: { [key: string]: any } = {
      aws: {
        'Amazon Web Services': {
          'Introduction to Cloud Computing': '/Blogs/aws/amazon-web-services/introduction-to-cloud-computing.md',
          'Types of Clouds': '/Blogs/aws/amazon-web-services/types-of-clouds.md',
          'Principles of Cloud': '/Blogs/aws/amazon-web-services/principles-of-cloud.md'
        },
        'Compute Services': {
          'Introduction to Compute Services': '/Blogs/aws/compute-services/introduction-to-compute-services.md',
          'Intro to EC2': '/Blogs/aws/compute-services/intro-to-ec2.md',
          'Practical Guide to EC2': '/Blogs/aws/compute-services/practical-guide-to-ec2.md'
        }
      },
      react: {
        'React Fundamentals': {
          'What is React?': '/Blogs/react/react-fundamentals/what-is-react.md',
          'Components and JSX': '/Blogs/react/react-fundamentals/components-and-jsx.md',
          'Props and State': '/Blogs/react/react-fundamentals/props-and-state.md'
        },
        'Advanced React': {
          'React Hooks': '/Blogs/react/advanced-react/react-hooks.md',
          'Context API': '/Blogs/react/advanced-react/context-api.md',
          'Performance Optimization': '/Blogs/react/advanced-react/performance-optimization.md'
        }
      }
    };

    const structure = structures[hashtag.toLowerCase()] || {};
    return this.convertToFolderNodes(structure);
  }

  private convertToFolderNodes(structure: any): FolderNode[] {
    const nodes: FolderNode[] = [];

    for (const [folderName, contents] of Object.entries(structure)) {
      const folderNode: FolderNode = {
        name: folderName,
        type: 'folder',
        isOpen: true,
        children: []
      };

      if (typeof contents === 'object') {
        for (const [fileName, filePath] of Object.entries(contents as any)) {
          const blogNode: FolderNode = {
            name: fileName,
            type: 'blog',
            slug: this.pathToSlug(filePath as string),
            path: filePath as string
          };
          folderNode.children!.push(blogNode);
        }
      }

      nodes.push(folderNode);
    }

    return nodes;
  }

  private pathToSlug(path: string): string {
    return path.split('/').pop()?.replace('.md', '') || '';
  }

  async loadBlog(blogPath: string): Promise<BlogPost | null> {
    if (this.blogCache[blogPath]) {
      return this.blogCache[blogPath];
    }

    try {
      // In a real implementation, this would fetch the actual markdown file
      // For now, we'll simulate loading markdown content
      const markdownContent = await this.fetchMarkdownContent(blogPath);
      const { meta, content } = parseMarkdown(markdownContent);
      const blocks = markdownToBlocks(content);

      const blog: BlogPost = {
        meta: {
          title: meta.title,
          author: meta.author || 'Anonymous',
          publishedDate: meta.publishedDate || new Date().toISOString().split('T')[0],
          readingTime: meta.readingTime || 5,
          hashtags: meta.hashtags || [],
          slug: this.pathToSlug(blogPath),
          description: meta.description || '',
          viewCount: Math.floor(Math.random() * 10000) + 1000
        },
        blocks
      };

      this.blogCache[blogPath] = blog;
      return blog;
    } catch (error) {
      console.error('Error loading blog:', error);
      return null;
    }
  }

  private async fetchMarkdownContent(path: string): Promise<string> {
    // This simulates fetching markdown content
    // In a real implementation, you'd fetch the actual file
    return `---
title: ${path.split('/').pop()?.replace('.md', '').replace(/-/g, ' ') || 'Sample Blog'}
author: Tech Writer
publishedDate: 2024-01-15
readingTime: 8
hashtags: [${path.includes('aws') ? 'aws, cloud' : 'react, javascript'}]
description: This is a comprehensive guide covering the essential concepts and practical applications.
---

# Introduction

This is an introduction paragraph that sets the context for the entire article. It provides readers with a clear understanding of what they can expect to learn.

## Key Concepts

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

> **Note:** This is an important note that readers should pay attention to. It contains crucial information that enhances understanding.

## Practical Examples

Here we dive deeper into the main concepts. This paragraph provides detailed explanations and examples that help readers understand the topic better.

![Illustration of key concepts](/api/placeholder/800/400)

## Advanced Topics

Following the visual representation above, we can see how these concepts apply in real-world scenarios. The implementation details are crucial for practical application.

> **Alert:** Warning: Make sure to follow best practices when implementing these concepts to avoid common pitfalls.

## Conclusion

The final section provides practical examples and actionable takeaways that you can use in your own projects. Remember to adapt these concepts to your specific use case and requirements.`;
  }
}

export const blogService = BlogService.getInstance();
