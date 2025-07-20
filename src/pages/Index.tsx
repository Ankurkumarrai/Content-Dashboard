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
  Bell, 
  RefreshCw,
  LogIn,
  LogOut,
  Sun,
  Moon,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { RootState } from '@/store';
import { 
  setContent,
  addContent,
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
import { useToast } from '@/hooks/use-toast';
import { 
  getArticles, 
  getFeaturedArticles, 
  getTrendingArticles, 
  searchArticles,
  getUserFavorites,
  getUserBookmarks,
  Article 
} from '@/lib/supabase';

const Index = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const { 
    activeView, 
    theme, 
    isSettingsOpen 
  } = useSelector((state: RootState) => state.ui);
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [favorites, setFavorites] = useState<Article[]>([]);
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    'all', 'news', 'entertainment', 'social', 'technology', 
    'sports', 'science', 'health', 'business'
  ];

  // Load articles from Supabase
  useEffect(() => {
    loadArticles();
  }, []);

  // Load user favorites and bookmarks when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  // Filter articles based on search and category
  useEffect(() => {
    let filtered = articles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredArticles(filtered);
  }, [articles, selectedCategory, searchQuery]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await getArticles();
      setArticles(data);
    } catch (error) {
      console.error('Error loading articles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load articles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    if (!user?.id) return;

    try {
      const [userFavorites, userBookmarks] = await Promise.all([
        getUserFavorites(user.id),
        getUserBookmarks(user.id),
      ]);
      
      setFavorites(userFavorites);
      setBookmarks(userBookmarks);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadArticles();
      if (isAuthenticated && user) {
        await loadUserData();
      }
      toast({
        title: t('common.success'),
        description: 'Content refreshed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh content',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
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
        return articles.filter(article => article.trending);
      default:
        return filteredArticles;
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    // Drag and drop functionality can be implemented here
    // For now, we'll keep the articles in their current order
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
