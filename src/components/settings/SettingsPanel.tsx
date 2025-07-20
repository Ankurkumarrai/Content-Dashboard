import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Globe, Palette, Bell, Shield, Clock, Eye, Save, X } from 'lucide-react';
import { RootState } from '@/store';
import { setTheme, setLanguage } from '@/store/slices/uiSlice';
import { updateUserPreferences, updateUserProfile } from '@/store/slices/authSlice';
import { useToast } from '@/hooks/use-toast';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme, language } = useSelector((state: RootState) => state.ui);
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  const [localSettings, setLocalSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    language: language,
    theme: theme,
    notifications: {
      push: user?.preferences.notifications.push || false,
      email: user?.preferences.notifications.email || false,
    },
    contentTypes: user?.preferences.contentTypes || [],
    refreshRate: user?.preferences.refreshRate || 30000,
    displayDensity: user?.preferences.displayDensity || 'comfortable',
    autoRefresh: user?.preferences.autoRefresh ?? true,
  });

  const handleSave = () => {
    if (user) {
      dispatch(updateUserProfile({
        name: localSettings.name,
        email: localSettings.email,
      }));

      dispatch(updateUserPreferences({
        language: localSettings.language,
        theme: localSettings.theme,
        notifications: localSettings.notifications,
        contentTypes: localSettings.contentTypes,
        refreshRate: localSettings.refreshRate,
        displayDensity: localSettings.displayDensity as 'compact' | 'comfortable' | 'spacious',
        autoRefresh: localSettings.autoRefresh,
      }));
    }

    toast({
      title: t('common.success'),
      description: 'Settings saved successfully',
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            {t('settings.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Auto Refresh</Label>
                <Switch
                  checked={localSettings.autoRefresh}
                  onCheckedChange={(checked) => {
                    setLocalSettings({ ...localSettings, autoRefresh: checked });
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};