import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

export default function Settings() {
  const [settings, setSettings] = useState({
    moistureMin: 30,
    moistureMax: 70,
    tempMin: 20,
    tempMax: 35,
    humidityMin: 50,
    humidityMax: 80,
    autoIrrigation: true,
    notifications: true,
    emailAlerts: false,
    darkMode: false,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    setSettings({
      moistureMin: 30,
      moistureMax: 70,
      tempMin: 20,
      tempMax: 35,
      humidityMin: 50,
      humidityMax: 80,
      autoIrrigation: true,
      notifications: true,
      emailAlerts: false,
      darkMode: false,
    });
    toast.info('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your system preferences</p>
      </div>

      {/* Sensor Calibration */}
      <Card>
        <CardHeader>
          <CardTitle>Sensor Calibration</CardTitle>
          <CardDescription>Set threshold values for sensor readings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Soil Moisture */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Soil Moisture Range (%)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="moisture-min">Minimum Threshold</Label>
                <Input
                  id="moisture-min"
                  type="number"
                  value={settings.moistureMin}
                  onChange={(e) => setSettings({ ...settings, moistureMin: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moisture-max">Maximum Threshold</Label>
                <Input
                  id="moisture-max"
                  type="number"
                  value={settings.moistureMax}
                  onChange={(e) => setSettings({ ...settings, moistureMax: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Temperature */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Temperature Range (°C)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temp-min">Minimum Threshold</Label>
                <Input
                  id="temp-min"
                  type="number"
                  value={settings.tempMin}
                  onChange={(e) => setSettings({ ...settings, tempMin: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temp-max">Maximum Threshold</Label>
                <Input
                  id="temp-max"
                  type="number"
                  value={settings.tempMax}
                  onChange={(e) => setSettings({ ...settings, tempMax: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Humidity */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Humidity Range (%)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="humidity-min">Minimum Threshold</Label>
                <Input
                  id="humidity-min"
                  type="number"
                  value={settings.humidityMin}
                  onChange={(e) => setSettings({ ...settings, humidityMin: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="humidity-max">Maximum Threshold</Label>
                <Input
                  id="humidity-max"
                  type="number"
                  value={settings.humidityMax}
                  onChange={(e) => setSettings({ ...settings, humidityMax: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>System Preferences</CardTitle>
          <CardDescription>Configure system behavior and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-irrigation" className="text-base font-semibold">Auto Irrigation</Label>
              <p className="text-sm text-muted-foreground">
                Automatically control irrigation based on sensor readings
              </p>
            </div>
            <Switch
              id="auto-irrigation"
              checked={settings.autoIrrigation}
              onCheckedChange={(checked) => setSettings({ ...settings, autoIrrigation: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="text-base font-semibold">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive real-time notifications for alerts and updates
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-alerts" className="text-base font-semibold">Email Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive critical alerts via email
              </p>
            </div>
            <Switch
              id="email-alerts"
              checked={settings.emailAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, emailAlerts: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleSave} className="flex-1">
          Save Changes
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex-1">
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
