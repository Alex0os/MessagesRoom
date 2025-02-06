import express, { Request, Response, NextFunction } from "express"
import { readFileSync } from "fs";
import * as https from "https";

const app = express();

const BUILD_DIR = process.cwd() + "/build/";
const PUBLIC_DIR = process.cwd() + "/public/";

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
	if (req.header("Authorization")) {
		console.log("It has a token");
		console.log(req.header("Authorization"));
	}
	else {
		console.log("It doesn't have a token");
		return res.redirect(302, "/login");
	}
	return next();
}



app.get("/", authorizeUser, (req, res) => {
	res.sendFile(PUBLIC_DIR + "app/index.html");
})

app.get("/login", (req, res) => {
	res.sendFile(PUBLIC_DIR + "login/login.html");
})

app.get("/signin", (req, res) => {
	res.sendFile(PUBLIC_DIR + "signin/signin.html");
})

app.post("/submit-signup", (req, res) => {
	if (req.method !== "POST") {
		res.status(401).send("Invalid request");
		return;
	}
	console.log(req.body);
})


app.post("/submit-login", (req, res) => {
	if (req.method !== "POST") {
		res.status(401).send("Invalid request");
		return;
	}
	console.log(req.body);
})

app.use(isValidUrl);

const httpsOptions: https.ServerOptions = {
	key: readFileSync(BUILD_DIR + "server.key"),
	cert: readFileSync(BUILD_DIR + "server.cert"),
}


https.createServer(httpsOptions, app)
	.listen(8080, () => {
		console.log("HTTPs server started");
	});
