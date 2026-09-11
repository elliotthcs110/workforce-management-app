import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { BarChart3, Users, Clock, Calendar, FileText } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  // Fetch dashboard data
  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const [timesheets, employees, activeClocks] = await Promise.all([
        api.get('/timesheets?status=SUBMITTED'),
        api.get('/users/employees'),
        api.get('/clock-logs/active/all'),
      ]);
      return {
        pendingTimesheets: timesheets.data.length,
        totalEmployees: employees.data.length,
        currentlyOnShift: activeClocks.data.length,
      };
    },
  });

  const isManager = ['ADMIN', 'MANAGER', 'SUPERVISOR'].includes(user?.role || '');

  const statCards = [
    {
      title: 'Currently On Shift',
      value: stats?.currentlyOnShift || 0,
      icon: Clock,
      color: 'bg-green-100 text-green-600',
      visible: isManager,
    },
    {
      title: 'Total Employees',
      value: stats?.totalEmployees || 0,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      visible: isManager,
    },
    {
      title: 'Pending Timesheets',
      value: stats?.pendingTimesheets || 0,
      icon: FileText,
      color: 'bg-yellow-100 text-yellow-600',
      visible: isManager,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">Here's your workforce management dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return card.visible ? (
              <div key={card.title} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${card.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                </div>
              </div>
            ) : null;
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a
              href="/clock"
              className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-lg transition-shadow border-2 border-green-200"
            >
              <Clock className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Clock In/Out</h3>
              <p className="text-sm text-gray-600">Start or end your shift</p>
            </a>

            <a
              href="/timesheets"
              className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-lg transition-shadow border-2 border-blue-200"
            >
              <FileText className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Timesheets</h3>
              <p className="text-sm text-gray-600">View and manage timesheets</p>
            </a>

            <a
              href="/schedule"
              className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-lg transition-shadow border-2 border-purple-200"
            >
              <Calendar className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Schedule</h3>
              <p className="text-sm text-gray-600">View your schedule</p>
            </a>

            <a
              href="/employees"
              className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg hover:shadow-lg transition-shadow border-2 border-yellow-200"
            >
              <Users className="w-8 h-8 text-yellow-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Employees</h3>
              <p className="text-sm text-gray-600">View employee directory</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
