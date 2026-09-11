import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Users, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  // Fetch employees
  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await api.get('/users/employees');
      return response.data;
    },
  });

  const filteredEmployees = employees?.filter((emp: any) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Employee Directory</h1>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Employees Grid */}
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredEmployees && filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee: any) => (
              <div key={employee.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{employee.employeeProfile?.employeeId}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    {employee.email}
                  </div>

                  {employee.employeeProfile?.department && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      {employee.employeeProfile.department.name}
                    </div>
                  )}

                  {employee.employeeProfile?.hireDate && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Hired: {format(new Date(employee.employeeProfile.hireDate), 'MMM dd, yyyy')}
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-200">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      employee.employeeProfile?.employmentStatus === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {employee.employeeProfile?.employmentStatus || 'ACTIVE'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No employees found</p>
          </div>
        )}
      </div>
    </div>
  );
};
