import type { Classroom } from '../types';

export const mockClassroom: Classroom = {
  id: 'class-101',
  teacherName: 'Ms. Davison',
  students: [
    { id: 'student-1', name: 'Alice Johnson' },
    { id: 'student-2', name: 'Bob Williams' },
    { id: 'student-3', name: 'Charlie Brown' },
    { id: 'student-4', name: 'Diana Miller' },
  ],
  quizAttempts: [
    // Alice's attempts
    { studentId: 'student-1', lessonTitle: 'The Water Cycle', question: 'What is condensation?', selectedAnswer: 'Water vapor turning into liquid', correctAnswer: 'Water vapor turning into liquid', isCorrect: true, timestamp: Date.now() - 86400000 * 2 },
    { studentId: 'student-1', lessonTitle: 'Photosynthesis Explained', question: 'What does a plant need for photosynthesis?', selectedAnswer: 'Sunlight, water, and CO2', correctAnswer: 'Sunlight, water, and CO2', isCorrect: true, timestamp: Date.now() - 86400000 },
    { studentId: 'student-1', lessonTitle: 'Basics of Gravity', question: 'Who discovered gravity?', selectedAnswer: 'Albert Einstein', correctAnswer: 'Isaac Newton', isCorrect: false, timestamp: Date.now() - 3600000 },

    // Bob's attempts
    { studentId: 'student-2', lessonTitle: 'The Water Cycle', question: 'What is condensation?', selectedAnswer: 'Water vapor turning into liquid', correctAnswer: 'Water vapor turning into liquid', isCorrect: true, timestamp: Date.now() - 86400000 * 3 },
    { studentId: 'student-2', lessonTitle: 'Photosynthesis Explained', question: 'What does a plant need for photosynthesis?', selectedAnswer: 'Sunlight and water only', correctAnswer: 'Sunlight, water, and CO2', isCorrect: false, timestamp: Date.now() - 86400000 },
    { studentId: 'student-2', lessonTitle: 'Basics of Gravity', question: 'Who discovered gravity?', selectedAnswer: 'Isaac Newton', correctAnswer: 'Isaac Newton', isCorrect: true, timestamp: Date.now() - 7200000 },
    { studentId: 'student-2', lessonTitle: 'The Solar System', question: 'Which planet is closest to the sun?', selectedAnswer: 'Mercury', correctAnswer: 'Mercury', isCorrect: true, timestamp: Date.now() - 3600000 },

    // Charlie's attempts
    { studentId: 'student-3', lessonTitle: 'The Water Cycle', question: 'What is condensation?', selectedAnswer: 'Liquid turning into gas', correctAnswer: 'Water vapor turning into liquid', isCorrect: false, timestamp: Date.now() - 86400000 * 2 },
    { studentId: 'student-3', lessonTitle: 'Photosynthesis Explained', question: 'What does a plant need for photosynthesis?', selectedAnswer: 'Sunlight, water, and CO2', correctAnswer: 'Sunlight, water, and CO2', isCorrect: true, timestamp: Date.now() - 86400000 },

    // Diana has no attempts yet
  ],
};