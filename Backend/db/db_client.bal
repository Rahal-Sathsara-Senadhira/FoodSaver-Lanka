import ballerinax/mysql;

configurable string dbHost = "localhost";
configurable string dbUser = "root";
configurable string dbPassword = "2002";
configurable int dbPort = 3306;
configurable string dbName = "foodsaver_db";

// Global MySQL client for the package
mysql:Client dbClient = check new (dbHost, dbUser, dbPassword, dbName, dbPort);
