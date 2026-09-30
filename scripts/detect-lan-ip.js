const { networkInterfaces } = require('os');
const fs = require('fs');
const path = require('path');

function getLocalIp() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

const ip = getLocalIp();
console.log(`\n========================================`);
console.log(`Detected LAN IP: ${ip}`);
console.log(`========================================\n`);

const envPath = path.join(__dirname, '..', 'mobile', '.env');
const envExamplePath = path.join(__dirname, '..', 'mobile', '.env.example');

const envContent = `EXPO_PUBLIC_API_URL=http://${ip}:5000\nEXPO_PUBLIC_WEB_FRAME=true\n`;

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log(`Successfully wrote to mobile/.env:`);
  console.log(envContent);
  
  if (!fs.existsSync(envExamplePath)) {
    fs.writeFileSync(envExamplePath, `EXPO_PUBLIC_API_URL=http://<YOUR_LAN_IP>:5000\nEXPO_PUBLIC_WEB_FRAME=true\n`, 'utf8');
  }
} catch (error) {
  console.error('Error writing to .env file:', error);
}
