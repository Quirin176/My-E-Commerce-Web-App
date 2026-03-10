// Test database connection using mssql/msnodesqlv8 with Windows Authentication
// To run this test, change directory to nest-api/src/test and execute: `npx ts-node test-db.ts`
import { Connection, ConnectionConfiguration, Request } from "tedious";

const config: ConnectionConfiguration = {
  server: "DELL",
  authentication: {
    type: "default",
    options: {
      userName: "sa",
      password: "123456",
    }
  },
  options: {
    database: "ECommerceDB",
    instanceName: "SQLEXPRESS",
    trustServerCertificate: true,
    encrypt: false,
    // port: 1433,
  }
};
console.log("CONFIG LOADED:", config);
const connection = new Connection(config);

connection.on("connect", err => {
  if (err) {
    console.error("Connection Failed", err);
  } else {
    console.log("Connected SUCCESSFULLY using tedious!");
  }
  connection.close();
});

connection.connect();