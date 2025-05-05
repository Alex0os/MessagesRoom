import pgPromise from "pg-promise"
const pgp = pgPromise();
import { genSalt, hash} from "bcrypt";

const db = pgp({
	host: "localhost",
	port: 5432,
	database: "MessageRoom", // pending
	password: undefined,
	max: 30
});

export async function initDataBase() {
	let query1 = `SELECT EXISTS (
		SELECT FROM information_schema.tables 
		WHERE  table_schema = 'public'
		AND    table_name   = $1
	);`

	let credentials = await db.one(query1, ['credentials']);
	let users = await db.one(query1, ['users']);

	if (!users.exists) {
		let usersTableQuery = 
			`CREATE TABLE users (
				id SERIAL PRIMARY KEY,
				user_name VARCHAR(30),
				user_creation_date TIMESTAMP,
				age SMALLINT
		);`;

		try {
			await db.none(usersTableQuery);
		} catch (e) {
			console.error(e);
		}
	}
	if (!credentials.exists) {
		let credentialsTableQuery = 
			`CREATE TABLE credentials (
				id SERIAL PRIMARY KEY,
				email VARCHAR(255),
				password CHAR(60),
				salt CHAR(16),
				user_id INTEGER REFERENCES users(id)
		);`;

		try {
			await db.none(credentialsTableQuery);
		} catch (e) {
			console.error(e);
		}
	}
};

export async function introduceCredentials(userName: string, email: string, password: string) {
	try {
		let salt = await genSalt(10)
		let hashedPass = await hash(password, salt)

		let check_user = await db.any("SELECT 1 FROM users WHERE user_name = $1", [userName]) 

		if (check_user.length > 0) {
			throw new Error("CREDENTIAL_CONFLICT");
		}

		let userID = await db.one(`INSERT INTO users (user_name) VALUES ($1) RETURNING id`, [userName]);

		await db.none(`INSERT INTO credentials (email, password, salt, user_id)
					  VALUES ($1, $2, $3, $4)`, [email, hashedPass, salt, userID.id])
	} catch (error) {
		throw new Error("INTERNAL_SERVER_ERROR");
	}
}
