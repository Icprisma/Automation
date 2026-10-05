import { useMemo } from 'react';

interface XMLRawProps {
  content: string;
}

interface Token {
  type: 'tag-open' | 'tag-close' | 'tag-name' | 'attr-name' | 'attr-value' | 'text' | 'comment' | 'processing' | 'equals' | 'quote' | 'self-close' | 'slash';
  value: string;
}

function tokenize(xml: string): Token[][] {
  const lines = xml.split('\n');
  const result: Token[][] = [];

  for (const line of lines) {
    const tokens: Token[] = [];
    let i = 0;

    while (i < line.length) {
      // Comment
      if (line.substring(i, i + 4) === '<!--') {
        const end = line.indexOf('-->', i + 4);
        const commentEnd = end === -1 ? line.length : end + 3;
        tokens.push({ type: 'comment', value: line.substring(i, commentEnd) });
        i = commentEnd;
        continue;
      }

      // Processing instruction
      if (line.substring(i, i + 2) === '<?') {
        const end = line.indexOf('?>', i + 2);
        const piEnd = end === -1 ? line.length : end + 2;
        tokens.push({ type: 'processing', value: line.substring(i, piEnd) });
        i = piEnd;
        continue;
      }

      // CDATA
      if (line.substring(i, i + 9) === '<![CDATA[') {
        const end = line.indexOf(']]>', i + 9);
        const cdataEnd = end === -1 ? line.length : end + 3;
        tokens.push({ type: 'text', value: line.substring(i, cdataEnd) });
        i = cdataEnd;
        continue;
      }

      // Tag
      if (line[i] === '<') {
        tokens.push({ type: 'tag-open', value: '<' });
        i++;

        // Closing tag slash
        if (line[i] === '/') {
          tokens.push({ type: 'slash', value: '/' });
          i++;
        }

        // Tag name
        let tagName = '';
        while (i < line.length && /[\w:.-]/.test(line[i])) {
          tagName += line[i];
          i++;
        }
        if (tagName) {
          tokens.push({ type: 'tag-name', value: tagName });
        }

        // Attributes
        while (i < line.length && line[i] !== '>' && line[i] !== '/') {
          // Whitespace
          if (/\s/.test(line[i])) {
            i++;
            continue;
          }

          // Attribute name
          let attrName = '';
          while (i < line.length && /[\w:.-]/.test(line[i])) {
            attrName += line[i];
            i++;
          }
          if (attrName) {
            tokens.push({ type: 'attr-name', value: attrName });
          }

          // Equals
          if (line[i] === '=') {
            tokens.push({ type: 'equals', value: '=' });
            i++;
          }

          // Attribute value
          if (line[i] === '"' || line[i] === "'") {
            const quote = line[i];
            tokens.push({ type: 'quote', value: quote });
            i++;
            let attrValue = '';
            while (i < line.length && line[i] !== quote) {
              attrValue += line[i];
              i++;
            }
            tokens.push({ type: 'attr-value', value: attrValue });
            if (i < line.length) {
              tokens.push({ type: 'quote', value: line[i] });
              i++;
            }
          }
        }

        // Self-closing
        if (line[i] === '/') {
          tokens.push({ type: 'self-close', value: '/' });
          i++;
        }

        // Close
        if (line[i] === '>') {
          tokens.push({ type: 'tag-close', value: '>' });
          i++;
        }

        continue;
      }

      // Text content
      let text = '';
      while (i < line.length && line[i] !== '<') {
        text += line[i];
        i++;
      }
      if (text) {
        tokens.push({ type: 'text', value: text });
      }
    }

    result.push(tokens);
  }

  return result;
}

function getTokenColor(type: Token['type']): string {
  switch (type) {
    case 'tag-open':
    case 'tag-close':
    case 'slash':
    case 'self-close':
      return 'text-gray-400';
    case 'tag-name':
      return 'text-blue-400';
    case 'attr-name':
      return 'text-purple-400';
    case 'attr-value':
      return 'text-green-400';
    case 'equals':
      return 'text-gray-400';
    case 'quote':
      return 'text-gray-500';
    case 'text':
      return 'text-amber-300';
    case 'comment':
      return 'text-gray-500 italic';
    case 'processing':
      return 'text-cyan-400';
    default:
      return 'text-gray-300';
  }
}

export default function XMLRaw({ content }: XMLRawProps) {
  const lines = useMemo(() => tokenize(content), [content]);

  return (
    <div className="font-mono text-sm overflow-auto max-h-full">
      <div className="py-2">
        {lines.map((tokens, lineIdx) => (
          <div key={lineIdx} className="flex hover:bg-gray-700/20 group">
            <span className="inline-block w-12 text-right pr-4 text-gray-600 select-none text-xs leading-6 group-hover:text-gray-400 shrink-0">
              {lineIdx + 1}
            </span>
            <span className="leading-6">
              {tokens.map((token, tokenIdx) => (
                <span key={tokenIdx} className={getTokenColor(token.type)}>
                  {token.value}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
