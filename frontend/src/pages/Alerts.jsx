import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AlertTriangle, CheckCircle, Info, XCircle, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Alerts() {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [showResolved, setShowResolved] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/alerts');
        if (res.ok) {
          const data = await res.json();
          // Map API keys to component keys if needed
          const mapped = data.map(a => ({
            id: a.id,
            severity: a.type.toLowerCase(), // CRITICAL -> critical
            message: a.message,
            timestamp: a.timestamp,
            resolved: a.read // Using 'read' as resolved for now
          }));
          setAlerts(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // Polling alerts
    return () => clearInterval(interval);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesResolved = showResolved || true; // Show all for now as we don't have a 'resolved' toggle in backend yet
    return matchesSeverity && matchesResolved;
  });

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[hsl(var(--warning))]" />;
      case 'normal':
        return <CheckCircle className="w-5 h-5 text-[hsl(var(--success))]" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAlertBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-500 hover:bg-red-600">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>;
      case 'normal':
        return <Badge className="bg-green-500 hover:bg-green-600">Normal</Badge>;
      default:
        return <Badge variant="outline">Info</Badge>;
    }
  };

  const severityCounts = {
    all: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    info: alerts.filter(a => a.severity === 'info').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Alerts & Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">System notifications and event logs</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold">{severityCounts.all}</p>
              </div>
              <Info className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-destructive">{severityCounts.critical}</p>
              </div>
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold text-[hsl(var(--warning))]">{severityCounts.warning}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-[hsl(var(--warning))]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Info</p>
                <p className="text-2xl font-bold text-blue-500">{severityCounts.info}</p>
              </div>
              <Info className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Alert History</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterSeverity === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterSeverity('all')}
              >
                <Filter className="w-4 h-4 mr-2" />
                All
              </Button>
              <Button
                variant={filterSeverity === 'critical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterSeverity('critical')}
              >
                Critical
              </Button>
              <Button
                variant={filterSeverity === 'warning' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterSeverity('warning')}
              >
                Warning
              </Button>
              <Button
                variant={filterSeverity === 'info' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterSeverity('info')}
              >
                Info
              </Button>
              {/* Feature toggle disabled for now as backend 'read' state is not yet toggleable via UI */}
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResolved(!showResolved)}
              >
                {showResolved ? 'Hide' : 'Show'} Resolved
              </Button> */}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No alerts found</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${alert.resolved ? 'bg-muted/50 opacity-60' : 'bg-card'
                    }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-foreground">{alert.message}</p>
                      {getAlertBadge(alert.severity)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {alert.timestamp ? formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true }) : 'Unknown time'}
                      </span>
                      {alert.resolved && (
                        <Badge variant="outline" className="status-normal">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Read
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
