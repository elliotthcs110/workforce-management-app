import React from 'react';
import { useAuthStore } from '../store/auth';
import api from '../lib/api';
import { useQuery } from '@tanstack/react-query';
import { Clock, ClockOff, ArrowRightLeft } from 'lucide-react';
import { useState } from 'react';

interface ClockStatus {
  status: 'CLOCKED_IN' | 'CLOCKED_OUT';
  clockLog?: any;
  elapsedMinutes?: number;
}

export const ClockInOutPage: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [transferMode, setTransferMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch current status
  const { data: status, refetch: refetchStatus } = useQuery<ClockStatus>({
    queryKey: ['clockStatus'],
    queryFn: async () => {
      const response = await api.get('/clock-logs/status/current');
      return response.data;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Fetch departments and teams
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await api.get('/departments');
      return response.data;
    },
  });

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await api.get('/teams');
      return response.data;
    },
  });

  const handleClockIn = async () => {
    if (!selectedDepartment) {
      alert('Please select a department');
      return;
    }

    try {
      setLoading(true);
      await api.post('/clock-logs/in', {
        departmentId: selectedDepartment,
        teamId: selectedTeam || undefined,
      });
      refetchStatus();
    } catch (error) {
      alert('Failed to clock in');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      await api.post('/clock-logs/out', {});
      refetchStatus();
    } catch (error) {
      alert('Failed to clock out');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedDepartment) {
      alert('Please select a new department');
      return;
    }

    try {
      setLoading(true);
      await api.post('/clock-logs/transfer', {
        newDepartmentId: selectedDepartment,
        newTeamId: selectedTeam || undefined,
      });
      refetchStatus();
      setTransferMode(false);
    } catch (error) {
      alert('Failed to transfer');
    } finally {
      setLoading(false);
    }
  };

  const formatElapsedTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Clock In/Out</h1>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            {status?.status === 'CLOCKED_IN' ? (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <Clock className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Clocked In</h2>
                <p className="text-gray-600 mb-4">
                  Department: {status?.clockLog?.department?.name}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {status?.elapsedMinutes && formatElapsedTime(status.elapsedMinutes)}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Clocked in at {status?.clockLog?.clockInTime && new Date(status.clockLog.clockInTime).toLocaleTimeString()}
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <ClockOff className="w-10 h-10 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-600 mb-2">Clocked Out</h2>
                <p className="text-gray-600">You are not currently clocked in</p>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        {!transferMode ? (
          <div className="space-y-4">
            {status?.status === 'CLOCKED_OUT' ? (
              <>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Clock In</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select Department</option>
                        {departments?.map((dept: any) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team (Optional)
                      </label>
                      <select
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select Team</option>
                        {teams?.map((team: any) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleClockIn}
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Clock className="w-5 h-5" />
                      Clock In
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={handleClockOut}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  <ClockOff className="w-6 h-6" />
                  Clock Out
                </button>

                <button
                  onClick={() => setTransferMode(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  <ArrowRightLeft className="w-6 h-6" />
                  Transfer to Different Job
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Transfer to Different Job</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  {departments?.map((dept: any) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Team (Optional)
                </label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Team</option>
                  {teams?.map((team: any) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setTransferMode(false)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
