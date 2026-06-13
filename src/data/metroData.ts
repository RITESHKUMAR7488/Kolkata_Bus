export interface MetroStation {
  id: string;
  name: string;
  lines: string[];
  x: number;
  y: number;
  lat: number;
  lng: number;
  orientation: 'right' | 'left' | 'top' | 'bottom' | 'top-angled' | 'bottom-angled';
  isInterchange?: boolean;
}

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  stations: string[];
}

// 1 unit = 50px
export const metroStations: Record<string, MetroStation> = {
  // Blue Line (North-South)
  "Dakshineswar": { id: "Dakshineswar", name: "Dakshineswar", lines: ["blue"], x: 200, y: 150, lat: 22.6548, lng: 88.3576, orientation: "top" },
  "Baranagar": { id: "Baranagar", name: "Baranagar", lines: ["blue"], x: 300, y: 150, lat: 22.6450, lng: 88.3770, orientation: "top" },
  "Noapara": { id: "Noapara", name: "Noapara", lines: ["blue", "yellow"], x: 400, y: 150, lat: 22.6427, lng: 88.4350, orientation: "top", isInterchange: true },
  "Dum Dum": { id: "Dum Dum", name: "Dum Dum", lines: ["blue"], x: 400, y: 250, lat: 22.6234, lng: 88.3934, orientation: "right" },
  "Belgachia": { id: "Belgachia", name: "Belgachia", lines: ["blue"], x: 400, y: 350, lat: 22.6061, lng: 88.3869, orientation: "right" },
  "Shyambazar": { id: "Shyambazar", name: "Shyambazar", lines: ["blue"], x: 400, y: 450, lat: 22.6013, lng: 88.3725, orientation: "right" },
  "Sovabazar Sutanuti": { id: "Sovabazar Sutanuti", name: "Sovabazar Sutanuti", lines: ["blue"], x: 400, y: 550, lat: 22.5934, lng: 88.3615, orientation: "right" },
  "Girish Park": { id: "Girish Park", name: "Girish Park", lines: ["blue"], x: 400, y: 650, lat: 22.5871, lng: 88.3629, orientation: "right" },
  "M.G. Road": { id: "M.G. Road", name: "M.G. Road", lines: ["blue"], x: 400, y: 750, lat: 22.5816, lng: 88.3601, orientation: "right" },
  "Central": { id: "Central", name: "Central", lines: ["blue"], x: 400, y: 850, lat: 22.5735, lng: 88.3585, orientation: "right" },
  "Chandni Chowk": { id: "Chandni Chowk", name: "Chandni Chowk", lines: ["blue"], x: 400, y: 950, lat: 22.5670, lng: 88.3542, orientation: "right" },
  "Esplanade": { id: "Esplanade", name: "Esplanade", lines: ["blue", "green", "purple"], x: 400, y: 1050, lat: 22.5646, lng: 88.3518, orientation: "right", isInterchange: true },
  "Park Street": { id: "Park Street", name: "Park Street", lines: ["blue", "purple"], x: 400, y: 1150, lat: 22.5552, lng: 88.3501, orientation: "right", isInterchange: true },
  "Maidan": { id: "Maidan", name: "Maidan", lines: ["blue"], x: 400, y: 1250, lat: 22.5503, lng: 88.3457, orientation: "right" },
  "Rabindra Sadan": { id: "Rabindra Sadan", name: "Rabindra Sadan", lines: ["blue"], x: 400, y: 1350, lat: 22.5415, lng: 88.3473, orientation: "right" },
  "Netaji Bhawan": { id: "Netaji Bhawan", name: "Netaji Bhawan", lines: ["blue"], x: 400, y: 1450, lat: 22.5325, lng: 88.3458, orientation: "right" },
  "Jatin Das Park": { id: "Jatin Das Park", name: "Jatin Das Park", lines: ["blue"], x: 400, y: 1550, lat: 22.5242, lng: 88.3465, orientation: "right" },
  "Kalighat": { id: "Kalighat", name: "Kalighat", lines: ["blue"], x: 400, y: 1650, lat: 22.5152, lng: 88.3457, orientation: "right" },
  "Rabindra Sarobar": { id: "Rabindra Sarobar", name: "Rabindra Sarobar", lines: ["blue"], x: 400, y: 1750, lat: 22.5034, lng: 88.3441, orientation: "right" },
  "Mahanayak U.K.": { id: "Mahanayak U.K.", name: "Mahanayak U.K.", lines: ["blue"], x: 400, y: 1850, lat: 22.4936, lng: 88.3453, orientation: "right" },
  "Netaji": { id: "Netaji", name: "Netaji", lines: ["blue"], x: 400, y: 1950, lat: 22.4841, lng: 88.3540, orientation: "bottom" },
  "Masterda Surya Sen": { id: "Masterda Surya Sen", name: "Masterda Surya Sen", lines: ["blue"], x: 550, y: 1950, lat: 22.4764, lng: 88.3621, orientation: "bottom" },
  "Gitanjali": { id: "Gitanjali", name: "Gitanjali", lines: ["blue"], x: 700, y: 1950, lat: 22.4718, lng: 88.3734, orientation: "bottom" },
  "Kavi Nazrul": { id: "Kavi Nazrul", name: "Kavi Nazrul", lines: ["blue"], x: 850, y: 1950, lat: 22.4687, lng: 88.3845, orientation: "bottom" },
  "Shahid Khudiram": { id: "Shahid Khudiram", name: "Shahid Khudiram", lines: ["blue"], x: 1000, y: 1950, lat: 22.4665, lng: 88.3912, orientation: "bottom" },
  "Kavi Subhash": { id: "Kavi Subhash", name: "Kavi Subhash", lines: ["blue", "orange"], x: 1150, y: 1950, lat: 22.4668, lng: 88.4005, orientation: "bottom", isInterchange: true },

  // Green Line (East-West)
  "Howrah Maidan": { id: "Howrah Maidan", name: "Howrah Maidan", lines: ["green"], x: 100, y: 1050, lat: 22.5855, lng: 88.3314, orientation: "bottom" },
  "Howrah": { id: "Howrah", name: "Howrah", lines: ["green"], x: 200, y: 1050, lat: 22.5828, lng: 88.3411, orientation: "bottom" },
  "Mahakaran": { id: "Mahakaran", name: "Mahakaran", lines: ["green"], x: 300, y: 1050, lat: 22.5732, lng: 88.3475, orientation: "bottom" },
  "Sealdah": { id: "Sealdah", name: "Sealdah", lines: ["green"], x: 500, y: 1050, lat: 22.5670, lng: 88.3712, orientation: "bottom" },
  "Phoolbagan": { id: "Phoolbagan", name: "Phoolbagan", lines: ["green"], x: 600, y: 1050, lat: 22.5684, lng: 88.3905, orientation: "top-angled" },
  "Salt Lake Stadium": { id: "Salt Lake Stadium", name: "Salt Lake Stadium", lines: ["green"], x: 700, y: 1050, lat: 22.5721, lng: 88.4064, orientation: "top-angled" },
  "Bengal Chemical": { id: "Bengal Chemical", name: "Bengal Chemical", lines: ["green"], x: 800, y: 1050, lat: 22.5786, lng: 88.4079, orientation: "top-angled" },
  "City Center": { id: "City Center", name: "City Center", lines: ["green"], x: 900, y: 1050, lat: 22.5857, lng: 88.4086, orientation: "top-angled" },
  "Central Park": { id: "Central Park", name: "Central Park", lines: ["green"], x: 1000, y: 1050, lat: 22.5835, lng: 88.4184, orientation: "top-angled" },
  "Karunamoyee": { id: "Karunamoyee", name: "Karunamoyee", lines: ["green"], x: 1100, y: 1050, lat: 22.5780, lng: 88.4215, orientation: "top-angled" },
  "Salt Lake Sector V": { id: "Salt Lake Sector V", name: "Salt Lake Sector V", lines: ["green", "orange"], x: 1200, y: 1050, lat: 22.5780, lng: 88.4320, orientation: "top", isInterchange: true },

  // Purple Line
  "Joka": { id: "Joka", name: "Joka", lines: ["purple"], x: 250, y: 1950, lat: 22.4435, lng: 88.3033, orientation: "left" },
  "Thakurpukur": { id: "Thakurpukur", name: "Thakurpukur", lines: ["purple"], x: 250, y: 1850, lat: 22.4578, lng: 88.3075, orientation: "left" },
  "Sakher Bazar": { id: "Sakher Bazar", name: "Sakher Bazar", lines: ["purple"], x: 250, y: 1750, lat: 22.4705, lng: 88.3122, orientation: "left" },
  "Behala Chowrasta": { id: "Behala Chowrasta", name: "Behala Chowrasta", lines: ["purple"], x: 250, y: 1650, lat: 22.4836, lng: 88.3184, orientation: "left" },
  "Behala Bazar": { id: "Behala Bazar", name: "Behala Bazar", lines: ["purple"], x: 250, y: 1550, lat: 22.4930, lng: 88.3225, orientation: "left" },
  "Taratala": { id: "Taratala", name: "Taratala", lines: ["purple"], x: 250, y: 1450, lat: 22.5085, lng: 88.3245, orientation: "left" },
  "Majerhat": { id: "Majerhat", name: "Majerhat", lines: ["purple"], x: 250, y: 1350, lat: 22.5188, lng: 88.3275, orientation: "left" },
  "Mominpur": { id: "Mominpur", name: "Mominpur", lines: ["purple"], x: 250, y: 1250, lat: 22.5290, lng: 88.3288, orientation: "left" },
  "Khidirpur": { id: "Khidirpur", name: "Khidirpur", lines: ["purple"], x: 300, y: 1150, lat: 22.5385, lng: 88.3280, orientation: "bottom-angled" },
  "Victoria": { id: "Victoria", name: "Victoria", lines: ["purple"], x: 350, y: 1150, lat: 22.5448, lng: 88.3425, orientation: "bottom-angled" },

  // Orange Line
  "Satyajit Ray": { id: "Satyajit Ray", name: "Satyajit Ray", lines: ["orange"], x: 1200, y: 1850, lat: 22.4788, lng: 88.3975, orientation: "right" },
  "Jyotindra Nandi": { id: "Jyotindra Nandi", name: "Jyotindra Nandi", lines: ["orange"], x: 1200, y: 1750, lat: 22.4905, lng: 88.3955, orientation: "right" },
  "Kavi Sukanta": { id: "Kavi Sukanta", name: "Kavi Sukanta", lines: ["orange"], x: 1200, y: 1650, lat: 22.5020, lng: 88.3965, orientation: "right" },
  "Hemanta M.": { id: "Hemanta M.", name: "Hemanta M.", lines: ["orange"], x: 1200, y: 1550, lat: 22.5105, lng: 88.3995, orientation: "right" },
  "VIP Bazar": { id: "VIP Bazar", name: "VIP Bazar", lines: ["orange"], x: 1200, y: 1450, lat: 22.5200, lng: 88.4005, orientation: "right" },
  "Ritwik Ghatak": { id: "Ritwik Ghatak", name: "Ritwik Ghatak", lines: ["orange"], x: 1200, y: 1350, lat: 22.5305, lng: 88.4025, orientation: "right" },
  "Barun Sengupta": { id: "Barun Sengupta", name: "Barun Sengupta", lines: ["orange"], x: 1200, y: 1250, lat: 22.5405, lng: 88.4020, orientation: "right" },
  "Beleghata": { id: "Beleghata", name: "Beleghata", lines: ["orange"], x: 1200, y: 1150, lat: 22.5550, lng: 88.4025, orientation: "right" },
  "Gour Kishore Ghosh": { id: "Gour Kishore Ghosh", name: "Gour Kishore Ghosh", lines: ["orange"], x: 1200, y: 950, lat: 22.5650, lng: 88.4095, orientation: "right" },
  "Nalban": { id: "Nalban", name: "Nalban", lines: ["orange"], x: 1200, y: 850, lat: 22.5710, lng: 88.4230, orientation: "right" },
  "Nazrul Tirtha": { id: "Nazrul Tirtha", name: "Nazrul Tirtha", lines: ["orange"], x: 1200, y: 750, lat: 22.5855, lng: 88.4385, orientation: "right" },
  "Swapnabhor": { id: "Swapnabhor", name: "Swapnabhor", lines: ["orange"], x: 1200, y: 650, lat: 22.5930, lng: 88.4485, orientation: "right" },
  "Convention Center": { id: "Convention Center", name: "Convention Center", lines: ["orange"], x: 1100, y: 550, lat: 22.5960, lng: 88.4550, orientation: "top" },
  "Shiksha Tirtha": { id: "Shiksha Tirtha", name: "Shiksha Tirtha", lines: ["orange"], x: 1000, y: 550, lat: 22.6030, lng: 88.4610, orientation: "top" },
  "Mother's Wax Museum": { id: "Mother's Wax Museum", name: "Mother's Wax Museum", lines: ["orange"], x: 900, y: 550, lat: 22.6105, lng: 88.4665, orientation: "top" },
  "Eco Park": { id: "Eco Park", name: "Eco Park", lines: ["orange"], x: 800, y: 550, lat: 22.6200, lng: 88.4695, orientation: "top" },
  "Mangal Deep": { id: "Mangal Deep", name: "Mangal Deep", lines: ["orange"], x: 700, y: 450, lat: 22.6305, lng: 88.4655, orientation: "right" },

  // Yellow Line
  "Dum Dum Cantonment": { id: "Dum Dum Cantonment", name: "Dum Dum Cantonment", lines: ["yellow"], x: 500, y: 150, lat: 22.6455, lng: 88.4245, orientation: "top-angled" },
  "Jessore Road": { id: "Jessore Road", name: "Jessore Road", lines: ["yellow"], x: 600, y: 150, lat: 22.6480, lng: 88.4315, orientation: "top-angled" },
  "Jai Hind": { id: "Jai Hind", name: "Jai Hind", lines: ["yellow", "orange"], x: 700, y: 150, lat: 22.6505, lng: 88.4430, orientation: "top", isInterchange: true },
  "Birati": { id: "Birati", name: "Birati", lines: ["yellow"], x: 800, y: 150, lat: 22.6610, lng: 88.4455, orientation: "top-angled" },
  "Michael Nagar": { id: "Michael Nagar", name: "Michael Nagar", lines: ["yellow"], x: 900, y: 150, lat: 22.6710, lng: 88.4550, orientation: "top-angled" },
  "New Barrackpore": { id: "New Barrackpore", name: "New Barrackpore", lines: ["yellow"], x: 1000, y: 150, lat: 22.6850, lng: 88.4625, orientation: "top-angled" },
  "Madhyamgram": { id: "Madhyamgram", name: "Madhyamgram", lines: ["yellow"], x: 1100, y: 150, lat: 22.6950, lng: 88.4710, orientation: "top-angled" },
  "Hridaypur": { id: "Hridaypur", name: "Hridaypur", lines: ["yellow"], x: 1200, y: 150, lat: 22.7050, lng: 88.4780, orientation: "top-angled" },
  "Barasat": { id: "Barasat", name: "Barasat", lines: ["yellow"], x: 1300, y: 150, lat: 22.7160, lng: 88.4850, orientation: "top" }
};

export const metroLines: MetroLine[] = [
  {
    id: "blue",
    name: "Blue Line (North-South)",
    color: "#3B82F6",
    stations: ["Dakshineswar", "Baranagar", "Noapara", "Dum Dum", "Belgachia", "Shyambazar", "Sovabazar Sutanuti", "Girish Park", "M.G. Road", "Central", "Chandni Chowk", "Esplanade", "Park Street", "Maidan", "Rabindra Sadan", "Netaji Bhawan", "Jatin Das Park", "Kalighat", "Rabindra Sarobar", "Mahanayak U.K.", "Netaji", "Masterda Surya Sen", "Gitanjali", "Kavi Nazrul", "Shahid Khudiram", "Kavi Subhash"]
  },
  {
    id: "green",
    name: "Green Line (East-West)",
    color: "#22C55E",
    stations: ["Howrah Maidan", "Howrah", "Mahakaran", "Esplanade", "Sealdah", "Phoolbagan", "Salt Lake Stadium", "Bengal Chemical", "City Center", "Central Park", "Karunamoyee", "Salt Lake Sector V"]
  },
  {
    id: "purple",
    name: "Purple Line (Joka)",
    color: "#A855F7",
    stations: ["Joka", "Thakurpukur", "Sakher Bazar", "Behala Chowrasta", "Behala Bazar", "Taratala", "Majerhat", "Mominpur", "Khidirpur", "Victoria", "Park Street", "Esplanade"]
  },
  {
    id: "orange",
    name: "Orange Line (Airport)",
    color: "#F97316",
    stations: ["Kavi Subhash", "Satyajit Ray", "Jyotindra Nandi", "Kavi Sukanta", "Hemanta M.", "VIP Bazar", "Ritwik Ghatak", "Barun Sengupta", "Beleghata", "Gour Kishore Ghosh", "Nalban", "Salt Lake Sector V", "Nazrul Tirtha", "Swapnabhor", "Convention Center", "Shiksha Tirtha", "Mother's Wax Museum", "Eco Park", "Mangal Deep", "Jai Hind"]
  },
  {
    id: "yellow",
    name: "Yellow Line (Barasat)",
    color: "#EAB308",
    stations: ["Noapara", "Dum Dum Cantonment", "Jessore Road", "Jai Hind", "Birati", "Michael Nagar", "New Barrackpore", "Madhyamgram", "Hridaypur", "Barasat"]
  }
];
