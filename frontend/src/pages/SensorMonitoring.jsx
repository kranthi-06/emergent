import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const mockSensors = [
  { id: 1, name: 'Soil Moisture Sensor 1', value: 45.2, unit: '%', status: 'normal', lastUpdated: '2 min ago' },
  { id: 2, name: 'Soil Moisture Sensor 2', value: 38.7, unit: '%', status: 'warning', lastUpdated: '2 min ago' },
  { id: 3, name: 'Temperature Sensor 1', value: 28.5, unit: '°C', status: 'normal', lastUpdated: '1 min ago' },
  { id: 4, name: 'Temperature Sensor 2', value: 42.1, unit: '°C', status: 'critical', lastUpdated: '1 min ago' },
  { id: 5, name: 'Humidity Sensor 1', value: 65.3, unit: '%', status: 'normal', lastUpdated: '3 min ago' },
  { id: 6, name: 'Humidity Sensor 2', value: 58.9, unit: '%', status: 'normal', lastUpdated: '3 min ago' },
  { id: 7, name: 'pH Sensor', value: 6.8, unit: 'pH', status: 'normal', lastUpdated: '5 min ago' },
  { id: 8, name: 'Light Intensity Sensor', value: 850, unit: 'lux', status: 'normal', lastUpdated: '2 min ago' },
  { id: 9, name: 'NPK Sensor', value: 245, unit: 'ppm', status: 'warning', lastUpdated: '10 min ago' },
];

export default function SensorMonitoring() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredSensors = mockSensors.filter(sensor => {
    const matchesSearch = sensor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || sensor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'normal':
        return <Badge className="status-normal">Normal</Badge>;
      case 'warning':
        return <Badge className="status-warning">Warning</Badge>;
      case 'critical':
        return <Badge className="status-critical">Critical</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const statusCounts = {
    all: mockSensors.length,
    normal: mockSensors.filter(s => s.status === 'normal').length,
    warning: mockSensors.filter(s => s.status === 'warning').length,
    critical: mockSensors.filter(s => s.status === 'critical').length,
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
                    <TableCell className="text-muted-foreground">{sensor.lastUpdated}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredSensors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No sensors found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
