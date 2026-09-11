import React from 'react';
import { Calendar } from 'lucide-react';

export const Schedule: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Schedule</h1>

        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Schedule viewer coming soon</p>
          <p className="text-sm text-gray-500">This feature will display your personal and team schedules</p>
        </div>
      </div>
    </div>
  );
};
