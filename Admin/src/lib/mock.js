// DASHBOARD
export const lineData = [
  { day: "Mon", kg: 420 },
  { day: "Tue", kg: 510 },
  { day: "Wed", kg: 480 },
  { day: "Thu", kg: 610 },
  { day: "Fri", kg: 690 },
  { day: "Sat", kg: 740 },
  { day: "Sun", kg: 700 },
];

export const pkgData = [
  { name: "Cooked Meals", value: 85 },
  { name: "Dry Rations", value: 45 },
  { name: "Soup", value: 25 },
  { name: "Other", value: 10 },
];

export const PIE_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#64748b"];

// APPROVALS
export const pendingNGOs = [
  { id: "ngo_app_01", name: "Hope & Harvest", district: "Colombo", contact: "+94 70 222 9988" },
  { id: "ngo_app_02", name: "Central Care Collective", district: "Colombo", contact: "+94 72 444 1111" },
];
export const pendingDonors = [
  { id: "donor_app_11", name: "Hilton Colombo", type: "Hotel", contact: "+94 11 249 2492" },
  { id: "donor_app_12", name: "FreshCo (Union Pl)", type: "Supermarket", contact: "+94 71 000 1122" },
];
export const pendingVolunteers = [
  { id: "vol_001", name: "Kasun Perera", vehicle: "Van", district: "Colombo", phone: "+94 77 555 1122" },
  { id: "vol_002", name: "Ayesha Silva", vehicle: "Bike", district: "Colombo", phone: "+94 76 333 6677" },
];

// DONATIONS
export const donorOffers = [
  { id: "OF-1009", donor: "Hilton Colombo", items: "25 food containers, 8 soup", readyBy: "21:30", address: "No. 2, Galle Face", status: "New" },
  { id: "OF-1010", donor: "FreshCo (Union Pl)", items: "10 food containers, 12 soup", readyBy: "21:45", address: "Union Pl, Colombo 02", status: "New" },
];
export const activePickups = [
  { id: "PU-2201", donor: "Hilton Colombo", driver: "Kasun Perera", eta: "21:50", status: "Assigned" },
  { id: "PU-2202", donor: "FreshCo (Union Pl)", driver: "Ayesha Silva", eta: "22:05", status: "On route" },
];
export const donationHistory = [
  { id: "DN-0301", donor: "Galle Face Hotel", receivedAt: "20:15", items: "40 cooked meals", driver: "Ruwan" },
  { id: "DN-0300", donor: "Cafe 34", receivedAt: "19:05", items: "15 cooked meals", driver: "Ayesha" },
];

// DRIVERS
export const drivers = [
  { id: "DRV-001", name: "Kasun Perera", vehicle: "Van", phone: "+94 77 555 1122", capacity: "60 meals", status: "Available" },
  { id: "DRV-002", name: "Ayesha Silva", vehicle: "Bike", phone: "+94 76 333 6677", capacity: "15 meals", status: "On Duty" },
  { id: "DRV-003", name: "Imran Nazeer", vehicle: "Car", phone: "+94 71 888 4455", capacity: "30 meals", status: "Offline" },
];
export const availabilityToday = [
  { id: "DRV-001", name: "Kasun Perera", from: "18:30", to: "22:00", area: "Colombo 03" },
  { id: "DRV-003", name: "Imran Nazeer", from: "19:00", to: "23:30", area: "Colombo 05" },
];
export const driverTrips = [
  { id: "TR-501", driver: "Kasun Perera", pickup: "Hilton Colombo", drop: "FSL Shelter A", time: "20:10", items: "40 meals" },
  { id: "TR-502", driver: "Ayesha Silva", pickup: "Cafe 34", drop: "FSL Shelter A", time: "19:40", items: "15 meals" },
];

export const statusTone = (s) => (s === "Available" ? "green" : s === "On Duty" ? "blue" : "slate");

// DISTRIBUTION (No batches)
export const shelterRequests = [
  { id: "RQ-7001", shelter: "FSL Shelter A", requested: "80 cooked meals", priority: "High", neededBy: "22:30" },
  { id: "RQ-7002", shelter: "FSL Shelter B", requested: "40 cooked meals", priority: "Normal", neededBy: "Tomorrow 10:00" },
];
export const assignments = [
  { id: "AS-9001", from: "Hilton Colombo", to: "FSL Shelter A", items: "80 cooked meals", driver: "Kasun Perera", eta: "23:10", status: "Out for delivery" },
  { id: "AS-9000", from: "FreshCo (Union Pl)", to: "FSL Shelter B", items: "40 cooked meals", driver: "Ayesha Silva", eta: "Delivered 20:45", status: "Delivered" },
];
