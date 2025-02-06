import express, { Request, Response, NextFunction } from "express"
import { resolve } from "path";
import { readFileSync } from "fs";
import * as https from "https";

const app = express();

const BUILD_DIR = "/home/Matixannder/Desktop/Projects/MessageRoom/build";

// Let's make a callback to authenticate with JWT

// TODO: Send form to make the user authenticate themselves and then be able to
// access the website

const VALIDURLS = "^(/signin|/login|/)$";


function isValidUrl(req: Request, res: Response, next: NextFunction): void {
	// This isn't gonna be good for when I create chatrooms with the resource
	// "/chatroom/{chatroom_id}, because the matches will become complicated,
	// unless I decide to first verify that the url starts first with
	// "/chatroom" resource
	if (req.method === "GET" && !req.url.match(VALIDURLS)) {
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
		res.redirect(302, "/login")
	}
	return next();
}


app.use(express.json());

app.use("/", express.static(resolve(__dirname, "..") + "/public/app", ));
app.use("/login", express.static(resolve(__dirname, "..") + "/public/login", {index: "login.html"}));
app.use("/signin", express.static(resolve(__dirname, "..") + "/public/signin", {index: "signin.html"}));


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


const httpsOptions: https.ServerOptions = {
	key: readFileSync(BUILD_DIR + "/server.key"),
	cert: readFileSync(BUILD_DIR + "/server.cert"),
}


https.createServer(httpsOptions, app)
	.listen(8080, () => {
		console.log("Server set in");
	});
