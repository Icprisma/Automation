import { useState, useCallback } from 'react';
import { 
  FileCode, TreePine, Code2, BarChart3, 
  Upload, FolderOpen, AlertCircle, CheckCircle2,
  X, Layers, Hash, Maximize2
} from 'lucide-react';
import FileUpload from './components/FileUpload';
import XMLTree from './components/XMLTree';
import XMLRaw from './components/XMLRaw';
import { parseXML, ParseResult } from './utils/xmlParser';
import { sampleFiles, SampleFile } from './data/sampleXml';

type ViewMode = 'tree' | 'raw';

export default function App() {
  const [xmlContent, setXmlContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [showSamples, setShowSamples] = useState(false);

  const handleFileLoad = useCallback((content: string, name: string) => {
    setXmlContent(content);
    setFileName(name);
    const result = parseXML(content);
    setParseResult(result);
  }, []);

  const handleSampleLoad = useCallback((sample: SampleFile) => {
    setXmlContent(sample.content);
    setFileName(sample.name);
    const result = parseXML(sample.content);
    setParseResult(result);
    setShowSamples(false);
  }, []);

  const handleClear = useCallback(() => {
    setXmlContent('');
    setFileName('');
    setParseResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800/80 border-b border-gray-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-blue-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Automation
              </h1>
              <p className="text-xs text-gray-500 -mt-0.5">XML File Viewer</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSamples(!showSamples)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                showSamples 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-gray-700/50 text-gray-400 hover:text-gray-200 hover:bg-gray-700 border border-transparent'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Samples</span>
            </button>
            {xmlContent && (
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-gray-700/50 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Samples Panel */}
        {showSamples && (
          <div className="mb-6 bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Sample XML Files
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {sampleFiles.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSampleLoad(sample)}
                  className="text-left p-3 rounded-lg bg-gray-700/30 border border-gray-700/50 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileCode className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                    <span className="text-sm font-medium text-gray-200 group-hover:text-blue-300 truncate">
                      {sample.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{sample.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Upload Area - shown when no file loaded */}
        {!xmlContent && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-200">
                View & Explore XML Files
              </h2>
              <p className="text-gray-500">
                Upload an XML file or choose a sample to get started
              </p>
            </div>
            <FileUpload onFileLoad={handleFileLoad} />
            
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-3">Or try a sample file:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {sampleFiles.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSampleLoad(sample)}
                    className="px-3 py-1.5 rounded-full text-xs bg-gray-800 border border-gray-700 text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* XML Viewer - shown when file is loaded */}
        {xmlContent && parseResult && (
          <div className="space-y-4">
            {/* File Info Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileCode className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="font-medium text-gray-200 truncate">{fileName}</span>
              </div>
              
              {parseResult.success && parseResult.stats && (
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {parseResult.stats.elements} elements
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" />
                    Depth: {parseResult.stats.depth}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    {parseResult.stats.attributes} attributes
                  </span>
                </div>
              )}

              {parseResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
            </div>

            {/* Error Display */}
            {parseResult.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Parse Error</span>
                </div>
                <pre className="text-sm text-red-300/80 font-mono whitespace-pre-wrap">{parseResult.error}</pre>
              </div>
            )}

            {/* View Mode Tabs */}
            {parseResult.success && (
              <>
                <div className="flex items-center gap-1 bg-gray-800/50 border border-gray-700/50 rounded-xl p-1 w-fit">
                  <button
                    onClick={() => setViewMode('tree')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                      viewMode === 'tree'
                        ? 'bg-blue-500/20 text-blue-400 shadow-sm'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <TreePine className="w-4 h-4" />
                    Tree View
                  </button>
                  <button
                    onClick={() => setViewMode('raw')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                      viewMode === 'raw'
                        ? 'bg-blue-500/20 text-blue-400 shadow-sm'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    Source Code
                  </button>
                </div>

                {/* Content Area */}
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden">
                  <div className="max-h-[calc(100vh-320px)] overflow-auto">
                    {viewMode === 'tree' ? (
                      <XMLTree node={parseResult.data!} />
                    ) : (
                      <XMLRaw content={xmlContent} />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-3 text-center">
        <p className="text-xs text-gray-600">
          Automation XML Viewer • Parse, explore, and visualize XML data
        </p>
      </footer>
    </div>
  );
}
