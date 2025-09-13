'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MindMapViewProps {
  mindMapData: string;
}

interface MindMapNode {
  content: string;
  children: MindMapNode[];
  level: number;
}

function parseMindMap(text: string): MindMapNode[] {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const rootNodes: MindMapNode[] = [];
  const nodeStack: MindMapNode[] = [];

  lines.forEach(line => {
    const level = (line.match(/^\s*/)?.[0].length || 0) / 2; // Assuming 2 spaces for indentation
    const content = line.trim().replace(/^-|^\*/, '').trim();

    const newNode: MindMapNode = { content, children: [], level };

    while (nodeStack.length > 0 && nodeStack[nodeStack.length - 1].level >= level) {
      nodeStack.pop();
    }

    if (nodeStack.length > 0) {
      nodeStack[nodeStack.length - 1].children.push(newNode);
    } else {
      rootNodes.push(newNode);
    }

    nodeStack.push(newNode);
  });

  return rootNodes;
}

const NodeComponent: React.FC<{ node: MindMapNode }> = ({ node }) => {
  return (
    <li className="ml-4">
      <div className="flex items-center">
        <span className="w-2 h-2 bg-primary rounded-full mr-3 shrink-0"></span>
        <span className="font-medium">{node.content}</span>
      </div>
      {node.children.length > 0 && (
        <ul className="pl-5 mt-2 border-l border-dashed border-primary/50">
          {node.children.map((child, index) => (
            <NodeComponent key={index} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function MindMapView({ mindMapData }: MindMapViewProps) {
  const mindMapTree = parseMindMap(mindMapData);

  if (!mindMapData || mindMapTree.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No mind map was generated for this content.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mind Map</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {mindMapTree.map((node, index) => (
            <NodeComponent key={index} node={node} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
