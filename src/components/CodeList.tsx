import { useState } from 'react';
import { Code as CodeIcon, Copy, Trash2, Search, Tag, Calendar, Pencil, CheckCheck } from 'lucide-react';
import { CodeSnippet } from './CodeX';
import { isoToVNDate } from '../utils/dateFormat';

interface CodeListProps {
  codes: CodeSnippet[];
  onEdit: (code: CodeSnippet) => void;
  onDelete: (id: string) => void;
}

const codeTypeColors: Record<string, string> = {
  javascript: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  typescript: 'bg-blue-100 text-blue-700 border-blue-200',
  html: 'bg-orange-100 text-orange-700 border-orange-200',
  css: 'bg-purple-100 text-purple-700 border-purple-200',
  php: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  python: 'bg-green-100 text-green-700 border-green-200',
  sql: 'bg-pink-100 text-pink-700 border-pink-200',
  json: 'bg-teal-100 text-teal-700 border-teal-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200'
};

export function CodeList({ codes, onEdit, onDelete }: CodeListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getTypeColor = (type: string) => {
    return codeTypeColors[type.toLowerCase()] || codeTypeColors.other;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      html: 'HTML',
      css: 'CSS',
      php: 'PHP',
      python: 'Python',
      sql: 'SQL',
      json: 'JSON',
      other: 'Khác'
    };
    return labels[type.toLowerCase()] || type;
  };

  if (codes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <CodeIcon className="w-16 h-16 mb-4 text-gray-300" />
        <p className="text-lg">Chưa có đoạn code nào</p>
        <p className="text-sm">Thêm đoạn code đầu tiên để bắt đầu!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {codes.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">
                  {item.name}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getTypeColor(item.type)}`}>
                  {getTypeLabel(item.type)}
                </span>
              </div>
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
            <div className="flex gap-2 ml-3">
              <button
                onClick={() => onEdit(item)}
                className="text-gray-400 hover:text-[#4DBFAD] transition-colors"
                title="Chỉnh sửa"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Code Block */}
          <div className="relative group">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-48 overflow-y-auto">
              <code>{item.content}</code>
            </pre>
            
            {/* Copy Button */}
            <button
              onClick={() => copyToClipboard(item.content, item.id)}
              className={`absolute top-2 right-2 p-2 rounded-lg transition-all ${
                copiedId === item.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-gray-700'
              }`}
              title={copiedId === item.id ? 'Đã copy!' : 'Copy code'}
            >
              {copiedId === item.id ? (
                <CheckCheck className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>
              {isoToVNDate(item.createdAt)}
            </span>
            <span className="text-gray-400">
              {item.content.split('\n').length} dòng
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}