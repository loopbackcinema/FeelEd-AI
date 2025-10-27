// Decouple the Firebase user type to prevent premature module loading issues.
// This local interface defines the shape of the user object our app uses,
// avoiding a direct dependency on the 'firebase/auth' module in files
// that are not lazy-loaded.
export interface FirebaseUser {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
}


export type Theme = 'light' | 'dark';

export interface LessonFormData {
  concept: string;
  grade: string;
  language: string;
  tone: string;
  voice: string;
}

export interface Scene {
  sceneNumber: number;
  narration: string;
  visualDescription: string;
  textOverlay?: string;
  imageUrl?: string;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface Quiz {
  question: string;
  options: QuizOption[];
}


export interface LessonScript {
  title: string;
  story: string;
  scenes: Scene[];
  quiz: Quiz;
  summary: string;
}

export interface GeneratedContent {
  audioUrl: string;
  quiz: Quiz;
  summary: string;
  title: string;
  scenes: Scene[];
  voice: string;
  avatarCustomization?: AvatarCustomization;
}

export interface TranscriptionMessage {
  speaker: 'user' | 'ai';
  text: string;
}

export interface HistoryItem extends GeneratedContent {
  id: number;
  timestamp: number;
  feedback?: 'positive' | 'negative' | null;
}

export type UserRole = 'Student' | 'Teacher' | 'Parent' | null;

export type AvatarStyle = 'robot' | 'blob' | 'alien' | 'photo';

export interface AvatarCustomization {
  style: AvatarStyle;
  color: string;
  hasGlasses: boolean;
  imageUrl?: string;
}

export interface Student {
  id: string;
  name: string;
}

export interface QuizAttempt {
  studentId: string;
  lessonTitle: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface Classroom {
  id: string;
  teacherName: string;
  students: Student[];
  quizAttempts: QuizAttempt[];
}


// Add a declaration for the aistudio object on the window
// FIX: Resolved a TypeScript declaration conflict for 'window.aistudio' by moving the AIStudio interface inside the `declare global` block. This ensures a single, globally-scoped definition.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // FIX: Made `aistudio` optional to resolve declaration conflict as its existence is checked at runtime.
    aistudio?: AIStudio;
    webkitAudioContext: typeof AudioContext;
  }
}