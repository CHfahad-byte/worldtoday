
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, Category, NewsItem, ChatMessage } from './types';
// import { fetchGlobalNews } from './services/newsService';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { NewsCard } from './components/NewsCard';
import { DetailedView } from './components/DetailedView';
import { AiAssistant } from './components/AiAssistant';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    news: [],
    loading: true,
    selectedNews: null,
    activeCategory: 'World',
    error: null,
    isAssistantOpen: false,
    chatHistory: [],
    lastRefreshed: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const loadNews = useCallback(async (category: Category) => {
    setState(prev => ({ ...prev, loading: true, error: null, activeCategory: category }));
    try {
      const news = await fetchGlobalNews(category);
      setState(prev => ({ 
        ...prev, 
        news, 
        loading: false, 
        lastRefreshed: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) 
      }));
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: 'Failed to fetch global news. Please try again later.' }));
    }
  }, []);

  useEffect(() => {
    loadNews(state.activeCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryChange = (category: Category) => {
    if (category !== state.activeCategory) {
      loadNews(category);
    }
  };

  const handleOpenAssistantWithTopic = (topic: string) => {
    setState(prev => ({ ...prev, isAssistantOpen: true }));
    // If specific topic passed, we could pre-fill or trigger message
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Header onOpenAssistant={() => setState(prev => ({ ...prev, isAssistantOpen: true }))} />
      <CategoryBar activeCategory={state.activeCategory} onCategoryChange={handleCategoryChange} />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {state.loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400 space-y-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            <p className="font-medium tracking-widest text-xs uppercase animate-pulse">Consulting AI Global Intelligence...</p>
          </div>
        ) : state.error ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="bg-red-50 text-red-600 p-8 rounded-2xl max-w-md">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <h3 className="text-xl font-bold mb-2">Service Temporarily Unavailable</h3>
              <p className="text-sm opacity-80">{state.error}</p>
              <button 
                onClick={() => loadNews(state.activeCategory)}
                className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                Retry Connection
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Hero Headline */}
            <section className="text-center py-10 md:py-16">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight max-w-4xl mx-auto leading-[1.1]">
                Today’s Global Highlights, <span className="text-gray-400">Explained Simply.</span>
              </h2>
              <div className="mt-8 flex items-center justify-center gap-4">
                 <button 
                  onClick={() => loadNews(state.activeCategory)}
                  className="group flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-black hover:text-white rounded-full transition-all text-[10px] font-black uppercase tracking-widest"
                >
                  <svg className={`w-3 h-3 group-hover:rotate-180 transition-transform duration-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  AI Refresh (Last: {state.lastRefreshed})
                </button>
              </div>
            </section>

            {/* Latest Updates Section */}
            <section className="bg-black text-white rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
              <div className="flex-shrink-0 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] whitespace-nowrap">Latest AI Updates</h3>
              </div>
              <div className="flex-grow overflow-hidden relative">
                <div className="flex items-center gap-12 animate-[scroll_40s_linear_infinite] whitespace-nowrap">
                  {state.news.map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => setState(prev => ({ ...prev, selectedNews: item }))}
                      className="text-sm font-medium hover:text-blue-400 transition-colors flex items-center gap-2"
                    >
                      <span className="opacity-40">{item.timestamp}</span>
                      {item.title}
                    </button>
                  ))}
                  {state.news.map((item, i) => (
                    <button 
                      key={`dup-${i}`} 
                      onClick={() => setState(prev => ({ ...prev, selectedNews: item }))}
                      className="text-sm font-medium hover:text-blue-400 transition-colors flex items-center gap-2"
                    >
                      <span className="opacity-40">{item.timestamp}</span>
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <style>{`
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>

            {/* Featured Global Story Section */}
            {state.news.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Featured Global Story</h2>
                </div>
                <NewsCard 
                  featured 
                  item={state.news[0]} 
                  onClick={(item) => setState(prev => ({ ...prev, selectedNews: item }))} 
                />
              </section>
            )}

            {/* Top World Headlines Section */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Top World Headlines</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {state.news.slice(1).map(item => (
                  <NewsCard 
                    key={item.id} 
                    item={item} 
                    onClick={(item) => setState(prev => ({ ...prev, selectedNews: item }))} 
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-black text-white p-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <span className="font-bold text-gray-900">The World Today</span>
            </div>
            <div className="text-xs text-gray-400 font-medium text-center md:text-left">
              &copy; {new Date().getFullYear()} The World Today. Neutral AI-assisted reporting for a complex world.
            </div>
          </div>
        </div>
      </footer>

      {state.selectedNews && (
        <DetailedView 
          item={state.selectedNews} 
          onClose={() => setState(prev => ({ ...prev, selectedNews: null }))}
          onAskAi={(q) => {
            setChatHistory(prev => [...prev, { role: 'user', content: `Can you explain more about: ${q}` }]);
            setState(prev => ({ ...prev, isAssistantOpen: true }));
          }}
        />
      )}

      <AiAssistant 
        isOpen={state.isAssistantOpen} 
        onClose={() => setState(prev => ({ ...prev, isAssistantOpen: false }))}
        history={chatHistory}
        setHistory={setChatHistory}
      />
    </div>
  );
};

export default App;
