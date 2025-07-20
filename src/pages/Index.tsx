import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Settings, 
  User, 
  Bell, 
  Grid, 
  List, 
  Filter, 
  RefreshCw,
  TrendingUp,
  Heart,
  LogIn,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { RootState } from '@/store';
import { 
  setSearchQuery, 
  setSelectedCategory, 
  reorderContent,
  setContent,
  addContent,
  ContentItem,
} from '@/store/slices/contentSlice';
import { 
  setActiveView, 
  toggleSettings, 
  setTheme 
} from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { ContentCard } from '@/components/content/ContentCard';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { AuthModal } from '@/components/auth/AuthModal';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { triggerManualUpdate } = useRealTimeUpdates();
  
  const { 
    filteredItems, 
    favorites, 
    bookmarks, 
    searchQuery, 
    selectedCategory, 
    isLoading 
  } = useSelector((state: RootState) => state.content);
  
  const { 
    activeView, 
    theme, 
    isSettingsOpen 
  } = useSelector((state: RootState) => state.ui);
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const categories = [
    'all', 'news', 'entertainment', 'social', 'technology', 
    'sports', 'science', 'health', 'business'
  ];

  // Initialize content
  useEffect(() => {
    const initializeContent = async () => {
      dispatch(setContent(generateMockContent(20)));
    };

    initializeContent();
  }, [dispatch]);

  const generateMockContent = (count: number): ContentItem[] => {
    const categories = ['news', 'entertainment', 'social', 'technology', 'sports', 'science', 'health', 'business'] as const;
    const authors = ['Alex Johnson', 'Sarah Chen', 'Mike Rodriguez', 'Emma Thompson', 'David Kim', 'Lisa Park', 'James Wilson'];
    
    return Array.from({ length: count }, (_, i) => {
      const category = categories[Math.floor(Math.random() * categories.length)];
      return {
        id: `item-${i + 1}`,
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Article ${i + 1}`,
        description: `This is a sample description for ${category} content. It provides insights and valuable information about the latest trends and developments.`,
        category,
        author: authors[Math.floor(Math.random() * authors.length)],
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        imageUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400&h=250&fit=crop`,
        url: `https://example.com/article/${i + 1}`,
        isFavorite: Math.random() > 0.8,
        isBookmarked: Math.random() > 0.7,
        readTime: Math.floor(Math.random() * 10) + 1,
        tags: [category, 'trending', 'featured'].slice(0, Math.floor(Math.random() * 3) + 1),
        engagement: {
          likes: Math.floor(Math.random() * 100),
          shares: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 25),
        },
      };
    });
  };

  const handleSearch = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  const handleCategoryFilter = (category: string) => {
    dispatch(setSelectedCategory(category));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      const newContent = generateMockContent(5);
      dispatch(addContent(newContent));
      setIsRefreshing(false);
      
      toast({
        title: t('common.success'),
        description: 'New content loaded successfully',
      });
    }, 1000);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: t('auth.logoutSuccess'),
      description: 'You have been logged out successfully',
    });
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    dispatch(setTheme(newTheme));
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const getCurrentContent = () => {
    switch (activeView) {
      case 'favorites':
        return favorites;
      case 'trending':
        return filteredItems.filter(item => item.tags.includes('trending'));
      default:
        return filteredItems;
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    dispatch(reorderContent({
      fromIndex: result.source.index,
      toIndex: result.destination.index,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">CD</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Content Dashboard
              </span>
            </div>
          </div>

          {/* Navigation */}
          <Tabs value={activeView} onValueChange={(value) => dispatch(setActiveView(value as any))}>
            <TabsList>
              <TabsTrigger value="feed">{t('nav.feed')}</TabsTrigger>
              <TabsTrigger value="trending">{t('nav.trending')}</TabsTrigger>
              <TabsTrigger value="favorites">{t('nav.favorites')}</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9 w-9 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(toggleSettings())}
                  className="h-9 w-9 p-0"
                >
                  <Settings className="h-4 w-4" />
                </Button>

                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="h-9 w-9 p-0"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                {t('auth.login')}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('content.search')}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => handleCategoryFilter(category)}
              >
                {category === 'all' ? 'All' : t(`categories.${category}`)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="content-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence>
                  {getCurrentContent().map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ContentCard
                            item={item}
                            index={index}
                            isDragging={snapshot.isDragging}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {getCurrentContent().length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('content.noResults')}</p>
          </div>
        )}
      </main>

      {/* Modals */}
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => dispatch(toggleSettings())} 
      />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
