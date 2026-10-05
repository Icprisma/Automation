export interface XMLNode {
  type: 'element' | 'text' | 'cdata' | 'comment' | 'processing';
  name?: string;
  attributes?: Record<string, string>;
  children?: XMLNode[];
  value?: string;
}

export interface ParseResult {
  success: boolean;
  data?: XMLNode;
  error?: string;
  stats?: {
    elements: number;
    attributes: number;
    depth: number;
  };
}

export function parseXML(xmlString: string): ParseResult {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');
    
    // Check for parse errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      return {
        success: false,
        error: parseError.textContent || 'Unknown XML parse error'
      };
    }

    const rootNode = convertNode(doc.documentElement);
    const stats = calculateStats(rootNode);

    return {
      success: true,
      data: rootNode,
      stats
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to parse XML'
    };
  }
}

function convertNode(node: globalThis.Node): XMLNode {
  if (node.nodeType === globalThis.Node.ELEMENT_NODE) {
    const element = node as Element;
    const attributes: Record<string, string> = {};
    
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      attributes[attr.name] = attr.value;
    }

    const children: XMLNode[] = [];
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeType === globalThis.Node.ELEMENT_NODE) {
        children.push(convertNode(child));
      } else if (child.nodeType === globalThis.Node.TEXT_NODE) {
        const text = child.textContent?.trim();
        if (text) {
          children.push({ type: 'text', value: text });
        }
      } else if (child.nodeType === globalThis.Node.CDATA_SECTION_NODE) {
        children.push({ type: 'cdata', value: child.textContent || '' });
      } else if (child.nodeType === globalThis.Node.COMMENT_NODE) {
        children.push({ type: 'comment', value: child.textContent || '' });
      }
    }

    return {
      type: 'element',
      name: element.tagName,
      attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
      children: children.length > 0 ? children : undefined
    };
  }

  return { type: 'text', value: node.textContent || '' };
}

function calculateStats(node: XMLNode, depth: number = 0): { elements: number; attributes: number; depth: number } {
  let elements = 0;
  let attributes = 0;
  let maxDepth = depth;

  if (node.type === 'element') {
    elements = 1;
    attributes = node.attributes ? Object.keys(node.attributes).length : 0;
    
    if (node.children) {
      for (const child of node.children) {
        const childStats = calculateStats(child, depth + 1);
        elements += childStats.elements;
        attributes += childStats.attributes;
        maxDepth = Math.max(maxDepth, childStats.depth);
      }
    }
  }

  return { elements, attributes, depth: maxDepth };
}

export function formatXML(xmlString: string): string {
  let formatted = '';
  let indent = 0;
  const lines = xmlString.replace(/>\s*</g, '>\n<').split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    if (trimmed.startsWith('</')) {
      indent = Math.max(0, indent - 1);
    }
    
    formatted += '  '.repeat(indent) + trimmed + '\n';
    
    if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.startsWith('<?') && 
        !trimmed.endsWith('/>') && !trimmed.includes('</')) {
      indent++;
    }
  }
  
  return formatted.trim();
}
