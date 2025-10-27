import React, { useState, useRef, useEffect } from 'react';
import type { HistoryItem, Quiz, Scene, QuizOption, AvatarCustomization, AvatarStyle } from '../types';
import { generateSceneImage } from '../services/geminiService';
import { AIAvatar } from './AIAvatar';
import { ToggleSwitch } from './ToggleSwitch';
import { Tooltip } from './Tooltip';


interface ResultsDisplayProps {
  content: HistoryItem;
  onReset: () => void;
  onImageGenerated: (lessonId: number, sceneNumber: number, imageUrl: string) => void;
  showNotification: (message: string, type: 'success' | 'info') => void;
  avatarCustomization: AvatarCustomization;
  onAvatarChange: (newSettings: Partial<AvatarCustomization>) => void;
  isAuthenticated: boolean;
  onFeedbackSubmit: (lessonId: number, feedback: 'positive' | 'negative') => void;
}

const InteractiveQuiz: React.FC<{ quiz: Quiz }> = ({ quiz }) => {
    const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    
    const handleOptionSelect = (option: QuizOption) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);
    };
    
    const getButtonClass = (option: QuizOption) => {
        if (!isAnswered) {
            return "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600";
        }
        if (option.isCorrect) {
            return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-500";
        }
        if (selectedOption && option.text === selectedOption.text) {
            return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-500";
        }
        return "bg-gray-100 dark:bg-gray-700 opacity-60";
    };

    const correctAnswer = quiz.options.find(o => o.isCorrect);

    return (
        <div className="mt-8 p-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3">Check Your Understanding</h3>
            <p className="mb-4">{quiz.question}</p>
            <div className="space-y-3">
                {quiz.options.map((option, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleOptionSelect(option)}
                        className={`w-full text-left p-3 rounded-lg border-2 border-transparent transition-all ${getButtonClass(option)}`}
                        disabled={isAnswered}
                    >
                        {option.text}
                    </button>
                ))}
            </div>
             {isAnswered && selectedOption && (
                <>
                    <div className={`mt-4 p-4 rounded-lg text-sm border-l-4 ${selectedOption.isCorrect ? 'bg-green-50 dark:bg-green-900/50 border-green-500' : 'bg-red-50 dark:bg-red-900/50 border-red-500'}`}>
                        <p className={`font-bold ${selectedOption.isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                            {selectedOption.isCorrect ? 'Correct!' : 'Not quite...'}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">{selectedOption.feedback}</p>
                    </div>

                    {!selectedOption.isCorrect && correctAnswer && (
                        <div className="mt-3 p-4 rounded-lg text-sm border-l-4 bg-green-50 dark:bg-green-900/50 border-green-500">
                            <p className="font-bold text-green-700 dark:text-green-300">The correct answer was: {correctAnswer.text}</p>
                            <p className="text-gray-700 dark:text-gray-300 mt-1">{correctAnswer.feedback}</p>
                        </div>
                    )}
                </>
             )}
        </div>
    );
};

const AvatarSettings: React.FC<{
    customization: AvatarCustomization;
    onAvatarChange: (newSettings: Partial<AvatarCustomization>) => void;
    onClose: () => void;
}> = ({ customization, onAvatarChange, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const styles: { id: AvatarStyle, name: string }[] = [{id: 'robot', name: 'Robot'}, {id: 'blob', name: 'Blob'}, {id: 'alien', name: 'Alien'}];
    const colors = [
        { name: 'Teal', value: '#4fd1c5' },
        { name: 'Pink', value: '#f472b6' },
        { name: 'Orange', value: '#fb923c' },
        { name: 'Purple', value: '#a78bfa' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div ref={menuRef} className="absolute bottom-36 right-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-30 animate-fade-in-scale">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Customize Avatar</h4>
            
            <div className="space-y-4">
                 <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Style</label>
                    <div className="flex items-center space-x-2 mt-2">
                        {styles.map(style => (
                            <button key={style.id} onClick={() => onAvatarChange({ style: style.id })} className={`w-full text-xs font-semibold py-1.5 rounded-md transition-colors ${customization.style === style.id ? 'bg-teal-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                                {style.name}
                            </button>
                        ))}
                    </div>
                </div>

                 <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Color</label>
                    <div className="flex items-center justify-between mt-2">
                         {colors.map(color => (
                            <button key={color.name} onClick={() => onAvatarChange({ color: color.value })} className={`w-10 h-10 rounded-full transition-all border-2 ${customization.color === color.value ? 'border-teal-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: color.value }} aria-label={`Set color to ${color.name}`} />
                        ))}
                    </div>
                </div>

                <div>
                    <ToggleSwitch
                        label="Glasses"
                        enabled={customization.hasGlasses}
                        onChange={(enabled) => onAvatarChange({ hasGlasses: enabled })}
                    />
                </div>
            </div>
        </div>
    );
};

const FeedbackSection: React.FC<{ 
    lessonId: number, 
    feedback: HistoryItem['feedback'], 
    onSubmit: (lessonId: number, feedback: 'positive' | 'negative') => void 
}> = ({ lessonId, feedback, onSubmit }) => {
    if (feedback) {
        return (
             <div className="text-center p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <p className="font-medium text-gray-700 dark:text-gray-300">Thank you for your feedback!</p>
            </div>
        );
    }

    return (
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Rate this lesson</h4>
            <div className="flex justify-center space-x-4">
                <button 
                    onClick={() => onSubmit(lessonId, 'positive')}
                    className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-green-500 hover:text-white transition-colors"
                    aria-label="Good lesson"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.93L5 10m7 0a2 2 0 002 2h2.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20" /></svg>
                </button>
                 <button 
                    onClick={() => onSubmit(lessonId, 'negative')}
                    className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-red-500 hover:text-white transition-colors"
                    aria-label="Bad lesson"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.085a2 2 0 001.736-.93l3.464-5.94m-7 0a2 2 0 00-2-2H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.738 3h4.017c.163 0 .326.02.485.06L17 4" /></svg>
                </button>
            </div>
        </div>
    );
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ content, onReset, onImageGenerated, showNotification, avatarCustomization, onAvatarChange, isAuthenticated, onFeedbackSubmit }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imageStates, setImageStates] = useState<Record<number, { status: 'idle' | 'loading' | 'error'; error?: string }>>({});
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    
    const handlePlay = () => setIsSpeaking(true);
    const handlePause = () => setIsSpeaking(false);
    
    audioEl.addEventListener('play', handlePlay);
    audioEl.addEventListener('pause', handlePause);
    audioEl.addEventListener('ended', handlePause);

    return () => {
        audioEl.removeEventListener('play', handlePlay);
        audioEl.removeEventListener('pause', handlePause);
        audioEl.removeEventListener('ended', handlePause);
    };
  }, [content.audioUrl]);

  const handleGenerateImage = async (scene: Scene) => {
    setImageStates(prev => ({ ...prev, [scene.sceneNumber]: { status: 'loading' } }));
    try {
        const imageUrl = await generateSceneImage(scene.visualDescription);
        onImageGenerated(content.id, scene.sceneNumber, imageUrl);
        setImageStates(prev => ({ ...prev, [scene.sceneNumber]: { status: 'idle' } }));
    } catch (error: any) {
        setImageStates(prev => ({ ...prev, [scene.sceneNumber]: { status: 'error', error: error.message } }));
    }
  };

  const handleCopyLink = () => {
    try {
        // Create a clean, shareable version of the lesson content.
        // We exclude user-specific data (feedback), history-specific data (id, timestamp),
        // and the temporary audio blob URL which won't work for others.
        const { id, timestamp, feedback, audioUrl, ...shareableContent } = content;
        
        const lessonJson = JSON.stringify(shareableContent);
        
        // This trick handles UTF-8 characters correctly before base64 encoding
        const encodedLesson = btoa(unescape(encodeURIComponent(lessonJson)));
        const shareUrl = `${window.location.origin}${window.location.pathname}?lesson=${encodedLesson}`;
        
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                showNotification('Share link copied to clipboard!', 'info');
            })
            .catch(err => {
                console.error('Failed to copy link: ', err);
                alert('Could not copy the share link to your clipboard.');
            });
    } catch (error) {
        console.error("Error creating share link:", error);
        alert("Sorry, a shareable link could not be created for this lesson.");
    }
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden relative">
        <AIAvatar
            className="fixed bottom-4 right-4 w-24 h-24 sm:w-32 sm:h-32 z-20 transition-transform duration-300 hover:scale-110"
            isSpeaking={isSpeaking}
            {...avatarCustomization}
        />
        <button 
            onClick={() => setIsAvatarMenuOpen(prev => !prev)} 
            className="absolute bottom-4 right-28 sm:right-32 p-2 rounded-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-900/80 transition-colors z-30"
            aria-label="Customize Avatar"
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
        </button>

        {isAvatarMenuOpen && (
            <AvatarSettings 
                customization={avatarCustomization}
                onAvatarChange={onAvatarChange}
                onClose={() => setIsAvatarMenuOpen(false)}
            />
        )}
        
        <div className="p-4 sm:p-6">
             <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4">{content.title}</h2>
        </div>
        
        <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900">
            <audio ref={audioRef} src={content.audioUrl} controls className="w-full" aria-label={`Audio lesson for ${content.title}`} />
        </div>

        <div className="p-4 sm:p-6 pb-32 sm:pb-40">
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-semibold">Lesson Scenes</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">A scene-by-scene breakdown of the lesson.</p>
                    </div>
                </div>
                 <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    {content.scenes.map((scene) => (
                        <div key={scene.sceneNumber} className={`p-4 rounded-lg border bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 transition-all duration-300`}>
                            <p className="font-semibold text-sm text-teal-700 dark:text-teal-400 mb-1">SCENE {scene.sceneNumber}</p>
                            
                            <div className="md:flex md:space-x-4">
                                <div className="flex-grow">
                                    <p className="text-gray-800 dark:text-gray-200">{scene.narration}</p>
                                    {scene.textOverlay && (
                                        <div className="mt-3 bg-black/50 text-white text-sm font-mono py-1 px-3 rounded-md inline-block">
                                            <p>"{scene.textOverlay}"</p>
                                        </div>
                                    )}
                                    {scene.visualDescription && (
                                        <div className="flex items-start text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                            </svg>
                                            <p><strong className="font-medium text-gray-600 dark:text-gray-300">Visuals:</strong> {scene.visualDescription}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="md:w-48 mt-4 md:mt-0 flex-shrink-0">
                                     {scene.imageUrl ? (
                                        <img src={scene.imageUrl} alt={scene.visualDescription} className="w-full h-auto rounded-lg object-cover shadow-md" />
                                     ) : (
                                        <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                                            {(() => {
                                                const imageState = imageStates[scene.sceneNumber];
                                                switch (imageState?.status) {
                                                    case 'loading':
                                                        return (
                                                            <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse flex flex-col items-center justify-center p-2 text-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Generating Visual...</p>
                                                            </div>
                                                        );
                                                    case 'error':
                                                        return (
                                                            <div className="text-red-500 dark:text-red-400 text-xs">
                                                                <p>Generation Failed</p>
                                                                <button onClick={() => handleGenerateImage(scene)} className="text-xs underline mt-1">Retry</button>
                                                            </div>
                                                        );
                                                    default: // 'idle'
                                                        return (
                                                            <button 
                                                                onClick={() => handleGenerateImage(scene)}
                                                                className="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                                                                <span>Generate Visual</span>
                                                            </button>
                                                        );
                                                }
                                            })()}
                                        </div>
                                     )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <InteractiveQuiz quiz={content.quiz} />
            
            {isAuthenticated && (
                <div className="mt-8 px-4 sm:px-6">
                    <FeedbackSection 
                        lessonId={content.id} 
                        feedback={content.feedback} 
                        onSubmit={onFeedbackSubmit} 
                    />
                </div>
            )}

             <div className="mt-8 p-4 sm:p-6 text-center flex flex-col sm:flex-row items-center justify-center sm:space-x-4 space-y-4 sm:space-y-0">
                <Tooltip text="Generates a unique link to share this lesson. Anyone with the link can view it without needing an account.">
                    <button
                        onClick={handleCopyLink}
                        className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all flex items-center justify-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l-1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                        <span>Copy Share Link</span>
                    </button>
                </Tooltip>
                 <button
                    onClick={onReset}
                    className="w-full sm:w-auto px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all"
                >
                    Create Another Lesson
                </button>
             </div>
        </div>
    </div>
  );
};