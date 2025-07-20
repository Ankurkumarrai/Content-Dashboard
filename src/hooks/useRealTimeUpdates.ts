import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RealTimeService, RealTimeUpdate } from '@/services/realTimeService';
import { addContent } from '@/store/slices/contentSlice';
import { addNotification } from '@/store/slices/uiSlice';
import { RootState } from '@/store';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeUpdates = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const autoRefresh = user?.preferences.autoRefresh ?? true;

  const handleRealTimeUpdate = useCallback((update: RealTimeUpdate) => {
    if (!autoRefresh) return;

    switch (update.type) {
      case 'new_content':
        // Add new content to the store
        dispatch(addContent([update.data]));
        
        // Show notification if user has notifications enabled
        if (user?.preferences.notifications.push) {
          dispatch(addNotification({
            type: 'info',
            title: 'New Content Available',
            message: `New ${update.data.category} content: ${update.data.title}`,
          }));

          // Show toast for immediate feedback
          toast({
            title: 'New Content',
            description: update.data.title,
            duration: 3000,
          });
        }
        break;

      case 'trending_update':
        // Handle trending updates
        if (user?.preferences.notifications.push) {
          dispatch(addNotification({
            type: 'info',
            title: 'Trending Update',
            message: `New trending topics: ${update.data.trendingItems.slice(0, 2).join(', ')}`,
          }));
        }
        break;

      case 'user_interaction':
        // Handle user interaction updates (likes, shares, etc.)
        if (Math.random() > 0.8) { // Only show 20% of interaction updates to avoid spam
          dispatch(addNotification({
            type: 'success',
            title: 'Engagement Update',
            message: `Content received ${update.data.count} new ${update.data.action}s`,
          }));
        }
        break;
    }
  }, [dispatch, toast, user, autoRefresh]);

  useEffect(() => {
    if (!user || !autoRefresh) return;

    const realTimeService = RealTimeService.getInstance();
    const subscriberId = `user-${user.id}`;

    realTimeService.subscribe(subscriberId, handleRealTimeUpdate);

    return () => {
      realTimeService.unsubscribe(subscriberId);
    };
  }, [handleRealTimeUpdate, user, autoRefresh]);

  // Manual refresh function
  const triggerManualUpdate = useCallback(() => {
    const realTimeService = RealTimeService.getInstance();
    realTimeService.triggerUpdate('new_content', realTimeService['generateMockContent']());
  }, []);

  return {
    triggerManualUpdate,
  };
};