import { ContentItem } from '@/store/slices/contentSlice';

export interface RealTimeUpdate {
  type: 'new_content' | 'trending_update' | 'user_interaction';
  data: any;
  timestamp: number;
}

export class RealTimeService {
  private static instance: RealTimeService;
  private callbacks: Map<string, (update: RealTimeUpdate) => void> = new Map();
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  static getInstance(): RealTimeService {
    if (!RealTimeService.instance) {
      RealTimeService.instance = new RealTimeService();
    }
    return RealTimeService.instance;
  }

  subscribe(id: string, callback: (update: RealTimeUpdate) => void): void {
    this.callbacks.set(id, callback);
    
    if (!this.isRunning) {
      this.start();
    }
  }

  unsubscribe(id: string): void {
    this.callbacks.delete(id);
    
    if (this.callbacks.size === 0) {
      this.stop();
    }
  }

  private start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // Simulate real-time updates every 30 seconds
    this.intervalId = setInterval(() => {
      this.simulateUpdate();
    }, 30000);
  }

  private stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  private simulateUpdate(): void {
    // Simulate different types of updates
    const updateTypes = ['new_content', 'trending_update', 'user_interaction'] as const;
    const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
    
    let updateData: RealTimeUpdate;

    switch (randomType) {
      case 'new_content':
        updateData = {
          type: 'new_content',
          data: this.generateMockContent(),
          timestamp: Date.now(),
        };
        break;
      case 'trending_update':
        updateData = {
          type: 'trending_update',
          data: {
            trendingItems: this.generateTrendingItems(),
          },
          timestamp: Date.now(),
        };
        break;
      case 'user_interaction':
        updateData = {
          type: 'user_interaction',
          data: {
            contentId: `item-${Math.floor(Math.random() * 100)}`,
            action: Math.random() > 0.5 ? 'like' : 'share',
            count: Math.floor(Math.random() * 50) + 1,
          },
          timestamp: Date.now(),
        };
        break;
    }

    // Notify all subscribers
    this.callbacks.forEach((callback) => {
      callback(updateData);
    });
  }

  private generateMockContent(): ContentItem {
    const categories = ['news', 'entertainment', 'social', 'technology', 'sports', 'science', 'health', 'business'] as const;
    const authors = ['Alex Johnson', 'Sarah Chen', 'Mike Rodriguez', 'Emma Thompson', 'David Kim'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const titles = {
      news: [
        'Breaking: Major Economic Update Announced',
        'International Summit Concludes with Key Agreements',
        'New Policy Changes to Take Effect Next Month',
      ],
      technology: [
        'Revolutionary AI Breakthrough Changes Everything',
        'Next-Gen Quantum Computing Makes Headlines',
        'Cybersecurity Alert: New Threat Detected',
      ],
      entertainment: [
        'Celebrity News: Surprise Announcement Rocks Industry',
        'Award Season Update: Nominations Revealed',
        'Streaming Wars: New Platform Enters Market',
      ],
      social: [
        'Viral Trend Takes Social Media by Storm',
        'Community Initiative Gains Massive Support',
        'Social Platform Updates Terms of Service',
      ],
      sports: [
        'Championship Update: Unexpected Results',
        'Transfer News: Star Player Changes Teams',
        'Season Highlights: Record-Breaking Performance',
      ],
      science: [
        'Scientific Discovery Could Change Medicine',
        'Climate Research Reveals Surprising Findings',
        'Space Mission Achieves Historic Milestone',
      ],
      health: [
        'Health Study Shows Promising Results',
        'New Treatment Shows Breakthrough Potential',
        'Wellness Trend Gains Scientific Backing',
      ],
      business: [
        'Market Update: Significant Changes Expected',
        'Startup Success: Million-Dollar Funding Achieved',
        'Industry Analysis: Trends for Next Quarter',
      ],
    };

    const categoryTitles = titles[category];
    const title = categoryTitles[Math.floor(Math.random() * categoryTitles.length)];

    return {
      id: `realtime-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      description: `Latest update on ${title.toLowerCase()}. This real-time content provides immediate insights and analysis.`,
      category,
      author: authors[Math.floor(Math.random() * authors.length)],
      publishedAt: new Date().toISOString(),
      imageUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400&h=250&fit=crop`,
      url: `https://example.com/article/${Date.now()}`,
      isFavorite: false,
      isBookmarked: false,
      readTime: Math.floor(Math.random() * 10) + 1,
      tags: [category, 'breaking', 'latest'],
      engagement: {
        likes: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 25),
      },
    };
  }

  private generateTrendingItems(): string[] {
    const trendingTopics = [
      'AI Revolution',
      'Climate Action',
      'Space Exploration',
      'Quantum Computing',
      'Renewable Energy',
      'Digital Privacy',
      'Virtual Reality',
      'Biotechnology',
      'Cryptocurrency',
      'Sustainable Living',
    ];
    
    return trendingTopics
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
  }

  // Method to manually trigger updates (for testing)
  triggerUpdate(type: RealTimeUpdate['type'], data: any): void {
    const update: RealTimeUpdate = {
      type,
      data,
      timestamp: Date.now(),
    };

    this.callbacks.forEach((callback) => {
      callback(update);
    });
  }
}