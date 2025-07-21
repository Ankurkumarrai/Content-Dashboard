import axios from 'axios';
import { Article } from '@/lib/supabase';

// Base API client
const apiClient = axios.create({
  timeout: 10000,
});

// Mock APIs for development (since we need working functionality)
export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export interface MovieRecommendation {
  id: string;
  title: string;
  description: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface SocialPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  shares: number;
  hashtags: string[];
  media_url?: string;
}

// Mock data generators
const generateMockNews = (category: string, count: number = 10): Article[] => {
  const authors = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emily Watson', 'Alex Rodriguez'];
  const categories = ['technology', 'sports', 'finance', 'health', 'entertainment', 'science', 'business'] as const;
  
  return Array.from({ length: count }, (_, i) => ({
    id: `news_${category}_${i}`,
    title: `${category} News: ${generateNewsTitle(category)} ${i + 1}`,
    description: `Breaking news in ${category}. This is a comprehensive report covering the latest developments and their impact on the industry.`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`,
    category: categories.includes(category as any) ? category as any : 'news',
    author: authors[Math.floor(Math.random() * authors.length)],
    author_avatar: `https://ui-avatars.com/api/?name=${authors[i % authors.length]}&background=6366f1&color=fff&size=100`,
    published_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000 * 7).toISOString(),
    image_url: `https://picsum.photos/800/400?random=${category}_${i}`,
    external_url: `#`,
    read_time: Math.floor(Math.random() * 10) + 2,
    tags: generateTags(category),
    likes: Math.floor(Math.random() * 500) + 10,
    shares: Math.floor(Math.random() * 100) + 5,
    comments: Math.floor(Math.random() * 50) + 2,
    featured: Math.random() > 0.7,
    trending: Math.random() > 0.6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
};

const generateNewsTitle = (category: string): string => {
  const titles = {
    technology: ['AI Revolution', 'Tech Breakthrough', 'Innovation Alert', 'Digital Transformation'],
    sports: ['Championship Update', 'Player Transfer', 'Season Highlights', 'Record Breaking'],
    finance: ['Market Analysis', 'Economic Outlook', 'Investment Update', 'Financial Report'],
    health: ['Medical Discovery', 'Health Study', 'Wellness Trend', 'Treatment Advance'],
    entertainment: ['Celebrity News', 'Movie Release', 'Award Show', 'Entertainment Buzz'],
    science: ['Research Finding', 'Scientific Discovery', 'Space News', 'Environmental Study'],
    business: ['Corporate News', 'Startup Success', 'Industry Report', 'Business Strategy']
  };
  
  const categoryTitles = titles[category as keyof typeof titles] || ['General News', 'Breaking Update'];
  return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
};

const generateTags = (category: string): string[] => {
  const tagMap = {
    technology: ['ai', 'innovation', 'tech', 'digital'],
    sports: ['athletics', 'competition', 'team', 'player'],
    finance: ['market', 'investment', 'economy', 'trading'],
    health: ['wellness', 'medical', 'healthcare', 'research'],
    entertainment: ['celebrity', 'movie', 'music', 'tv'],
    science: ['research', 'discovery', 'experiment', 'data'],
    business: ['corporate', 'startup', 'industry', 'strategy']
  };
  
  const baseTags = tagMap[category as keyof typeof tagMap] || ['news', 'update'];
  return baseTags.slice(0, Math.floor(Math.random() * 3) + 2);
};

const generateMockMovies = (count: number = 10): MovieRecommendation[] => {
  const movieTitles = [
    'The Future Chronicles', 'Digital Dreams', 'Space Odyssey 2024', 'Quantum Reality',
    'The Last Algorithm', 'Cyber Symphony', 'Virtual Horizons', 'Neural Networks',
    'AI Awakening', 'Data Storm', 'Code Revolution', 'Binary Hearts'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `movie_${i}`,
    title: movieTitles[i % movieTitles.length] + ` ${Math.floor(i / movieTitles.length) + 1}`,
    description: `An epic tale of technology, humanity, and the future. This groundbreaking film explores themes of artificial intelligence and human connection.`,
    poster_path: `https://picsum.photos/300/450?random=movie_${i}`,
    release_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    vote_average: parseFloat((Math.random() * 4 + 6).toFixed(1)),
    genre_ids: [Math.floor(Math.random() * 20) + 1, Math.floor(Math.random() * 20) + 1],
  }));
};

const generateMockSocialPosts = (hashtag: string, count: number = 10): SocialPost[] => {
  const authors = ['TechGuru2024', 'SportsFan_Pro', 'FinanceExpert', 'HealthyLiving', 'MovieBuff'];
  const posts = [
    'Just discovered an amazing new trend!',
    'This changes everything we know about the industry.',
    'Incredible breakthrough in research today.',
    'Can\'t believe how fast technology is advancing.',
    'Great insights from today\'s conference.',
    'Revolutionary approach to solving problems.',
    'Fascinating developments in this field.',
    'Game-changing innovation announced!'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `social_${hashtag}_${i}`,
    author: authors[Math.floor(Math.random() * authors.length)],
    avatar: `https://ui-avatars.com/api/?name=${authors[i % authors.length]}&background=random&size=50`,
    content: `${posts[Math.floor(Math.random() * posts.length)]} ${hashtag ? `#${hashtag}` : ''} #trending`,
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    likes: Math.floor(Math.random() * 1000) + 10,
    shares: Math.floor(Math.random() * 200) + 5,
    hashtags: [hashtag, 'trending', 'news'].filter(Boolean),
    media_url: Math.random() > 0.5 ? `https://picsum.photos/400/300?random=social_${i}` : undefined,
  }));
};

// API Service functions
export const newsService = {
  getNews: async (category?: string, page: number = 1): Promise<NewsResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    
    const articles = generateMockNews(category || 'general', 20);
    
    return {
      status: 'ok',
      totalResults: 100,
      articles
    };
  },

  searchNews: async (query: string): Promise<NewsResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));
    
    const articles = generateMockNews('general', 15).map(article => ({
      ...article,
      title: `${query}: ${article.title}`,
      description: `Search result for "${query}". ${article.description}`,
    }));
    
    return {
      status: 'ok',
      totalResults: articles.length,
      articles
    };
  }
};

export const movieService = {
  getRecommendations: async (page: number = 1): Promise<{ results: MovieRecommendation[] }> => {
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 400));
    
    return {
      results: generateMockMovies(20)
    };
  },

  searchMovies: async (query: string): Promise<{ results: MovieRecommendation[] }> => {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));
    
    return {
      results: generateMockMovies(10).map(movie => ({
        ...movie,
        title: `${query} ${movie.title}`,
      }))
    };
  }
};

export const socialService = {
  getPosts: async (hashtag?: string, count: number = 20): Promise<{ posts: SocialPost[] }> => {
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
    
    return {
      posts: generateMockSocialPosts(hashtag || 'trending', count)
    };
  },

  searchPosts: async (query: string): Promise<{ posts: SocialPost[] }> => {
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 200));
    
    return {
      posts: generateMockSocialPosts(query, 15)
    };
  }
};

// Combined content service
export interface UnifiedContent {
  id: string;
  type: 'news' | 'movie' | 'social';
  title: string;
  description: string;
  image_url?: string;
  author?: string;
  timestamp: string;
  engagement: {
    likes: number;
    shares: number;
    comments?: number;
  };
  metadata: any;
}

export const contentService = {
  getUnifiedFeed: async (preferences: string[] = [], page: number = 1): Promise<UnifiedContent[]> => {
    const [newsRes, moviesRes, socialRes] = await Promise.all([
      newsService.getNews(preferences[0] || 'technology', page),
      movieService.getRecommendations(page),
      socialService.getPosts(preferences[0] || 'tech', 10)
    ]);

    const unifiedContent: UnifiedContent[] = [];

    // Add news content
    newsRes.articles.slice(0, 6).forEach(article => {
      unifiedContent.push({
        id: article.id,
        type: 'news',
        title: article.title,
        description: article.description,
        image_url: article.image_url,
        author: article.author,
        timestamp: article.published_at,
        engagement: {
          likes: article.likes,
          shares: article.shares,
          comments: article.comments,
        },
        metadata: article,
      });
    });

    // Add movie content
    moviesRes.results.slice(0, 4).forEach(movie => {
      unifiedContent.push({
        id: movie.id,
        type: 'movie',
        title: movie.title,
        description: movie.description,
        image_url: movie.poster_path,
        timestamp: movie.release_date,
        engagement: {
          likes: Math.floor(movie.vote_average * 100),
          shares: Math.floor(movie.vote_average * 50),
        },
        metadata: movie,
      });
    });

    // Add social content
    socialRes.posts.slice(0, 5).forEach(post => {
      unifiedContent.push({
        id: post.id,
        type: 'social',
        title: `@${post.author}`,
        description: post.content,
        image_url: post.media_url,
        author: post.author,
        timestamp: post.timestamp,
        engagement: {
          likes: post.likes,
          shares: post.shares,
        },
        metadata: post,
      });
    });

    // Shuffle content for variety
    return unifiedContent.sort(() => Math.random() - 0.5);
  },

  searchUnifiedContent: async (query: string): Promise<UnifiedContent[]> => {
    const [newsRes, moviesRes, socialRes] = await Promise.all([
      newsService.searchNews(query),
      movieService.searchMovies(query),
      socialService.searchPosts(query)
    ]);

    const unifiedContent: UnifiedContent[] = [];

    // Process search results
    [...newsRes.articles.slice(0, 5), ...moviesRes.results.slice(0, 3), ...socialRes.posts.slice(0, 4)]
      .forEach((item: any) => {
        if ('published_at' in item) {
          // News article
          unifiedContent.push({
            id: item.id,
            type: 'news',
            title: item.title,
            description: item.description,
            image_url: item.image_url,
            author: item.author,
            timestamp: item.published_at,
            engagement: {
              likes: item.likes,
              shares: item.shares,
              comments: item.comments,
            },
            metadata: item,
          });
        } else if ('vote_average' in item) {
          // Movie
          unifiedContent.push({
            id: item.id,
            type: 'movie',
            title: item.title,
            description: item.description,
            image_url: item.poster_path,
            timestamp: item.release_date,
            engagement: {
              likes: Math.floor(item.vote_average * 100),
              shares: Math.floor(item.vote_average * 50),
            },
            metadata: item,
          });
        } else {
          // Social post
          unifiedContent.push({
            id: item.id,
            type: 'social',
            title: `@${item.author}`,
            description: item.content,
            image_url: item.media_url,
            author: item.author,
            timestamp: item.timestamp,
            engagement: {
              likes: item.likes,
              shares: item.shares,
            },
            metadata: item,
          });
        }
      });

    return unifiedContent;
  }
};