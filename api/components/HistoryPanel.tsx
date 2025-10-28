import React, { useState, useMemo } from 'react';
import type { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  isVisible: boolean;
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: number) => void;
  onClear: () => void;
  isAuthenticated: boolean;
}

const FilterButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors w-full ${
            active
                ? 'bg-teal-500 text-white shadow-sm'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
    >
        {label}
    </button>
);


export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, isVisible, onClose, onSelect, onDelete, onClear, isAuthenticated }) => {
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const filteredHistory = useMemo(() => {
    if (filter === 'all') {
      return history;
    }
    const now = new Date();
    switch (filter) {
        case 'today':
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            return history.filter(item => item.timestamp >= todayStart.getTime());
        case 'week':
            const weekStart = new Date();
            // Assuming Sunday is the start of the week (getDay() returns 0 for Sunday)
            weekStart.setDate(now.getDate() - now.getDay());
            weekStart.setHours(0, 0, 0, 0);
            return history.filter(item => item.timestamp >= weekStart.getTime());
        case 'month':
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            return history.filter(item => item.timestamp >= monthStart.getTime());
        default:
            return history;
    }
  }, [history, filter]);


  const renderContent = () => {
     if (!isAuthenticated) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <p className="text-gray-600 dark:text-gray-400 font-semibold">Login to Save Your History</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Create an account to save and review your lessons anytime.</p>
              </div>
        );
     }
     if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-gray-600 dark:text-gray-400">No lessons generated yet.</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Your created lessons will appear here.</p>
            </div>
        );
     }
     if (filteredHistory.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <p className="text-gray-600 dark:text-gray-400 font-semibold">No Lessons Found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Try selecting a different time period.</p>
            </div>
        );
     }
     return (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredHistory.map(item => (
            <li key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 truncate pr-2">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
                <button onClick={() => onDelete(item.id)} aria-label="Delete item" className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                </button>
              </div>
              <button 
                onClick={() => onSelect(item)}
                className="mt-3 w-full px-3 py-1.5 text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800"
              >
                View Lesson
              </button>
            </li>
          ))}
        </ul>
     );
  };


  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-30 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Lesson History</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isAuthenticated && history.length > 0 && (
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
                <FilterButton label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
                <FilterButton label="Today" active={filter === 'today'} onClick={() => setFilter('today')} />
                <FilterButton label="This Week" active={filter === 'week'} onClick={() => setFilter('week')} />
                <FilterButton label="This Month" active={filter === 'month'} onClick={() => setFilter('month')} />
            </div>
          </div>
        )}

        <div className="flex-grow overflow-y-auto">
          {renderContent()}
        </div>

        {isAuthenticated && history.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                    onClick={onClear}
                    className="w-full px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                >
                    Clear All History
                </button>
            </div>
        )}
      </div>
    </>
  );
};
