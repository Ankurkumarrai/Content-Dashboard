import { createClient } from '@supabase/supabase-js';

// Check if we have real Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a conditional client
export const supabase = (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Mock data for development
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Breaking: Major Tech Innovation Announced',
    description: 'A revolutionary new technology promises to change the way we interact with digital devices.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'technology',
    author: 'John Smith',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop',
    external_url: '#',
    read_time: 5,
    tags: ['innovation', 'technology', 'future'],
    likes: 156,
    shares: 42,
    comments: 28,
    featured: true,
    trending: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'New Movie Breaks Box Office Records',
    description: 'The latest blockbuster film has shattered opening weekend records worldwide.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'entertainment',
    author: 'Sarah Johnson',
    author_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&crop=face',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1489599849996-76c3e1b7eb5b?w=800&h=400&fit=crop',
    external_url: '#',
    read_time: 3,
    tags: ['movies', 'entertainment', 'box office'],
    likes: 89,
    shares: 23,
    comments: 15,
    featured: false,
    trending: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Social Media Platform Launches New Feature',
    description: 'A popular social media platform introduces innovative tools for better user engagement.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'social',
    author: 'Mike Chen',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=800&h=400&fit=crop',
    external_url: '#',
    read_time: 4,
    tags: ['social media', 'technology', 'features'],
    likes: 203,
    shares: 67,
    comments: 45,
    featured: true,
    trending: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Healthcare Breakthrough in Disease Research',
    description: 'Scientists make significant progress in understanding and treating complex diseases.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'health',
    author: 'Dr. Emily Watson',
    author_avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=800&h=400&fit=crop',
    external_url: '#',
    read_time: 7,
    tags: ['health', 'research', 'medicine'],
    likes: 124,
    shares: 35,
    comments: 22,
    featured: false,
    trending: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Global Climate Summit Reaches Historic Agreement',
    description: 'World leaders unite on ambitious climate action plans for the next decade.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'news',
    author: 'Alex Rodriguez',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1569163139394-de4e5f43e4e3?w=800&h=400&fit=crop',
    external_url: '#',
    read_time: 6,
    tags: ['climate', 'environment', 'politics'],
    likes: 278,
    shares: 98,
    comments: 67,
    featured: true,
    trending: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'news' | 'entertainment' | 'social' | 'technology' | 'sports' | 'science' | 'health' | 'business';
  author: string;
  author_avatar?: string;
  published_at: string;
  image_url?: string;
  external_url?: string;
  read_time: number;
  tags: string[];
  likes: number;
  shares: number;
  comments: number;
  featured: boolean;
  trending: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  article_id: string;
  created_at: string;
}

export interface UserBookmark {
  id: string;
  user_id: string;
  article_id: string;
  created_at: string;
}

// Article functions
export const getArticles = async (category?: string, limit = 20, offset = 0) => {
  // Use mock data if Supabase is not available
  if (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    let filteredArticles = mockArticles;
    
    if (category && category !== 'all') {
      filteredArticles = mockArticles.filter(article => article.category === category);
    }
    
    return filteredArticles.slice(offset, offset + limit);
  }

  let query = supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data as Article[];
};

export const getFeaturedArticles = async (limit = 5) => {
  // Use mock data if Supabase is not available
  if (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockArticles.filter(article => article.featured).slice(0, limit);
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Article[];
};

export const getTrendingArticles = async (limit = 10) => {
  // Use mock data if Supabase is not available
  if (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockArticles.filter(article => article.trending).slice(0, limit);
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('trending', true)
    .order('likes', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Article[];
};

export const searchArticles = async (searchTerm: string, limit = 20) => {
  // Use mock data if Supabase is not available
  if (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const filtered = mockArticles.filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.slice(0, limit);
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Article[];
};

// Mock storage for favorites and bookmarks when offline
let mockFavorites: string[] = [];
let mockBookmarks: string[] = [];

// User favorites functions
export const getUserFavorites = async (userId: string) => {
  // Use mock data if Supabase is not available
  if (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockArticles.filter(article => mockFavorites.includes(article.id));
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .select(`
      *,
      articles (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(item => item.articles) as Article[];
};

export const addToFavorites = async (userId: string, articleId: string) => {
  // Use mock data if Supabase is not available
  if (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (!mockFavorites.includes(articleId)) {
      mockFavorites.push(articleId);
    }
    return [{ id: `fav_${articleId}`, user_id: userId, article_id: articleId }];
  }

  const { data, error } = await supabase
    .from('user_favorites')
    .insert({ user_id: userId, article_id: articleId })
    .select();

  if (error) throw error;
  return data;
};

export const removeFromFavorites = async (userId: string, articleId: string) => {
  // Use mock data if Supabase is not available
  if (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
    mockFavorites = mockFavorites.filter(id => id !== articleId);
    return;
  }

  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('article_id', articleId);

  if (error) throw error;
};

// User bookmarks functions
export const getUserBookmarks = async (userId: string) => {
  // Use mock data if Supabase is not available
  if (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockArticles.filter(article => mockBookmarks.includes(article.id));
  }

  const { data, error } = await supabase
    .from('user_bookmarks')
    .select(`
      *,
      articles (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(item => item.articles) as Article[];
};

export const addToBookmarks = async (userId: string, articleId: string) => {
  // Use mock data if Supabase is not available
  if (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (!mockBookmarks.includes(articleId)) {
      mockBookmarks.push(articleId);
    }
    return [{ id: `bookmark_${articleId}`, user_id: userId, article_id: articleId }];
  }

  const { data, error } = await supabase
    .from('user_bookmarks')
    .insert({ user_id: userId, article_id: articleId })
    .select();

  if (error) throw error;
  return data;
};

export const removeFromBookmarks = async (userId: string, articleId: string) => {
  // Use mock data if Supabase is not available
  if (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
    mockBookmarks = mockBookmarks.filter(id => id !== articleId);
    return;
  }

  const { error } = await supabase
    .from('user_bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('article_id', articleId);

  if (error) throw error;
};

// Update article engagement
export const updateArticleLikes = async (articleId: string, increment = true) => {
  // Use mock data if Supabase is not available
  if (!supabase) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const article = mockArticles.find(a => a.id === articleId);
    if (article) {
      article.likes = increment ? article.likes + 1 : Math.max(0, article.likes - 1);
    }
    return;
  }

  const { data: article, error: fetchError } = await supabase
    .from('articles')
    .select('likes')
    .eq('id', articleId)
    .single();

  if (fetchError) throw fetchError;

  const newLikes = increment ? article.likes + 1 : Math.max(0, article.likes - 1);

  const { error } = await supabase
    .from('articles')
    .update({ likes: newLikes })
    .eq('id', articleId);

  if (error) throw error;
};

// Helper functions to check if user has favorited/bookmarked an article
export const isArticleFavorited = (articleId: string): boolean => {
  return mockFavorites.includes(articleId);
};

export const isArticleBookmarked = (articleId: string): boolean => {
  return mockBookmarks.includes(articleId);
};