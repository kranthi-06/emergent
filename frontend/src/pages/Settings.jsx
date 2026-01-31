import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

export default function Settings() {
  const [settings, setSettings] = useState({
    auto_mode: true,
    moisture_threshold: 40,
    manual_pump_state: false,
    alert_mobile: '',
    alert_email: '',
    enable_sms: false,
    enable_email: false
  });

  const [loading, setLoading] = useState(true);

  // Fetch settings from API
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          setSettings(prev => ({
            ...prev,
            auto_mode: data.auto_mode,
            moisture_threshold: data.moisture_threshold,
            manual_pump_state: data.manual_pump_state,
            alert_mobile: data.alert_mobile || '',
            alert_email: data.alert_email || '',
            enable_sms: data.enable_sms || false,
            enable_email: data.enable_email || false
          }));
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast.success('Settings saved successfully');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your system preferences</p>
      </div>

      {/* Automation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Automation</CardTitle>
          <CardDescription>Control how the system behaves automatically</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-mode" className="text-base font-semibold">Auto Mode</Label>
              <p className="text-sm text-muted-foreground">
                Automatically turn pump ON/OFF based on moisture levels
              </p>
            </div>
            <Switch
              id="auto-mode"
              checked={settings.auto_mode}
              onCheckedChange={(checked) => setSettings({ ...settings, auto_mode: checked })}
            />
          </div>

          {settings.auto_mode && (
            <div className="space-y-3 pt-4">
              <Label htmlFor="moisture-threshold">Moisture Threshold (%)</Label>
              <div className="text-sm text-muted-foreground mb-2">
                Pump turns ON when moisture is below this value.
              </div>
              <Input
                id="moisture-threshold"
                type="number"
                value={settings.moisture_threshold}
                onChange={(e) => setSettings({ ...settings, moisture_threshold: Number(e.target.value) })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings (User Requested) */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure alerts sent to your phone and email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* SMS Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-sms" className="text-base font-semibold">SMS Alerts</Label>
              <Switch
                id="enable-sms"
                checked={settings.enable_sms}
                onCheckedChange={(checked) => setSettings({ ...settings, enable_sms: checked })}
              />
            </div>
            {settings.enable_sms && (
              <div className="space-y-2">
                <Label htmlFor="mobile-number">Mobile Number</Label>
                <Input
                  id="mobile-number"
                  placeholder="+1234567890"
                  value={settings.alert_mobile}
                  onChange={(e) => setSettings({ ...settings, alert_mobile: e.target.value })}
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Email Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-email" className="text-base font-semibold">Email Alerts</Label>
              <Switch
                id="enable-email"
                checked={settings.enable_email}
                onCheckedChange={(checked) => setSettings({ ...settings, enable_email: checked })}
              />
            </div>
            {settings.enable_email && (
              <div className="space-y-2">
                <Label htmlFor="email-address">Email Address</Label>
                <Input
                  id="email-address"
                  placeholder="you@example.com"
                  value={settings.alert_email}
                  onChange={(e) => setSettings({ ...settings, alert_email: e.target.value })}
                />
              </div>
            )}
          </div>

        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleSave} className="flex-1">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
