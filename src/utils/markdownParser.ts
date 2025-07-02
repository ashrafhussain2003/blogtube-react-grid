
export interface MarkdownMeta {
  title: string;
  author?: string;
  publishedDate?: string;
  readingTime?: number;
  hashtags?: string[];
  description?: string;
}

export interface ParsedMarkdown {
  meta: MarkdownMeta;
  content: string;
}

export const parseMarkdown = (content: string): ParsedMarkdown => {
  // Split frontmatter and content
  const parts = content.split('---');
  if (parts.length < 3) {
    return {
      meta: { title: 'Untitled' },
      content: content
    };
  }

  // Parse frontmatter
  const frontmatter = parts[1];
  const markdownContent = parts.slice(2).join('---').trim();
  
  const meta: MarkdownMeta = { title: 'Untitled' };
  
  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      switch (key.trim()) {
        case 'title':
          meta.title = value.replace(/['"]/g, '');
          break;
        case 'author':
          meta.author = value.replace(/['"]/g, '');
          break;
        case 'publishedDate':
          meta.publishedDate = value.replace(/['"]/g, '');
          break;
        case 'readingTime':
          meta.readingTime = parseInt(value);
          break;
        case 'hashtags':
          meta.hashtags = value.replace(/[\[\]'"]/g, '').split(',').map(tag => tag.trim());
          break;
        case 'description':
          meta.description = value.replace(/['"]/g, '');
          break;
      }
    }
  });

  return { meta, content: markdownContent };
};

export const markdownToBlocks = (markdown: string) => {
  const lines = markdown.split('\n');
  const blocks = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('# ')) {
      blocks.push({
        type: 'title',
        content: line.substring(2),
        level: 1
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        type: 'title',
        content: line.substring(3),
        level: 2
      });
    } else if (line.startsWith('![')) {
      const altMatch = line.match(/!\[(.*?)\]/);
      const urlMatch = line.match(/\((.*?)\)/);
      blocks.push({
        type: 'image',
        content: urlMatch ? urlMatch[1] : '/api/placeholder/800/400',
        alt: altMatch ? altMatch[1] : 'Image'
      });
    } else if (line.startsWith('> **Note:**')) {
      blocks.push({
        type: 'note',
        content: line.substring(11).trim()
      });
    } else if (line.startsWith('> **Alert:**')) {
      blocks.push({
        type: 'alert',
        content: line.substring(12).trim()
      });
    } else if (line && !line.startsWith('#')) {
      blocks.push({
        type: 'text',
        content: line
      });
    }
  }
  
  return blocks;
};
