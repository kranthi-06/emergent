import React, { useState } from 'react';
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

// Mock data for charts
const generateMockData = () => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.getHours() + ':00',
      moisture: 35 + Math.random() * 20,
      temperature: 24 + Math.random() * 8,
      humidity: 55 + Math.random() * 20,
    });
  }
  return data;
};

const mockData = generateMockData();

const recentReadings = [
  { timestamp: '2024-01-15 14:30', moisture: '45.2%', temperature: '28.5°C', humidity: '65.3%' },
  { timestamp: '2024-01-15 14:00', moisture: '43.8%', temperature: '28.2°C', humidity: '66.1%' },
  { timestamp: '2024-01-15 13:30', moisture: '42.5%', temperature: '27.9°C', humidity: '64.8%' },
  { timestamp: '2024-01-15 13:00', moisture: '41.2%', temperature: '27.5°C', humidity: '63.5%' },
  { timestamp: '2024-01-15 12:30', moisture: '39.8%', temperature: '27.1°C', humidity: '62.2%' },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('24h');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analytics / History</h1>
          <p className="text-sm text-muted-foreground mt-1">Historical data and trends</p>
        </div>
        <div className="flex gap-2">
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
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Custom
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
            <AreaChart data={mockData}>
              <defs>
                <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(200, 70%, 50%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(200, 70%, 50%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
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
              <LineChart data={mockData}>
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
              <LineChart data={mockData}>
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
                {recentReadings.map((reading, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{reading.timestamp}</TableCell>
                    <TableCell>{reading.moisture}</TableCell>
                    <TableCell>{reading.temperature}</TableCell>
                    <TableCell>{reading.humidity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
