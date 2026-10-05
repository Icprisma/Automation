import { useState } from 'react';
import { Upload, FileCode } from 'lucide-react';

interface FileUploadProps {
  onFileLoad: (content: string, fileName: string) => void;
}

export default function FileUpload({ onFileLoad }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.xml') && file.type !== 'application/xml' && file.type !== 'text/xml') {
      alert('Please upload an XML file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileLoad(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
        ${isDragging 
          ? 'border-blue-400 bg-blue-500/10 scale-[1.02]' 
          : 'border-gray-600 hover:border-blue-400/60 hover:bg-gray-800/50'
        }
      `}
    >
      <input
        type="file"
        accept=".xml,application/xml,text/xml"
        onChange={handleInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-3">
        <div className={`
          p-4 rounded-full transition-all duration-300
          ${isDragging ? 'bg-blue-500/20' : 'bg-gray-700/50'}
        `}>
          {isDragging ? (
            <FileCode className="w-8 h-8 text-blue-400 animate-pulse" />
          ) : (
            <Upload className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div>
          <p className="text-gray-300 font-medium">
            {isDragging ? 'Drop your XML file here' : 'Drag & drop XML file here'}
          </p>
          <p className="text-gray-500 text-sm mt-1">or click to browse</p>
        </div>
      </div>
    </div>
  );
}
