

import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    level: string;
    studentName: string;
    lessonsCreated: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, level, studentName, lessonsCreated }) => {
    const certificateRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handleShare = () => {
        const text = encodeURIComponent(`I just earned the "${level}" certificate on FeelEd AI by creating ${lessonsCreated} lessons! 🎉 Check out this amazing AI platform for emotional learning. #FeelEdAI #EdTech #StudentAchievement`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    };

    const handleDownloadPdf = () => {
        const input = certificateRef.current;
        if (input) {
            html2canvas(input, { 
                scale: 2, // Higher scale for better resolution
                useCORS: true, // In case images are from another origin
                backgroundColor: null, // Use element's background
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                // A4 size in points: 595.28 x 841.89. Let's use a landscape orientation.
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'pt',
                    format: 'a4'
                });
                
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const canvasAspectRatio = canvas.width / canvas.height;
                const pdfAspectRatio = pdfWidth / pdfHeight;

                let finalCanvasWidth, finalCanvasHeight;

                if (canvasAspectRatio > pdfAspectRatio) {
                    finalCanvasWidth = pdfWidth;
                    finalCanvasHeight = pdfWidth / canvasAspectRatio;
                } else {
                    finalCanvasHeight = pdfHeight;
                    finalCanvasWidth = pdfHeight * canvasAspectRatio;
                }
                
                const x = (pdfWidth - finalCanvasWidth) / 2;
                const y = (pdfHeight - finalCanvasHeight) / 2;

                pdf.addImage(imgData, 'PNG', x, y, finalCanvasWidth, finalCanvasHeight);
                pdf.save(`FeelEd-AI-Certificate-${level.replace(' ', '-')}.pdf`);
            });
        }
    };


    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity" 
            aria-modal="true" 
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all scale-95 opacity-0 animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
            >
                <div ref={certificateRef}>
                    <div className="relative p-6 sm:p-8 border-4 border-yellow-400 dark:border-yellow-600 m-2 rounded-md bg-slate-50 dark:bg-slate-900">
                        {/* Decorative elements */}
                        <div className="absolute top-4 left-4 h-12 w-12 border-l-2 border-t-2 border-yellow-500"></div>
                        <div className="absolute top-4 right-4 h-12 w-12 border-r-2 border-t-2 border-yellow-500"></div>
                        <div className="absolute bottom-4 left-4 h-12 w-12 border-l-2 border-b-2 border-yellow-500"></div>
                        <div className="absolute bottom-4 right-4 h-12 w-12 border-r-2 border-b-2 border-yellow-500"></div>

                        <div className="text-center">
                            <img 
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAbFBMVEUAd7f///8AdLYAcbQAb7MAcrUAcLMAc7UAbLIAbrMAa7AAeLgAdrfw9fvu9Pvx9vsAeLfs8/n2+v3O4O/d6/TQ4fDE2+y71eqwz+eoxt6mxd3R4/Hj7vXV5fOgyNuaweCexuKFxN+91umVvN3r8/mHw+BqR5yYAAAEe0lEQVR4nO2dbXuiMBSGMwQSqIACKog3qLXW6/9/vAkICJAD4yQm89z7rY+2nCQhEw7DJgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABs8fT29k7p6e3t7W2T/w0xL9f3P9u2/Y2Pj7dt+5sfHx9lWX5kWR7b9g/pA7mP6/u/lGV5V5blL0h/xP0wL9f3Py/L8qssy3+S/gj7Wb7/3v+lLD/o9vZWl/s7/T2e63s/S+l/6e5fD04Y/rS1/P7w8b+Tf9f3/r5nC4Ua+s/z+H2dD0/vHy/sDwn9rS/z/o+pC+Ff6n2df0uFf/X+Tr/72r4i1P0kI/U+d3s7/ZzT5+P3d/p/V9+l6l6/99Dq/X5z6+P3A8u2/Q3+JzT5/E9+S6mKvwM15t8F6v+Amu+J3/+DmvP893DqBwG1L3DqB4G1u4dTPwjY+x+o+Z3+/eX/Wj+k9X0Wb7X2Lw8P/9T/Bfrv+t6PUsZ59e3t7Qn+L9L22/X9b2VZdlyW5Q9If8D9MC/X9z8ny/KxLMt/kv4I+xn+f57//yzLD/Jsvyr9Ae0v0/T+nLK8j+VZXm+0hfZ/g/tb1O1f8jy77Isv6n0Rbb/B9r3p/7/keW/ZFn+SaVfZA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqH6BfS3p/9A8b+cAAAAASUVORK5CYII=" 
                                alt="FeelEd AI Logo" 
                                className="h-20 w-20 mx-auto mb-2"
                            />
                            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Certificate of Achievement</h2>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mt-2 font-serif">FeelEd AI</h1>
                            
                            <p className="mt-6 text-base text-gray-600 dark:text-gray-300">This certificate is proudly presented to</p>
                            <p className="text-2xl sm:text-3xl font-semibold text-teal-600 dark:text-teal-400 my-2">{studentName}</p>
                            <p className="text-base text-gray-600 dark:text-gray-300">for achieving the rank of</p>
                            <p className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white my-2">{level}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">by creating {lessonsCreated} lessons.</p>

                             <p className="text-xs text-gray-400 mt-8">Issued: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
                 <div className="bg-gray-100 dark:bg-gray-700/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                    <button 
                        onClick={handleDownloadPdf}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        <span>Download PDF</span>
                    </button>
                    <button 
                        onClick={handleShare}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:focus:ring-white dark:focus:ring-offset-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span>Share on X</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 focus:outline-none"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};