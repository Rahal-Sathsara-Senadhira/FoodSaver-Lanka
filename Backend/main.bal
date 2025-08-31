import ballerina/http;

import ballerina/sql;
import ballerinax/mysql;

// Record types matching the new SQL schema
public type User record {
    int id;
    string username;
    string password;
};

public type Donor record {
    string id;
    string? restaurant_id;
    string? google_location;
    string? address;
    int? user_id;
};

public type NGO record {
    int ngo_id;
    string name;
    string email;
    string contact_no;
    string? contact_name;
    int? address_street;
    int? user_id;
};

public type Driver record {
    int driver_id;
    string? first_name;
    string? last_name;
    string? vehicle_type;
    string? vehicle_number;
    int? age;
    string? phone_number;
    string? email;
    string? NIC;
    int? address_street;
    int? user_id;
};

public type DonorOrder record {
    int id;
    string donor_id;
    string donor_restaurant;
    string donated_item;
    string donated_amount;
    string? delivered_person;
};

public type RestaurantCredits record {
    int id;
    string donorid;
    int total_credits;
    int total_donations;
};

public type FoodRequest record {
    int id;
    int request_id;
    string restaurant;
    string food_item;
    string food_amount;
    string requested_person;
};

public type Shelter record {
    int id;
    int request_id;
    string restaurant;
    string food_item;
    string food_amount;
    string requested_person;
    int? address_street;
};

public type Address record {
    int street;
    string? village;
    string? city;
};

// Add your DB access and service logic below
# Calculate credits based on donated amount
function calculateCredits(string amount) returns int {
    // Parse the amount string (e.g., "50 kg", "200 ml", "10 pieces")
    // Manual string splitting since built-in split is not working
    int? spaceIndex = amount.indexOf(" ");
    if spaceIndex is () || spaceIndex == 0 || spaceIndex == amount.length() - 1 {
        return 0; // Invalid format
    }

    string quantityStr = amount.substring(0, spaceIndex);
    string unit = amount.substring(spaceIndex + 1).toLowerAscii();

    string[] parts = [quantityStr, unit];
    if parts.length() != 2 {
        return 0; // Invalid format
    }

    int|error quantity = int:fromString(quantityStr);
    if quantity is error {
        return 0; // Invalid quantity
    }

    // Calculate credits based on unit
    if unit == "kg" || unit == "kilogram" || unit == "kilograms" {
        return quantity; // 1 credit per kg
    } else if unit == "ml" || unit == "milliliter" || unit == "milliliters" {
        return quantity / 1000; // 1 credit per liter (1000ml)
    } else if unit == "l" || unit == "liter" || unit == "liters" {
        return quantity; // 1 credit per liter
    } else if unit == "pieces" || unit == "piece" || unit == "pcs" {
        return quantity; // 1 credit per piece
    } else {
        return quantity; // Default: 1 credit per unit
    }
}

# User registration service
service / on new http:Listener(8080) {

    # Health check endpoint
    resource function get health() returns http:Response {
        http:Response response = new;
        response.statusCode = 200;
        response.setPayload({"status": "Backend service is running", "database": "connected"});
        response.setHeader("Content-Type", "application/json");
        return response;
    }

    # User signup endpoint
    resource function post signup(@http:Payload User user) returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        // Validate input
        if user.username.trim().length() == 0 || user.password.trim().length() == 0 {
            response.statusCode = 400;
            response.setPayload({"error": "Username and password are required and cannot be empty"});
            return response;
        }

        // Validate password strength (minimum 6 characters)
        if user.password.length() < 6 {
            response.statusCode = 400;
            response.setPayload({"error": "Password must be at least 6 characters long"});
            return response;
        }

        // Check if username already exists
        do {
            sql:ParameterizedQuery checkQuery = `SELECT id FROM users WHERE username = ${user.username}`;
            stream<record {}, sql:Error?> resultStream = dbClient->query(checkQuery);
            record {|record {} value;|}? existingUser = check resultStream.next();

            if existingUser is record {|record {} value;|} {
                response.statusCode = 409;
                response.setPayload({"error": "Username already exists"});
                return response;
            }
        } on fail var e {
            io:println("Database error during user check: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Database error occurred"});
            return response;
        }

        // Hash the password using SHA-256
        do {
            byte[] passwordBytes = user.password.toBytes();
            string hashedPassword = crypto:hashSha256(passwordBytes).toBase16();

            // Insert new user
            sql:ParameterizedQuery insertQuery = `INSERT INTO users (username, password) VALUES (${user.username}, ${hashedPassword})`;
            sql:ExecutionResult insertResult = check dbClient->execute(insertQuery);

            if insertResult.affectedRowCount == 1 {
                response.statusCode = 201;
                response.setPayload({
                    "message": "User registered successfully",
                    "username": user.username
                });
                io:println("User registered successfully: ", user.username);
            } else {
                response.statusCode = 500;
                response.setPayload({"error": "Failed to create user account"});
            }
        } on fail var e {
            io:println("Database error during user creation: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to create user account"});
        }

        return response;
    }

    # Get all users endpoint (for testing purposes)
    resource function get users() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            stream<UserRecord, sql:Error?> userStream = dbClient->query(`SELECT id, username, password, created_at FROM users`);
            UserRecord[] users = [];

            check from UserRecord user in userStream
                do {
                    // Remove password from response for security
                    UserRecord publicUser = {
                        id: user.id,
                        username: user.username,
                        password: "",  // Don't expose passwords
                        created_at: user.created_at
                    };
                    users.push(publicUser);
                };

            response.statusCode = 200;
            response.setPayload({"users": users, "count": users.length()});
        } on fail var e {
            io:println("Database error during user retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve users"});
        }

        return response;
    }

    # Login endpoint
    resource function post login(@http:Payload User user) returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        // Validate input
        if user.username.trim().length() == 0 || user.password.trim().length() == 0 {
            response.statusCode = 400;
            response.setPayload({"error": "Username and password are required"});
            return response;
        }

        do {
            // Get user from database
            sql:ParameterizedQuery selectQuery = `SELECT id, username, password FROM users WHERE username = ${user.username}`;
            stream<UserRecord, sql:Error?> resultStream = dbClient->query(selectQuery);
            record {|UserRecord value;|}? userRecord = check resultStream.next();

            if userRecord is record {|UserRecord value;|} {
                // Hash the provided password and compare
                byte[] passwordBytes = user.password.toBytes();
                string hashedPassword = crypto:hashSha256(passwordBytes).toBase16();

                if hashedPassword == userRecord.value.password {
                    response.statusCode = 200;
                    response.setPayload({
                        "message": "Login successful",
                        "username": user.username,
                        "userId": userRecord.value.id
                    });
                    io:println("User logged in successfully: ", user.username);
                } else {
                    response.statusCode = 401;
                    response.setPayload({"error": "Invalid password"});
                }
            } else {
                response.statusCode = 401;
                response.setPayload({"error": "User not found"});
            }
        } on fail var e {
            io:println("Database error during login: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Login failed due to server error"});
        }

        return response;
    }

    # Create donor order
    resource function post donor\-orders(@http:Payload DonorOrder donorOrder) returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        // Validate input
        if donorOrder.donor_id <= 0 || donorOrder.donor_restaurant.trim().length() == 0 ||
           donorOrder.donated_item.trim().length() == 0 || donorOrder.donated_amount.trim().length() == 0 {
            response.statusCode = 400;
            response.setPayload({"error": "All required fields must be provided and valid"});
            return response;
        }

        do {
            // Insert new donor order
            sql:ParameterizedQuery insertQuery = `INSERT INTO donor_orders 
                (donor_id, donor_restaurant, donated_item, donated_amount, delivered_person) 
                VALUES (${donorOrder.donor_id}, ${donorOrder.donor_restaurant}, 
                        ${donorOrder.donated_item}, ${donorOrder.donated_amount}, 
                        ${donorOrder.delivered_person})`;
            sql:ExecutionResult insertResult = check dbClient->execute(insertQuery);

            if insertResult.affectedRowCount == 1 {
                // Get the inserted record
                stream<record {int id;}, sql:Error?> idStream = dbClient->query(`SELECT LAST_INSERT_ID() as id`);
                record {|record {int id;} value;|}? idRecord = check idStream.next();

                if idRecord is record {|record {int id;} value;|} {
                    int orderId = idRecord.value.id;

                    // Calculate and add credits to restaurant
                    int creditsEarned = calculateCredits(donorOrder.donated_amount);
                    if creditsEarned > 0 {
                        // Check if restaurant exists in credits table
                        sql:ParameterizedQuery checkRestaurantQuery = `SELECT id, total_credits, total_donations 
                            FROM restaurant_credits WHERE restaurant_name = ${donorOrder.donor_restaurant}`;
                        stream<RestaurantCredits, sql:Error?> restaurantStream = dbClient->query(checkRestaurantQuery);
                        record {|RestaurantCredits value;|}? restaurantRecord = check restaurantStream.next();

                        if restaurantRecord is record {|RestaurantCredits value;|} {
                            // Update existing restaurant credits
                            int newCredits = restaurantRecord.value.total_credits + creditsEarned;
                            int newDonations = restaurantRecord.value.total_donations + 1;
                            sql:ParameterizedQuery updateCreditsQuery = `UPDATE restaurant_credits 
                                SET total_credits = ${newCredits}, total_donations = ${newDonations} 
                                WHERE restaurant_name = ${donorOrder.donor_restaurant}`;
                            sql:ExecutionResult _ = check dbClient->execute(updateCreditsQuery);
                        } else {
                            // Create new restaurant credits entry
                            sql:ParameterizedQuery insertCreditsQuery = `INSERT INTO restaurant_credits 
                                (restaurant_name, total_credits, total_donations) 
                                VALUES (${donorOrder.donor_restaurant}, ${creditsEarned}, 1)`;
                            sql:ExecutionResult _ = check dbClient->execute(insertCreditsQuery);
                        }
                        io:println("Credits added to restaurant: ", donorOrder.donor_restaurant, " - Credits earned: ", creditsEarned);
                    }

                    response.statusCode = 201;
                    response.setPayload({
                        "message": "Donor order created successfully",
                        "orderId": orderId,
                        "creditsEarned": creditsEarned,
                        "donorOrder": donorOrder
                    });
                    io:println("Donor order created successfully with ID: ", orderId);
                } else {
                    response.statusCode = 500;
                    response.setPayload({"error": "Failed to retrieve order ID"});
                }
            } else {
                response.statusCode = 500;
                response.setPayload({"error": "Failed to create donor order"});
            }
        } on fail var e {
            io:println("Database error during donor order creation: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to create donor order"});
        }

        return response;
    }

    # Get all donor orders
    resource function get donor\-orders() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            stream<DonorOrderResponse, sql:Error?> orderStream = dbClient->query(
                `SELECT id, donor_id, donor_restaurant, donated_item, donated_amount, delivered_person FROM donor_orders ORDER BY id DESC`
            );
            DonorOrderResponse[] orders = [];

            check from var donorOrder in orderStream
                do {
                    orders.push(donorOrder);
                };

            response.statusCode = 200;
            response.setPayload({"donorOrders": orders, "count": orders.length()});
        } on fail var e {
            io:println("Database error during donor orders retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve donor orders"});
        }

        return response;
    }

    # Get donor orders by donor ID
    resource function get donor\-orders/[int donorId]() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            sql:ParameterizedQuery selectQuery = `SELECT id, donor_id, donor_restaurant, donated_item, 
                donated_amount, delivered_person FROM donor_orders WHERE donor_id = ${donorId} ORDER BY id DESC`;
            stream<DonorOrderResponse, sql:Error?> orderStream = dbClient->query(selectQuery);
            DonorOrderResponse[] orders = [];

            check from var donorOrder in orderStream
                do {
                    orders.push(donorOrder);
                };

            response.statusCode = 200;
            response.setPayload({"donorOrders": orders, "count": orders.length()});
        } on fail var e {
            io:println("Database error during donor orders retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve donor orders"});
        }

        return response;
    }

    # Update donor order
    resource function put donor\-orders/[int id](@http:Payload DonorOrder donorOrder) returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        // Validate input
        if donorOrder.donor_id <= 0 || donorOrder.donor_restaurant.trim().length() == 0 ||
           donorOrder.donated_item.trim().length() == 0 || donorOrder.donated_amount.trim().length() == 0 {
            response.statusCode = 400;
            response.setPayload({"error": "All required fields must be provided and valid"});
            return response;
        }

        do {
            // Update donor order
            sql:ParameterizedQuery updateQuery = `UPDATE donor_orders SET 
                donor_id = ${donorOrder.donor_id}, 
                donor_restaurant = ${donorOrder.donor_restaurant},
                donated_item = ${donorOrder.donated_item}, 
                donated_amount = ${donorOrder.donated_amount},
                delivered_person = ${donorOrder.delivered_person}
                WHERE id = ${id}`;
            sql:ExecutionResult updateResult = check dbClient->execute(updateQuery);

            if updateResult.affectedRowCount == 1 {
                response.statusCode = 200;
                response.setPayload({
                    "message": "Donor order updated successfully",
                    "orderId": id,
                    "donorOrder": donorOrder
                });
                io:println("Donor order updated successfully with ID: ", id);
            } else {
                response.statusCode = 404;
                response.setPayload({"error": "Donor order not found"});
            }
        } on fail var e {
            io:println("Database error during donor order update: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to update donor order"});
        }

        return response;
    }

    # Delete donor order
    resource function delete donor\-orders/[int id]() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            sql:ParameterizedQuery deleteQuery = `DELETE FROM donor_orders WHERE id = ${id}`;
            sql:ExecutionResult deleteResult = check dbClient->execute(deleteQuery);

            if deleteResult.affectedRowCount == 1 {
                response.statusCode = 200;
                response.setPayload({
                    "message": "Donor order deleted successfully",
                    "orderId": id
                });
                io:println("Donor order deleted successfully with ID: ", id);
            } else {
                response.statusCode = 404;
                response.setPayload({"error": "Donor order not found"});
            }
        } on fail var e {
            io:println("Database error during donor order deletion: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to delete donor order"});
        }

        return response;
    }

    # Create food request
    resource function post food\-requests(@http:Payload FoodRequest foodRequest) returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        // Validate input
        if foodRequest.request_id <= 0 || foodRequest.restaurant.trim().length() == 0 ||
           foodRequest.food_item.trim().length() == 0 || foodRequest.food_amount.trim().length() == 0 ||
           foodRequest.requested_person.trim().length() == 0 {
            response.statusCode = 400;
            response.setPayload({"error": "All required fields must be provided and valid"});
            return response;
        }

        do {
            // Insert new food request
            sql:ParameterizedQuery insertQuery = `INSERT INTO food_requests 
                (request_id, restaurant, food_item, food_amount, requested_person) 
                VALUES (${foodRequest.request_id}, ${foodRequest.restaurant}, 
                        ${foodRequest.food_item}, ${foodRequest.food_amount}, 
                        ${foodRequest.requested_person})`;
            sql:ExecutionResult insertResult = check dbClient->execute(insertQuery);

            if insertResult.affectedRowCount == 1 {
                // Get the inserted record
                stream<record {int id;}, sql:Error?> idStream = dbClient->query(`SELECT LAST_INSERT_ID() as id`);
                record {|record {int id;} value;|}? idRecord = check idStream.next();

                if idRecord is record {|record {int id;} value;|} {
                    int requestId = idRecord.value.id;

                    response.statusCode = 201;
                    response.setPayload({
                        "message": "Food request created successfully",
                        "requestId": requestId,
                        "foodRequest": foodRequest
                    });
                    io:println("Food request created successfully with ID: ", requestId);
                } else {
                    response.statusCode = 500;
                    response.setPayload({"error": "Failed to retrieve request ID"});
                }
            } else {
                response.statusCode = 500;
                response.setPayload({"error": "Failed to create food request"});
            }
        } on fail var e {
            io:println("Database error during food request creation: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to create food request"});
        }

        return response;
    }

    # Get all food requests
    resource function get food\-requests() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            stream<FoodRequestResponse, sql:Error?> requestStream = dbClient->query(
                `SELECT id, request_id, restaurant, food_item, food_amount, requested_person 
                 FROM food_requests ORDER BY id DESC`
            );
            FoodRequestResponse[] requests = [];

            check from var foodRequest in requestStream
                do {
                    requests.push(foodRequest);
                };

            response.statusCode = 200;
            response.setPayload({"foodRequests": requests, "count": requests.length()});
        } on fail var e {
            io:println("Database error during food requests retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve food requests"});
        }

        return response;
    }

    # Get food requests by request ID
    resource function get food\-requests/[int requestId]() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            sql:ParameterizedQuery selectQuery = `SELECT id, request_id, restaurant, food_item, 
                food_amount, requested_person FROM food_requests WHERE request_id = ${requestId} ORDER BY id DESC`;
            stream<FoodRequestResponse, sql:Error?> requestStream = dbClient->query(selectQuery);
            FoodRequestResponse[] requests = [];

            check from var foodRequest in requestStream
                do {
                    requests.push(foodRequest);
                };

            response.statusCode = 200;
            response.setPayload({"foodRequests": requests, "count": requests.length()});
        } on fail var e {
            io:println("Database error during food requests retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve food requests"});
        }

        return response;
    }

    # Update food request
    resource function put food\-requests/[int id](@http:Payload FoodRequest foodRequest) returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        // Validate input
        if foodRequest.request_id <= 0 || foodRequest.restaurant.trim().length() == 0 ||
           foodRequest.food_item.trim().length() == 0 || foodRequest.food_amount.trim().length() == 0 ||
           foodRequest.requested_person.trim().length() == 0 {
            response.statusCode = 400;
            response.setPayload({"error": "All required fields must be provided and valid"});
            return response;
        }

        do {
            // Update food request
            sql:ParameterizedQuery updateQuery = `UPDATE food_requests SET 
                request_id = ${foodRequest.request_id}, 
                restaurant = ${foodRequest.restaurant},
                food_item = ${foodRequest.food_item}, 
                food_amount = ${foodRequest.food_amount},
                requested_person = ${foodRequest.requested_person}
                WHERE id = ${id}`;
            sql:ExecutionResult updateResult = check dbClient->execute(updateQuery);

            if updateResult.affectedRowCount == 1 {
                response.statusCode = 200;
                response.setPayload({
                    "message": "Food request updated successfully",
                    "requestId": id,
                    "foodRequest": foodRequest
                });
                io:println("Food request updated successfully with ID: ", id);
            } else {
                response.statusCode = 404;
                response.setPayload({"error": "Food request not found"});
            }
        } on fail var e {
            io:println("Database error during food request update: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to update food request"});
        }

        return response;
    }

    # Delete food request
    resource function delete food\-requests/[int id]() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            sql:ParameterizedQuery deleteQuery = `DELETE FROM food_requests WHERE id = ${id}`;
            sql:ExecutionResult deleteResult = check dbClient->execute(deleteQuery);

            if deleteResult.affectedRowCount == 1 {
                response.statusCode = 200;
                response.setPayload({
                    "message": "Food request deleted successfully",
                    "requestId": id
                });
                io:println("Food request deleted successfully with ID: ", id);
            } else {
                response.statusCode = 404;
                response.setPayload({"error": "Food request not found"});
            }
        } on fail var e {
            io:println("Database error during food request deletion: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to delete food request"});
        }

        return response;
    }

    # Get all restaurant credits (sorted by credits)
    resource function get restaurant\-credits() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            stream<RestaurantCredits, sql:Error?> creditsStream = dbClient->query(
                `SELECT id, restaurant_name, total_credits, total_donations 
                 FROM restaurant_credits ORDER BY total_credits DESC`
            );
            RestaurantCredits[] credits = [];

            check from RestaurantCredits credit in creditsStream
                do {
                    credits.push(credit);
                };

            response.statusCode = 200;
            response.setPayload({"restaurantCredits": credits, "count": credits.length()});
        } on fail var e {
            io:println("Database error during restaurant credits retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve restaurant credits"});
        }

        return response;
    }

    # Get restaurant credits by name
    resource function get restaurant\-credits/[string restaurantName]() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            sql:ParameterizedQuery selectQuery = `SELECT id, restaurant_name, total_credits, total_donations 
                FROM restaurant_credits WHERE restaurant_name = ${restaurantName}`;
            stream<RestaurantCredits, sql:Error?> creditsStream = dbClient->query(selectQuery);
            record {|RestaurantCredits value;|}? creditRecord = check creditsStream.next();

            if creditRecord is record {|RestaurantCredits value;|} {
                response.statusCode = 200;
                response.setPayload({"restaurantCredits": creditRecord.value});
            } else {
                response.statusCode = 404;
                response.setPayload({"error": "Restaurant not found"});
            }
        } on fail var e {
            io:println("Database error during restaurant credits retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve restaurant credits"});
        }

        return response;
    }

    # Get restaurant leaderboard (top restaurants by credits)
    resource function get restaurant\-credits/leaderboard() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            stream<RestaurantCredits, sql:Error?> creditsStream = dbClient->query(
                `SELECT id, restaurant_name, total_credits, total_donations 
                 FROM restaurant_credits ORDER BY total_credits DESC LIMIT 10`
            );
            RestaurantCredits[] leaderboard = [];
            int rank = 1;

            check from RestaurantCredits credit in creditsStream
                do {
                    RestaurantCreditsSummary summary = {
                        restaurant_name: credit.restaurant_name,
                        total_credits: credit.total_credits,
                        total_donations: credit.total_donations,
                        rank: rank
                    };
                    leaderboard.push(credit);
                    rank += 1;
                };

            response.statusCode = 200;
            response.setPayload({
                "leaderboard": leaderboard, 
                "count": leaderboard.length(),
                "message": "Top 10 restaurants by credits"
            });
        } on fail var e {
            io:println("Database error during leaderboard retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve leaderboard"});
        }

        return response;
    }

    # Get restaurant credits statistics
    resource function get restaurant\-credits/statistics() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            // Get total restaurants
            stream<record {int count;}, sql:Error?> totalStream = dbClient->query(`SELECT COUNT(*) as count FROM restaurant_credits`);
            record {|record {int count;} value;|}? totalRecord = check totalStream.next();

            // Get total credits distributed
            stream<record {int total;}, sql:Error?> creditsStream = dbClient->query(`SELECT SUM(total_credits) as total FROM restaurant_credits`);
            record {|record {int total;} value;|}? creditsRecord = check creditsStream.next();

            // Get total donations
            stream<record {int total;}, sql:Error?> donationsStream = dbClient->query(`SELECT SUM(total_donations) as total FROM restaurant_credits`);
            record {|record {int total;} value;|}? donationsRecord = check donationsStream.next();

            int totalRestaurants = totalRecord is record {|record {int count;} value;|} ? totalRecord.value.count : 0;
            int totalCredits = creditsRecord is record {|record {int total;} value;|} ? creditsRecord.value.total : 0;
            int totalDonations = donationsRecord is record {|record {int total;} value;|} ? donationsRecord.value.total : 0;

            response.statusCode = 200;
            response.setPayload({
                "totalRestaurants": totalRestaurants,
                "totalCreditsDistributed": totalCredits,
                "totalDonations": totalDonations,
                "averageCreditsPerRestaurant": totalRestaurants > 0 ? totalCredits / totalRestaurants : 0
            });
        } on fail var e {
            io:println("Database error during statistics retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve statistics"});
        }

        return response;
    }

    # Create NGO supply record
    resource function post ngo\-supplies(@http:Payload NgoSupply ngoSupply) returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        // Validate input
        if ngoSupply.stock_id.trim().length() == 0 || ngoSupply.restaurant_name.trim().length() == 0 ||
           ngoSupply.container_type.trim().length() == 0 || ngoSupply.number_of_containers <= 0 {
            response.statusCode = 400;
            response.setPayload({"error": "All required fields must be provided and valid"});
            return response;
        }

        do {
            // Check if stock_id already exists
            sql:ParameterizedQuery checkQuery = `SELECT id FROM ngo_supplies WHERE stock_id = ${ngoSupply.stock_id}`;
            stream<record {}, sql:Error?> checkStream = dbClient->query(checkQuery);
            record {|record {} value;|}? existingRecord = check checkStream.next();

            if existingRecord is record {|record {} value;|} {
                response.statusCode = 409;
                response.setPayload({"error": "Stock ID already exists"});
                return response;
            }

            // Insert new NGO supply record
            sql:ParameterizedQuery insertQuery = `INSERT INTO ngo_supplies 
                (stock_id, restaurant_name, container_type, number_of_containers, notes) 
                VALUES (${ngoSupply.stock_id}, ${ngoSupply.restaurant_name}, 
                        ${ngoSupply.container_type}, ${ngoSupply.number_of_containers}, 
                        ${ngoSupply.notes})`;
            sql:ExecutionResult insertResult = check dbClient->execute(insertQuery);

            if insertResult.affectedRowCount == 1 {
                // Get the inserted record
                stream<record {int id;}, sql:Error?> idStream = dbClient->query(`SELECT LAST_INSERT_ID() as id`);
                record {|record {int id;} value;|}? idRecord = check idStream.next();

                if idRecord is record {|record {int id;} value;|} {
                    int supplyId = idRecord.value.id;

                    response.statusCode = 201;
                    response.setPayload({
                        "message": "NGO supply record created successfully",
                        "supplyId": supplyId,
                        "ngoSupply": ngoSupply
                    });
                    io:println("NGO supply record created successfully with ID: ", supplyId);
                } else {
                    response.statusCode = 500;
                    response.setPayload({"error": "Failed to retrieve supply ID"});
                }
            } else {
                response.statusCode = 500;
                response.setPayload({"error": "Failed to create NGO supply record"});
            }
        } on fail var e {
            io:println("Database error during NGO supply creation: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to create NGO supply record"});
        }

        return response;
    }

    # Get all NGO supplies
    resource function get ngo\-supplies() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            stream<NgoSupplyResponse, sql:Error?> suppliesStream = dbClient->query(
                `SELECT id, stock_id, restaurant_name, container_type, number_of_containers, 
                        supplied_date, notes 
                 FROM ngo_supplies ORDER BY id DESC`
            );
            NgoSupplyResponse[] supplies = [];

            check from NgoSupplyResponse supply in suppliesStream
                do {
                    supplies.push(supply);
                };

            response.statusCode = 200;
            response.setPayload({"ngoSupplies": supplies, "count": supplies.length()});
        } on fail var e {
            io:println("Database error during NGO supplies retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve NGO supplies"});
        }

        return response;
    }

    # Get NGO supplies by restaurant name
    resource function get ngo\-supplies/restaurant/[string restaurantName]() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            sql:ParameterizedQuery selectQuery = `SELECT id, stock_id, restaurant_name, container_type, 
                number_of_containers, supplied_date, notes 
                FROM ngo_supplies WHERE restaurant_name = ${restaurantName} ORDER BY id DESC`;
            stream<NgoSupplyResponse, sql:Error?> suppliesStream = dbClient->query(selectQuery);
            NgoSupplyResponse[] supplies = [];

            check from NgoSupplyResponse supply in suppliesStream
                do {
                    supplies.push(supply);
                };

            response.statusCode = 200;
            response.setPayload({"ngoSupplies": supplies, "count": supplies.length()});
        } on fail var e {
            io:println("Database error during NGO supplies retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve NGO supplies"});
        }

        return response;
    }

    # Get NGO supply by stock ID
    resource function get ngo\-supplies/stock/[string stockId]() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            sql:ParameterizedQuery selectQuery = `SELECT id, stock_id, restaurant_name, container_type, 
                number_of_containers, supplied_date, notes 
                FROM ngo_supplies WHERE stock_id = ${stockId}`;
            stream<NgoSupplyResponse, sql:Error?> suppliesStream = dbClient->query(selectQuery);
            record {|NgoSupplyResponse value;|}? supplyRecord = check suppliesStream.next();

            if supplyRecord is record {|NgoSupplyResponse value;|} {
                response.statusCode = 200;
                response.setPayload({"ngoSupply": supplyRecord.value});
            } else {
                response.statusCode = 404;
                response.setPayload({"error": "NGO supply record not found"});
            }
        } on fail var e {
            io:println("Database error during NGO supply retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve NGO supply record"});
        }

        return response;
    }

    # Update NGO supply record
    resource function put ngo\-supplies/[int id](@http:Payload NgoSupply ngoSupply) returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        // Validate input
        if ngoSupply.stock_id.trim().length() == 0 || ngoSupply.restaurant_name.trim().length() == 0 ||
           ngoSupply.container_type.trim().length() == 0 || ngoSupply.number_of_containers <= 0 {
            response.statusCode = 400;
            response.setPayload({"error": "All required fields must be provided and valid"});
            return response;
        }

        do {
            // Update NGO supply record
            sql:ParameterizedQuery updateQuery = `UPDATE ngo_supplies SET 
                stock_id = ${ngoSupply.stock_id}, 
                restaurant_name = ${ngoSupply.restaurant_name},
                container_type = ${ngoSupply.container_type}, 
                number_of_containers = ${ngoSupply.number_of_containers},
                notes = ${ngoSupply.notes}
                WHERE id = ${id}`;
            sql:ExecutionResult updateResult = check dbClient->execute(updateQuery);

            if updateResult.affectedRowCount == 1 {
                response.statusCode = 200;
                response.setPayload({
                    "message": "NGO supply record updated successfully",
                    "supplyId": id,
                    "ngoSupply": ngoSupply
                });
                io:println("NGO supply record updated successfully with ID: ", id);
            } else {
                response.statusCode = 404;
                response.setPayload({"error": "NGO supply record not found"});
            }
        } on fail var e {
            io:println("Database error during NGO supply update: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to update NGO supply record"});
        }

        return response;
    }

    # Delete NGO supply record
    resource function delete ngo\-supplies/[int id]() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            sql:ParameterizedQuery deleteQuery = `DELETE FROM ngo_supplies WHERE id = ${id}`;
            sql:ExecutionResult deleteResult = check dbClient->execute(deleteQuery);

            if deleteResult.affectedRowCount == 1 {
                response.statusCode = 200;
                response.setPayload({
                    "message": "NGO supply record deleted successfully",
                    "supplyId": id
                });
                io:println("NGO supply record deleted successfully with ID: ", id);
            } else {
                response.statusCode = 404;
                response.setPayload({"error": "NGO supply record not found"});
            }
        } on fail var e {
            io:println("Database error during NGO supply deletion: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to delete NGO supply record"});
        }

        return response;
    }

    # Get NGO supplies statistics
    resource function get ngo\-supplies/statistics() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            // Get total supplies
            stream<record {int count;}, sql:Error?> totalStream = dbClient->query(`SELECT COUNT(*) as count FROM ngo_supplies`);
            record {|record {int count;} value;|}? totalRecord = check totalStream.next();

            // Get total containers distributed
            stream<record {int total;}, sql:Error?> containersStream = dbClient->query(`SELECT SUM(number_of_containers) as total FROM ngo_supplies`);
            record {|record {int total;} value;|}? containersRecord = check containersStream.next();

            // Get unique restaurants served
            stream<record {int count;}, sql:Error?> restaurantStream = dbClient->query(
                `SELECT COUNT(DISTINCT restaurant_name) as count FROM ngo_supplies`
            );
            record {|record {int count;} value;|}? restaurantRecord = check restaurantStream.next();

            int totalSupplies = totalRecord is record {|record {int count;} value;|} ? totalRecord.value.count : 0;
            int totalContainers = containersRecord is record {|record {int total;} value;|} ? containersRecord.value.total : 0;
            int uniqueRestaurants = restaurantRecord is record {|record {int count;} value;|} ? restaurantRecord.value.count : 0;

            response.statusCode = 200;
            response.setPayload({
                "totalSupplies": totalSupplies,
                "totalContainersDistributed": totalContainers,
                "uniqueRestaurantsServed": uniqueRestaurants,
                "averageContainersPerRestaurant": uniqueRestaurants > 0 ? totalContainers / uniqueRestaurants : 0
            });
        } on fail var e {
            io:println("Database error during NGO supplies statistics retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve NGO supplies statistics"});
        }

        return response;
    }

    # ===============================
    # DELIVERY DRIVER MANAGEMENT
    # ===============================

    # Register a new delivery driver
    resource function post delivery\-drivers(@http:Payload DeliveryDriver driver) returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        // Validate input
        if driver.driver_name.trim().length() == 0 || driver.phone_number.trim().length() == 0 ||
           driver.vehicle_type.trim().length() == 0 || driver.license_number.trim().length() == 0 {
            response.statusCode = 400;
            response.setPayload({"error": "Driver name, phone number, vehicle type, and license number are required"});
            return response;
        }

        do {
            // Check if license number already exists
            sql:ParameterizedQuery checkLicenseQuery = `SELECT id FROM delivery_drivers WHERE license_number = ${driver.license_number}`;
            stream<record {}, sql:Error?> licenseStream = dbClient->query(checkLicenseQuery);
            record {|record {} value;|}? existingLicense = check licenseStream.next();

            if existingLicense is record {|record {} value;|} {
                response.statusCode = 409;
                response.setPayload({"error": "License number already exists"});
                return response;
            }

            // Insert new delivery driver
            sql:ParameterizedQuery insertQuery = `INSERT INTO delivery_drivers
                (driver_name, phone_number, email, vehicle_type, license_number,
                 current_location_lat, current_location_lng, is_available)
                VALUES (${driver.driver_name}, ${driver.phone_number}, ${driver.email},
                        ${driver.vehicle_type}, ${driver.license_number},
                        ${driver.current_location_lat ?: ()}, ${driver.current_location_lng ?: ()},
                        ${driver.is_available ?: true})`;
            sql:ExecutionResult insertResult = check dbClient->execute(insertQuery);

            if insertResult.affectedRowCount == 1 {
                // Get the inserted record
                stream<record {int id;}, sql:Error?> idStream = dbClient->query(`SELECT LAST_INSERT_ID() as id`);
                record {|record {int id;} value;|}? idRecord = check idStream.next();

                if idRecord is record {|record {int id;} value;|} {
                    int driverId = idRecord.value.id;

                    response.statusCode = 201;
                    response.setPayload({
                        "message": "Delivery driver registered successfully",
                        "driverId": driverId,
                        "driver": driver
                    });
                    io:println("Delivery driver registered successfully with ID: ", driverId);
                } else {
                    response.statusCode = 500;
                    response.setPayload({"error": "Failed to retrieve driver ID"});
                }
            } else {
                response.statusCode = 500;
                response.setPayload({"error": "Failed to register delivery driver"});
            }
        } on fail var e {
            io:println("Database error during delivery driver registration: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to register delivery driver"});
        }

        return response;
    }

    # Get all delivery drivers
    resource function get delivery\-drivers() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            stream<DeliveryDriverResponse, sql:Error?> driverStream = dbClient->query(
                `SELECT id, driver_name, phone_number, email, vehicle_type, license_number,
                        current_location_lat, current_location_lng, is_available, rating, 
                        total_deliveries, created_at, updated_at 
                 FROM delivery_drivers ORDER BY created_at DESC`
            );
            DeliveryDriverResponse[] drivers = [];

            check from var driver in driverStream
                do {
                    drivers.push(driver);
                };

            response.statusCode = 200;
            response.setPayload({"drivers": drivers, "count": drivers.length()});
        } on fail var e {
            io:println("Database error during delivery drivers retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve delivery drivers"});
        }

        return response;
    }

    # Get available delivery drivers
    resource function get delivery\-drivers/available() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            stream<DeliveryDriverResponse, sql:Error?> driverStream = dbClient->query(
                `SELECT id, driver_name, phone_number, email, vehicle_type, license_number,
                        current_location_lat, current_location_lng, is_available, rating, 
                        total_deliveries, created_at, updated_at 
                 FROM delivery_drivers WHERE is_available = true 
                 ORDER BY rating DESC, total_deliveries DESC`
            );
            DeliveryDriverResponse[] drivers = [];

            check from var driver in driverStream
                do {
                    drivers.push(driver);
                };

            response.statusCode = 200;
            response.setPayload({"availableDrivers": drivers, "count": drivers.length()});
        } on fail var e {
            io:println("Database error during available drivers retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve available drivers"});
        }

        return response;
    }

    # Update delivery driver location
    resource function put delivery\-drivers/[int driverId]/location(decimal lat, decimal lng) returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            sql:ParameterizedQuery updateQuery = `UPDATE delivery_drivers 
                SET current_location_lat = ${lat}, current_location_lng = ${lng}, updated_at = NOW() 
                WHERE id = ${driverId}`;
            sql:ExecutionResult updateResult = check dbClient->execute(updateQuery);

            if updateResult.affectedRowCount == 1 {
                response.statusCode = 200;
                response.setPayload({
                    "message": "Driver location updated successfully",
                    "driverId": driverId,
                    "location": {"lat": lat, "lng": lng}
                });
                io:println("Driver location updated for ID: ", driverId);
            } else {
                response.statusCode = 404;
                response.setPayload({"error": "Delivery driver not found"});
            }
        } on fail var e {
            io:println("Database error during driver location update: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to update driver location"});
        }

        return response;
    }

    # ===============================
    # DELIVERY MANAGEMENT
    # ===============================

    # Create a new delivery order
    resource function post deliveries(@http:Payload Delivery delivery) returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        // Validate input
        if delivery.order_id <= 0 || delivery.ngo_id <= 0 || delivery.requester_id <= 0 ||
           delivery.restaurant_name.trim().length() == 0 || delivery.food_item.trim().length() == 0 ||
           delivery.food_amount.trim().length() == 0 || delivery.pickup_location.trim().length() == 0 ||
           delivery.delivery_location.trim().length() == 0 {
            response.statusCode = 400;
            response.setPayload({"error": "All required fields must be provided and valid"});
            return response;
        }

        do {
            // Insert new delivery
            sql:ParameterizedQuery insertQuery = `INSERT INTO deliveries 
                (order_id, ngo_id, requester_id, restaurant_name, food_item, food_amount,
                 pickup_location, delivery_location, pickup_lat, pickup_lng, 
                 delivery_lat, delivery_lng, delivery_notes) 
                VALUES (${delivery.order_id}, ${delivery.ngo_id}, ${delivery.requester_id},
                        ${delivery.restaurant_name}, ${delivery.food_item}, ${delivery.food_amount},
                        ${delivery.pickup_location}, ${delivery.delivery_location},
                        ${delivery.pickup_lat}, ${delivery.pickup_lng},
                        ${delivery.delivery_lat}, ${delivery.delivery_lng}, ${delivery.delivery_notes})`;
            sql:ExecutionResult insertResult = check dbClient->execute(insertQuery);

            if insertResult.affectedRowCount == 1 {
                // Get the inserted record
                stream<record {int id;}, sql:Error?> idStream = dbClient->query(`SELECT LAST_INSERT_ID() as id`);
                record {|record {int id;} value;|}? idRecord = check idStream.next();

                if idRecord is record {|record {int id;} value;|} {
                    int deliveryId = idRecord.value.id;

                    response.statusCode = 201;
                    response.setPayload({
                        "message": "Delivery order created successfully",
                        "deliveryId": deliveryId,
                        "delivery": delivery
                    });
                    io:println("Delivery order created successfully with ID: ", deliveryId);
                } else {
                    response.statusCode = 500;
                    response.setPayload({"error": "Failed to retrieve delivery ID"});
                }
            } else {
                response.statusCode = 500;
                response.setPayload({"error": "Failed to create delivery order"});
            }
        } on fail var e {
            io:println("Database error during delivery creation: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to create delivery order"});
        }

        return response;
    }

    # Get all deliveries
    resource function get deliveries() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            stream<DeliveryWithDriverQueryResult, sql:Error?> deliveryStream = dbClient->query(
                `SELECT d.id, d.order_id, d.driver_id, d.ngo_id, d.requester_id, 
                        d.restaurant_name, d.food_item, d.food_amount, d.pickup_location, 
                        d.delivery_location, d.pickup_lat, d.pickup_lng, d.delivery_lat, 
                        d.delivery_lng, d.status, d.estimated_delivery_time, 
                        d.actual_delivery_time, d.delivery_notes, d.created_at, d.updated_at,
                        dd.driver_name, dd.phone_number, dd.vehicle_type
                 FROM deliveries d 
                 LEFT JOIN delivery_drivers dd ON d.driver_id = dd.id 
                 ORDER BY d.created_at DESC`
            );
            DeliveryResponse[] deliveries = [];

            check from var row in deliveryStream
                do {
                    DeliveryDriverResponse? driver = ();
                    if row["driver_id"] is int && row["driver_name"] is string {
                        driver = {
                            id: <int>row["driver_id"],
                            driver_name: <string>row["driver_name"],
                            phone_number: row["phone_number"] is string ? <string>row["phone_number"] : "",
                            email: (),
                            vehicle_type: row["vehicle_type"] is string ? <string>row["vehicle_type"] : "",
                            license_number: "",
                            current_location_lat: (),
                            current_location_lng: (),
                            is_available: true,
                            rating: 5.00,
                            total_deliveries: 0,
                            created_at: "",
                            updated_at: ""
                        };
                    }

                    DeliveryResponse delivery = {
                        id: <int>row["id"],
                        order_id: <int>row["order_id"],
                        driver_id: row["driver_id"] is int ? <int>row["driver_id"] : (),
                        ngo_id: <int>row["ngo_id"],
                        requester_id: <int>row["requester_id"],
                        restaurant_name: <string>row["restaurant_name"],
                        food_item: <string>row["food_item"],
                        food_amount: <string>row["food_amount"],
                        pickup_location: <string>row["pickup_location"],
                        delivery_location: <string>row["delivery_location"],
                        pickup_lat: row["pickup_lat"] is decimal ? <decimal>row["pickup_lat"] : (),
                        pickup_lng: row["pickup_lng"] is decimal ? <decimal>row["pickup_lng"] : (),
                        delivery_lat: row["delivery_lat"] is decimal ? <decimal>row["delivery_lat"] : (),
                        delivery_lng: row["delivery_lng"] is decimal ? <decimal>row["delivery_lng"] : (),
                        status: <string>row["status"],
                        estimated_delivery_time: row["estimated_delivery_time"] is string ? <string>row["estimated_delivery_time"] : (),
                        actual_delivery_time: row["actual_delivery_time"] is string ? <string>row["actual_delivery_time"] : (),
                        delivery_notes: row["delivery_notes"] is string ? <string>row["delivery_notes"] : (),
                        created_at: <string>row["created_at"],
                        updated_at: row["updated_at"] is string ? <string>row["updated_at"] : "",
                        driver: driver
                    };
                    deliveries.push(delivery);
                };

            response.statusCode = 200;
            response.setPayload({"deliveries": deliveries, "count": deliveries.length()});
        } on fail var e {
            io:println("Database error during deliveries retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve deliveries"});
        }

        return response;
    }

    # Assign driver to delivery
    resource function put deliveries/[int deliveryId]/assign\-driver(int driverId) returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            // Check if driver is available
            sql:ParameterizedQuery checkDriverQuery = `SELECT id, is_available FROM delivery_drivers WHERE id = ${driverId} AND is_available = true`;
            stream<record {int id; boolean is_available;}, sql:Error?> driverStream = dbClient->query(checkDriverQuery);
            record {|record {int id; boolean is_available;} value;|}? driverRecord = check driverStream.next();

            if driverRecord is () {
                response.statusCode = 404;
                response.setPayload({"error": "Driver not found or not available"});
                return response;
            }

            // Update delivery with driver assignment
            sql:ParameterizedQuery updateQuery = `UPDATE deliveries 
                SET driver_id = ${driverId}, status = 'assigned', updated_at = NOW() 
                WHERE id = ${deliveryId} AND status = 'pending'`;
            sql:ExecutionResult updateResult = check dbClient->execute(updateQuery);

            if updateResult.affectedRowCount == 1 {
                // Update driver availability and delivery count
                sql:ParameterizedQuery updateDriverQuery = `UPDATE delivery_drivers 
                    SET is_available = false, total_deliveries = total_deliveries + 1, updated_at = NOW() 
                    WHERE id = ${driverId}`;
                sql:ExecutionResult _ = check dbClient->execute(updateDriverQuery);

                response.statusCode = 200;
                response.setPayload({
                    "message": "Driver assigned to delivery successfully",
                    "deliveryId": deliveryId,
                    "driverId": driverId
                });
                io:println("Driver assigned to delivery - Delivery ID: ", deliveryId, ", Driver ID: ", driverId);
            } else {
                response.statusCode = 404;
                response.setPayload({"error": "Delivery not found or already assigned"});
            }
        } on fail var e {
            io:println("Database error during driver assignment: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to assign driver to delivery"});
        }

        return response;
    }

    # Update delivery status
    resource function put deliveries/[int deliveryId]/status(string status) returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        // Validate status
        if status != "pending" && status != "assigned" && status != "picked_up" && 
           status != "in_transit" && status != "delivered" && status != "cancelled" {
            response.statusCode = 400;
            response.setPayload({"error": "Invalid status. Must be: pending, assigned, picked_up, in_transit, delivered, or cancelled"});
            return response;
        }

        do {
            sql:ParameterizedQuery sqlQuery;
            if status == "delivered" {
                sqlQuery = `UPDATE deliveries SET status = ${status}, actual_delivery_time = NOW(), updated_at = NOW() WHERE id = ${deliveryId}`;
            } else {
                sqlQuery = `UPDATE deliveries SET status = ${status}, updated_at = NOW() WHERE id = ${deliveryId}`;
            }

            sql:ExecutionResult updateResult = check dbClient->execute(sqlQuery);

            if updateResult.affectedRowCount == 1 {
                // If delivery is completed, make driver available again
                if status == "delivered" || status == "cancelled" {
                    sql:ParameterizedQuery getDriverQuery = `SELECT driver_id FROM deliveries WHERE id = ${deliveryId}`;
                    stream<record {int? driver_id;}, sql:Error?> driverIdStream = dbClient->query(getDriverQuery);
                    record {|record {int? driver_id;} value;|}? driverIdRecord = check driverIdStream.next();

                    if driverIdRecord is record {|record {int? driver_id;} value;|} && driverIdRecord.value.driver_id is int {
                        sql:ParameterizedQuery updateDriverQuery = `UPDATE delivery_drivers 
                            SET is_available = true, updated_at = NOW() 
                            WHERE id = ${driverIdRecord.value.driver_id}`;
                        sql:ExecutionResult _ = check dbClient->execute(updateDriverQuery);
                    }
                }

                response.statusCode = 200;
                response.setPayload({
                    "message": "Delivery status updated successfully",
                    "deliveryId": deliveryId,
                    "status": status
                });
                io:println("Delivery status updated - ID: ", deliveryId, ", Status: ", status);
            } else {
                response.statusCode = 404;
                response.setPayload({"error": "Delivery not found"});
            }
        } on fail var e {
            io:println("Database error during delivery status update: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to update delivery status"});
        }

        return response;
    }

    # Get deliveries by NGO
    resource function get deliveries/ngo/[int ngoId]() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            sql:ParameterizedQuery selectQuery = `SELECT d.id, d.order_id, d.driver_id, d.ngo_id, d.requester_id, 
                d.restaurant_name, d.food_item, d.food_amount, d.pickup_location, d.delivery_location, 
                d.status, d.created_at, dd.driver_name, dd.phone_number
                FROM deliveries d 
                LEFT JOIN delivery_drivers dd ON d.driver_id = dd.id 
                WHERE d.ngo_id = ${ngoId} ORDER BY d.created_at DESC`;
            stream<NgoDeliveryQueryResult, sql:Error?> deliveryStream = dbClient->query(selectQuery);
            
            // Process results similar to get deliveries endpoint
            DeliveryResponse[] deliveries = [];
            
            check from var row in deliveryStream
                do {
                    // Create simplified delivery response
                    DeliveryResponse delivery = {
                        id: row.id,
                        order_id: row.order_id,
                        driver_id: row.driver_id,
                        ngo_id: row.ngo_id,
                        requester_id: row.requester_id,
                        restaurant_name: row.restaurant_name,
                        food_item: row.food_item,
                        food_amount: row.food_amount,
                        pickup_location: row.pickup_location,
                        delivery_location: row.delivery_location,
                        pickup_lat: (),
                        pickup_lng: (),
                        delivery_lat: (),
                        delivery_lng: (),
                        status: row.status,
                        estimated_delivery_time: (),
                        actual_delivery_time: (),
                        delivery_notes: (),
                        created_at: row.created_at,
                        updated_at: "",
                        driver: ()
                    };
                    deliveries.push(delivery);
                };

            response.statusCode = 200;
            response.setPayload({"deliveries": deliveries, "count": deliveries.length()});
        } on fail var e {
            io:println("Database error during NGO deliveries retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve NGO deliveries"});
        }

        return response;
    }

    # Get deliveries by driver
    resource function get deliveries/driver/[int driverId]() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            sql:ParameterizedQuery selectQuery = `SELECT d.id, d.order_id, d.ngo_id, d.requester_id, 
                d.restaurant_name, d.food_item, d.food_amount, d.pickup_location, d.delivery_location, 
                d.status, d.created_at, d.actual_delivery_time
                FROM deliveries d 
                WHERE d.driver_id = ${driverId} ORDER BY d.created_at DESC`;
            stream<record {}, sql:Error?> deliveryStream = dbClient->query(selectQuery);
            
            DeliveryResponse[] deliveries = [];
            
            check from var row in deliveryStream
                do {
                    // Create delivery response
                    DeliveryResponse delivery = {
                        id: <int>row["id"],
                        order_id: <int>row["order_id"],
                        driver_id: <int?>row["driver_id"],
                        ngo_id: <int>row["ngo_id"],
                        requester_id: <int>row["requester_id"],
                        restaurant_name: <string>row["restaurant_name"],
                        food_item: <string>row["food_item"],
                        food_amount: <string>row["food_amount"],
                        pickup_location: <string>row["pickup_location"],
                        delivery_location: <string>row["delivery_location"],
                        pickup_lat: (),
                        pickup_lng: (),
                        delivery_lat: (),
                        delivery_lng: (),
                        status: <string>row["status"],
                        estimated_delivery_time: (),
                        actual_delivery_time: <string?>row["actual_delivery_time"],
                        delivery_notes: (),
                        created_at: <string>row["created_at"],
                        updated_at: "",
                        driver: ()
                    };
                    deliveries.push(delivery);
                };

            response.statusCode = 200;
            response.setPayload({"deliveries": deliveries, "count": deliveries.length()});
        } on fail var e {
            io:println("Database error during driver deliveries retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve driver deliveries"});
        }

        return response;
    }

    # ===============================
    # DRIVER MANAGEMENT ENDPOINTS
    # ===============================

    # Register a new delivery driver
    resource function post drivers(@http:Payload DeliveryDriver driver) returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        // Validate input
        if driver.driver_name.trim().length() == 0 || driver.phone_number.trim().length() == 0 ||
           driver.vehicle_type.trim().length() == 0 || driver.license_number.trim().length() == 0 {
            response.statusCode = 400;
            response.setPayload({"error": "Driver name, phone number, vehicle type, and license number are required"});
            return response;
        }

        do {
            // Insert new driver
            sql:ParameterizedQuery insertQuery = `INSERT INTO delivery_drivers
                (driver_name, phone_number, email, vehicle_type, license_number, 
                 current_location_lat, current_location_lng, is_available)
                VALUES (${driver.driver_name}, ${driver.phone_number}, ${driver.email},
                        ${driver.vehicle_type}, ${driver.license_number}, 
                        ${driver.current_location_lat ?: ()}, ${driver.current_location_lng ?: ()}, 
                        ${driver.is_available ?: true})`;
            sql:ExecutionResult insertResult = check dbClient->execute(insertQuery);

            if insertResult.affectedRowCount == 1 {
                // Get the inserted record
                stream<record {int id;}, sql:Error?> idStream = dbClient->query(`SELECT LAST_INSERT_ID() as id`);
                record {|record {int id;} value;|}? idRecord = check idStream.next();

                if idRecord is record {|record {int id;} value;|} {
                    response.statusCode = 201;
                    response.setPayload({
                        "message": "Driver registered successfully",
                        "driverId": idRecord.value.id,
                        "driver": driver
                    });
                    io:println("Driver registered successfully: ", driver.driver_name);
                } else {
                    response.statusCode = 500;
                    response.setPayload({"error": "Failed to retrieve driver ID"});
                }
            } else {
                response.statusCode = 500;
                response.setPayload({"error": "Failed to register driver"});
            }
        } on fail var e {
            io:println("Database error during driver registration: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to register driver"});
        }

        return response;
    }

    # Get all drivers
    resource function get drivers() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            stream<DeliveryDriverResponse, sql:Error?> driverStream = dbClient->query(
                `SELECT id, driver_name, phone_number, email, vehicle_type, license_number,
                        current_location_lat, current_location_lng, is_available, rating, 
                        total_deliveries, created_at, updated_at
                 FROM delivery_drivers ORDER BY id DESC`
            );
            DeliveryDriverResponse[] drivers = [];

            check from var driver in driverStream
                do {
                    drivers.push(driver);
                };

            response.statusCode = 200;
            response.setPayload({"drivers": drivers, "count": drivers.length()});
        } on fail var e {
            io:println("Database error during driver retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve drivers"});
        }

        return response;
    }

    # Get driver by ID
    resource function get drivers/[int driverId]() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            sql:ParameterizedQuery selectQuery = `SELECT id, driver_name, phone_number, email, vehicle_type, license_number,
                current_location_lat, current_location_lng, is_available, rating, 
                total_deliveries, created_at, updated_at
                FROM delivery_drivers WHERE id = ${driverId}`;
            stream<DeliveryDriverResponse, sql:Error?> driverStream = dbClient->query(selectQuery);
            record {|DeliveryDriverResponse value;|}? driverRecord = check driverStream.next();

            if driverRecord is record {|DeliveryDriverResponse value;|} {
                response.statusCode = 200;
                response.setPayload({"driver": driverRecord.value});
            } else {
                response.statusCode = 404;
                response.setPayload({"error": "Driver not found"});
            }
        } on fail var e {
            io:println("Database error during driver retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve driver"});
        }

        return response;
    }

    # Update driver availability status
    resource function put drivers/[int driverId]/status(@http:Payload map<boolean> status) returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        boolean? isAvailable = status["is_available"];

        if isAvailable is () {
            response.statusCode = 400;
            response.setPayload({"error": "is_available must be provided"});
            return response;
        }

        do {
            sql:ParameterizedQuery updateQuery = `UPDATE delivery_drivers SET is_available = ${isAvailable} WHERE id = ${driverId}`;
            sql:ExecutionResult updateResult = check dbClient->execute(updateQuery);

            if updateResult.affectedRowCount == 1 {
                response.statusCode = 200;
                response.setPayload({
                    "message": "Driver status updated successfully",
                    "driverId": driverId,
                    "is_available": isAvailable
                });
            } else {
                response.statusCode = 404;
                response.setPayload({"error": "Driver not found"});
            }
        } on fail var e {
            io:println("Database error during status update: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to update driver status"});
        }

        return response;
    }

    # Get driver statistics
    resource function get drivers/stats() returns http:Response|error {
        http:Response response = new;
        response.setHeader("Content-Type", "application/json");

        do {
            // Get total drivers count
            stream<record {int total;}, sql:Error?> totalStream = dbClient->query(`SELECT COUNT(*) as total FROM delivery_drivers`);
            record {|record {int total;} value;|}? totalRecord = check totalStream.next();

            // Get available drivers count
            stream<record {int available;}, sql:Error?> availableStream = dbClient->query(
                `SELECT COUNT(*) as available FROM delivery_drivers WHERE is_available = TRUE`
            );
            record {|record {int available;} value;|}? availableRecord = check availableStream.next();

            // Get drivers by vehicle type
            stream<record {string vehicle_type; int count;}, sql:Error?> vehicleStream = dbClient->query(
                `SELECT vehicle_type, COUNT(*) as count FROM delivery_drivers GROUP BY vehicle_type`
            );
            record {string vehicle_type; int count;}[] vehicleStats = [];
            check from var stat in vehicleStream
                do {
                    vehicleStats.push(stat);
                };

            response.statusCode = 200;
            response.setPayload({
                "totalDrivers": totalRecord?.value?.total ?: 0,
                "availableDrivers": availableRecord?.value?.available ?: 0,
                "vehicleTypeStats": vehicleStats
            });
        } on fail var e {
            io:println("Database error during driver stats retrieval: ", e.message());
            response.statusCode = 500;
            response.setPayload({"error": "Failed to retrieve driver statistics"});
        }

        return response;
    }
}
