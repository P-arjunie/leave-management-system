import React, { useState, useEffect } from 'react';
import { Users, Calendar, CheckCircle, XCircle, Clock, TrendingUp, UserCheck, AlertCircle } from 'lucide-react';
import { apiCall } from '../../services/api';

export const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [selectedTab, setSelectedTab] = useState('leaves');
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0
  });

  useEffect(() => {
    if (selectedTab === 'employees') {
      fetchEmployees();
    } else {
      fetchLeaves();
    }
  }, [selectedTab]);

  useEffect(() => {
    // Calculate stats when leaves data changes
    if (leaves.length > 0) {
      setStats({
        totalEmployees: employees.length,
        pendingLeaves: leaves.filter(l => l.status === 'pending').length,
        approvedLeaves: leaves.filter(l => l.status === 'approved').length,
        rejectedLeaves: leaves.filter(l => l.status === 'rejected').length
      });
    }
  }, [leaves, employees]);

  const fetchEmployees = async () => {
    try {
      console.log('Fetching employees...');
      console.log('Current token:', localStorage.getItem('token'));
      const response = await apiCall('get', '/admin/employees');
      console.log('Employees response:', response);
      
      if (response.data.employees) {
        console.log('Setting employees:', response.data.employees);
        setEmployees(response.data.employees);
      } else {
        console.error('Invalid response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', {
        error,
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
    }
  };

  const fetchLeaves = async () => {
    try {
      const response = await apiCall('get', '/leaves');
      setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };

  const handleLeaveAction = async (leaveId, status) => {
    console.log('Leave action initiated:', { leaveId, status });
    try {
      const response = await apiCall('put', `/leaves/${leaveId}`, { status });
      
      console.log('Leave action response:', response);
      
      if (response.data.leave) {
        console.log('Updating leaves list with new leave data:', response.data.leave);
        // Update the leaves list with the updated leave
        setLeaves(prevLeaves => 
          prevLeaves.map(leave => 
            leave.id === leaveId ? response.data.leave : leave
          )
        );
      } else {
        console.log('Response missing leave data, fetching all leaves');
        // If the response doesn't contain the updated leave, fetch all leaves
        fetchLeaves();
      }
    } catch (error) {
      console.error('Error updating leave status:', {
        error,
        leaveId,
        status,
        message: error.message
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-emerald-500';
      case 'rejected':
        return 'text-rose-500';
      default:
        return 'text-amber-500';
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-emerald-100 text-emerald-800 border border-emerald-200`;
      case 'rejected':
        return `${baseClasses} bg-rose-100 text-rose-800 border border-rose-200`;
      default:
        return `${baseClasses} bg-amber-100 text-amber-800 border border-amber-200`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-lg border border-opacity-20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage your team and leave requests</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setSelectedTab('leaves')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              selectedTab === 'leaves'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600'
            }`}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Leave Requests
          </button>
          <button
            onClick={() => setSelectedTab('employees')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
              selectedTab === 'employees'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600'
            }`}
          >
            <Users className="h-5 w-5 mr-2" />
            Employees
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          color="text-blue-600"
          bgColor="bg-white"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingLeaves}
          icon={Clock}
          color="text-amber-600"
          bgColor="bg-white"
        />
        <StatCard
          title="Approved Leaves"
          value={stats.approvedLeaves}
          icon={CheckCircle}
          color="text-emerald-600"
          bgColor="bg-white"
        />
        <StatCard
          title="Rejected Requests"
          value={stats.rejectedLeaves}
          icon={XCircle}
          color="text-rose-600"
          bgColor="bg-white"
        />
      </div>

      {/* Main Content */}
      {selectedTab === 'employees' ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
              Employee Directory
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {employees.map((employee, index) => (
                  <tr key={employee.id} className={`transition-colors duration-200 hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                          {employee.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">{employee.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                        {employee.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Leave Requests Management
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {leaves.map((leave, index) => (
                  <tr key={leave.id} className={`transition-colors duration-200 hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                          {leave.user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">{leave.user?.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200">
                        {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      <div className="truncate" title={leave.reason}>
                        {leave.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(leave.status)}>
                        {getStatusIcon(leave.status)}
                        <span className="ml-2">
                          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {leave.status === 'pending' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleLeaveAction(leave.id, 'approved')}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleLeaveAction(leave.id, 'rejected')}
                            className="bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">No actions available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};