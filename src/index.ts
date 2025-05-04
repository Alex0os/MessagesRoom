import express, { Request, Response, NextFunction } from "express"
import { readFileSync } from "fs";
import * as https from "https";
import { WebSocketServer } from "ws";
import cookieParser from "cookie-parser";
import { initDataBase, introduceCredentials } from "./db_handler";

const app = express();

const BUILD_DIR = process.cwd() + "/build/";
const PUBLIC_DIR = process.cwd() + "/public/";
const REACT_DIR = PUBLIC_DIR + "/app/";

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(PUBLIC_DIR));

const VALIDURLS = "^(/signin|/login|/)$";

function isValidUrl(req: Request, res: Response, next: NextFunction): void {
	// This isn't gonna be good for when I create chatrooms with the resource
	// "/chatroom/{chatroom_id}, because the matches will become complicated,
	// unless I decide to first verify that the url starts first with
	// "/chatroom" resource
	if (req.method === "GET" && !req.url.match(VALIDURLS)) {
		console.log(req.url)
		res.status(401).send("Resource doesn't exists");
		return;
	}

	return next();
}

function authorizeUser(req: Request, res: Response, next: NextFunction): void {
	if (Object.keys(req.cookies).length > 0) // Object not empty
		return next();
	else
		return res.redirect("/login");
}


app.get("/", authorizeUser, (req, res) => {
	res.sendFile(REACT_DIR + "index.html");
})

app.use(express.static(REACT_DIR));

app.route("/login")
.get((req, res) => {
	res.sendFile(PUBLIC_DIR + "login/login.html");
})
.post((req, res) => {
	console.log(req.body);
})

app.route("/signin")
.get((req, res) => {
	res.sendFile(PUBLIC_DIR + "signin/signin.html");
})
// TODO: once the scripts are no longer useful for testing
// make this URL and method accessible from agents only
.post((req, res) => {
	introduceCredentials(req.body.fullname, req.body.email, req.body.password)
	.then(() => res.status(200).send("OK\n"))
	.catch(error => {
		console.log("Error in this part of the thing");
		res.status(505).send("Something went wrong from the server, try again later")
	});
})


app.use(isValidUrl);

const httpsOptions: https.ServerOptions = {
	key: readFileSync(BUILD_DIR + "server.key"),
	cert: readFileSync(BUILD_DIR + "server.cert"),
}

const server = https.createServer(httpsOptions, app);
const wss = new WebSocketServer({ server, path: "/ws"});

wss.on("connection", function(ws, req) {
	const clientAddress = req.socket.remoteAddress;
	console.log("New client -> " + clientAddress);

	ws.on("error", () => console.log("There was an error"));

	ws.send("Hello from webserver");

	ws.on("message", function(msg) {
		console.log(new String(msg));
		// I noticed that is not necesary to parse the RawData type when
		// sending it with a string in the "send" method
		wss.clients.forEach((client) => client
							.send(`Message from ${clientAddress} -> ${msg}`));

	})

});

server.listen(8080, () => {
	console.log("HTTPs server started");
	initDataBase().then(() => console.log("initDatabase executed"));
});

export default app;
