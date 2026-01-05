
export interface NewsItem {
  id: string;
  title: string;
  category: Category;
  summary: string;
  explanation: string;
  whyItMatters: string;
  imageUrl: string;
  timestamp: string;
  sources: { title: string; uri: string }[];
}

export type Category = 
  | 'World'
  | 'Politics'
  | 'Economy'
  | 'Technology'
  | 'Climate'
  | 'Culture';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; uri: string }[];
}

export interface AppState {
  news: NewsItem[];
  loading: boolean;
  selectedNews: NewsItem | null;
  activeCategory: Category;
  error: string | null;
  isAssistantOpen: boolean;
  chatHistory: ChatMessage[];
  lastRefreshed: string;
}
