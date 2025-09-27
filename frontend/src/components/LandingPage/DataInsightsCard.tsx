import React from 'react';
import { Search, Calendar, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

const AnalyticsDashboardCard = () => {
  return (
    <div 
      className="mx-auto bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
      style={{
        width: '500px',
        height: '355.83px',
        background: '#EBEEFF'
      }}
    >
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-xs">TC</span>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
              <input
                type="text"
                placeholder="Search here"
                className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent w-32"
                readOnly
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div>
                <div className="text-xs font-medium text-gray-900">Subhash Chotti</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 overflow-hidden">
        {/* Analytics Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-gray-900">Analytics</h1>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-0.5">
            <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-white text-gray-900 shadow-sm">
              Weekly
            </button>
            <button className="px-3 py-1.5 text-xs font-medium rounded-md text-gray-600">
              Monthly
            </button>
            <button className="px-3 py-1.5 text-xs font-medium rounded-md text-gray-600">
              Yearly
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-600 mb-1">Total Program Views</h3>
            <div className="text-xl font-bold text-gray-900">420</div>
            <div className="text-xs text-blue-600 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from previous week
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-600 mb-1">Course Views</h3>
            <div className="text-xl font-bold text-gray-900">340</div>
            <div className="text-xs text-green-600 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% from previous week
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-600 mb-1">Leads Generated</h3>
            <div className="text-xl font-bold text-gray-900">270</div>
            <div className="text-xs text-red-600 mt-1 flex items-center">
              <TrendingDown className="h-3 w-3 mr-1" />
              -3.1% from previous week
            </div>
          </div>
        </div>

        {/* Program Performance Table */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Program Performance</h2>
          </div>

          {/* Table Header */}
          <div className="bg-gray-50 rounded-t-lg px-3 py-2 border border-gray-200">
            <div className="grid grid-cols-6 gap-2 text-xs font-medium text-gray-600">
              <div>S.No</div>
              <div>Program Name</div>
              <div>Status</div>
              <div>Views</div>
              <div>Leads</div>
              <div>Action</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="border-x border-b border-gray-200 rounded-b-lg bg-white overflow-hidden">
            {/* Row 1 */}
            <div className="grid grid-cols-6 gap-2 px-3 py-2 border-b border-gray-100">
              <div className="text-xs text-gray-600">A</div>
              <div className="text-xs font-medium text-gray-900 truncate">Computer Science</div>
              <div>
                <span className="inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Live
                </span>
              </div>
              <div className="text-xs text-gray-600">Low</div>
              <div className="text-xs text-gray-900 font-medium">45</div>
              <div>
                <ExternalLink className="h-3 w-3 text-blue-600" />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-6 gap-2 px-3 py-2 border-b border-gray-100">
              <div className="text-xs text-gray-600">B</div>
              <div className="text-xs font-medium text-gray-900 truncate">Business Admin</div>
              <div>
                <span className="inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Live
                </span>
              </div>
              <div className="text-xs text-gray-600">High</div>
              <div className="text-xs text-gray-900 font-medium">78</div>
              <div>
                <ExternalLink className="h-3 w-3 text-blue-600" />
              </div>
            </div>
            
            {/* Add Course Button */}
            <div className="px-3 py-2 text-center border-t border-gray-100">
              <span className="text-blue-600 text-xs font-medium">+ Add Course</span>
            </div>
          </div>
        </div>

        {/* View & Lead Trends Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">View & Lead Trends</h3>
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Views</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span className="text-gray-600">Leads</span>
              </div>
            </div>
          </div>

          {/* Compact Chart */}
          <div className="h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 400 64">
              <defs>
                <linearGradient id="viewsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* Views Area Fill */}
              <path
                d="M 20 45 Q 80 30, 120 35 T 200 25 T 280 30 T 360 20 L 360 55 L 20 55 Z"
                fill="url(#viewsGradient)"
              />
              
              {/* Views Line (Blue) */}
              <path
                d="M 20 45 Q 80 30, 120 35 T 200 25 T 280 30 T 360 20"
                stroke="#3b82f6"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />

              {/* Leads Line (Light Blue, Dashed) */}
              <path
                d="M 20 50 Q 80 40, 120 42 T 200 35 T 280 38 T 360 30"
                stroke="#93c5fd"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="3,3"
              />
              
              {/* Month labels */}
              {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((month, index) => (
                <text
                  key={month}
                  x={20 + index * 56}
                  y={60}
                  fontSize="8"
                  fill="#9ca3af"
                  textAnchor="middle"
                >
                  {month}
                </text>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardCard;