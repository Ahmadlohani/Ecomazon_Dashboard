// db.js
import { Sequelize } from "sequelize";
const database = new Sequelize(
	process.env.MSSQL_DATABASE,
	process.env.MSSQL_USER,
	process.env.MSSQL_PASSWORD,
	{
		host: "localhost",
		dialect: "mssql",
	}
);
async function connectDB() {
	try {
		await database.authenticate();
		console.log("DB Connected successfully!");
	} catch (error) {
		console.error(
			"Unable to connect to the database:",
			error
		);
	}
}
connectDB();
export default database;