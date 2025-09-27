import React from 'react';
import { Search, Calendar, Eye, Edit2 } from 'lucide-react';

const SettingsDashboardCard = () => {
  return (
    <div 
      className="mx-auto bg-white rounded-lg shadow-lg border border-gray-100"
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
        {/* Settings Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-gray-900">Settings</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-0.5 mb-4">
          <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-white text-gray-900 shadow-sm">
            Admin Details
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-md text-gray-600">
            Edit Program
          </button>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center space-x-3 mb-4 p-3 bg-white rounded-lg border border-gray-200">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-sm font-medium">SC</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">Santhosh</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
          <div className="text-blue-600">
            <Edit2 className="h-4 w-4" />
          </div>
        </div>

        {/* Change Email Address Section */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Change Email Address</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Your current email is
              </label>
              <div className="text-xs text-gray-600">rightmatesedtech572@gmail.com</div>
            </div>
            
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter new email id"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-md">
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Change Password</h3>
          
          <div className="space-y-3">
            {/* Old Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Old password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter old password"
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Eye className="h-3 w-3" />
                </div>
              </div>
            </div>

            {/* New Password and Confirm Password Row */}
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  New password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    readOnly
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Eye className="h-3 w-3" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter confirm password"
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    readOnly
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Eye className="h-3 w-3" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-end">
                <button className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-md">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDashboardCard;