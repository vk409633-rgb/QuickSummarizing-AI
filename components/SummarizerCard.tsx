import React, { useState, useCallback, useRef } from 'react';
import { SummaryType } from '../types';
import { summarizeText } from '../services/geminiService';
import { SparklesIcon, StarIcon, PhotoIcon, XCircleIcon, ClipboardIcon, CheckIcon, DocumentArrowDownIcon } from '../constants';

type ImageState = {
  data: string;
  mimeType: string;
  name: string;
};

interface SummarizerCardProps {
  isPro: boolean;
  credits: number;
  useCredit: () => void;
}

const SummarizerCard: React.FC<SummarizerCardProps> = ({ isPro, credits, useCredit }) => {
  const [inputText, setInputText] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [summaryType, setSummaryType] = useState<SummaryType>(SummaryType.Brief);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showProAlert, setShowProAlert] = useState<boolean>(false);
  const [image, setImage] = useState<ImageState | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canUsePro = isPro && credits >= 10;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError("Image size should not exceed 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          data: (reader.result as string).split(',')[1],
          mimeType: file.type,
          name: file.name,
        });
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSummarize = useCallback(async () => {
    if (!inputText.trim() && !image) {
      setError('Please enter some text or upload an image to summarize.');
      return;
    }
    if (summaryType === SummaryType.Detailed && !canUsePro) {
      setShowProAlert(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary('');
    setShowProAlert(false);

    if (summaryType === SummaryType.Detailed) {
      useCredit();
    }

    try {
      await summarizeText(inputText, summaryType, (chunk) => {
        setSummary((prev) => prev + chunk);
      }, image);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, summaryType, image, canUsePro, useCredit]);

  const handleTypeChange = (type: SummaryType) => {
    setSummaryType(type);
    if (type === SummaryType.Detailed && !canUsePro) {
      setShowProAlert(true);
    } else {
      setShowProAlert(false);
    }
  }
  
  const getProAlertMessage = () => {
      if (!isPro) {
        return "Detailed summaries are a Pro feature. Upgrade to unlock!";
      }
      if (credits < 10) {
        return "You need at least 10 credits for a detailed summary. Watch an ad to renew them.";
      }
      return "Detailed summaries are available on our Pro plan. Check out the benefits!";
  }

  const parseMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/•\s(.*?)\n/g, '<ul><li>$1</li></ul>\n') // Bullets
      .replace(/<\/ul>\n<ul>/g, '') // Merge consecutive lists
      .replace(/\n/g, '<br />'); // Newlines
  };

  const getPlainTextSummary = () => {
    return summary
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
      .replace(/•\s/g, ''); // Remove bullet point markers
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(getPlainTextSummary());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!summary) return;
    
    const plainTextSummary = getPlainTextSummary();
    const blob = new Blob([plainTextSummary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section aria-labelledby="summarizer-heading" className="bg-white/60 dark:bg-slate-800/50 shadow-2xl rounded-3xl p-6 sm:p-10 space-y-8 backdrop-blur-3xl border border-white/30 dark:border-slate-700/50">
      <div className="text-center">
        <h1 id="summarizer-heading" className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">AI Note Summarizer</h1>
        <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Paste text or upload an image for a clean, elegant summary in seconds.</p>
      </div>
      
      <div className="space-y-4">
        <label htmlFor="note-input" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Your Content</label>
        <textarea
          id="note-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={image ? "Optionally, add some text to go with your image..." : "Paste your notes, article, or any text here..."}
          className="w-full h-48 p-4 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base"
          aria-label="Text input for summarization"
        ></textarea>
        <p className="text-right text-xs text-slate-400 dark:text-slate-500 font-medium">
          {inputText.length} characters
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Optional Image</label>
        {image ? (
          <div className="relative group w-full sm:w-64">
              <div className="flex items-center p-2 bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl">
                <img src={`data:${image.mimeType};base64,${image.data}`} alt="Upload preview" className="w-16 h-16 object-cover rounded-lg" />
                <p className="ml-4 text-sm text-slate-600 dark:text-slate-300 truncate" title={image.name}>{image.name}</p>
              </div>
              <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white"
                  aria-label="Remove image"
              >
                  <XCircleIcon className="w-6 h-6" />
              </button>
          </div>
        ) : (
          <div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              aria-hidden="true"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all duration-300"
            >
              <PhotoIcon className="h-6 w-6" />
              Upload an Image
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-full">
          <button 
            onClick={() => handleTypeChange(SummaryType.Brief)}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${summaryType === SummaryType.Brief ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            Brief Summary
          </button>
          <button 
            onClick={() => handleTypeChange(SummaryType.Detailed)}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${summaryType === SummaryType.Detailed ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            <StarIcon className="h-4 w-4 text-amber-400" />
            Detailed
            <span className="text-xs bg-amber-400 text-white font-bold px-2 py-0.5 rounded-full">PRO</span>
          </button>
        </div>
        <button
          onClick={handleSummarize}
          disabled={isLoading}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold text-base rounded-full shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-300"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Summarizing...
            </>
          ) : (
            <>
              <SparklesIcon className="h-6 w-6" />
              Summarize
            </>
          )}
        </button>
      </div>

      {showProAlert && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/50 border-l-4 border-amber-400 text-amber-700 dark:text-amber-300 rounded-r-lg">
              <div className="flex">
                  <div className="py-1"><StarIcon className="h-5 w-5 text-amber-500 mr-3" /></div>
                  <div>
                      <p className="font-bold">Pro Feature (10 Credits)</p>
                      <p className="text-sm">{getProAlertMessage()}</p>
                  </div>
              </div>
          </div>
      )}

      {(summary || error) && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Summary Result</h2>
          {error && <p className="mt-4 text-red-600 bg-red-100 dark:bg-red-900/50 p-4 rounded-xl font-medium">{error}</p>}
          {summary && (
            <div>
              <div 
                className="mt-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl space-y-4 prose prose-slate dark:prose-invert max-w-none prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(summary) }}
              >
              </div>
              <div className="mt-4 flex justify-end items-center gap-3">
                 <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  aria-label="Download summary"
                >
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                    isCopied
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
                      : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  aria-live="polite"
                >
                  {isCopied ? (
                    <>
                      <CheckIcon className="h-5 w-5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <ClipboardIcon className="h-5 w-5" />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default SummarizerCard;