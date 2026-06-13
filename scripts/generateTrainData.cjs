const fs = require('fs');
const path = require('path');
const https = require('https');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchLatLng = (stationName) => {
  return new Promise((resolve) => {
    // Add "Railway Station, Kolkata" or "Railway Station, West Bengal" to help Nominatim
    const query = encodeURIComponent(`${stationName} Railway Station, West Bengal, India`);
    const options = {
      hostname: 'nominatim.openstreetmap.org',
      path: `/search?q=${query}&format=json&limit=1`,
      headers: {
        'User-Agent': 'KolkataBusTravelApp/1.0 (test@example.com)'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed.length > 0) {
            resolve({ lat: parseFloat(parsed[0].lat), lng: parseFloat(parsed[0].lon) });
          } else {
            console.log(`Nominatim failed for ${stationName}, falling back...`);
            resolve(null);
          }
        } catch (e) {
          console.error(`Error parsing Nominatim for ${stationName}:`, e.message);
          resolve(null);
        }
      });
    }).on('error', (e) => {
      console.error(`Network error for ${stationName}:`, e.message);
      resolve(null);
    });
  });
};

const ER_MAIN = [
  "Sealdah", "Bidhannagar Road", "Dum Dum", "Belgharia", "Agarpara", "Sodpur", "Khardaha", "Titagarh", "Barrackpore", "Palta", "Ichhapur", "Shyamnagar", "Jagaddal", "Kankinara", "Naihati", "Halisahar", "Kanchrapara", "Kalyani", "Madanpur", "Simurali", "Palpara", "Chakdaha", "Payradanga", "Ranaghat", "Kalinarayanpur", "Birnagar", "Taherpur", "Badkulla", "Jalalkhali Halt", "Krishnanagar City"
];

const ER_SOUTH = [
  "Sealdah", "Park Circus", "Ballygunge", "Dhakuria", "Jadavpur", "Baghajatin", "Garia", "Narendrapur", "Sonarpur", "Subhashgram", "Mallikpur", "Baruipur", "Kalyanpur", "Dakshin Durgapur", "Hotar", "Dhamua", "Uttar Radhanagar", "Magra Hat", "Bahirpuya Halt", "Sangrampur", "Deula", "Netra", "Basuldanga", "Gurudas Nagar", "Joynagar Majilpur", "Mathurapur Road", "Madhabpur", "Lakshmikantapur", "Kakdwip", "Namkhana"
];

const CIRCULAR = [
  "Dum Dum", "Patipukur", "Kolkata", "Tala", "Bagbazar", "Shobhabazar Ahiritola", "Burrabazar", "BBD Bag", "Eden Gardens", "Prinsep Ghat", "Hastings", "Khidirpur", "Remount Road", "Majerhat", "New Alipore", "Tollygunge", "Lake Gardens", "Ballygunge"
];

const HOWRAH_MAIN = [
  "Howrah Station", "Liluah", "Belur", "Bally", "Uttarpara", "Hind Motor", "Konnagar", "Rishra", "Serampore", "Sheoraphuli", "Baidyabati", "Bhadreshwar", "Mankundu", "Chandannagar", "Chuchura", "Hooghly", "Bandel"
];

const lines = [
  { id: "er_main", name: "Sealdah Main Line", color: "#DC2626", stops: ER_MAIN },
  { id: "er_south", name: "Sealdah South Line", color: "#059669", stops: ER_SOUTH },
  { id: "circular", name: "Circular Railway", color: "#D97706", stops: CIRCULAR },
  { id: "hwh_main", name: "Howrah Main Line", color: "#2563EB", stops: HOWRAH_MAIN }
];

async function run() {
  const busDataPath = path.join(__dirname, '../src/data/busdata.json');
  const busData = JSON.parse(fs.readFileSync(busDataPath, 'utf8'));

  let allTrainStations = new Set();
  lines.forEach(line => line.stops.forEach(s => allTrainStations.add(s)));
  
  // Add routes to busdata
  lines.forEach(line => {
    // Check if route exists
    const exists = busData.routes.find(r => r.busNumber === line.name);
    if (!exists) {
      busData.routes.push({
        busNumber: line.name,
        type: "train",
        stops: line.stops
      });
      console.log(`Added route: ${line.name}`);
    }
  });

  // Generate Schematic coordinates
  const trainStations = {};
  
  // Assign simple x,y layout for schematic
  // Let's position Sealdah at 1500, 1500
  const assignXY = () => {
    // Sealdah Center
    let cx = 1500;
    let cy = 1500;
    
    // ER MAIN (Goes North)
    ER_MAIN.forEach((station, i) => {
      if (!trainStations[station]) {
        trainStations[station] = {
          id: station,
          name: station,
          lines: ['er_main'],
          isInterchange: ["Sealdah", "Dum Dum", "Naihati", "Ranaghat"].includes(station),
          x: cx,
          y: cy - (i * 60), // Up
          orientation: 'right'
        };
      } else {
        trainStations[station].lines.push('er_main');
      }
    });

    // ER SOUTH (Goes South)
    ER_SOUTH.forEach((station, i) => {
      if (!trainStations[station]) {
        trainStations[station] = {
          id: station,
          name: station,
          lines: ['er_south'],
          isInterchange: ["Sealdah", "Ballygunge", "Sonarpur", "Baruipur"].includes(station),
          x: cx,
          y: cy + (i * 60), // Down
          orientation: 'right'
        };
      } else {
        trainStations[station].lines.push('er_south');
      }
    });

    // CIRCULAR (Goes Left and down from Dum Dum to Ballygunge)
    // Dum Dum is at ER_MAIN[2] -> x: 1500, y: 1500 - 120 = 1380
    // Ballygunge is at ER_SOUTH[2] -> x: 1500, y: 1500 + 120 = 1620
    const startY = 1380;
    const endY = 1620;
    const circLen = CIRCULAR.length;
    CIRCULAR.forEach((station, i) => {
      if (!trainStations[station]) {
        // Curve to the left (x: 1200)
        let pct = i / (circLen - 1);
        let arcX = 1500 - Math.sin(pct * Math.PI) * 400;
        let arcY = startY + (endY - startY) * pct;
        
        trainStations[station] = {
          id: station,
          name: station,
          lines: ['circular'],
          isInterchange: false,
          x: Math.round(arcX),
          y: Math.round(arcY),
          orientation: 'left'
        };
      } else {
        trainStations[station].lines.push('circular');
        trainStations[station].isInterchange = true;
      }
    });

    // HOWRAH MAIN (Goes North from Howrah, left of Circular)
    // Howrah at x: 1000, y: 1500
    HOWRAH_MAIN.forEach((station, i) => {
      if (!trainStations[station]) {
        trainStations[station] = {
          id: station,
          name: station,
          lines: ['hwh_main'],
          isInterchange: ["Howrah Station", "Bally", "Serampore", "Bandel"].includes(station),
          x: 1000,
          y: 1500 - (i * 60), // Up
          orientation: 'left'
        };
      } else {
        trainStations[station].lines.push('hwh_main');
      }
    });
  };

  assignXY();

  // Create trainData.ts
  const trainDataTs = `export const trainStations: Record<string, { id: string; name: string; lines: string[]; isInterchange: boolean; x: number; y: number; orientation: string }> = ${JSON.stringify(trainStations, null, 2)};

export const trainLines = ${JSON.stringify(lines.map(l => ({ id: l.id, name: l.name, color: l.color, stations: l.stops })), null, 2)};
`;

  fs.writeFileSync(path.join(__dirname, '../src/data/trainData.ts'), trainDataTs, 'utf8');
  console.log('Created src/data/trainData.ts');

  // Geocode missing stations for busdata.json
  const stationsArr = Array.from(allTrainStations);
  for (let i = 0; i < stationsArr.length; i++) {
    const s = stationsArr[i];
    if (!busData.stops[s] || (!busData.stops[s].lat && !busData.stops[s].lng)) {
      console.log(`Fetching ${s} (${i+1}/${stationsArr.length})...`);
      const loc = await fetchLatLng(s);
      if (loc) {
        busData.stops[s] = loc;
      } else {
        // Fallback dummy around kolkata
        busData.stops[s] = { lat: 22.5726 + (Math.random()*0.1), lng: 88.3639 + (Math.random()*0.1) };
      }
      await delay(1000); // 1 sec delay to respect nominatim
    } else {
      console.log(`Skipping ${s}, already exists.`);
    }
  }

  fs.writeFileSync(busDataPath, JSON.stringify(busData, null, 2), 'utf8');
  console.log('Updated busdata.json!');
}

run().catch(console.error);
