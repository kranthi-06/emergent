import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Droplets, Thermometer, Wind, Power, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export default function Dashboard() {
  const [stats, setStats] = useState({
    soilMoisture: 0,
    temperature: 0,
    humidity: 0,
    pumpStatus: 'OFF'
  });

  // Fetch real-time updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sensors');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        // If we have data, use the latest reading
        if (data && data.length > 0) {
          const latest = data[0]; // Assuming sorted by timestamp desc
          setStats({
            soilMoisture: latest.soil_moisture,
            temperature: latest.temperature,
            humidity: latest.humidity,
            pumpStatus: latest.pump_status
          });
        }
      } catch (error) {
        console.error("Failed to fetch sensor data:", error);
      }
    };

    // Fetch immediately on mount
    fetchData();

    // Poll every 5 seconds
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const statCards = [
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
      title: 'Temperature',
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your smart agriculture system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    {stat.trend && (
                      <div className="flex items-center gap-1">
                        <TrendIcon className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                        <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.trendValue}
                        </span>
                        <span className="text-xs text-muted-foreground">from yesterday</span>
                      </div>
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
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  <span className="text-sm font-medium">All Sensors Online</span>
                </div>
                <Badge variant="outline" className="status-normal">Normal</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  <span className="text-sm font-medium">Irrigation System</span>
                </div>
                <Badge variant="outline" className="status-normal">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-warning animate-pulse"></div>
                  <span className="text-sm font-medium">Water Tank Level</span>
                </div>
                <Badge variant="outline" className="status-warning">Low (35%)</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  <span className="text-sm font-medium">Network Connection</span>
                </div>
                <Badge variant="outline" className="status-normal">Stable</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-warning pl-4 py-2">
                <p className="text-sm font-medium">Soil moisture below threshold</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <div className="border-l-4 border-success pl-4 py-2">
                <p className="text-sm font-medium">Irrigation cycle completed</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-sm font-medium">Temperature optimal for crops</p>
                <p className="text-xs text-muted-foreground">8 hours ago</p>
              </div>
              <div className="border-l-4 border-warning pl-4 py-2">
                <p className="text-sm font-medium">High humidity detected</p>
                <p className="text-xs text-muted-foreground">12 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
