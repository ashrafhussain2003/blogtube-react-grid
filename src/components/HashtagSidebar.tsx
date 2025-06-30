
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, Hash } from 'lucide-react';
import { FolderNode } from '../types/folderTree';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from './ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface HashtagSidebarProps {
  tree: FolderNode[];
  activeSlug: string | null;
  onBlogSelect: (slug: string, path: string) => void;
  hashtag: string;
}

export const HashtagSidebar: React.FC<HashtagSidebarProps> = ({
  tree,
  activeSlug,
  onBlogSelect,
  hashtag,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodePath: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodePath)) {
      newExpanded.delete(nodePath);
    } else {
      newExpanded.add(nodePath);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node: FolderNode, depth: number = 0, path: string = '') => {
    const nodePath = `${path}/${node.name}`;
    const isExpanded = expandedNodes.has(nodePath) || node.isOpen;
    const isActive = node.type === 'blog' && node.slug === activeSlug;

    if (node.type === 'folder') {
      return (
        <SidebarMenuItem key={nodePath}>
          <Collapsible open={isExpanded} onOpenChange={() => toggleNode(nodePath)}>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="w-full justify-start">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 mr-1" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-1" />
                )}
                {isExpanded ? (
                  <FolderOpen className="w-4 h-4 mr-2 text-blue-500" />
                ) : (
                  <Folder className="w-4 h-4 mr-2 text-gray-500" />
                )}
                <span className="truncate">{node.name}</span>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            {node.children && (
              <CollapsibleContent>
                <SidebarMenuSub>
                  {node.children.map(child => (
                    <SidebarMenuSubItem key={`${nodePath}/${child.name}`}>
                      {renderSubNode(child, depth + 1, nodePath)}
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            )}
          </Collapsible>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={nodePath}>
        <SidebarMenuButton 
          isActive={isActive}
          onClick={() => {
            if (node.slug && node.path) {
              onBlogSelect(node.slug, node.path);
            }
          }}
        >
          <FileText className="w-4 h-4 mr-2" />
          <span className="truncate">{node.name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const renderSubNode = (node: FolderNode, depth: number, path: string) => {
    const nodePath = `${path}/${node.name}`;
    const isActive = node.type === 'blog' && node.slug === activeSlug;

    if (node.type === 'blog') {
      return (
        <SidebarMenuSubButton
          isActive={isActive}
          onClick={() => {
            if (node.slug && node.path) {
              onBlogSelect(node.slug, node.path);
            }
          }}
        >
          <FileText className="w-4 h-4 mr-2" />
          <span className="truncate">{node.name}</span>
        </SidebarMenuSubButton>
      );
    }

    return null;
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 p-2">
          <Hash className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-lg">Topics</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-gray-500">
            {hashtag} Content
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tree.map(node => renderNode(node))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
