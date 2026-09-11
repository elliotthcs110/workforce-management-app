import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export const Timesheets: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fetch timesheets
  const { data: timesheets, isLoading } = useQuery({
    queryKey: ['timesheets', selectedStatus],
    queryFn: async () => {
      const response = await api.get('/timesheets/user/my-timesheets', {
        params: selectedStatus !== 'ALL' ? { status: selectedStatus } : {},
      });
      return response.data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5" />;
      case 'SUBMITTED':
        return <Clock className="w-5 h-5" />;
      case 'REJECTED':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Timesheets</h1>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-2 flex-wrap">
          {['ALL', 'DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Timesheets List */}
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : timesheets && timesheets.length > 0 ? (
          <div className="space-y-4">
            {timesheets.map((timesheet: any) => (
              <div key={timesheet.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === timesheet.id ? null : timesheet.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <FileText className="w-8 h-8 text-primary-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Week of {format(new Date(timesheet.weekStartDate), 'MMM dd, yyyy')}
                        </h3>
                        <p className="text-gray-600">
                          {timesheet.entries.length} entries • {timesheet.totalHours} hours
                        </p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-medium flex items-center gap-2 ${getStatusColor(timesheet.status)}`}>
                      {getStatusIcon(timesheet.status)}
                      {timesheet.status}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === timesheet.id && (
                  <div className="px-6 pb-6 border-t border-gray-200">
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Entries</h4>
                      <div className="space-y-2">
                        {timesheet.entries.map((entry: any) => (
                          <div key={entry.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium text-gray-900">
                                {format(new Date(entry.date), 'MMM dd')}
                              </p>
                              <p className="text-sm text-gray-600">
                                {format(new Date(entry.startTime), 'h:mm a')} - {format(new Date(entry.endTime), 'h:mm a')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{entry.hours}h</p>
                              <p className="text-sm text-gray-600">{entry.category}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No timesheets found</p>
          </div>
        )}
      </div>
    </div>
  );
};
