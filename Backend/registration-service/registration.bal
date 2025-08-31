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
        string name = check payload.name.ensureType(string);
        string email = check payload.email.ensureType(string);
        string contact_no = check payload.contact_no.ensureType(string);
        string contact_name = check payload.contact_name.ensureType(string);

        string address_street = "";
        if payload.address_street is json {
            address_street = payload.address_street.toString();
        }

        string username = check payload.username.ensureType(string);
        string password = check payload.password.ensureType(string);

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
        string first_name = check payload.first_name.ensureType(string);
        string last_name = check payload.last_name.ensureType(string);
        string vehicle_type = check payload.vehicle_type.ensureType(string);
        string vehicle_number = check payload.vehicle_number.ensureType(string);

        int age = check int:fromString(check payload.age.ensureType(string));

        string phone_number = check payload.phone_number.ensureType(string);
        string email = check payload.email.ensureType(string);
        string NIC = check payload.NIC.ensureType(string);

        string address_street = "";
        if payload.address_street is json {
            address_street = payload.address_street.toString();
        }

        string username = check payload.username.ensureType(string);
        string password = check payload.password.ensureType(string);

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
        string restaurant_id = check payload.restaurant_id.ensureType(string);
        string google_location = check payload.google_location.ensureType(string);
        string address = check payload.address.ensureType(string);
        string username = check payload.username.ensureType(string);
        string password = check payload.password.ensureType(string);
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
