import { useState } from 'react';
import { ChevronRight, ChevronDown, Tag, AtSign, Type } from 'lucide-react';
import { XMLNode } from '../utils/xmlParser';

interface XMLTreeProps {
  node: XMLNode;
  depth?: number;
  defaultExpanded?: boolean;
}

function TreeNode({ node, depth = 0, defaultExpanded = true }: XMLTreeProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 3 && defaultExpanded);

  if (node.type === 'text') {
    return (
      <div className="flex items-center gap-2 py-0.5 pl-6">
        <Type className="w-3 h-3 text-amber-400 shrink-0" />
        <span className="text-amber-300 text-sm font-mono break-all">{node.value}</span>
      </div>
    );
  }

  if (node.type === 'comment') {
    return (
      <div className="flex items-center gap-2 py-0.5 pl-6">
        <span className="text-gray-500 text-sm font-mono italic">{'<!-- '}{node.value}{' -->'}</span>
      </div>
    );
  }

  if (node.type === 'cdata') {
    return (
      <div className="flex items-center gap-2 py-0.5 pl-6">
        <span className="text-green-400 text-sm font-mono">{'<![CDATA['}{node.value}{']]>'}</span>
      </div>
    );
  }

  const hasChildren = node.children && node.children.length > 0;
  const isLeaf = !hasChildren;

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-1 py-0.5 px-1 rounded hover:bg-gray-700/40 transition-colors cursor-pointer group`}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          )
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        
        <Tag className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        
        <span className="text-blue-300 font-mono text-sm font-medium group-hover:text-blue-200">
          {node.name}
        </span>

        {node.attributes && Object.keys(node.attributes).length > 0 && (
          <span className="flex items-center gap-1 ml-1">
            {Object.entries(node.attributes).map(([key, value]) => (
              <span key={key} className="flex items-center gap-0.5 text-xs">
                <AtSign className="w-2.5 h-2.5 text-purple-400" />
                <span className="text-purple-300 font-mono">{key}</span>
                <span className="text-gray-500">=</span>
                <span className="text-green-300 font-mono">"{value}"</span>
              </span>
            ))}
          </span>
        )}

        {isLeaf && (
          <span className="text-gray-500 text-xs ml-1">/</span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="border-l border-gray-700/50 ml-5">
          {node.children!.map((child, index) => (
            <TreeNode key={index} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function XMLTree({ node }: { node: XMLNode }) {
  return (
    <div className="font-mono text-sm overflow-auto max-h-full py-2">
      <TreeNode node={node} />
    </div>
  );
}
