

// FIX: Removed duplicated code from index.tsx to resolve multiple import conflicts.
import React, { useState, useEffect, useCallback } from 'react';
import { LessonForm } from './components/LessonForm';
import { Header } from './components/Header';
import { ApiKeySelector } from './components/ApiKeySelector';
import { LoadingDisplay } from './components/LoadingDisplay';
import { ResultsDisplay } from './components/ResultsDisplay';
import { SharedLessonDisplay } from './components/SharedLessonDisplay';
import { LiveChat } from './components/LiveChat';
import { HistoryPanel } from './components/HistoryPanel';
import { AboutPage } from './components/AboutPage';
import { Footer } from './components/Footer';
import { StudentProfile } from './components/StudentProfile';
import { TeacherProfile } from './components/TeacherProfile';
import { ParentProfile } from './components/ParentProfile';
import { Notification } from './components/Notification';
import { AuthModal } from './components/AuthModal';
import { generateLessonScript, generateLessonAudio } from './services/geminiService';
import type { LessonFormData, GeneratedContent, HistoryItem, AvatarCustomization } from './types';
import { useAuth } from './contexts/AuthContext';
import useInactivityTimer from './hooks/useInactivityTimer';

const HISTORY_STORAGE_KEY_PREFIX = 'feeled_lesson_history_';
const API_KEY_STORAGE_KEY = 'feeled_api_key_selected';
const LESSON_COUNT_STORAGE_KEY = 'feeled_lesson_count';
const AVATAR_CUSTOMIZATION_KEY = 'feeled_avatar_customization';
const GENERATION_SESSION_KEY = 'feeled_generation_session';
const FREE_LESSON_LIMIT = 5;
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Defined here because it's only used by App.tsx
const UpgradeModal: React.FC<{ isVisible: boolean, onClose: () => void }> = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    const plans = [
        { role: 'Student', price: 99, features: ['Unlimited Lessons', 'Access to All Voices', 'Save History'] },
        { role: 'Teacher', price: 199, features: ['All Student Features', 'Create Classrooms', 'Track Student Progress'] },
        { role: 'Parent', price: 299, features: ['All Student Features', 'Monitor Child\'s Activity', 'Family Plan Discounts'] },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity p-4" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 max-w-4xl w-full transform transition-all scale-95 opacity-0 animate-fade-in-scale">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Unlock Your Full Potential</h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">You've used all your free lessons. Upgrade to continue learning without limits.</p>
                </div>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div key={plan.role} className={`relative rounded-xl border p-6 flex flex-col ${index === 1 ? 'border-teal-500 ring-2 ring-teal-500' : 'border-gray-200 dark:border-gray-700'}`}>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plan.role} Plan</h3>
                            {index === 1 && <span className="absolute top-0 right-6 -translate-y-1/2 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>}
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-bold">₹{plan.price}</span>
                                <span className="ml-1 text-lg text-gray-500 dark:text-gray-400">/ month</span>
                            </div>
                            <ul className="mt-6 space-y-3 text-gray-600 dark:text-gray-300 flex-grow">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className={`mt-8 w-full py-3 px-6 rounded-lg font-semibold transition-colors ${index === 1 ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                Choose Plan
                            </button>
                        </div>
                    ))}
                </div>
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );
};


export default function App() {
  const { user, userRole, loading: authLoading } = useAuth();
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [generatedContent, setGeneratedContent] = useState<HistoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastFormData, setLastFormData] = useState<LessonFormData | null>(null);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [lessonHistory, setLessonHistory] = useState<HistoryItem[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  // Freemium model state (for guests)
  const [lessonCount, setLessonCount] = useState(0);
  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Simple routing and shared lessons state
  const [currentPage, setCurrentPage] = useState<'main' | 'about' | 'profile'>('main');
  const [sharedLessonContent, setSharedLessonContent] = useState<GeneratedContent | null>(null);
  const [isCheckingUrl, setIsCheckingUrl] = useState(true);

  // Avatar customization state
  const [avatarCustomization, setAvatarCustomization] = useState<AvatarCustomization>({
    style: 'robot',
    color: '#4fd1c5', // Default Teal
    hasGlasses: false,
    imageUrl: undefined,
  });

  const showNotification = (message: string, type: 'success' | 'info' | 'error') => {
    setNotification({ message, type });
  };
  
  const handleInactive = useCallback(() => {
    if (!user && lessonCount > 0) {
      setLessonCount(0);
      sessionStorage.removeItem(LESSON_COUNT_STORAGE_KEY);
      showNotification('Session reset. Your free lessons are restored.', 'info');
    }
  }, [user, lessonCount]);

  useInactivityTimer(handleInactive, INACTIVITY_TIMEOUT);

  const handleGenerate = async (formData: LessonFormData) => {
    setLastFormData(formData); // Store for potential retry
    if (!user && lessonCount >= FREE_LESSON_LIMIT) {
      setIsUpgradeModalVisible(true);
      return;
    }

    localStorage.setItem(GENERATION_SESSION_KEY, JSON.stringify({ formData }));

    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      setLoadingMessage('Phase 1/2: Crafting the lesson script...');
      const script = await generateLessonScript(formData);
      
      if (!script || !script.scenes || script.scenes.length === 0) {
        throw new Error("Failed to generate a valid lesson script.");
      }

      setLoadingMessage('Phase 2/2: Generating audio lesson...');
      const audioUrl = await generateLessonAudio(script, formData.voice);

      const newContent: HistoryItem = {
        id: Date.now(),
        timestamp: Date.now(),
        audioUrl,
        quiz: script.quiz,
        summary: script.summary,
        title: script.title,
        scenes: script.scenes,
        voice: formData.voice,
        avatarCustomization: avatarCustomization,
        feedback: null,
      };

      setGeneratedContent(newContent);
      showNotification('Lesson ready! Email notification sent.', 'success');
      
      if (user) {
        setLessonHistory(prevHistory => {
          const updatedHistory = [newContent, ...prevHistory];
          localStorage.setItem(`${HISTORY_STORAGE_KEY_PREFIX}${user.uid}`, JSON.stringify(updatedHistory));
          return updatedHistory;
        });
      } else {
         const newCount = lessonCount + 1;
         setLessonCount(newCount);
         sessionStorage.setItem(LESSON_COUNT_STORAGE_KEY, newCount.toString());
         if (newCount === FREE_LESSON_LIMIT - 1) {
            showNotification('You have 1 free lesson remaining.', 'info');
         }
      }


    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || 'An unknown error occurred.';
      // The backend provides user-friendly messages. We check for 'api key' to handle UI state reset.
      if (errorMessage.toLowerCase().includes('api key')) {
        setError(errorMessage); // Use the direct message which prompts for a new key
        localStorage.removeItem(API_KEY_STORAGE_KEY);
        setApiKeySelected(false);
      } else {
        setError(`Generation failed: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
      localStorage.removeItem(GENERATION_SESSION_KEY);
    }
  };


  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const lessonData = urlParams.get('lesson');
        if (lessonData) {
            const decodedJson = decodeURIComponent(escape(atob(lessonData)));
            const lessonContent = JSON.parse(decodedJson) as GeneratedContent;
            
            if (lessonContent && lessonContent.title && lessonContent.scenes) {
                setSharedLessonContent(lessonContent);
            }
        }
    } catch (e) {
        console.error("Failed to parse shared lesson from URL", e);
    } finally {
        setIsCheckingUrl(false);
        if (window.history.replaceState) {
            const cleanUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
            window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
        }
    }
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    try {
      if (user) {
        const savedHistory = localStorage.getItem(`${HISTORY_STORAGE_KEY_PREFIX}${user.uid}`);
        if (savedHistory) setLessonHistory(JSON.parse(savedHistory));
        else setLessonHistory([]);
      } else {
        setLessonHistory([]);
        const savedCount = sessionStorage.getItem(LESSON_COUNT_STORAGE_KEY);
        setLessonCount(savedCount ? parseInt(savedCount, 10) : 0);
      }

      const keyStored = localStorage.getItem(API_KEY_STORAGE_KEY) === 'true';
      setApiKeySelected(keyStored);
      
      const savedCustomization = localStorage.getItem(AVATAR_CUSTOMIZATION_KEY);
      if (savedCustomization) {
        const parsed = JSON.parse(savedCustomization);
        if (parsed.style && parsed.color && typeof parsed.hasGlasses === 'boolean') {
          setAvatarCustomization(parsed);
        }
      }

      const savedSession = localStorage.getItem(GENERATION_SESSION_KEY);
      if (savedSession) {
          const { formData } = JSON.parse(savedSession) as { formData: LessonFormData };
          if (formData?.concept) {
              setTimeout(() => handleGenerate(formData), 0);
          } else {
              localStorage.removeItem(GENERATION_SESSION_KEY);
          }
      }
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
      localStorage.removeItem(GENERATION_SESSION_KEY);
    }
  }, [user, authLoading]);

  const handleImageGenerated = (lessonId: number, sceneNumber: number, imageUrl: string) => {
    const updateScenes = (scenes: any[]) => scenes.map(scene =>
        scene.sceneNumber === sceneNumber ? { ...scene, imageUrl } : scene
    );

    setGeneratedContent(prevContent => {
        if (!prevContent || prevContent.id !== lessonId) return prevContent;
        return { ...prevContent, scenes: updateScenes(prevContent.scenes) };
    });

    setLessonHistory(prevHistory => {
        const updatedHistory = prevHistory.map(item => {
            if (item.id === lessonId) {
                return { ...item, scenes: updateScenes(item.scenes) };
            }
            return item;
        });
        if (user) {
            localStorage.setItem(`${HISTORY_STORAGE_KEY_PREFIX}${user.uid}`, JSON.stringify(updatedHistory));
        }
        return updatedHistory;
    });
  };

  const handleFeedbackSubmit = (lessonId: number, feedback: 'positive' | 'negative') => {
    if (!user) return;

    const updateHistory = (prevHistory: HistoryItem[]) =>
        prevHistory.map(item =>
            item.id === lessonId ? { ...item, feedback } : item
        );
    
    setLessonHistory(prevHistory => {
        const updated = updateHistory(prevHistory);
        localStorage.setItem(`${HISTORY_STORAGE_KEY_PREFIX}${user.uid}`, JSON.stringify(updated));
        return updated;
    });

    setGeneratedContent(prevContent => {
      if (prevContent && prevContent.id === lessonId) {
        return { ...prevContent, feedback };
      }
      return prevContent;
    });
    
    showNotification('Thank you for your feedback!', 'info');
  };


  const handleSelectHistoryItem = (item: HistoryItem) => {
    setGeneratedContent(item);
    setIsHistoryVisible(false);
    setError(null);
    setCurrentPage('main');
  };

  const handleDeleteHistoryItem = (id: number) => {
    if (!user) return;
    setLessonHistory(prev => {
      const updatedHistory = prev.filter(item => item.id !== id);
      localStorage.setItem(`${HISTORY_STORAGE_KEY_PREFIX}${user.uid}`, JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const handleClearHistory = () => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete all lesson history? This cannot be undone.")) {
      setLessonHistory([]);
      localStorage.removeItem(`${HISTORY_STORAGE_KEY_PREFIX}${user.uid}`);
    }
  };
  
  const handleKeySelected = () => {
    localStorage.setItem(API_KEY_STORAGE_KEY, 'true');
    setApiKeySelected(true);
    setError(null);
  };

  const handleClearKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKeySelected(false);
    setError(null);
  };

  const handleNavigate = (page: 'main' | 'about' | 'profile') => {
    setCurrentPage(page);
    setGeneratedContent(null);
    setError(null);
    localStorage.removeItem(GENERATION_SESSION_KEY);
  }

  const handleSettingsSave = () => {
    showNotification('Notification settings saved successfully!', 'success');
  };

  const handleRewardClaimed = (message: string) => {
    showNotification(message, 'success');
  };

  const handleAvatarChange = (newSettings: Partial<AvatarCustomization>) => {
    setAvatarCustomization(prev => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.style && newSettings.style !== 'photo') {
        updated.imageUrl = undefined;
      }
      localStorage.setItem(AVATAR_CUSTOMIZATION_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleRetry = () => {
    if (lastFormData) {
        handleGenerate(lastFormData);
    } else {
        console.error("Retry failed: No previous lesson data available.");
        showNotification("Cannot retry: No lesson data found. Please create a new lesson.", 'error');
    }
  };


  const renderPage = () => {
    switch(currentPage) {
        case 'main':
            return (
                 <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                      {!apiKeySelected ? (
                        <ApiKeySelector onKeySelected={handleKeySelected} onKeyCleared={handleClearKey} />
                      ) : (
                        <>
                          {!isLoading && !generatedContent && (
                            <>
                              <LessonForm onGenerate={handleGenerate} isLoading={isLoading} />
                              {!user && (
                                <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                                  You have {Math.max(0, FREE_LESSON_LIMIT - lessonCount)} free lessons remaining.
                                </div>
                              )}
                            </>
                          )}
                          {isLoading && <LoadingDisplay message={loadingMessage} />}
                          {error && (
                            <div className="bg-red-50 dark:bg-red-900/50 p-6 rounded-xl shadow-lg border border-red-300 dark:border-red-700 my-4 animate-fade-in" role="alert">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4 flex-grow">
                                        <h3 className="text-lg font-bold text-red-800 dark:text-red-200">Lesson Generation Failed</h3>
                                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                            <p>{error}</p>
                                        </div>
                                        <div className="mt-4">
                                            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
                                                {!error.toLowerCase().includes('api key') && (
                                                    <button
                                                        onClick={handleRetry}
                                                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                                                    >
                                                        Try Again
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setError(null)}
                                                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                                                >
                                                    Dismiss
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                          )}
                          {generatedContent && (
                            <ResultsDisplay
                              content={generatedContent}
                              onReset={() => {
                                setGeneratedContent(null);
                                setError(null);
                                localStorage.removeItem(GENERATION_SESSION_KEY);
                              }}
                              onImageGenerated={handleImageGenerated}
                              showNotification={showNotification}
                              avatarCustomization={avatarCustomization}
                              onAvatarChange={handleAvatarChange}
                              isAuthenticated={!!user}
                              onFeedbackSubmit={handleFeedbackSubmit}
                            />
                          )}
                        </>
                      )}
                    </div>
                 </main>
            );
        case 'about':
            return <AboutPage onBack={() => handleNavigate('main')} />;
        case 'profile':
            switch(userRole) {
                case 'Student':
                    return <StudentProfile 
                                onBack={() => handleNavigate('main')} 
                                onSettingsSave={handleSettingsSave} 
                                lessonsCreated={lessonHistory.length}
                                onRewardClaimed={handleRewardClaimed}
                            />;
                case 'Teacher':
                    return <TeacherProfile 
                                onBack={() => handleNavigate('main')} 
                                onSettingsSave={handleSettingsSave} 
                                lessonsCreated={lessonHistory.length}
                                onRewardClaimed={handleRewardClaimed}
                                avatarCustomization={avatarCustomization}
                                onAvatarChange={handleAvatarChange}
                            />;
                case 'Parent':
                    return <ParentProfile 
                                onBack={() => handleNavigate('main')} 
                                onSettingsSave={handleSettingsSave} 
                                lessonsCreated={lessonHistory.length}
                                onRewardClaimed={handleRewardClaimed}
                            />;
                default:
                    return (
                        <div className="text-center p-8">
                            <p>Please log in to view your profile.</p>
                            <button onClick={() => handleNavigate('main')} className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-lg">Go Home</button>
                        </div>
                    )
            }
        default:
             return null;
    }
  }
  
  const PageSpinner: React.FC = () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
    </div>
  );

  if (isCheckingUrl || authLoading) {
    return <PageSpinner />;
  }

  if (sharedLessonContent) {
    return <SharedLessonDisplay content={sharedLessonContent} />;
  }


  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200 font-sans flex flex-col">
      <Header 
        onToggleChat={() => setIsChatVisible(prev => !prev)} 
        onToggleHistory={() => setIsHistoryVisible(prev => !prev)}
        onUpgrade={() => setIsUpgradeModalVisible(true)}
        onNavigateHome={() => handleNavigate('main')}
        onNavigateToProfile={() => handleNavigate('profile')}
        onLoginClick={() => setIsAuthModalOpen(true)}
        remainingLessons={user ? null : Math.max(0, FREE_LESSON_LIMIT - lessonCount)}
      />
      <div className="flex-grow">
        {renderPage()}
      </div>

      <Footer onNavigateToAbout={() => handleNavigate('about')} />

      {isChatVisible && <LiveChat onClose={() => setIsChatVisible(false)} />}
      <HistoryPanel
        history={lessonHistory}
        isVisible={isHistoryVisible}
        onClose={() => setIsHistoryVisible(false)}
        onSelect={handleSelectHistoryItem}
        onDelete={handleDeleteHistoryItem}
        onClear={handleClearHistory}
        isAuthenticated={!!user}
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <UpgradeModal isVisible={isUpgradeModalVisible} onClose={() => setIsUpgradeModalVisible(false)} />
       {notification && (
        <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}