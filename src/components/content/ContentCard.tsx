import React from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Bookmark, Share2, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import { Article } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  item: Article;
  index: number;
  isDragging?: boolean;
}

const categoryColors = {
  news: 'bg-blue-500/10 text-blue-600 border-blue-200',
  entertainment: 'bg-purple-500/10 text-purple-600 border-purple-200',
  social: 'bg-green-500/10 text-green-600 border-green-200',
  technology: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
  sports: 'bg-orange-500/10 text-orange-600 border-orange-200',
  science: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
  health: 'bg-red-500/10 text-red-600 border-red-200',
  business: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
};

export const ContentCard: React.FC<ContentCardProps> = ({ item, index, isDragging = false }) => {
  const dispatch = useDispatch();

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement Supabase favorite toggle
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement Supabase bookmark toggle
  };

  const handleCardClick = () => {
    window.open(item.external_url || '#', '_blank', 'noopener,noreferrer');
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const published = new Date(item.published_at);
    const diffInMinutes = Math.floor((now.getTime() - published.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className={cn('group', isDragging && 'opacity-50')}
    >
      <Card 
        className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg border-border/50 bg-card/50 backdrop-blur-sm"
        onClick={handleCardClick}
      >
        {item.image_url && (
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute top-3 left-3">
              <Badge 
                variant="secondary" 
                className={cn('font-medium border', categoryColors[item.category])}
              >
                {item.category}
              </Badge>
            </div>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={item.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.author)}&background=6366f1&color=fff&size=24`} />
                <AvatarFallback className="text-xs">
                  {item.author.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{item.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-8 w-8 p-0 transition-colors text-muted-foreground hover:text-red-500'
                )}
                onClick={handleFavoriteToggle}
                aria-label="Add to favorites"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-8 w-8 p-0 transition-colors text-muted-foreground hover:text-blue-500'
                )}
                onClick={handleBookmarkToggle}
                aria-label="Add bookmark"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
            {item.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <CardDescription className="text-sm line-clamp-3 mb-4">
            {item.description}
          </CardDescription>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{item.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Share2 className="h-3 w-3" />
                <span>{item.shares}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{item.comments}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {item.read_time && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{item.read_time} min read</span>
                </div>
              )}
              <span>{formatTimeAgo(item.published_at)}</span>
            </div>
          </div>

          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {item.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {item.tags.length > 3 && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  +{item.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};