import React from 'react';
import { Search, Calendar, MoreVertical, Phone, Mail, MapPin } from 'lucide-react';

const StaticLeadsManagementCard = () => {
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
      <div className="p-4">
        {/* Leads Management Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-gray-900">Leads Management</h1>
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
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-600 mb-1">Profile Views</h3>
            <div className="text-xl font-bold text-gray-900">420</div>
            <div className="text-xs text-blue-600 mt-1">+12.5% from previous week</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-600 mb-1">Callback Leads</h3>
            <div className="text-xl font-bold text-gray-900">340</div>
            <div className="text-xs text-green-600 mt-1">+8.2% from previous week</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-600 mb-1">Demo Request Leads</h3>
            <div className="text-xl font-bold text-gray-900">270</div>
            <div className="text-xs text-red-600 mt-1">-3.1% from previous week</div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-3 gap-4">
          {/* Leads List */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Lead List</h2>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span>Received 500 leads in total</span>
                <div className="flex space-x-1">
                  <button className="px-1.5 py-0.5 text-xs text-blue-600">Weekly</button>
                  <button className="px-1.5 py-0.5 text-xs text-gray-600">Monthly</button>
                  <button className="px-1.5 py-0.5 text-xs text-gray-600">Yearly</button>
                </div>
              </div>
            </div>

            {/* Table Header */}
            <div className="bg-gray-50 rounded-t-lg px-3 py-2 border border-gray-200">
              <div className="grid grid-cols-4 gap-3 text-xs font-medium text-gray-600">
                <div>Date</div>
                <div>Student Name</div>
                <div>Status</div>
                <div></div>
              </div>
            </div>

            {/* Table Body */}
            <div className="border-x border-b border-gray-200 rounded-b-lg bg-white overflow-hidden">
              {/* Row 1 */}
              <div className="grid grid-cols-4 gap-3 px-3 py-1.5 border-b border-gray-100 bg-blue-50">
                <div className="text-xs text-gray-600">5/31/2024</div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-medium">JS</span>
                  </div>
                  <span className="text-xs font-medium text-gray-900 truncate">John Smith</span>
                </div>
                <div>
                  <span className="inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                    Requested call back
                  </span>
                </div>
                <div className="flex justify-end">
                  <MoreVertical className="h-3 w-3 text-gray-400" />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-4 gap-3 px-3 py-1.5 border-b border-gray-100">
                <div className="text-xs text-gray-600">5/30/2024</div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-medium">AJ</span>
                  </div>
                  <span className="text-xs font-medium text-gray-900 truncate">Alice Johnson</span>
                </div>
                <div>
                  <span className="inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Requested demo
                  </span>
                </div>
                <div className="flex justify-end">
                  <MoreVertical className="h-3 w-3 text-gray-400" />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-4 gap-3 px-3 py-1.5 border-b border-gray-100">
                <div className="text-xs text-gray-600">5/29/2024</div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-medium">MW</span>
                  </div>
                  <span className="text-xs font-medium text-gray-900 truncate">Mike Wilson</span>
                </div>
                <div>
                  <span className="inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                    Requested call back
                  </span>
                </div>
                <div className="flex justify-end">
                  <MoreVertical className="h-3 w-3 text-gray-400" />
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-4 gap-3 px-3 py-1.5">
                <div className="text-xs text-gray-600">5/28/2024</div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-medium">SD</span>
                  </div>
                  <span className="text-xs font-medium text-gray-900 truncate">Sarah Davis</span>
                </div>
                <div>
                  <span className="inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Requested demo
                  </span>
                </div>
                <div className="flex justify-end">
                  <MoreVertical className="h-3 w-3 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details Panel */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer details</h3>
            <div className="text-xs text-gray-600 mb-4">Click on customer to see customer</div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 text-sm font-medium">SC</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Santhosh</h4>
                <p className="text-xs text-gray-600">Lead from search</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <Mail className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">santhosh@gmail.com</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">+91 9876543210</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-600">Hyderabad, Telangana</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg text-xs font-medium">
                Request for call back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticLeadsManagementCard;