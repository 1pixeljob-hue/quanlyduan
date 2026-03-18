import { useState, useEffect } from 'react';
import { Search, Plus, X, Copy, CheckCheck, Tag, Calendar, Filter, Code, Hash, Pencil, Trash2, ChevronRight, List, Eye, Menu } from 'lucide-react';
import { CodeSnippet } from './CodeX';
import { CodeList } from './CodeList';
import { CodeForm } from './CodeForm';
import { isoToVNDate } from '../utils/dateFormat';

const languageList = [
  { value: 'all', label: 'Tất cả ngôn ngữ', count: 0 },
  { value: 'javascript', label: 'JavaScript', count: 0 },
  { value: 'typescript', label: 'TypeScript', count: 0 },
  { value: 'html', label: 'HTML', count: 0 },
  { value: 'css', label: 'CSS', count: 0 },
  { value: 'php', label: 'PHP', count: 0 },
  { value: 'python', label: 'Python', count: 0 },
  { value: 'sql', label: 'SQL', count: 0 },
  { value: 'json', label: 'JSON', count: 0 },
  { value: 'other', label: 'Khác', count: 0 }
];

const languageColors: Record<string, string> = {
  javascript: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  typescript: 'bg-blue-100 text-blue-700 border-blue-300',
  html: 'bg-orange-100 text-orange-700 border-orange-300',
  css: 'bg-purple-100 text-purple-700 border-purple-300',
  php: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  python: 'bg-green-100 text-green-700 border-green-300',
  sql: 'bg-pink-100 text-pink-700 border-pink-300',
  json: 'bg-teal-100 text-teal-700 border-teal-300',
  other: 'bg-gray-100 text-gray-700 border-gray-300'
};

interface CodeXProps {
  codes: CodeSnippet[];
  onAdd: (code: any) => void;
  onEdit: (code: any) => void;
  onDelete: (id: string) => void;
}

export function CodeX({ codes, onAdd, onEdit, onDelete }: CodeXProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<CodeSnippet | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'preview'>('list');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Calculate language counts
  const languageCounts = languageList.map(lang => {
    if (lang.value === 'all') {
      return { ...lang, count: codes.length };
    }
    return { 
      ...lang, 
      count: codes.filter(c => c.type === lang.value).length 
    };
  });

  // Filter codes
  const filteredCodes = codes.filter(code => {
    const matchesSearch = 
      code.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || code.type === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  // Auto-select first snippet when filter changes
  useEffect(() => {
    if (filteredCodes.length > 0 && !selectedSnippet) {
      setSelectedSnippet(filteredCodes[0]);
    } else if (filteredCodes.length === 0) {
      setSelectedSnippet(null);
    } else if (selectedSnippet && !filteredCodes.find(c => c.id === selectedSnippet.id)) {
      setSelectedSnippet(filteredCodes[0]);
    }
  }, [filteredCodes, selectedSnippet]);

  // Switch to preview on mobile when snippet is selected
  useEffect(() => {
    if (selectedSnippet && window.innerWidth < 768) {
      setMobileView('preview');
    }
  }, [selectedSnippet]);

  const copyToClipboard = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleEdit = (code: CodeSnippet) => {
    setEditingCode(code);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingCode(null);
    setIsFormOpen(true);
  };

  const handleSubmit = (code: any) => {
    if (editingCode) {
      onEdit(code);
    } else {
      onAdd(code);
    }
    setIsFormOpen(false);
    setEditingCode(null);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    if (selectedSnippet?.id === id) {
      setSelectedSnippet(null);
      setMobileView('list');
    }
  };

  const getLanguageLabel = (type: string) => {
    return languageList.find(l => l.value === type)?.label || type;
  };

  return (
    <div className="space-y-4">
      {/* Mobile Header */}
      <div className="block lg:hidden">
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-4">
          {/* Top Actions */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex-1"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Bộ Lọc</span>
              {selectedLanguage !== 'all' && (
                <span className="px-2 py-0.5 bg-[#4DBFAD] text-white text-xs rounded-full">1</span>
              )}
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white rounded-lg hover:opacity-90 transition-opacity flex-1"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Thêm</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm snippet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent text-sm"
            />
          </div>

          <div className="mt-2 text-xs text-gray-500">
            {filteredCodes.length} snippet{filteredCodes.length !== 1 ? 's' : ''}
          </div>

          {/* Mobile Filter Dropdown */}
          {showMobileFilter && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">Ngôn Ngữ</h4>
              <div className="grid grid-cols-2 gap-2">
                {languageCounts.map(lang => (
                  <button
                    key={lang.value}
                    onClick={() => {
                      setSelectedLanguage(lang.value);
                      setShowMobileFilter(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all text-xs ${
                      selectedLanguage === lang.value
                        ? 'bg-gradient-to-r from-[#4DBFAD]/10 to-[#2563B4]/10 text-[#2563B4] font-medium border border-[#4DBFAD]/30'
                        : 'text-gray-700 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <span className="truncate">{lang.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ml-1 ${
                      selectedLanguage === lang.value
                        ? 'bg-[#4DBFAD]/20 text-[#2563B4]'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {lang.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Tabs */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={() => setMobileView('list')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                mobileView === 'list'
                  ? 'bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
              Danh Sách
            </button>
            <button
              onClick={() => setMobileView('preview')}
              disabled={!selectedSnippet}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                mobileView === 'preview'
                  ? 'bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white'
                  : selectedSnippet
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Eye className="w-4 h-4" />
              Chi Tiết
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-180px)] gap-4 lg:gap-6">
        {/* Left Sidebar - Filters - Desktop Only */}
        <div className={`hidden lg:flex ${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-white rounded-lg shadow-sm border border-gray-200 flex-col transition-all`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Bộ Lọc</h3>
              </div>
            )}
            
            {/* Add Button */}
            <button
              onClick={handleAdd}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity ${
                isSidebarCollapsed ? 'px-2' : ''
              }`}
            >
              <Plus className="w-5 h-5" />
              {!isSidebarCollapsed && <span>Thêm Snippet</span>}
            </button>
          </div>

          {/* Language Filters */}
          {!isSidebarCollapsed && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {languageCounts.map(lang => (
                  <button
                    key={lang.value}
                    onClick={() => setSelectedLanguage(lang.value)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm ${
                      selectedLanguage === lang.value
                        ? 'bg-gradient-to-r from-[#4DBFAD]/10 to-[#2563B4]/10 text-[#2563B4] font-medium border border-[#4DBFAD]/30'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedLanguage === lang.value
                        ? 'bg-[#4DBFAD]/20 text-[#2563B4]'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {lang.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Collapse Toggle */}
          <div className="p-2 border-t border-gray-200">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors text-sm"
            >
              {isSidebarCollapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        {/* Middle - Snippet List */}
        <div className={`${mobileView === 'list' ? 'block' : 'hidden'} lg:block w-full lg:w-96 bg-white rounded-lg shadow-sm border-2 border-gray-200 flex flex-col`}>
          {/* Search - Desktop Only */}
          <div className="hidden lg:block p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm snippet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFAD] focus:border-transparent"
              />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {filteredCodes.length} snippet{filteredCodes.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Snippet List */}
          <div className="flex-1 overflow-y-auto">
            {filteredCodes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-400 p-8">
                <Code className="w-12 h-12 sm:w-16 sm:h-16 mb-3" />
                <p className="text-sm">Không tìm thấy snippet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredCodes.map(code => (
                  <button
                    key={code.id}
                    onClick={() => setSelectedSnippet(code)}
                    className={`w-full p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedSnippet?.id === code.id ? 'bg-[#4DBFAD]/5 border-l-4 border-[#4DBFAD]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-1 flex-1">
                        {code.name}
                      </h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${
                        languageColors[code.type] || languageColors.other
                      }`}>
                        {getLanguageLabel(code.type)}
                      </span>
                    </div>
                    {code.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {code.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Hash className="w-3 h-3" />
                      <span>{code.content.split('\n').length} dòng</span>
                      <span>•</span>
                      <span>{code.content.length} ký tự</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right - Code Preview */}
        <div className={`${mobileView === 'preview' ? 'block' : 'hidden'} lg:block flex-1 bg-white rounded-lg shadow-sm border-2 border-gray-200 flex flex-col min-h-[400px] lg:min-h-0`}>
          {selectedSnippet ? (
            <>
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-gray-200">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setMobileView('list')}
                  className="lg:hidden flex items-center gap-2 text-sm text-gray-600 hover:text-[#4DBFAD] mb-3 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Quay lại danh sách
                </button>

                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                        {selectedSnippet.name}
                      </h2>
                      <span className={`text-xs px-2.5 py-1 rounded-full border w-fit ${
                        languageColors[selectedSnippet.type] || languageColors.other
                      }`}>
                        {getLanguageLabel(selectedSnippet.type)}
                      </span>
                    </div>
                    {selectedSnippet.description && (
                      <p className="text-xs sm:text-sm text-gray-600">
                        {selectedSnippet.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(selectedSnippet)}
                      className="p-2 text-gray-400 hover:text-[#4DBFAD] hover:bg-[#4DBFAD]/10 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedSnippet.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    <span>{selectedSnippet.content.split('\n').length} dòng</span>
                  </div>
                  <span>•</span>
                  <span>{selectedSnippet.content.length} ký tự</span>
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 overflow-hidden flex flex-col p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Code className="w-4 h-4" />
                    <span>Code Preview</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedSnippet.content, selectedSnippet.id)}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                      copiedId === selectedSnippet.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {copiedId === selectedSnippet.id ? (
                      <>
                        <CheckCheck className="w-4 h-4" />
                        Đã copy!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>

                <div className="flex-1 overflow-auto bg-gray-900 rounded-lg">
                  <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-gray-100 leading-relaxed overflow-x-auto">
                    <code className="block whitespace-pre-wrap break-all">{selectedSnippet.content}</code>
                  </pre>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
              <div className="bg-gradient-to-br from-[#4DBFAD]/10 to-[#2563B4]/10 p-6 sm:p-8 rounded-2xl mb-4">
                <Code className="w-16 h-16 sm:w-20 sm:h-20 text-[#4DBFAD]" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">
                Chọn một snippet
              </h3>
              <p className="text-xs sm:text-sm text-center max-w-md">
                Chọn một snippet từ danh sách để xem chi tiết và copy code
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <CodeForm
          code={editingCode}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCode(null);
          }}
        />
      )}
    </div>
  );
}
