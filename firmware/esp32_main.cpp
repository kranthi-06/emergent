#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> // Make sure to install ArduinoJson library

// --- Configuration ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://YOUR_BACKEND_IP:8000/api/sensors"; // OR your Vercel URL
const int PUMP_PIN = 26; // GPIO for Pump Relay
const int MOISTURE_PIN = 34; // Analog pin for sensor

// --- Safety Thresholds (The "Safety Authority") ---
const float CRITICAL_MOISTURE_LOW = 10.0; // Too dry?
const float CRITICAL_MOISTURE_HIGH = 90.0; // Too wet?
const unsigned long MAX_PUMP_RUNTIME_MS = 30000; // Max 30 seconds run
const unsigned long MIN_PUMP_COOLDOWN_MS = 60000; // Min 1 minute off

// --- State Variables ---
unsigned long lastPumpStartTime = 0;
unsigned long lastPumpStopTime = 0;
bool isPumpRunning = false;

void setup() {
  Serial.begin(115200);
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, LOW); // Start OFF
  
  // WiFi Connection
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  // 1. Read Sensors
  int rawMoisture = analogRead(MOISTURE_PIN);
  float moisturePercent = map(rawMoisture, 4095, 0, 0, 100); // Calibrate this!
  float temp = 25.0; // Placeholder: Read from DHT11/22
  float humidity = 60.0; // Placeholder
  
  // 2. Prepare JSON Payload
  StaticJsonDocument<200> doc;
  doc["temperature"] = temp;
  doc["humidity"] = humidity;
  doc["soil_moisture"] = moisturePercent;
  doc["pump_status"] = isPumpRunning ? "ON" : "OFF";
  
  String requestBody;
  serializeJson(doc, requestBody);
  
  // 3. Send to Backend & Get Command
  String command = "OFF"; // Default to safe state
  
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    
    int httpResponseCode = http.POST(requestBody);
    
    if (httpResponseCode == 200) {
      String response = http.getString();
      Serial.println("Server Response: " + response);
      
      // Parse Response: {"command": "ON", "source": "AUTO", ...}
      StaticJsonDocument<200> responseDoc;
      DeserializationError error = deserializeJson(responseDoc, response);
      
      if (!error) {
        const char* cmd = responseDoc["command"];
        command = String(cmd);
      } else {
        Serial.println("Failed to parse response JSON");
      }
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
  
  // 4. HYBRID LOGIC & SAFETY CHECKS (The "Safety Authority")
  executePumpLogic(command, moisturePercent);
  
  // 5. Wait before next loop
  delay(5000); // 5 seconds
}

void executePumpLogic(String serverCommand, float currentMoisture) {
  unsigned long now = millis();
  
  // --- SAFETY CHECK 1: Local Override ---
  // If moisture is already very high, IGNORE "ON" command
  if (currentMoisture > CRITICAL_MOISTURE_HIGH && serverCommand == "ON") {
    Serial.println("SAFETY BLOCKED: Moisture high, ignoring ON command");
    serverCommand = "OFF";
  }
  
  // --- SAFETY CHECK 2: Cooldown ---
  if (!isPumpRunning && serverCommand == "ON") {
    if (now - lastPumpStopTime < MIN_PUMP_COOLDOWN_MS) {
       Serial.println("SAFETY BLOCKED: Pump in cooldown");
       serverCommand = "OFF";
    }
  }
  
  // --- SAFETY CHECK 3: Max Runtime ---
  if (isPumpRunning && (now - lastPumpStartTime > MAX_PUMP_RUNTIME_MS)) {
    Serial.println("SAFETY TRIGGER: Max runtime exceeded, forcing OFF");
    serverCommand = "OFF";
  }
  
  // --- EXECUTE ---
  if (serverCommand == "ON") {
    if (!isPumpRunning) {
      // Starting Pump
      digitalWrite(PUMP_PIN, HIGH);
      isPumpRunning = true;
      lastPumpStartTime = now;
      Serial.println("PUMP: Started");
    }
  } else {
    if (isPumpRunning) {
      // Stopping Pump
      digitalWrite(PUMP_PIN, LOW);
      isPumpRunning = false;
      lastPumpStopTime = now;
      Serial.println("PUMP: Stopped");
    }
  }
}
