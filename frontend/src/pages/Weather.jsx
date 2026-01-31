import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  CloudSun, 
  Cloud, 
  CloudRain, 
  Droplets, 
  Wind, 
  Eye,
  Sunrise,
  Sunset,
  ThermometerSun
} from 'lucide-react';

const currentWeather = {
  condition: 'Partly Cloudy',
  temperature: 28,
  feelsLike: 30,
  humidity: 68,
  windSpeed: 12,
  visibility: 10,
  uvIndex: 7,
  sunrise: '06:15 AM',
  sunset: '06:45 PM',
  rainProbability: 35,
};

const forecast = [
  { day: 'Today', condition: 'Partly Cloudy', high: 32, low: 24, rain: 35, icon: CloudSun },
  { day: 'Tomorrow', condition: 'Light Rain', high: 29, low: 22, rain: 65, icon: CloudRain },
  { day: 'Wednesday', condition: 'Cloudy', high: 28, low: 21, rain: 45, icon: Cloud },
  { day: 'Thursday', condition: 'Partly Cloudy', high: 31, low: 23, rain: 25, icon: CloudSun },
  { day: 'Friday', condition: 'Sunny', high: 33, low: 25, rain: 10, icon: ThermometerSun },
];

export default function Weather() {
  const getIrrigationRecommendation = () => {
    if (currentWeather.rainProbability > 60) {
      return {
        action: 'Postpone Irrigation',
        reason: 'High probability of rain expected',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-500/10 border-blue-500/20',
      };
    } else if (currentWeather.rainProbability > 30) {
      return {
        action: 'Monitor Weather',
        reason: 'Moderate rain probability - check forecast before irrigating',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-500/10 border-yellow-500/20',
      };
    } else {
      return {
        action: 'Safe to Irrigate',
        reason: 'Low rain probability - proceed with scheduled irrigation',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-500/10 border-green-500/20',
      };
    }
  };

  const recommendation = getIrrigationRecommendation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Weather Advisory</h1>
        <p className="text-sm text-muted-foreground mt-1">Current conditions and forecast</p>
      </div>

      {/* Current Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Weather</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Main Temperature Display */}
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-yellow-300 flex items-center justify-center">
                  <CloudSun className="w-12 h-12 text-white" />
                </div>
                <div>
                  <p className="text-5xl font-bold">{currentWeather.temperature}°C</p>
                  <p className="text-lg text-muted-foreground">{currentWeather.condition}</p>
                  <p className="text-sm text-muted-foreground">Feels like {currentWeather.feelsLike}°C</p>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Humidity</p>
                    <p className="text-lg font-semibold">{currentWeather.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Wind className="w-5 h-5 text-cyan-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Wind Speed</p>
                    <p className="text-lg font-semibold">{currentWeather.windSpeed} km/h</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Eye className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Visibility</p>
                    <p className="text-lg font-semibold">{currentWeather.visibility} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <ThermometerSun className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">UV Index</p>
                    <p className="text-lg font-semibold">{currentWeather.uvIndex}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sun Times */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Sunrise className="w-8 h-8 text-orange-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Sunrise</p>
                  <p className="text-sm font-semibold">{currentWeather.sunrise}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Sunset className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Sunset</p>
                  <p className="text-sm font-semibold">{currentWeather.sunset}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Irrigation Recommendation */}
        <Card>
          <CardHeader>
            <CardTitle>Irrigation Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`${recommendation.bgColor} border rounded-lg p-4`}>
                <p className={`font-semibold text-lg ${recommendation.color} mb-2`}>
                  {recommendation.action}
                </p>
                <p className="text-sm text-muted-foreground">
                  {recommendation.reason}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Rain Probability</span>
                  <Badge variant="outline">{currentWeather.rainProbability}%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Soil Moisture</span>
                  <Badge variant="outline" className="status-normal">Optimal</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Next Scheduled</span>
                  <span className="text-sm text-muted-foreground">Tomorrow 6 AM</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {forecast.map((day, index) => {
              const Icon = day.icon;
              return (
                <div key={index} className="bg-muted rounded-lg p-4 text-center space-y-3">
                  <p className="font-semibold">{day.day}</p>
                  <Icon className="w-12 h-12 mx-auto text-orange-500" />
                  <p className="text-sm text-muted-foreground">{day.condition}</p>
                  <div className="flex justify-center gap-2">
                    <span className="font-semibold">{day.high}°</span>
                    <span className="text-muted-foreground">{day.low}°</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                    <CloudRain className="w-4 h-4" />
                    <span>{day.rain}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
