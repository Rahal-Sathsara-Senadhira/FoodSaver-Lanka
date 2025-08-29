# FoodSaver Lanka - Delivery System

## Overview
The Delivery System enables NGOs to connect with food requesters through a comprehensive delivery management platform. It includes driver management, delivery tracking, and location-based services.

## Features

### 🚗 Delivery Driver Management
- Register delivery drivers with vehicle information
- Track driver availability and location
- Monitor driver ratings and delivery history
- Real-time location updates

### 📦 Delivery Order Management
- Create delivery orders from NGO to food requesters
- Assign drivers to deliveries
- Track delivery status (pending → assigned → picked_up → in_transit → delivered)
- GPS location tracking for pickup and delivery points

### 🔗 Integration with Existing System
- Connects with existing food requests and donor orders
- Uses existing user management system
- Integrates with restaurant credits system

## Database Tables

### delivery_drivers
```sql
- id: Primary key
- driver_name: Driver's full name
- phone_number: Contact number
- email: Email address (optional)
- vehicle_type: Bike/Car/Van/Truck
- license_number: Unique driving license
- current_location_lat/lng: GPS coordinates
- is_available: Driver availability status
- rating: Driver rating (1.00-5.00)
- total_deliveries: Completed deliveries count
- created_at/updated_at: Timestamps
```

### deliveries
```sql
- id: Primary key
- order_id: Reference to food request/order
- driver_id: Assigned driver (nullable)
- ngo_id: NGO user ID
- requester_id: Food requester user ID
- restaurant_name: Source restaurant
- food_item: Item being delivered
- food_amount: Quantity (e.g., "50 kg", "200 ml")
- pickup_location: Restaurant address
- delivery_location: Requester address
- pickup_lat/lng: GPS coordinates for pickup
- delivery_lat/lng: GPS coordinates for delivery
- status: Delivery status (pending/assigned/picked_up/in_transit/delivered/cancelled)
- estimated_delivery_time: Expected completion time
- actual_delivery_time: Actual completion time
- delivery_notes: Additional notes
- created_at/updated_at: Timestamps
```

## API Endpoints

### Delivery Driver Endpoints

#### POST /delivery-drivers
Register a new delivery driver
```json
{
  "driver_name": "John Smith",
  "phone_number": "+94771234567",
  "email": "john.smith@email.com",
  "vehicle_type": "Bike",
  "license_number": "DL123456",
  "current_location_lat": 6.9271,
  "current_location_lng": 79.8612,
  "is_available": true
}
```

#### GET /delivery-drivers
Get all delivery drivers

#### GET /delivery-drivers/available
Get only available drivers (sorted by rating)

#### PUT /delivery-drivers/{driverId}/location?lat={lat}&lng={lng}
Update driver location

### Delivery Management Endpoints

#### POST /deliveries
Create a new delivery order
```json
{
  "order_id": 123,
  "ngo_id": 1,
  "requester_id": 2,
  "restaurant_name": "Pizza Palace",
  "food_item": "Pizza",
  "food_amount": "10 pieces",
  "pickup_location": "123 Restaurant St, Colombo",
  "delivery_location": "456 Customer Ave, Colombo",
  "pickup_lat": 6.9271,
  "pickup_lng": 79.8612,
  "delivery_lat": 6.9271,
  "delivery_lng": 79.8612,
  "delivery_notes": "Handle with care"
}
```

#### GET /deliveries
Get all deliveries with driver information

#### PUT /deliveries/{deliveryId}/assign-driver?driverId={driverId}
Assign a driver to a delivery

#### PUT /deliveries/{deliveryId}/status?status={status}
Update delivery status
- Status options: pending, assigned, picked_up, in_transit, delivered, cancelled

#### GET /deliveries/ngo/{ngoId}
Get deliveries for a specific NGO

#### GET /deliveries/driver/{driverId}
Get deliveries assigned to a specific driver

## Usage Workflow

### 1. Register Delivery Drivers
```bash
POST /delivery-drivers
{
  "driver_name": "John Smith",
  "phone_number": "+94771234567",
  "vehicle_type": "Bike",
  "license_number": "DL123456"
}
```

### 2. Create Delivery Order
When NGO wants to deliver food to a requester:
```bash
POST /deliveries
{
  "order_id": 123,
  "ngo_id": 1,
  "requester_id": 2,
  "restaurant_name": "Pizza Palace",
  "food_item": "Pizza",
  "food_amount": "10 pieces",
  "pickup_location": "123 Restaurant St",
  "delivery_location": "456 Customer Ave"
}
```

### 3. Assign Driver
```bash
PUT /deliveries/1/assign-driver?driverId=5
```

### 4. Track Delivery Progress
```bash
PUT /deliveries/1/status?status=picked_up
PUT /deliveries/1/status?status=in_transit
PUT /deliveries/1/status?status=delivered
```

### 5. Update Driver Location (Real-time)
```bash
PUT /delivery-drivers/5/location?lat=6.9271&lng=79.8612
```

## Future Enhancements

### Google Maps Integration
- Real-time route optimization
- Distance and time estimation
- Turn-by-turn navigation for drivers

### Mobile App Features
- Driver mobile app for location tracking
- Push notifications for delivery updates
- QR code scanning for delivery confirmation

### Advanced Features
- Delivery scheduling
- Multiple pickup/delivery points
- Delivery analytics and reporting
- Payment integration for drivers

## Setup Instructions

1. **Run the database setup script:**
   ```sql
   -- Execute create_delivery_tables.sql in MySQL Workbench
   ```

2. **Start the Ballerina application:**
   ```bash
   cd Backend
   bal run
   ```

3. **Test the endpoints using Postman or curl**

## Sample Data

The setup script includes sample delivery drivers:
- John Smith (Bike)
- Sarah Johnson (Car)
- Mike Wilson (Van)
- Emma Davis (Bike)
- Alex Brown (Car)

## Error Handling

- All endpoints return appropriate HTTP status codes
- Database errors are logged and user-friendly messages returned
- Foreign key constraints ensure data integrity
- Driver availability is automatically managed

## Security Considerations

- Driver phone numbers and emails are protected
- Location data is only accessible to authorized users
- Delivery status updates require proper authentication
- License numbers are validated for uniqueness
