import express, { Request, Response, NextFunction } from "express"
import { readFile } from "fs";
const app = express();

// Let's make a callback to authenticate with JWT

// TODO: Send form to make the user authenticate themselves and then be able to
// access the website

const VALIDURLS = "^(foo|bar|/)$";


function isValidUrl(req: Request, res: Response, next: NextFunction): void {
	// This isn't gonna be good for when I create chatrooms with the resource
	// "/chatroom/{chatroom_id}, because the matches will become complicated,
	// unless I decide to first verify that the url starts first with
	// "/chatroom" resource
	if (!req.url.match(VALIDURLS)) {
		res.status(401).send("Resource doesn't exists");
		return;
	}

	next();
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
	next();
}


app.all(/^(?!\/signin$|\/login$|\/$).*/, isValidUrl, authorizeUser);


app.get("/", (req, res) => {
	new Promise<string>((resolve, reject) => {
		readFile("public/index.html", "utf8", (err, data) => {
			if (err) {
				console.log(err);
				reject("Couldn't serve the HTML");
			}
			else {
				resolve(data)
			}
		})
	}).
		then(data => res.send(data)).
		catch(err => res.send(err));
})


app.get("/login", (req, res) => {
	res.send("This is the login resource");
})


app.get("/signin", (req, res) => {
	res.send("This is the signin resource");
})

app.listen(8080);
