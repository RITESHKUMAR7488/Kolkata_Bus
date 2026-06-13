const fs = require('fs');

const stations = [
  // Blue Line
  "Dakshineswar", "Baranagar", "Noapara", "Dum Dum", "Belgachia", "Shyambazar", 
  "Sovabazar Sutanuti", "Girish Park", "M.G. Road", "Central", "Chandni Chowk", 
  "Esplanade", "Park Street", "Maidan", "Rabindra Sadan", "Netaji Bhawan", 
  "Jatin Das Park", "Kalighat", "Rabindra Sarobar", "Mahanayak U.K.", "Netaji", 
  "Masterda Surya Sen", "Gitanjali", "Kavi Nazrul", "Shahid Khudiram", "Kavi Subhash",
  // Green Line
  "Howrah Maidan", "Howrah", "Mahakaran", "Sealdah", "Phoolbagan", "Salt Lake Stadium", 
  "Bengal Chemical", "City Center", "Central Park", "Karunamoyee", "Salt Lake Sector V",
  // Purple Line
  "Joka", "Thakurpukur", "Sakher Bazar", "Behala Chowrasta", "Behala Bazar", "Taratala", 
  "Majerhat", "Mominpur", "Khidirpur", "Victoria",
  // Orange Line
  "Satyajit Ray", "Jyotindra Nandi", "Kavi Sukanta", "Hemanta M.", "VIP Bazar", 
  "Ritwik Ghatak", "Barun Sengupta", "Beleghata", "Gour Kishore Ghosh", "Nalban", 
  "Nazrul Tirtha", "Swapnabhor", "Convention Center", "Shiksha Tirtha", 
  "Mother's Wax Museum", "Eco Park", "Mangal Deep",
  // Yellow Line
  "Dum Dum Cantonment", "Jessore Road", "Jai Hind", "Birati", "Michael Nagar", 
  "New Barrackpore", "Madhyamgram", "Hridaypur", "Barasat"
];

// Unique set
const uniqueStations = [...new Set(stations)];

async function geocode(station) {
  const query = encodeURIComponent(`Kolkata Metro ${station}`);
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
      headers: { 'User-Agent': 'KolkataMetroRouterBot/1.0' }
    });
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } else {
      // Fallback: search without "Metro"
      const res2 = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(station + ' Kolkata')}&limit=1`, {
        headers: { 'User-Agent': 'KolkataMetroRouterBot/1.0' }
      });
      const data2 = await res2.json();
      if (data2 && data2.length > 0) {
        return { lat: parseFloat(data2[0].lat), lng: parseFloat(data2[0].lon) };
      }
    }
  } catch (e) {
    console.error(`Error for ${station}: ${e.message}`);
  }
  return null;
}

async function run() {
  const results = {};
  for (const s of uniqueStations) {
    console.log(`Geocoding ${s}...`);
    const coords = await geocode(s);
    if (coords) {
      results[s] = coords;
      console.log(`  Found: ${coords.lat}, ${coords.lng}`);
    } else {
      console.log(`  NOT FOUND`);
      results[s] = { lat: 0, lng: 0 };
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
  }
  
  fs.writeFileSync('metroCoords.json', JSON.stringify(results, null, 2));
  console.log('Done!');
}

run();
