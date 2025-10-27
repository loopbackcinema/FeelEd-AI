import React from 'react';
import type { Student, QuizAttempt } from '../types';

interface StudentProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  attempts: QuizAttempt[];
}

export const StudentProgressModal: React.FC<StudentProgressModalProps> = ({ isOpen, onClose, student, attempts }) => {
  if (!isOpen || !student) return null;

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter(a => a.isCorrect).length;
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
  
  const getAccuracyColor = (acc: number) => {
    if (acc >= 80) return 'text-green-500';
    if (acc >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity animate-fade-in" 
        aria-modal="true" 
        role="dialog"
        aria-labelledby="progress-modal-title"
        onClick={onClose}
    >
      <div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl transform transition-all scale-95 opacity-0 animate-fade-in-scale max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="progress-modal-title" className="text-2xl font-bold text-gray-800 dark:text-white">{student.name}'s Progress</h2>
          <p className="text-gray-500 dark:text-gray-400">A detailed report of all quiz attempts.</p>
        </div>

        {/* Body */}
        <div className="p-6 flex-grow overflow-y-auto">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Attempts</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{totalAttempts}</p>
                </div>
                 <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Correct Answers</p>
                    <p className="text-3xl font-bold text-green-500 mt-1">{correctAttempts}</p>
                </div>
                 <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg text-center">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Accuracy</p>
                    <p className={`text-3xl font-bold mt-1 ${getAccuracyColor(accuracy)}`}>{accuracy}%</p>
                </div>
            </div>

            <h3 id="attempt-history-heading" className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">Attempt History</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
                <table aria-labelledby="attempt-history-heading" className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Lesson</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Your Answer</th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Result</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {attempts.length > 0 ? attempts.map((attempt, index) => (
                             <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-4 py-4 whitespace-normal">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{attempt.lessonTitle}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">Q: {attempt.question}</p>
                                </td>
                                <td className="px-4 py-4 whitespace-normal text-sm text-gray-600 dark:text-gray-300">{attempt.selectedAnswer}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                    {attempt.isCorrect ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                            Correct
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                            <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                            Incorrect
                                        </span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                             <tr>
                                <td colSpan={3} className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                                    No quiz attempts recorded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600 text-right">
            <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
                aria-label="Close student progress modal"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};