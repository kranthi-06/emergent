import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Filter, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { formatDistanceToNow } from 'date-fns';

export default function SensorMonitoring() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sensors, setSensors] = useState([]);

  // Initialize history from localStorage to show recent data if offline
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('sensor_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sensors');
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
          localStorage.setItem('sensor_history', JSON.stringify(data));

          if (data && data.length > 0) {
            const latest = data[0];
            const timestamp = latest.timestamp ? new Date(latest.timestamp) : new Date();

            // Map the single latest reading to "Virtual" sensors for the table
            setSensors([
              {
                id: 'soil-1',
                name: 'Soil Moisture Sensor',
                value: latest.soil_moisture,
                unit: '%',
                status: latest.soil_moisture < 40 ? 'warning' : 'normal',
                lastUpdated: timestamp
              },
              {
                id: 'temp-1',
                name: 'Temperature Sensor',
                value: latest.temperature,
                unit: '°C',
                status: latest.temperature > 35 ? 'warning' : 'normal',
                lastUpdated: timestamp
              },
              {
                id: 'hum-1',
                name: 'Humidity Sensor',
                value: latest.humidity,
                unit: '%',
                status: latest.humidity > 80 ? 'warning' : 'normal',
                lastUpdated: timestamp
              }
            ]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch sensor data", error);
        // Fallback: If we have history but fetch failed, reconstruct "Sensors" from cached latest history
        const saved = localStorage.getItem('sensor_history');
        if (saved) {
          const data = JSON.parse(saved);
          if (data && data.length > 0) {
            const latest = data[0];
            const timestamp = latest.timestamp ? new Date(latest.timestamp) : new Date();
            setSensors([
              {
                id: 'soil-1',
                name: 'Soil Moisture Sensor',
                value: latest.soil_moisture,
                unit: '%',
                status: latest.soil_moisture < 40 ? 'warning' : 'normal',
                lastUpdated: timestamp
              },
              {
                id: 'temp-1',
                name: 'Temperature Sensor',
                value: latest.temperature,
                unit: '°C',
                status: latest.temperature > 35 ? 'warning' : 'normal',
                lastUpdated: timestamp
              },
              {
                id: 'hum-1',
                name: 'Humidity Sensor',
                value: latest.humidity,
                unit: '%',
                status: latest.humidity > 80 ? 'warning' : 'normal',
                lastUpdated: timestamp
              }
            ]);
          }
        }
      }
    };

    fetchData(); // Run immediately
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    // Export the history, not just the current view
    if (!history || history.length === 0) return;

    const headers = ['Timestamp', 'Soil Moisture (%)', 'Temperature (C)', 'Humidity (%)', 'Pump Status'];
    const csvContent = [
      headers.join(','),
      ...history.map(row => [
        new Date(row.timestamp).toISOString(),
        row.soil_moisture,
        row.temperature,
        row.humidity,
        row.pump_status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor_data_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const filteredSensors = sensors.filter(sensor => {
    const matchesSearch = sensor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || sensor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'normal':
        return <Badge className="bg-green-500 hover:bg-green-600">Normal</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>;
      case 'critical':
        return <Badge className="bg-red-500 hover:bg-red-600">Critical</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const statusCounts = {
    all: sensors.length,
    normal: sensors.filter(s => s.status === 'normal').length,
    warning: sensors.filter(s => s.status === 'warning').length,
    critical: sensors.filter(s => s.status === 'critical').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Sensor Monitoring</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time sensor data and status</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Active Sensors</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search sensors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              <Filter className="w-4 h-4 mr-2" />
              All ({statusCounts.all})
            </Button>
            <Button
              variant={filterStatus === 'normal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('normal')}
              className={filterStatus === 'normal' ? '' : 'hover:bg-green-500/10'}
            >
              Normal ({statusCounts.normal})
            </Button>
            <Button
              variant={filterStatus === 'warning' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('warning')}
              className={filterStatus === 'warning' ? '' : 'hover:bg-yellow-500/10'}
            >
              Warning ({statusCounts.warning})
            </Button>
            <Button
              variant={filterStatus === 'critical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('critical')}
              className={filterStatus === 'critical' ? '' : 'hover:bg-red-500/10'}
            >
              Critical ({statusCounts.critical})
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sensor Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSensors.map((sensor) => (
                  <TableRow key={sensor.id}>
                    <TableCell className="font-medium">{sensor.name}</TableCell>
                    <TableCell className="font-semibold">{sensor.value}</TableCell>
                    <TableCell className="text-muted-foreground">{sensor.unit}</TableCell>
                    <TableCell>{getStatusBadge(sensor.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {sensor.lastUpdated ? formatDistanceToNow(sensor.lastUpdated, { addSuffix: true }) : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredSensors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active sensors found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
