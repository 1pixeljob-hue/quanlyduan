import { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Server, FolderKanban, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, X, BarChart3, Phone, User, Percent, Eye, Download, Filter } from 'lucide-react';
import { isoToVNDate } from '../utils/dateFormat';
import { formatCurrency, formatFullCurrency } from '../utils/formatMoney';
import { CustomSelect } from './CustomSelect';
import { Hosting } from '../App';
import { Project } from './ProjectList';

interface ReportsViewProps {
  hostings: Hosting[];
  projects: Project[];
}

export function ReportsView({ hostings, projects }: ReportsViewProps) {
  const completedProjects = projects.filter(p => p.status === 'completed');

  // State for month detail modal
  const [selectedMonthDetail, setSelectedMonthDetail] = useState<{ month: number; year: number } | null>(null);

  // Get all available years
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    
    completedProjects.forEach(project => {
      const year = new Date(project.createdAt).getFullYear();
      years.add(year);
    });
    
    hostings.forEach(hosting => {
      const year = new Date(hosting.registrationDate).getFullYear();
      years.add(year);
    });
    
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    return sortedYears;
  }, [completedProjects, hostings]);

  const [selectedYear, setSelectedYear] = useState<number | 'all'>( availableYears.length > 0 ? availableYears[0] : 'all'
  );

  // Year filter options for CustomSelect
  const yearOptions = useMemo(() => {
    const options = [
      { value: 'all', label: 'Tất Cả Năm', bgColor: 'bg-gradient-to-r from-[#4DBFAD]/10 to-[#2563B4]/10', color: 'text-gray-800' }
    ];
    availableYears.forEach(year => {
      options.push({
        value: year.toString(),
        label: year.toString(),
        bgColor: 'bg-gray-100',
        color: 'text-gray-800'
      });
    });
    return options;
  }, [availableYears]);

  // Get projects and hostings for selected month
  const getMonthlyDetails = (month: number, year: number) => {
    const monthProjects = completedProjects.filter(project => {
      const date = new Date(project.createdAt);
      return date.getFullYear() === year && date.getMonth() === month;
    });

    const monthHostings = hostings.filter(hosting => {
      const date = new Date(hosting.registrationDate);
      return date.getFullYear() === year && date.getMonth() === month;
    });

    return { projects: monthProjects, hostings: monthHostings };
  };

  // Calculate yearly overview data
  const yearlyOverviewData = useMemo(() => {
    const yearlyData: { [key: string]: { 
      year: string, 
      projectRevenue: number,
      projectCount: number,
      hostingRevenue: number,
      hostingCount: number,
      totalRevenue: number 
    } } = {};
    
    availableYears.forEach(year => {
      yearlyData[year] = {
        year: year.toString(),
        projectRevenue: 0,
        projectCount: 0,
        hostingRevenue: 0,
        hostingCount: 0,
        totalRevenue: 0
      };
    });
    
    completedProjects.forEach(project => {
      const year = new Date(project.createdAt).getFullYear();
      if (yearlyData[year]) {
        yearlyData[year].projectRevenue += project.price || 0;
        yearlyData[year].projectCount += 1;
      }
    });
    
    hostings.forEach(hosting => {
      const year = new Date(hosting.registrationDate).getFullYear();
      if (yearlyData[year]) {
        yearlyData[year].hostingRevenue += hosting.price;
        yearlyData[year].hostingCount += 1;
      }
    });
    
    Object.values(yearlyData).forEach(data => {
      data.totalRevenue = data.projectRevenue + data.hostingRevenue;
    });
    
    return Object.values(yearlyData).sort((a, b) => parseInt(b.year) - parseInt(a.year));
  }, [completedProjects, hostings, availableYears]);

  // Calculate monthly data for selected year
  const monthlyData = useMemo(() => {
    if (selectedYear === 'all') return [];

    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const monthlyRevenue = months.map((month, index) => ({
      month,
      monthIndex: index,
      projectRevenue: 0,
      hostingRevenue: 0,
      totalRevenue: 0,
      projectCount: 0,
      hostingCount: 0
    }));

    completedProjects.forEach(project => {
      const date = new Date(project.createdAt);
      if (date.getFullYear() === selectedYear) {
        const monthIndex = date.getMonth();
        monthlyRevenue[monthIndex].projectRevenue += project.price || 0;
        monthlyRevenue[monthIndex].projectCount += 1;
      }
    });

    hostings.forEach(hosting => {
      const date = new Date(hosting.registrationDate);
      if (date.getFullYear() === selectedYear) {
        const monthIndex = date.getMonth();
        monthlyRevenue[monthIndex].hostingRevenue += hosting.price;
        monthlyRevenue[monthIndex].hostingCount += 1;
      }
    });

    monthlyRevenue.forEach(data => {
      data.totalRevenue = data.projectRevenue + data.hostingRevenue;
    });

    return monthlyRevenue;
  }, [selectedYear, completedProjects, hostings]);

  // Get current year data
  const currentYearData = useMemo(() => {
    if (selectedYear === 'all') {
      return {
        projectRevenue: yearlyOverviewData.reduce((sum, d) => sum + d.projectRevenue, 0),
        projectCount: yearlyOverviewData.reduce((sum, d) => sum + d.projectCount, 0),
        hostingRevenue: yearlyOverviewData.reduce((sum, d) => sum + d.hostingRevenue, 0),
        hostingCount: yearlyOverviewData.reduce((sum, d) => sum + d.hostingCount, 0),
        totalRevenue: yearlyOverviewData.reduce((sum, d) => sum + d.totalRevenue, 0)
      };
    }

    const yearData = yearlyOverviewData.find(d => parseInt(d.year) === selectedYear);
    return yearData || {
      projectRevenue: 0,
      projectCount: 0,
      hostingRevenue: 0,
      hostingCount: 0,
      totalRevenue: 0
    };
  }, [selectedYear, yearlyOverviewData]);

  // Calculate growth compared to previous year
  const growthData = useMemo(() => {
    if (selectedYear === 'all' || typeof selectedYear !== 'number') {
      return { revenue: 0, projects: 0, hostings: 0 };
    }

    const currentYear = yearlyOverviewData.find(d => parseInt(d.year) === selectedYear);
    const previousYear = yearlyOverviewData.find(d => parseInt(d.year) === selectedYear - 1);

    if (!currentYear || !previousYear) {
      return { revenue: 0, projects: 0, hostings: 0 };
    }

    const revenueGrowth = previousYear.totalRevenue > 0
      ? ((currentYear.totalRevenue - previousYear.totalRevenue) / previousYear.totalRevenue) * 100
      : 0;

    const projectGrowth = previousYear.projectCount > 0
      ? ((currentYear.projectCount - previousYear.projectCount) / previousYear.projectCount) * 100
      : 0;

    const hostingGrowth = previousYear.hostingCount > 0
      ? ((currentYear.hostingCount - previousYear.hostingCount) / previousYear.hostingCount) * 100
      : 0;

    return {
      revenue: revenueGrowth,
      projects: projectGrowth,
      hostings: hostingGrowth
    };
  }, [selectedYear, yearlyOverviewData]);

  // Pie chart data for revenue breakdown
  const revenueBreakdown = [
    { name: 'Projects', value: currentYearData.projectRevenue, color: '#4DBFAD' },
    { name: 'Hosting', value: currentYearData.hostingRevenue, color: '#2563B4' }
  ];

  const GrowthIndicator = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
    
    return (
      <div className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>{Math.abs(value).toFixed(1)}%</span>
      </div>
    );
  };

  const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Month Detail Modal */}
      {selectedMonthDetail && typeof selectedYear === 'number' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedMonthDetail(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header - Fixed */}
            <div className="bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0 rounded-t-lg">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-base sm:text-xl font-bold truncate">
                    Chi Tiết {monthNames[selectedMonthDetail.month]} / {selectedMonthDetail.year}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 mt-1 hidden sm:block">
                    Danh sách đầy đủ projects và hosting trong tháng
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMonthDetail(null)}
                className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0 ml-2"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto project-modal-scroll p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1">
              {(() => {
                const { projects: monthProjects, hostings: monthHostings } = getMonthlyDetails(selectedMonthDetail.month, selectedMonthDetail.year);
                const totalRevenue = monthProjects.reduce((sum, p) => sum + (p.price || 0), 0) + monthHostings.reduce((sum, h) => sum + h.price, 0);

                return (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 border-2 border-green-200">
                        <div className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Tổng Doanh Thu</div>
                        <div className="text-lg sm:text-2xl font-bold text-green-600">{totalRevenue.toLocaleString('vi-VN')} VNĐ</div>
                      </div>
                      <div className="bg-gradient-to-br from-[#4DBFAD]/10 to-[#4DBFAD]/20 rounded-lg p-3 sm:p-4 border-2 border-[#4DBFAD]/30">
                        <div className="text-xs font-semibold text-[#4DBFAD] uppercase tracking-wider mb-1">Projects</div>
                        <div className="text-lg sm:text-2xl font-bold text-[#4DBFAD]">{monthProjects.length}</div>
                        <div className="text-xs sm:text-sm text-gray-600 mt-1">{monthProjects.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString('vi-VN')} VNĐ</div>
                      </div>
                      <div className="bg-gradient-to-br from-[#2563B4]/10 to-[#2563B4]/20 rounded-lg p-3 sm:p-4 border-2 border-[#2563B4]/30">
                        <div className="text-xs font-semibold text-[#2563B4] uppercase tracking-wider mb-1">Hosting</div>
                        <div className="text-lg sm:text-2xl font-bold text-[#2563B4]">{monthHostings.length}</div>
                        <div className="text-xs sm:text-sm text-gray-600 mt-1">{monthHostings.reduce((sum, h) => sum + h.price, 0).toLocaleString('vi-VN')} VNĐ</div>
                      </div>
                    </div>

                    {/* Projects List - Mobile Cards / Desktop Table */}
                    {monthProjects.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                          <div className="p-2 bg-[#4DBFAD] rounded-lg">
                            <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <h4 className="text-base sm:text-lg font-bold text-gray-900">Projects ({monthProjects.length})</h4>
                        </div>

                        {/* Mobile Card View */}
                        <div className="block md:hidden space-y-3">
                          {monthProjects.map(project => (
                            <div key={project.id} className="bg-white rounded-lg border-2 border-gray-200 p-3">
                              <div className="font-semibold text-gray-900 mb-2">{project.name}</div>
                              {project.description && (
                                <div className="text-xs text-gray-500 mb-2 line-clamp-2">{project.description}</div>
                              )}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  <span className="text-gray-700">{project.customer}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                  <span className="text-gray-600">{project.customerPhone}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                    {isoToVNDate(project.createdAt)}
                                  </div>
                                  <div className="text-sm font-bold text-[#4DBFAD]">
                                    {(project.price || 0).toLocaleString('vi-VN')} VNĐ
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {/* Total */}
                          <div className="bg-gradient-to-r from-[#4DBFAD]/10 to-[#4DBFAD]/5 rounded-lg p-3 border-2 border-[#4DBFAD]/30">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-gray-900">Tổng Projects:</span>
                              <span className="text-base font-bold text-[#4DBFAD]">
                                {monthProjects.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString('vi-VN')} VNĐ
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tên Project</th>
                                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Khách Hàng</th>
                                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Ngày Tạo</th>
                                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Giá Trị</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {monthProjects.map(project => (
                                  <tr key={project.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                      <div className="font-semibold text-gray-900 text-sm">{project.name}</div>
                                      {project.description && (
                                        <div className="text-xs text-gray-500 line-clamp-1 mt-1">{project.description}</div>
                                      )}
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">{project.customer}</span>
                                      </div>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                        <span className="text-xs text-gray-500">{project.customerPhone}</span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{isoToVNDate(project.createdAt)}</td>
                                    <td className="px-4 py-3 text-right">
                                      <div className="text-sm font-bold text-[#4DBFAD]">
                                        {(project.price || 0).toLocaleString('vi-VN')} VNĐ
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                                <tr>
                                  <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-900">Tổng Projects:</td>
                                  <td className="px-4 py-3 text-right text-sm font-bold text-[#4DBFAD]">
                                    {monthProjects.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString('vi-VN')} VNĐ
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Hostings List - Mobile Cards / Desktop Table */}
                    {monthHostings.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                          <div className="p-2 bg-[#2563B4] rounded-lg">
                            <Server className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <h4 className="text-base sm:text-lg font-bold text-gray-900">Hosting ({monthHostings.length})</h4>
                        </div>

                        {/* Mobile Card View */}
                        <div className="block md:hidden space-y-3">
                          {monthHostings.map(hosting => (
                            <div key={hosting.id} className="bg-white rounded-lg border-2 border-gray-200 p-3">
                              <div className="font-semibold text-gray-900 mb-2">{hosting.name}</div>
                              {hosting.notes && (
                                <div className="text-xs text-gray-500 mb-2 line-clamp-2">{hosting.notes}</div>
                              )}
                              <div className="space-y-2">
                                <div className="text-sm text-gray-700">
                                  <span className="text-xs text-gray-500">Domain:</span> {hosting.domain}
                                </div>
                                <div className="text-sm text-gray-700">
                                  <span className="text-xs text-gray-500">Provider:</span> {hosting.provider}
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                    {isoToVNDate(hosting.registrationDate)}
                                  </div>
                                  <div className="text-sm font-bold text-[#2563B4]">
                                    {hosting.price.toLocaleString('vi-VN')} VNĐ
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {/* Total */}
                          <div className="bg-gradient-to-r from-[#2563B4]/10 to-[#2563B4]/5 rounded-lg p-3 border-2 border-[#2563B4]/30">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-gray-900">Tổng Hosting:</span>
                              <span className="text-base font-bold text-[#2563B4]">
                                {monthHostings.reduce((sum, h) => sum + h.price, 0).toLocaleString('vi-VN')} VNĐ
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tên Hosting</th>
                                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Domain</th>
                                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Nhà Cung Cấp</th>
                                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Ngày Đăng Ký</th>
                                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Giá Trị</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {monthHostings.map(hosting => (
                                  <tr key={hosting.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                      <div className="font-semibold text-gray-900 text-sm">{hosting.name}</div>
                                      {hosting.notes && (
                                        <div className="text-xs text-gray-500 line-clamp-1 mt-1">{hosting.notes}</div>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{hosting.domain}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{hosting.provider}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{isoToVNDate(hosting.registrationDate)}</td>
                                    <td className="px-4 py-3 text-right">
                                      <div className="text-sm font-bold text-[#2563B4]">
                                        {hosting.price.toLocaleString('vi-VN')} VNĐ
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                                <tr>
                                  <td colSpan={4} className="px-4 py-3 text-sm font-bold text-gray-900">Tổng Hosting:</td>
                                  <td className="px-4 py-3 text-right text-sm font-bold text-[#2563B4]">
                                    {monthHostings.reduce((sum, h) => sum + h.price, 0).toLocaleString('vi-VN')} VNĐ
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {monthProjects.length === 0 && monthHostings.length === 0 && (
                      <div className="text-center py-8 sm:py-12">
                        <div className="inline-flex p-3 sm:p-4 bg-gray-100 rounded-full mb-3 sm:mb-4">
                          <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Không Có Dữ Liệu</h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Không có project hoặc hosting nào trong tháng này
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Page Header with Filter */}
      <div className="bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] rounded-lg shadow-md p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Báo Cáo & Thống Kê</h2>
              <p className="text-white/90 text-xs sm:text-sm mt-1">
                Phân tích doanh thu và hiệu suất kinh doanh
              </p>
            </div>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3">
              <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Năm:</span>
            </div>
            <div className="flex-1 sm:flex-none min-w-[140px] sm:min-w-[160px]">
              <CustomSelect
                value={selectedYear.toString()}
                onChange={(value) => setSelectedYear(value === 'all' ? 'all' : parseInt(value))}
                options={yearOptions}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white border-2 border-green-600/30 rounded-lg p-4 sm:p-6 hover:border-green-600 transition-all shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-green-600/10 rounded-lg">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            {selectedYear !== 'all' && typeof selectedYear === 'number' && (
              <GrowthIndicator value={growthData.revenue} />
            )}
          </div>
          <div className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Tổng Doanh Thu</div>
          <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
            {formatCurrency(currentYearData.totalRevenue)} VNĐ
          </div>
          <div className="text-xs text-gray-500">
            {selectedYear === 'all' ? 'Tất cả các năm' : `Năm ${selectedYear}`}
          </div>
        </div>

        {/* Project Revenue */}
        <div className="bg-white border-2 border-[#4DBFAD]/30 rounded-lg p-4 sm:p-6 hover:border-[#4DBFAD] transition-all shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-[#4DBFAD]/10 rounded-lg">
              <FolderKanban className="w-5 h-5 sm:w-6 sm:h-6 text-[#4DBFAD]" />
            </div>
            {selectedYear !== 'all' && typeof selectedYear === 'number' && (
              <GrowthIndicator value={growthData.projects} />
            )}
          </div>
          <div className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Doanh Thu Projects</div>
          <div className="text-xl sm:text-2xl font-bold text-[#4DBFAD] mb-1">
            {formatCurrency(currentYearData.projectRevenue)} VNĐ
          </div>
          <div className="text-xs text-gray-500">
            {currentYearData.projectCount} projects hoàn thành
          </div>
          {/* Progress bar */}
          <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#4DBFAD] to-[#4DBFAD]/70 h-full transition-all duration-500"
              style={{ 
                width: currentYearData.totalRevenue > 0 
                  ? `${(currentYearData.projectRevenue / currentYearData.totalRevenue) * 100}%` 
                  : '0%' 
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">Tỷ trọng</span>
            <span className="text-xs font-semibold text-[#4DBFAD]">
              {currentYearData.totalRevenue > 0 
                ? ((currentYearData.projectRevenue / currentYearData.totalRevenue) * 100).toFixed(1) 
                : 0}%
            </span>
          </div>
        </div>

        {/* Hosting Revenue */}
        <div className="bg-white border-2 border-[#2563B4]/30 rounded-lg p-4 sm:p-6 hover:border-[#2563B4] transition-all shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-[#2563B4]/10 rounded-lg">
              <Server className="w-5 h-5 sm:w-6 sm:h-6 text-[#2563B4]" />
            </div>
            {selectedYear !== 'all' && typeof selectedYear === 'number' && (
              <GrowthIndicator value={growthData.hostings} />
            )}
          </div>
          <div className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Doanh Thu Hosting</div>
          <div className="text-xl sm:text-2xl font-bold text-[#2563B4] mb-1">
            {formatCurrency(currentYearData.hostingRevenue)} VNĐ
          </div>
          <div className="text-xs text-gray-500">
            {currentYearData.hostingCount} hosting đang quản lý
          </div>
          {/* Progress bar */}
          <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#2563B4] to-[#2563B4]/70 h-full transition-all duration-500"
              style={{ 
                width: currentYearData.totalRevenue > 0 
                  ? `${(currentYearData.hostingRevenue / currentYearData.totalRevenue) * 100}%` 
                  : '0%' 
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">Tỷ trọng</span>
            <span className="text-xs font-semibold text-[#2563B4]">
              {currentYearData.totalRevenue > 0 
                ? ((currentYearData.hostingRevenue / currentYearData.totalRevenue) * 100).toFixed(1) 
                : 0}%
            </span>
          </div>
        </div>

        {/* Average Revenue */}
        <div className="bg-white border-2 border-purple-600/30 rounded-lg p-4 sm:p-6 hover:border-purple-600 transition-all shadow-sm hover:shadow-md">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-purple-600/10 rounded-lg">
              <Percent className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-xs sm:text-sm font-medium text-gray-600 mb-2">TB Doanh Thu/Đơn</div>
          <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">
            {currentYearData.projectCount + currentYearData.hostingCount > 0
              ? formatCurrency(currentYearData.totalRevenue / (currentYearData.projectCount + currentYearData.hostingCount))
              : '0'} VNĐ
          </div>
          <div className="text-xs text-gray-500">
            Trên {currentYearData.projectCount + currentYearData.hostingCount} đơn
          </div>
          <div className="mt-3 sm:mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">TB/Project:</span>
              <span className="font-semibold text-[#4DBFAD]">
                {currentYearData.projectCount > 0
                  ? formatCurrency(currentYearData.projectRevenue / currentYearData.projectCount)
                  : '0'} VNĐ
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">TB/Hosting:</span>
              <span className="font-semibold text-[#2563B4]">
                {currentYearData.hostingCount > 0
                  ? formatCurrency(currentYearData.hostingRevenue / currentYearData.hostingCount)
                  : '0'} VNĐ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue Breakdown Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] rounded-lg">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Cơ Cấu Doanh Thu</h3>
              <p className="text-xs text-gray-500">Tỷ trọng theo nguồn</p>
            </div>
          </div>

          {currentYearData.totalRevenue > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${formatCurrency(value)} VNĐ`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-3 mt-4">
                {revenueBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs sm:text-sm text-gray-700">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-bold text-gray-900">
                        {formatCurrency(item.value)} VNĐ
                      </div>
                      <div className="text-xs text-gray-500">
                        {((item.value / currentYearData.totalRevenue) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-xs sm:text-sm text-gray-500">Chưa có dữ liệu</p>
            </div>
          )}
        </div>

        {/* Yearly Comparison Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border-2 border-gray-200">
          <div className="px-4 sm:px-6 py-3 sm:py-5 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] rounded-lg">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">So Sánh Theo Năm</h3>
                <p className="text-xs text-gray-500">Doanh thu qua các năm</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {yearlyOverviewData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={yearlyOverviewData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="year" 
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280', fontSize: 11 }}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280', fontSize: 10 }}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip
                    formatter={(value: number) => `${formatCurrency(value)} VNĐ`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '2px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Bar 
                    dataKey="projectRevenue" 
                    fill="#4DBFAD" 
                    name="Projects"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar 
                    dataKey="hostingRevenue" 
                    fill="#2563B4" 
                    name="Hosting"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-xs sm:text-sm text-gray-500">Chưa có dữ liệu</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Trend (Only when a specific year is selected) */}
      {selectedYear !== 'all' && monthlyData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200">
          <div className="px-4 sm:px-6 py-3 sm:py-5 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] rounded-lg">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900">Xu Hướng Tháng - {selectedYear}</h3>
                <p className="text-xs text-gray-500">Doanh thu theo từng tháng</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280', fontSize: 9 }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis 
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280', fontSize: 10 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip
                  formatter={(value: number) => `${formatCurrency(value)} VNĐ`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '11px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Line 
                  type="monotone"
                  dataKey="projectRevenue" 
                  stroke="#4DBFAD"
                  strokeWidth={2}
                  name="Projects"
                  dot={{ fill: '#4DBFAD', r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone"
                  dataKey="hostingRevenue" 
                  stroke="#2563B4"
                  strokeWidth={2}
                  name="Hosting"
                  dot={{ fill: '#2563B4', r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone"
                  dataKey="totalRevenue" 
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Tổng"
                  dot={{ fill: '#10B981', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Monthly Details - Mobile Cards / Desktop Table */}
      {selectedYear !== 'all' && monthlyData.length > 0 && typeof selectedYear === 'number' && (
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200">
          <div className="px-4 sm:px-6 py-3 sm:py-5 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] rounded-lg">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-gray-900">Chi Tiết Tháng - {selectedYear}</h3>
                <p className="text-xs text-gray-500">Click để xem chi tiết</p>
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden p-4 space-y-3">
            {monthlyData.map((data, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-bold text-gray-900">{data.month}</span>
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    {formatCurrency(data.totalRevenue)} VNĐ
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-[#4DBFAD]/10 rounded-lg p-2">
                    <div className="text-xs text-gray-600 mb-1">Projects</div>
                    <div className="text-sm font-bold text-[#4DBFAD]">{formatCurrency(data.projectRevenue)} VNĐ</div>
                    <div className="text-xs text-gray-500">{data.projectCount} đơn</div>
                  </div>
                  <div className="bg-[#2563B4]/10 rounded-lg p-2">
                    <div className="text-xs text-gray-600 mb-1">Hosting</div>
                    <div className="text-sm font-bold text-[#2563B4]">{formatCurrency(data.hostingRevenue)} VNĐ</div>
                    <div className="text-xs text-gray-500">{data.hostingCount} đơn</div>
                  </div>
                </div>

                {(data.projectCount > 0 || data.hostingCount > 0) && (
                  <button
                    onClick={() => setSelectedMonthDetail({ month: data.monthIndex, year: selectedYear })}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Xem Chi Tiết
                  </button>
                )}
              </div>
            ))}

            {/* Total Card */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-200 p-3">
              <div className="text-xs font-semibold text-green-700 uppercase mb-2">Tổng Năm {selectedYear}</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Projects</div>
                  <div className="text-sm font-bold text-[#4DBFAD]">
                    {formatCurrency(monthlyData.reduce((sum, d) => sum + d.projectRevenue, 0))} VNĐ
                  </div>
                  <div className="text-xs text-gray-500">{monthlyData.reduce((sum, d) => sum + d.projectCount, 0)} đơn</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Hosting</div>
                  <div className="text-sm font-bold text-[#2563B4]">
                    {formatCurrency(monthlyData.reduce((sum, d) => sum + d.hostingRevenue, 0))} VNĐ
                  </div>
                  <div className="text-xs text-gray-500">{monthlyData.reduce((sum, d) => sum + d.hostingCount, 0)} đơn</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Tổng Cộng:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(monthlyData.reduce((sum, d) => sum + d.totalRevenue, 0))} VNĐ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tháng</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Projects</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Hosting</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Tổng DT</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monthlyData.map((data, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900 text-sm">{data.month}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-[#4DBFAD]">
                        {formatCurrency(data.projectRevenue)} VNĐ
                      </div>
                      <div className="text-xs text-gray-500">{data.projectCount} projects</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-[#2563B4]">
                        {formatCurrency(data.hostingRevenue)} VNĐ
                      </div>
                      <div className="text-xs text-gray-500">{data.hostingCount} hosting</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-green-600">
                        {formatCurrency(data.totalRevenue)} VNĐ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {(data.projectCount > 0 || data.hostingCount > 0) ? (
                        <button
                          onClick={() => setSelectedMonthDetail({ month: data.monthIndex, year: selectedYear })}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Xem Chi Tiết
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Không có dữ liệu</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-300">
                <tr>
                  <td className="px-6 py-4 font-bold text-gray-900 text-sm">TỔNG NĂM {selectedYear}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-bold text-[#4DBFAD]">
                      {formatCurrency(monthlyData.reduce((sum, d) => sum + d.projectRevenue, 0))} VNĐ
                    </div>
                    <div className="text-xs text-gray-500">
                      {monthlyData.reduce((sum, d) => sum + d.projectCount, 0)} projects
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-bold text-[#2563B4]">
                      {formatCurrency(monthlyData.reduce((sum, d) => sum + d.hostingRevenue, 0))} VNĐ
                    </div>
                    <div className="text-xs text-gray-500">
                      {monthlyData.reduce((sum, d) => sum + d.hostingCount, 0)} hosting
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(monthlyData.reduce((sum, d) => sum + d.totalRevenue, 0))} VNĐ
                    </div>
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Yearly Overview - Mobile Cards / Desktop Table */}
      <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200">
        <div className="px-4 sm:px-6 py-3 sm:py-5 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#4DBFAD] to-[#2563B4] rounded-lg">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Bảng Chi Tiết Theo Năm</h3>
                <p className="text-xs text-gray-500">Thống kê đầy đủ các chỉ số</p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white rounded-lg hover:opacity-90 transition-opacity text-xs sm:text-sm font-medium">
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Xuất Excel
            </button>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden p-4 space-y-3">
          {yearlyOverviewData.map((data, index) => {
            const prevData = yearlyOverviewData[index + 1];
            const growth = prevData && prevData.totalRevenue > 0
              ? ((data.totalRevenue - prevData.totalRevenue) / prevData.totalRevenue) * 100
              : 0;

            return (
              <div key={data.year} className="bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-bold text-gray-900 text-lg">{data.year}</span>
                    {parseInt(data.year) === selectedYear && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white text-xs rounded-full">
                        Đang xem
                      </span>
                    )}
                  </div>
                  {prevData && <GrowthIndicator value={growth} />}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-[#4DBFAD]/10 rounded-lg p-2">
                    <div className="text-xs text-gray-600 mb-1">Projects</div>
                    <div className="text-sm font-bold text-[#4DBFAD]">{formatCurrency(data.projectRevenue)} VNĐ</div>
                    <div className="text-xs text-gray-500">{data.projectCount} đơn</div>
                  </div>
                  <div className="bg-[#2563B4]/10 rounded-lg p-2">
                    <div className="text-xs text-gray-600 mb-1">Hosting</div>
                    <div className="text-sm font-bold text-[#2563B4]">{formatCurrency(data.hostingRevenue)} VNĐ</div>
                    <div className="text-xs text-gray-500">{data.hostingCount} đơn</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div>
                    <div className="text-xs text-gray-600">Tổng Doanh Thu</div>
                    <div className="text-lg font-bold text-green-600">{formatCurrency(data.totalRevenue)} VNĐ</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">TB/Đơn</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {data.projectCount + data.hostingCount > 0
                        ? formatCurrency(data.totalRevenue / (data.projectCount + data.hostingCount))
                        : '0'} VNĐ
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Total Card */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-200 p-3">
            <div className="text-xs font-semibold text-green-700 uppercase mb-2">Tổng Cộng</div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs text-gray-600 mb-1">Projects</div>
                <div className="text-sm font-bold text-[#4DBFAD]">
                  {formatCurrency(yearlyOverviewData.reduce((sum, d) => sum + d.projectRevenue, 0))} VNĐ
                </div>
                <div className="text-xs text-gray-500">{yearlyOverviewData.reduce((sum, d) => sum + d.projectCount, 0)} đơn</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Hosting</div>
                <div className="text-sm font-bold text-[#2563B4]">
                  {formatCurrency(yearlyOverviewData.reduce((sum, d) => sum + d.hostingRevenue, 0))} VNĐ
                </div>
                <div className="text-xs text-gray-500">{yearlyOverviewData.reduce((sum, d) => sum + d.hostingCount, 0)} đơn</div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-green-200">
              <span className="text-sm font-bold text-gray-900">Tổng Doanh Thu:</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(yearlyOverviewData.reduce((sum, d) => sum + d.totalRevenue, 0))} VNĐ
              </span>
            </div>
            <div className="text-center mt-2 text-xs text-gray-600">
              {yearlyOverviewData.length} năm hoạt động
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Năm</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Projects</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Hosting</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Tổng DT</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">TB/Đơn</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Tăng Trưởng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {yearlyOverviewData.map((data, index) => {
                const prevData = yearlyOverviewData[index + 1];
                const growth = prevData && prevData.totalRevenue > 0
                  ? ((data.totalRevenue - prevData.totalRevenue) / prevData.totalRevenue) * 100
                  : 0;

                return (
                  <tr key={data.year} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-bold text-gray-900 text-sm">{data.year}</span>
                        {parseInt(data.year) === selectedYear && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-[#4DBFAD] to-[#2563B4] text-white text-xs rounded-full">
                            Đang xem
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-[#4DBFAD]">
                        {formatCurrency(data.projectRevenue)} VNĐ
                      </div>
                      <div className="text-xs text-gray-500">
                        {data.projectCount} projects
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-[#2563B4]">
                        {formatCurrency(data.hostingRevenue)} VNĐ
                      </div>
                      <div className="text-xs text-gray-500">
                        {data.hostingCount} hosting
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-green-600">
                        {formatCurrency(data.totalRevenue)} VNĐ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {data.projectCount + data.hostingCount > 0
                          ? formatCurrency(data.totalRevenue / (data.projectCount + data.hostingCount))
                          : '0'} VNĐ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {prevData ? (
                        <GrowthIndicator value={growth} />
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-300">
              <tr>
                <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                  TỔNG CỘNG
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm font-bold text-[#4DBFAD]">
                    {formatCurrency(yearlyOverviewData.reduce((sum, d) => sum + d.projectRevenue, 0))} VNĐ
                  </div>
                  <div className="text-xs text-gray-500">
                    {yearlyOverviewData.reduce((sum, d) => sum + d.projectCount, 0)} projects
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm font-bold text-[#2563B4]">
                    {formatCurrency(yearlyOverviewData.reduce((sum, d) => sum + d.hostingRevenue, 0))} VNĐ
                  </div>
                  <div className="text-xs text-gray-500">
                    {yearlyOverviewData.reduce((sum, d) => sum + d.hostingCount, 0)} hosting
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(yearlyOverviewData.reduce((sum, d) => sum + d.totalRevenue, 0))} VNĐ
                  </div>
                </td>
                <td className="px-6 py-4 text-right" colSpan={2}>
                  <div className="text-sm font-semibold text-gray-700">
                    {yearlyOverviewData.length} năm hoạt động
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
