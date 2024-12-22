import express from "express"
import { readFile } from "fs";
const app = express();

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

app.listen(8080);
