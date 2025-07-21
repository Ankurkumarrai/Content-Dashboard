import { createClient } from '@supabase/supabase-js';

// Use Lovable's Supabase integration - these will be automatically provided
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

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
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Article[];
};

// User favorites functions
export const getUserFavorites = async (userId: string) => {
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
  const { data, error } = await supabase
    .from('user_favorites')
    .insert({ user_id: userId, article_id: articleId })
    .select();

  if (error) throw error;
  return data;
};

export const removeFromFavorites = async (userId: string, articleId: string) => {
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('article_id', articleId);

  if (error) throw error;
};

// User bookmarks functions
export const getUserBookmarks = async (userId: string) => {
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
  const { data, error } = await supabase
    .from('user_bookmarks')
    .insert({ user_id: userId, article_id: articleId })
    .select();

  if (error) throw error;
  return data;
};

export const removeFromBookmarks = async (userId: string, articleId: string) => {
  const { error } = await supabase
    .from('user_bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('article_id', articleId);

  if (error) throw error;
};

// Update article engagement
export const updateArticleLikes = async (articleId: string, increment = true) => {
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