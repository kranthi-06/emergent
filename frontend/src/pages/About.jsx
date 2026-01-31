import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Leaf, Droplets, Cpu, Wifi, Database, TrendingUp } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Droplets,
      title: 'Smart Irrigation',
      description: 'Automated irrigation control based on real-time soil moisture data',
    },
    {
      icon: Cpu,
      title: 'IoT Sensors',
      description: 'Multiple sensors monitoring soil, temperature, humidity, and more',
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Historical data analysis and trend visualization for informed decisions',
    },
    {
      icon: Wifi,
      title: 'Real-time Monitoring',
      description: 'Live data updates and instant alerts for critical conditions',
    },
    {
      icon: Database,
      title: 'Data Logging',
      description: 'Comprehensive logging of all sensor readings and system events',
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Optimize water usage and promote sustainable farming practices',
    },
  ];

  const technologies = [
    { name: 'React', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'Recharts', category: 'Visualization' },
    { name: 'Arduino/ESP32', category: 'Hardware' },
    { name: 'MQTT Protocol', category: 'Communication' },
    { name: 'MongoDB', category: 'Database' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">About Project</h1>
        <p className="text-sm text-muted-foreground mt-1">Smart Agriculture IoT Monitoring System</p>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            The Smart Agriculture Monitoring System is an IoT-based solution designed to revolutionize traditional farming practices.
            By leveraging real-time sensor data, automated irrigation control, and intelligent analytics, this system helps farmers
            make data-driven decisions to optimize crop yield while conserving water resources.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This project integrates hardware sensors with a cloud-based dashboard, providing farmers with remote access to their
            field conditions from anywhere. The system monitors critical parameters like soil moisture, temperature, humidity, and
            environmental factors, triggering automated responses when thresholds are exceeded.
          </p>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex gap-4 p-4 bg-muted rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Technologies Used */}
      <Card>
        <CardHeader>
          <CardTitle>Technologies Used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {technologies.map((tech, index) => (
              <Badge key={index} variant="outline" className="text-sm py-2 px-4">
                <span className="font-semibold">{tech.name}</span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-muted-foreground">{tech.category}</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Sensor Layer</span>
                <span className="text-muted-foreground">IoT Sensors</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Communication</span>
                <span className="text-muted-foreground">MQTT/WiFi</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Backend</span>
                <span className="text-muted-foreground">Cloud Server</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Database</span>
                <span className="text-muted-foreground">MongoDB</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Frontend</span>
                <span className="text-muted-foreground">React Dashboard</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Project Type</span>
                <span className="text-muted-foreground">Final Year Project</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Category</span>
                <span className="text-muted-foreground">IoT / Agriculture</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Version</span>
                <span className="text-muted-foreground">1.0.0</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Status</span>
                <Badge className="status-normal">Active</Badge>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium">Last Updated</span>
                <span className="text-muted-foreground">January 2026</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact & Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-6 space-y-3">
            <p className="text-sm text-muted-foreground">
              For technical support, questions, or feedback about this project:
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Email:</span>{' '}
                <a href="mailto:kasakk2006@gmail.com" className="text-primary hover:underline">
                  kasakk2006@gmail.com
                </a>
              </p>
              <p className="text-sm">
                <span className="font-medium">GitHub:</span>{' '}
                <a href="https://github.com/kranthi-06" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  github.com/kranthi-06
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
