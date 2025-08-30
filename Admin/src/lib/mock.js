export const pendingNGOs = [
  { id: 'ngo_app_01', name: 'Hope & Harvest', district: 'Kandy', contact: '+94 70 222 9988' },
  { id: 'ngo_app_02', name: 'Central Care Collective', district: 'Matale', contact: '+94 72 444 1111' },
];
export const pendingDonors = [
  { id: 'donor_app_11', name: 'Hilton Colombo', contact: '+94 11 249 2492', type: 'Hotel' },
  { id: 'donor_app_12', name: 'FreshCo Super (Union Pl)', contact: '+94 71 000 1122', type: 'Supermarket' },
];
export const pendingVolunteers = [
  { id: 'vol_001', name: 'Kasun Perera', phone: '+94 77 555 1122', vehicle: 'Van', district: 'Colombo' },
  { id: 'vol_002', name: 'Ayesha Silva', phone: '+94 76 333 6677', vehicle: 'Bike', district: 'Kandy' },
];
export const donationOffers = [
  { id: 'DN-0235796', donor: 'Hilton Colombo', date: '2025-08-30', time: '21:30', status: 'ready_for_pickup', district: 'Colombo',
    packages: [ { type: 'Food Container', qty: 25, desc: 'Mixed rice & curry' }, { type: 'Soup Container', qty: 8, desc: 'Pumpkin soup' } ] },
  { id: 'DN-0235231', donor: 'FreshCo Super (Union Pl)', date: '2025-08-30', time: '21:40', status: 'ready_for_pickup', district: 'Colombo',
    packages: [ { type: 'Food Container', qty: 10, desc: 'Buns & pastries' }, { type: 'Soup Container', qty: 12, desc: 'Chicken broth' } ] },
];
export const drivers = [
  { id: 'drv_01', name: 'Kasun Perera', vehicle: 'Van 07', district: 'Colombo', status: 'available' },
  { id: 'drv_02', name: 'Ayesha Silva', vehicle: 'Bike 02', district: 'Colombo', status: 'busy' },
];
export const distributionBatches = [
  { id: 'DB-1001', ngo: 'Green Plates Foundation', items: '80 cooked portions', status: 'ready', driver: null, destination: 'FSL Shelter A' },
  { id: 'DB-1002', ngo: 'Northern Hands', items: '60 dry rations', status: 'packing', driver: null, destination: 'FSL Shelter Jaffna' },
];
export const donations = [
  { day: 'Mon', kg: 410 }, { day: 'Tue', kg: 520 }, { day: 'Wed', kg: 460 },
  { day: 'Thu', kg: 580 }, { day: 'Fri', kg: 630 }, { day: 'Sat', kg: 710 }, { day: 'Sun', kg: 680 },
];
