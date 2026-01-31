import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Droplets, Thermometer, Wind, Power, TrendingUp, TrendingDown, CloudSun, CloudRain, CloudSnow, Sun, Cloud, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  // Initialize from LocalStorage or Default
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('dashboard_stats');
    return saved ? JSON.parse(saved) : {
      soilMoisture: 0,
      temperature: 0,
      humidity: 0,
      pumpStatus: 'OFF'
    };
  });

  const [weather, setWeather] = useState(() => {
    const saved = localStorage.getItem('dashboard_weather');
    return saved ? JSON.parse(saved) : {
      temp: '--',
      condition: 'Loading...',
      iconName: 'CloudSun', // Store string name, resolve icon on render
      isDay: 1
    };
  });

  const resolveIcon = (iconName) => {
    const icons = { CloudSun, CloudRain, CloudSnow, Sun, Cloud };
    return icons[iconName] || CloudSun;
  };

  const [systemHealth, setSystemHealth] = useState({
    database: 'Offline',
    esp32: 'Offline',
    api: 'Offline'
  });

  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('dashboard_alerts');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch all real-time data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Sensors
        const sensRes = await fetch('/api/sensors');
        if (sensRes.ok) {
          const data = await sensRes.json();
          if (data && data.length > 0) {
            const latest = data[0];
            const newStats = {
              soilMoisture: latest.soil_moisture,
              temperature: latest.temperature,
              humidity: latest.humidity,
              pumpStatus: latest.pump_status
            };
            setStats(newStats);
            localStorage.setItem('dashboard_stats', JSON.stringify(newStats));
          }
        }

        // 2. System Status
        const statusRes = await fetch('/api/status');
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setSystemHealth(statusData);
        } else {
          // API is responding but maybe error'd
          setSystemHealth(prev => ({ ...prev, api: 'Online' }));
        }

        // 3. Alerts
        const alertRes = await fetch('/api/alerts');
        if (alertRes.ok) {
          const alertData = await alertRes.json();
          setAlerts(alertData);
          localStorage.setItem('dashboard_alerts', JSON.stringify(alertData));
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // On Error: Keep existing stats (from cache), just mark API offline
        setSystemHealth(prev => ({ ...prev, api: 'Offline' }));
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Outdoor Weather (OpenMeteo)
  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day`);
        const data = await res.json();

        // WMO Weather interpretation
        const code = data.current.weather_code;
        const isDay = data.current.is_day;
        let condition = 'Clear';
        let iconName = isDay ? 'Sun' : 'CloudSun';

        if (code === 0) { condition = 'Clear'; iconName = isDay ? 'Sun' : 'Cloud'; }
        else if (code >= 1 && code <= 3) { condition = 'Partly Cloudy'; iconName = 'CloudSun'; }
        else if (code >= 45 && code <= 48) { condition = 'Foggy'; iconName = 'Cloud'; }
        else if (code >= 51 && code <= 67) { condition = 'Rain'; iconName = 'CloudRain'; }
        else if (code >= 71 && code <= 77) { condition = 'Snow'; iconName = 'CloudSnow'; }
        else if (code >= 80 && code <= 99) { condition = 'Storm'; iconName = 'CloudRain'; }

        const newWeather = {
          temp: data.current.temperature_2m,
          condition: condition,
          iconName: iconName,
          isDay: isDay
        };
        setWeather(newWeather);
        localStorage.setItem('dashboard_weather', JSON.stringify(newWeather));

      } catch (e) {
        console.error("Weather fetch failed", e);
        // keep old weather if fail
      }
    };

    // Try to get location, default to generic if failed/denied
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          fetchWeather(17.3850, 78.4867); // Default
        }
      );
    } else {
      fetchWeather(17.3850, 78.4867);
    }
  }, []);

  const statCards = [
    // Weather Card (New)
    {
      title: 'Local Weather',
      value: `${weather.temp}°C`,
      icon: resolveIcon(weather.iconName), // dynamic resolve
      trend: null, // No trend for simple weather yet
      trendValue: weather.condition, // reusing this slot for text
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'Soil Moisture',
      value: `${stats.soilMoisture.toFixed(1)}%`,
      icon: Droplets,
      trend: stats.soilMoisture > 40 ? 'up' : 'down',
      trendValue: '+2.4%',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Temperature (Inside)',
      value: `${stats.temperature.toFixed(1)}°C`,
      icon: Thermometer,
      trend: 'up',
      trendValue: '+0.8°C',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      title: 'Humidity',
      value: `${stats.humidity.toFixed(1)}%`,
      icon: Wind,
      trend: 'down',
      trendValue: '-1.2%',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    },
    {
      title: 'Pump Status',
      value: stats.pumpStatus,
      icon: Power,
      trend: null,
      color: stats.pumpStatus === 'ON' ? 'text-green-500' : 'text-muted-foreground',
      bgColor: stats.pumpStatus === 'ON' ? 'bg-green-500/10' : 'bg-muted'
    }
  ];

  const getStatusColor = (status) => status === 'Online' ? 'bg-green-500' : 'bg-red-500';
  const getStatusBadge = (status) => status === 'Online' ? 'success' : 'destructive';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your smart agriculture system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;

          return (
            <Card key={index} className="stat-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{stat.value}</h3>

                    {/* Special case for Weather (show condition text instead of trend) */}
                    {stat.title === 'Local Weather' ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {stat.trendValue}
                        </span>
                      </div>
                    ) : (
                      stat.trend && (
                        <div className="flex items-center gap-1">
                          <TrendIcon className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                          <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            {stat.trendValue}
                          </span>
                          <span className="text-xs text-muted-foreground">from yesterday</span>
                        </div>
                      )
                    )}
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(systemHealth.api)} animate-pulse`}></div>
                  <span className="text-sm font-medium">Backend API</span>
                </div>
                <Badge variant={systemHealth.api === 'Online' ? 'outline' : 'destructive'} className={systemHealth.api === 'Online' ? 'text-green-500' : ''}>
                  {systemHealth.api}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(systemHealth.database)} animate-pulse`}></div>
                  <span className="text-sm font-medium">Database (MongoDB)</span>
                </div>
                <Badge variant={systemHealth.database === 'Online' ? 'outline' : 'destructive'} className={systemHealth.database === 'Online' ? 'text-green-500' : ''}>
                  {systemHealth.database}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(systemHealth.esp32)} animate-pulse`}></div>
                  <span className="text-sm font-medium">ESP32 Device</span>
                </div>
                <Badge variant={systemHealth.esp32 === 'Online' ? 'outline' : 'destructive'} className={systemHealth.esp32 === 'Online' ? 'text-green-500' : ''}>
                  {systemHealth.esp32}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No recent alerts</p>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className={`border-l-4 pl-4 py-2 ${alert.type === 'WARNING' ? 'border-warning' : alert.type === 'CRITICAL' ? 'border-red-500' : 'border-blue-500'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
