import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Power, Droplets, Settings2, Activity, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export default function IrrigationControl() {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    auto_mode: true,
    moisture_threshold: 40,
    manual_pump_state: false
  });

  // Fetch initial config on load
  const fetchConfig = async () => {
    try {
      const response = await axios.get('/api/config');
      // If the API returns a valid config, use it
      if (response.data) {
        setConfig(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
      toast.error('Failed to load settings from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const updateConfig = async (newConfig) => {
    try {
      const response = await axios.post('/api/config', newConfig);
      setConfig(response.data);
      return true;
    } catch (error) {
      console.error('Failed to update config:', error);
      toast.error('Failed to save settings');
      return false;
    }
  };

  const handlePumpToggle = async () => {
    if (config.auto_mode) {
      toast.error('Please switch to Manual mode first');
      return;
    }

    const newState = !config.manual_pump_state;
    const success = await updateConfig({
      ...config,
      manual_pump_state: newState
    });

    if (success) {
      toast.success(newState ? 'Pump turned ON' : 'Pump turned OFF');
    }
  };

  const handleAutoModeToggle = async () => {
    const newMode = !config.auto_mode;
    const success = await updateConfig({
      ...config,
      auto_mode: newMode
    });

    if (success) {
      toast.success(newMode ? 'Auto mode enabled' : 'Manual mode enabled');
    }
  };

  const handleThresholdUpdate = async () => {
    const success = await updateConfig({
      ...config
    });

    if (success) {
      toast.success(`Moisture threshold updated to ${config.moisture_threshold}%`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Irrigation Control</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your irrigation system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pump Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Power className="w-5 h-5" />
              Pump Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${config.manual_pump_state && !config.auto_mode
                  ? 'bg-green-500/20 ring-4 ring-green-500/30'
                  : 'bg-muted'
                }`}>
                <Power className={`w-16 h-16 ${config.manual_pump_state && !config.auto_mode ? 'text-green-500' : 'text-muted-foreground'
                  }`} />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold">
                  {config.auto_mode ? 'AUTO' : (config.manual_pump_state ? 'ON' : 'OFF')}
                </h3>
                <p className="text-sm text-muted-foreground">Current Status</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handlePumpToggle}
                disabled={config.auto_mode}
                size="lg"
                className="h-20 bg-green-600 hover:bg-green-700 text-white"
              >
                <div className="flex flex-col items-center gap-2">
                  <Power className="w-6 h-6" />
                  <span>Turn ON</span>
                </div>
              </Button>
              <Button
                onClick={handlePumpToggle}
                disabled={config.auto_mode}
                size="lg"
                variant="outline"
                className="h-20 border-2"
              >
                <div className="flex flex-col items-center gap-2">
                  <Power className="w-6 h-6" />
                  <span>Turn OFF</span>
                </div>
              </Button>
            </div>

            {config.auto_mode && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  ℹ️ Pump is in Auto mode. Manual controls are disabled.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mode & Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              Control Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Auto/Manual Mode */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex-1">
                <Label htmlFor="auto-mode" className="text-base font-semibold">Auto Mode</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically control irrigation based on soil moisture
                </p>
              </div>
              <Switch
                id="auto-mode"
                checked={config.auto_mode}
                onCheckedChange={handleAutoModeToggle}
              />
            </div>

            {/* Moisture Threshold */}
            <div className="space-y-3">
              <Label htmlFor="threshold" className="text-base font-semibold">
                Moisture Threshold
              </Label>
              <p className="text-sm text-muted-foreground">
                Pump will activate when soil moisture drops below this value
              </p>
              <div className="flex items-center gap-4">
                <Input
                  id="threshold"
                  type="number"
                  value={config.moisture_threshold}
                  onChange={(e) => setConfig({ ...config, moisture_threshold: Number(e.target.value) })}
                  min="0"
                  max="100"
                  className="flex-1"
                />
                <span className="text-sm font-medium text-muted-foreground">%</span>
              </div>
              <Button onClick={handleThresholdUpdate} className="w-full">
                Update Threshold
              </Button>
            </div>

            {/* Relay Status - Now Reflective of Config */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">Logic Status</span>
                </div>
                <Badge variant="outline">
                  {config.auto_mode ? 'Automatic' : 'Manual Override'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Irrigation History (Static for now, but valid layout) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              Irrigation History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">History tracking will be available in the next update.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
