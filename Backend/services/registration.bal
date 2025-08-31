import ballerina/http;
import ballerina/sql;
import ballerinax/mysql;
import ballerina/lang.'int as int;

// Import the DB client directly
configurable string dbHost = "localhost";
configurable string dbUser = "root";
configurable string dbPassword = "2002";
configurable int dbPort = 3306;
configurable string dbName = "foodsaver_db";

// Create a new MySQL client for this service
mysql:Client dbClient = check new (dbHost, dbUser, dbPassword, dbName, dbPort);

listener http:Listener regListener = new(8081);

service /register on regListener {

    resource function post ngo(http:Request req) returns http:Response|error {
        json|error payloadResult = req.getJsonPayload();
        if payloadResult is error {
            return error("Invalid JSON payload");
        }
        json payload = payloadResult;

        // Extract and validate required fields
        json|error nameJson = payload.name;
        if nameJson is error {
            return error("Missing name field");
        }
        string name = nameJson.toString();

        json|error emailJson = payload.email;
        if emailJson is error {
            return error("Missing email field");
        }
        string email = emailJson.toString();

        json|error contactNoJson = payload.contact_no;
        if contactNoJson is error {
            return error("Missing contact_no field");
        }
        string contact_no = contactNoJson.toString();

        json|error contactNameJson = payload.contact_name;
        if contactNameJson is error {
            return error("Missing contact_name field");
        }
        string contact_name = contactNameJson.toString();

        string address_street = "";
        json|error addressStreetJson = payload.address_street;
        if addressStreetJson is json {
            address_street = addressStreetJson.toString();
        }

        json|error usernameJson = payload.username;
        if usernameJson is error {
            return error("Missing username field");
        }
        string username = usernameJson.toString();

        json|error passwordJson = payload.password;
        if passwordJson is error {
            return error("Missing password field");
        }
        string password = passwordJson.toString();

        // start a transaction
        sql:ExecutionResult|sql:Error startTxn = dbClient->execute(`START TRANSACTION`);
        if startTxn is sql:Error {
            return error("Failed to start transaction: " + startTxn.message());
        }

        // insert user with user_type 'ngo'
        sql:ExecutionResult|sql:Error userResult = dbClient->execute(`INSERT INTO users (username, password, user_type) VALUES (${username}, ${password}, 'ngo')`);
        if userResult is sql:Error {
            sql:ExecutionResult|sql:Error rollbackResult = dbClient->execute(`ROLLBACK`);
            return error("Failed to insert user: " + userResult.message());
        }

        // get last insert id
        stream<record{}, sql:Error?>|sql:Error queryResult = dbClient->query(`SELECT LAST_INSERT_ID() AS id`);
        if queryResult is sql:Error {
            sql:ExecutionResult|sql:Error rollbackResult = dbClient->execute(`ROLLBACK`);
            return error("Failed to get user ID: " + queryResult.message());
        }

        int userId = 0;
        record{}|sql:Error? row = queryResult.next();
        if row is record{} {
            anydata idValue = row["id"];
            if idValue is int {
                userId = idValue;
            }
        }

        // Close the stream
        sql:Error? closeResult = queryResult.close();
        if closeResult is sql:Error {
            // Log the error but don't fail the operation
        }

        if userId == 0 {
            sql:ExecutionResult|sql:Error rollbackResult = dbClient->execute(`ROLLBACK`);
            return error("Failed to retrieve user ID");
        }

        // insert ngo
        sql:ExecutionResult|sql:Error ngoResult = dbClient->execute(`INSERT INTO ngo (name, email, contact_no, contact_name, address_street, user_id) VALUES (${name}, ${email}, ${contact_no}, ${contact_name}, ${address_street}, ${userId})`);
        if ngoResult is sql:Error {
            sql:ExecutionResult|sql:Error rollbackResult = dbClient->execute(`ROLLBACK`);
            return error("Failed to insert NGO: " + ngoResult.message());
        }

        sql:ExecutionResult|sql:Error commitResult = dbClient->execute(`COMMIT`);
        if commitResult is sql:Error {
            return error("Failed to commit transaction: " + commitResult.message());
        }

        http:Response resp = new;
        resp.statusCode = 201;
        resp.setJsonPayload({ message: "NGO registered", user_id: userId });
        return resp;
    }

    resource function post driver(http:Request req) returns http:Response|error {
        json|error payloadResult = req.getJsonPayload();
        if payloadResult is error {
            return error("Invalid JSON payload");
        }
        json payload = payloadResult;

        // Extract and validate required fields
        json|error firstNameJson = payload.first_name;
        if firstNameJson is error {
            return error("Missing first_name field");
        }
        string first_name = firstNameJson.toString();

        json|error lastNameJson = payload.last_name;
        if lastNameJson is error {
            return error("Missing last_name field");
        }
        string last_name = lastNameJson.toString();

        json|error vehicleTypeJson = payload.vehicle_type;
        if vehicleTypeJson is error {
            return error("Missing vehicle_type field");
        }
        string vehicle_type = vehicleTypeJson.toString();

        json|error vehicleNumberJson = payload.vehicle_number;
        if vehicleNumberJson is error {
            return error("Missing vehicle_number field");
        }
        string vehicle_number = vehicleNumberJson.toString();

        json|error ageJson = payload.age;
        if ageJson is error {
            return error("Missing age field");
        }
        int|error ageInt = int:fromString(ageJson.toString());
        if ageInt is error {
            return error("Invalid age format");
        }
        int age = ageInt;

        json|error phoneNumberJson = payload.phone_number;
        if phoneNumberJson is error {
            return error("Missing phone_number field");
        }
        string phone_number = phoneNumberJson.toString();

        json|error emailJson = payload.email;
        if emailJson is error {
            return error("Missing email field");
        }
        string email = emailJson.toString();

        json|error nicJson = payload.NIC;
        if nicJson is error {
            return error("Missing NIC field");
        }
        string NIC = nicJson.toString();

        string address_street = "";
        json|error addressStreetJson = payload.address_street;
        if addressStreetJson is json {
            address_street = addressStreetJson.toString();
        }

        json|error usernameJson = payload.username;
        if usernameJson is error {
            return error("Missing username field");
        }
        string username = usernameJson.toString();

        json|error passwordJson = payload.password;
        if passwordJson is error {
            return error("Missing password field");
        }
        string password = passwordJson.toString();

        sql:ExecutionResult|sql:Error startTxn = dbClient->execute(`START TRANSACTION`);
        if startTxn is sql:Error {
            return error("Failed to start transaction: " + startTxn.message());
        }

        sql:ExecutionResult|sql:Error userResult = dbClient->execute(`INSERT INTO users (username, password, user_type) VALUES (${username}, ${password}, 'driver')`);
        if userResult is sql:Error {
            sql:ExecutionResult|sql:Error rollbackResult = dbClient->execute(`ROLLBACK`);
            return error("Failed to insert user: " + userResult.message());
        }

        stream<record{}, sql:Error?>|sql:Error queryResult = dbClient->query(`SELECT LAST_INSERT_ID() AS id`);
        if queryResult is sql:Error {
            sql:ExecutionResult|sql:Error rollbackResult = dbClient->execute(`ROLLBACK`);
            return error("Failed to get user ID: " + queryResult.message());
        }

        int userId = 0;
        record{}|sql:Error? row = queryResult.next();
        if row is record{} {
            anydata idValue = row["id"];
            if idValue is int {
                userId = idValue;
            }
        }

        // Close the stream
        sql:Error? closeResult = queryResult.close();
        if closeResult is sql:Error {
            // Log the error but don't fail the operation
        }

        if userId == 0 {
            sql:ExecutionResult|sql:Error rollbackResult = dbClient->execute(`ROLLBACK`);
            return error("Failed to retrieve user ID");
        }

        sql:ExecutionResult|sql:Error driverResult = dbClient->execute(`INSERT INTO driver (first_name, last_name, vehicle_type, vehicle_number, age, phone_number, email, NIC, address_street, user_id) VALUES (${first_name}, ${last_name}, ${vehicle_type}, ${vehicle_number}, ${age}, ${phone_number}, ${email}, ${NIC}, ${address_street}, ${userId})`);
        if driverResult is sql:Error {
            sql:ExecutionResult|sql:Error rollbackResult = dbClient->execute(`ROLLBACK`);
            return error("Failed to insert driver: " + driverResult.message());
        }

        sql:ExecutionResult|sql:Error commitResult = dbClient->execute(`COMMIT`);
        if commitResult is sql:Error {
            return error("Failed to commit transaction: " + commitResult.message());
        }

        http:Response resp = new;
        resp.statusCode = 201;
        resp.setJsonPayload({ message: "Driver registered", user_id: userId });
        return resp;
    }

    resource function post donor(http:Request req) returns http:Response|error {
        json|error payloadResult = req.getJsonPayload();
        if payloadResult is error {
            return error("Invalid JSON payload");
        }
        json payload = payloadResult;

        // Extract and validate required fields
        json|error restaurantIdJson = payload.restaurant_id;
        if restaurantIdJson is error {
            return error("Missing restaurant_id field");
        }
        string restaurant_id = restaurantIdJson.toString();

        json|error googleLocationJson = payload.google_location;
        if googleLocationJson is error {
            return error("Missing google_location field");
        }
        string google_location = googleLocationJson.toString();

        json|error addressJson = payload.address;
        if addressJson is error {
            return error("Missing address field");
        }
        string address = addressJson.toString();

        json|error usernameJson = payload.username;
        if usernameJson is error {
            return error("Missing username field");
        }
        string username = usernameJson.toString();

        json|error passwordJson = payload.password;
        if passwordJson is error {
            return error("Missing password field");
        }
        string password = passwordJson.toString();

        sql:ExecutionResult|sql:Error startTxn = dbClient->execute(`START TRANSACTION`);
        if startTxn is sql:Error {
            return error("Failed to start transaction: " + startTxn.message());
        }

        sql:ExecutionResult|sql:Error userResult = dbClient->execute(`INSERT INTO users (username, password, user_type) VALUES (${username}, ${password}, 'donor')`);
        if userResult is sql:Error {
            sql:ExecutionResult|sql:Error rollbackResult = dbClient->execute(`ROLLBACK`);
            return error("Failed to insert user: " + userResult.message());
        }

        stream<record{}, sql:Error?>|sql:Error queryResult = dbClient->query(`SELECT LAST_INSERT_ID() AS id`);
        if queryResult is sql:Error {
            sql:ExecutionResult|sql:Error rollbackResult = dbClient->execute(`ROLLBACK`);
            return error("Failed to get user ID: " + queryResult.message());
        }

        int userId = 0;
        record{}|sql:Error? row = queryResult.next();
        if row is record{} {
            anydata idValue = row["id"];
            if idValue is int {
                userId = idValue;
            }
        }

        // Close the stream
        sql:Error? closeResult = queryResult.close();
        if closeResult is sql:Error {
            // Log the error but don't fail the operation
        }

        if userId == 0 {
            sql:ExecutionResult|sql:Error rollbackResult = dbClient->execute(`ROLLBACK`);
            return error("Failed to retrieve user ID");
        }

        sql:ExecutionResult|sql:Error donorResult = dbClient->execute(`INSERT INTO donor (restaurant_id, google_location, address, user_id) VALUES (${restaurant_id}, ${google_location}, ${address}, ${userId})`);
        if donorResult is sql:Error {
            sql:ExecutionResult|sql:Error rollbackResult = dbClient->execute(`ROLLBACK`);
            return error("Failed to insert donor: " + donorResult.message());
        }

        sql:ExecutionResult|sql:Error commitResult = dbClient->execute(`COMMIT`);
        if commitResult is sql:Error {
            return error("Failed to commit transaction: " + commitResult.message());
        }

        http:Response resp = new;
        resp.statusCode = 201;
        resp.setJsonPayload({ message: "Donor registered", user_id: userId });
        return resp;
    }
}
