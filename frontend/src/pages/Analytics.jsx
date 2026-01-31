import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { format } from 'date-fns';

export default function Analytics() {
  const [dateRange, setDateRange] = useState('24h');

  // Initialize from LocalStorage or Default
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('analytics_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(!data.length); // Only loading if no cached data

  // Fetch real sensor data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would pass dateRange to the API
        const response = await fetch('/api/sensors');
        if (response.ok) {
          const rawData = await response.json();
          // Process data for charts
          // API returns desc (newest first). Charts need asc (oldest left).
          const reversed = [...rawData].reverse();

          const chartData = reversed.map(d => ({
            time: format(new Date(d.timestamp), 'HH:mm'),
            moisture: d.soil_moisture,
            temperature: d.temperature,
            humidity: d.humidity,
            originalTimestamp: d.timestamp
          }));

          setData(chartData);
          localStorage.setItem('analytics_data', JSON.stringify(chartData));
        }
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
        // On error, we rely on the cached data initialized in state
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, [dateRange]);

  // Recent readings (show last 5 desc)
  const recentReadings = [...data].reverse().slice(0, 5);

  if (loading && data.length === 0) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analytics / History</h1>
          <p className="text-sm text-muted-foreground mt-1">Historical data and trends</p>
        </div>
        <div className="flex gap-2">
          {/* Date range buttons could be wired up to API params later */}
          <Button
            variant={dateRange === '24h' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('24h')}
          >
            24 Hours
          </Button>
          <Button
            variant={dateRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={dateRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDateRange('30d')}
          >
            30 Days
          </Button>
        </div>
      </div>

      {/* Soil Moisture Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Soil Moisture Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(200, 70%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(200, 70%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: 'Moisture (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="moisture"
                stroke="hsl(200, 70%, 50%)"
                fill="url(#colorMoisture)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Temperature & Humidity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Temperature Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="time"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="hsl(38, 92%, 50%)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Humidity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="time"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: '%', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="hsl(180, 70%, 50%)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Readings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Soil Moisture</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead>Humidity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReadings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">No data available</TableCell>
                  </TableRow>
                ) : (
                  recentReadings.map((reading, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {format(new Date(reading.originalTimestamp), 'yyyy-MM-dd HH:mm:ss')}
                      </TableCell>
                      <TableCell>{reading.moisture}%</TableCell>
                      <TableCell>{reading.temperature}°C</TableCell>
                      <TableCell>{reading.humidity}%</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
