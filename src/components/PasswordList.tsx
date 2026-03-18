import { useState } from 'react';
import { Eye, EyeOff, Copy, Pencil, Trash2, Lock, Globe, User, CheckCircle2, MoreVertical } from 'lucide-react';
import { Password, Category } from './PasswordManager';

export interface Password {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  notes: string;
  category: string;
  createdAt: string;
}

interface PasswordListProps {
  passwords: Password[];
  categories: Category[];
  onEdit: (password: Password) => void;
  onDelete: (id: string) => void;
}

export function PasswordList({ passwords, categories, onEdit, onDelete }: PasswordListProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '#6B7280'; // Default gray color
  };

  const getCategoryStyle = (categoryId: string) => {
    const color = getCategoryColor(categoryId);
    return {
      backgroundColor: `${color}15`,
      borderColor: color,
      color: color
    };
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, id: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(`${id}-${field}`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (passwords.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-16">
        <div className="text-center max-w-md mx-auto">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-[#4DBFAD]/20 to-[#2563B4]/20 w-20 h-20 rounded-full flex items-center justify-center">
              <Lock className="w-10 h-10 text-[#4DBFAD]" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Chưa Có Mật Khẩu
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Bắt đầu bảo mật thông tin của bạn bằng cách thêm mật khẩu đầu tiên
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {passwords.map((item) => {
        const isPasswordVisible = visiblePasswords.has(item.id);
        const categoryColor = getCategoryColor(item.category);
        const categoryStyle = getCategoryStyle(item.category);
        const isHovered = hoveredCard === item.id;
        
        return (
          <div
            key={item.id}
            onMouseEnter={() => setHoveredCard(item.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`
              group relative bg-white rounded-xl border-2 transition-all duration-300
              ${isHovered ? 'border-[#4DBFAD] shadow-xl shadow-[#4DBFAD]/10 -translate-y-1' : 'border-gray-200 shadow-sm hover:shadow-md'}
            `}
          >
            {/* Gradient Top Border with Category Color */}
            <div 
              className="h-1.5 rounded-t-xl"
              style={{ 
                background: `linear-gradient(to right, ${categoryColor}, ${categoryColor}cc)` 
              }}
            ></div>

            <div className="p-5">
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base truncate mb-2">
                      {item.title}
                    </h3>
                    <span 
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border-2"
                      style={categoryStyle}
                    >
                      <div 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: categoryColor }}
                      ></div>
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>
                </div>

                {/* Website */}
                {item.website && (
                  <a
                    href={item.website.startsWith('http') ? item.website : `https://${item.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#2563B4] hover:text-[#4DBFAD] transition-colors group/link"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[180px] font-medium group-hover/link:underline">
                      {item.website.replace(/^https?:\/\//, '')}
                    </span>
                  </a>
                )}
              </div>

              {/* Content Fields */}
              <div className="space-y-3 mb-4">
                {/* Username Field */}
                <div className="group/field">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Username</label>
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-2 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg px-3 py-2.5 border border-gray-200 group-hover/field:border-[#4DBFAD]/30 transition-colors">
                      <span className="flex-1 text-sm text-gray-900 font-medium truncate">
                        {item.username}
                      </span>
                      <button
                        onClick={() => copyToClipboard(item.username, item.id, 'username')}
                        className={`
                          flex-shrink-0 p-1.5 rounded-md transition-all
                          ${copiedId === `${item.id}-username` 
                            ? 'bg-green-100 text-green-600' 
                            : 'text-gray-400 hover:text-[#4DBFAD] hover:bg-[#4DBFAD]/10'
                          }
                        `}
                        title="Sao chép username"
                      >
                        {copiedId === `${item.id}-username` ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="group/field">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-2 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg px-3 py-2.5 border border-gray-200 group-hover/field:border-[#4DBFAD]/30 transition-colors">
                      <span className="flex-1 text-sm text-gray-900 font-mono truncate">
                        {isPasswordVisible ? item.password : '••••••••••••'}
                      </span>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => togglePasswordVisibility(item.id)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-[#2563B4] hover:bg-[#2563B4]/10 transition-all"
                          title={isPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        >
                          {isPasswordVisible ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(item.password, item.id, 'password')}
                          className={`
                            p-1.5 rounded-md transition-all
                            ${copiedId === `${item.id}-password` 
                              ? 'bg-green-100 text-green-600' 
                              : 'text-gray-400 hover:text-[#4DBFAD] hover:bg-[#4DBFAD]/10'
                            }
                          `}
                          title="Sao chép mật khẩu"
                        >
                          {copiedId === `${item.id}-password` ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Field */}
                {item.notes && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ghi Chú</label>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-lg px-3 py-2.5 border border-amber-200/50">
                      <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                        {item.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => onEdit(item)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4DBFAD] to-[#4DBFAD]/90 hover:from-[#4DBFAD]/90 hover:to-[#4DBFAD] text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Sửa</span>
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 text-sm font-semibold rounded-lg border-2 border-red-200 hover:border-red-300 transition-all active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>

            {/* Hover Glow Effect */}
            {isHovered && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#4DBFAD]/5 to-[#2563B4]/5 pointer-events-none"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}