
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
  let currentCodeBlock = '';
  let inCodeBlock = false;
  let currentListItems: string[] = [];
  let currentListType: 'ordered' | 'unordered' | null = null;
  
  const flushList = () => {
    if (currentListItems.length > 0) {
      blocks.push({
        type: 'list',
        items: [...currentListItems],
        ordered: currentListType === 'ordered'
      });
      currentListItems = [];
      currentListType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Handle code blocks
    if (trimmedLine.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        blocks.push({
          type: 'code',
          content: currentCodeBlock.trim()
        });
        currentCodeBlock = '';
        inCodeBlock = false;
      } else {
        // Start code block
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      currentCodeBlock += line + '\n';
      continue;
    }

    // Handle headings
    if (trimmedLine.startsWith('#')) {
      flushList();
      const level = trimmedLine.match(/^#+/)?.[0].length || 1;
      const content = trimmedLine.substring(level).trim();
      
      blocks.push({
        type: 'heading',
        content,
        level
      });
      continue;
    }

    // Handle images
    if (trimmedLine.startsWith('![')) {
      flushList();
      const altMatch = trimmedLine.match(/!\[(.*?)\]/);
      const urlMatch = trimmedLine.match(/\((.*?)\)/);
      blocks.push({
        type: 'image',
        content: urlMatch ? urlMatch[1] : '/api/placeholder/800/400',
        alt: altMatch ? altMatch[1] : 'Image'
      });
      continue;
    }

    // Handle notes and alerts
    if (trimmedLine.startsWith('> **Note:**')) {
      flushList();
      blocks.push({
        type: 'note',
        content: trimmedLine.substring(11).trim()
      });
      continue;
    }

    if (trimmedLine.startsWith('> **Alert:**')) {
      flushList();
      blocks.push({
        type: 'alert',
        content: trimmedLine.substring(12).trim()
      });
      continue;
    }

    // Handle blockquotes
    if (trimmedLine.startsWith('>') && !trimmedLine.includes('**')) {
      flushList();
      blocks.push({
        type: 'quote',
        content: trimmedLine.substring(1).trim()
      });
      continue;
    }

    // Handle ordered lists
    if (/^\d+\.\s/.test(trimmedLine)) {
      if (currentListType !== 'ordered') {
        flushList();
        currentListType = 'ordered';
      }
      currentListItems.push(trimmedLine.replace(/^\d+\.\s/, ''));
      continue;
    }

    // Handle unordered lists
    if (/^[-*+]\s/.test(trimmedLine)) {
      if (currentListType !== 'unordered') {
        flushList();
        currentListType = 'unordered';
      }
      currentListItems.push(trimmedLine.replace(/^[-*+]\s/, ''));
      continue;
    }

    // Handle regular text
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      flushList();
      blocks.push({
        type: 'text',
        content: trimmedLine
      });
    } else if (!trimmedLine) {
      flushList();
    }
  }

  // Flush any remaining list
  flushList();
  
  return blocks;
};
