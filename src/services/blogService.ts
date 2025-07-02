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
      const tree = await this.buildFolderTree(hashtag);
      this.folderTreeCache[hashtag] = tree;
      return tree;
    } catch (error) {
      console.error('Error building folder tree:', error);
      return [];
    }
  }

  private async buildFolderTree(hashtag: string): Promise<FolderNode[]> {
    // Define the actual folder structure based on hashtag
    const structures: { [key: string]: any } = {
      react: {
        'React Fundamentals': {
          'Getting Started with React': `/Blogs/React/Getting Started with React.md`,
          'Components and Props': `/Blogs/React/Components and Props.md`,
          'State and Lifecycle': `/Blogs/React/State and Lifecycle.md`
        },
        'Advanced React': {
          'React Hooks Deep Dive': `/Blogs/React/React Hooks Deep Dive.md`,
          'Context API Guide': `/Blogs/React/Context API Guide.md`,
          'Performance Optimization': `/Blogs/React/Performance Optimization.md`
        }
      },
      javascript: {
        'JavaScript Basics': {
          'Introduction to JS': `/Blogs/JavaScript/Introduction to JS.md`,
          'Variables and Data Types': `/Blogs/JavaScript/Variables and Data Types.md`,
          'Functions and Scope': `/Blogs/JavaScript/Functions and Scope.md`
        },
        'Advanced JavaScript': {
          'Async Programming': `/Blogs/JavaScript/Async Programming.md`,
          'ES6+ Features': `/Blogs/JavaScript/ES6+ Features.md`,
          'Module Systems': `/Blogs/JavaScript/Module Systems.md`
        }
      },
      aws: {
        'Amazon Web Services': {
          'Introduction to Cloud Computing': `/Blogs/AWS/Introduction to Cloud Computing.md`,
          'Types of Clouds': `/Blogs/AWS/Types of Clouds.md`,
          'Principles of Cloud': `/Blogs/AWS/Principles of Cloud.md`
        },
        'Compute Services': {
          'Introduction to EC2': `/Blogs/AWS/Introduction to EC2.md`,
          'EC2 Instance Types': `/Blogs/AWS/EC2 Instance Types.md`,
          'Practical Guide to EC2': `/Blogs/AWS/Practical Guide to EC2.md`
        }
      },
      python: {
        'Python Fundamentals': {
          'Getting Started with Python': `/Blogs/Python/Getting Started with Python.md`,
          'Data Types and Variables': `/Blogs/Python/Data Types and Variables.md`,
          'Control Structures': `/Blogs/Python/Control Structures.md`
        },
        'Advanced Python': {
          'Object-Oriented Programming': `/Blogs/Python/Object-Oriented Programming.md`,
          'Web Development with Flask': `/Blogs/Python/Web Development with Flask.md`,
          'Data Science Libraries': `/Blogs/Python/Data Science Libraries.md`
        }
      },
      nodejs: {
        'Node.js Basics': {
          'Introduction to Node.js': `/Blogs/NodeJS/Introduction to Node.js.md`,
          'NPM and Package Management': `/Blogs/NodeJS/NPM and Package Management.md`,
          'File System Operations': `/Blogs/NodeJS/File System Operations.md`
        },
        'Express.js Framework': {
          'Getting Started with Express': `/Blogs/NodeJS/Getting Started with Express.md`,
          'Middleware and Routing': `/Blogs/NodeJS/Middleware and Routing.md`,
          'Building REST APIs': `/Blogs/NodeJS/Building REST APIs.md`
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
    return path.split('/').pop()?.replace('.md', '').toLowerCase().replace(/\s+/g, '-') || '';
  }

  async loadBlog(blogPath: string): Promise<BlogPost | null> {
    if (this.blogCache[blogPath]) {
      return this.blogCache[blogPath];
    }

    try {
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
    try {
      // Try to fetch the actual markdown file from the public directory
      const response = await fetch(path);
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      console.error('Error fetching markdown file:', error);
    }

    // Fallback to simulated content if file doesn't exist
    return this.generateFallbackContent(path);
  }

  private generateFallbackContent(path: string): string {
    const title = path.split('/').pop()?.replace('.md', '') || 'Sample Blog';
    const topic = path.split('/')[2] || 'General';
    
    return `---
title: ${title}
author: Tech Writer
publishedDate: 2024-01-15
readingTime: ${Math.floor(Math.random() * 10) + 5}
hashtags: [${topic.toLowerCase()}]
description: This is a comprehensive guide covering ${title.toLowerCase()} concepts and practical applications.
---

# ${title}

This is an introduction paragraph that sets the context for the entire article about ${title}. It provides readers with a clear understanding of what they can expect to learn.

## Key Concepts

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

> **Note:** This is an important note that readers should pay attention to. It contains crucial information that enhances understanding of ${title}.

## Practical Examples

Here we dive deeper into the main concepts of ${title}. This paragraph provides detailed explanations and examples that help readers understand the topic better.

![Illustration of ${title}](/api/placeholder/800/400)

## Advanced Topics

Following the visual representation above, we can see how these ${title} concepts apply in real-world scenarios. The implementation details are crucial for practical application.

> **Alert:** Warning: Make sure to follow best practices when implementing these ${title} concepts to avoid common pitfalls.

## Conclusion

The final section provides practical examples and actionable takeaways about ${title} that you can use in your own projects. Remember to adapt these concepts to your specific use case and requirements.`;
  }
}

export const blogService = BlogService.getInstance();
