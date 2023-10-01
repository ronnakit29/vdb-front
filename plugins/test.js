require("dotenv").config();
const fs = require('fs')
const { Reader } = require('thaismartcardreader.js')
const path = require('path')
// const { default: axios } = require('axios')
const myReader = new Reader()
const express = require('express')
const port = 44121;

function main() {
	process.on('uncaughtException', function (err) {
		console.log('ไม่สามารถอ่านบัตรได้กรุณาลองอีกครั้ง!');
	});

	myReader.on('device-activated', async (event) => {
		try {
			console.log('Device-Activated')
			console.log(event.name)
			console.log('=============================================')
		} catch (error) {
			console.log("error", error)
		}
	})

	myReader.on('error', async (err) => {
		try {

		} catch (error) {

		}
	})

	myReader.on('image-reading', (percent) => {
		if (percent === "100%") {
			console.log("Success!")
		}
	})


	myReader.on('card-inserted', async (person) => {
		try {
			const cid = await person.getCid()
			const thName = await person.getNameTH()
			const enName = await person.getNameEN()
			const dob = await person.getDoB()
			const issueDate = await person.getIssueDate()
			const expireDate = await person.getExpireDate()
			const address = await person.getAddress()
			const issuer = await person.getIssuer()
			const photo = await person.getPhoto()
			// convert to base64
			const photoBuff = Buffer.from(photo).toString('base64')
			const data = {
				cid,
				thName,
				enName,
				dob,
				issueDate,
				expireDate,
				address,
				issuer,
				photo: photoBuff
			}
			const token = getToken();
			const village_id = getVillageId();
			const webhook_url = getWebhookUrl();
			const postData = {
				vid: village_id,
				token: token,
				webhook_url: webhook_url,
			};
			console.log(postData)
			const requestOptions = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			};

			fetch(`${postData.webhook_url}/api/read-citizen-card/?vid=${postData.vid}&token=${postData.token}`, requestOptions)
				.then((response) => {
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					console.log("Data push to server successfully!")
				})
				.then((data) => {
					// Handle the response data here
				})
				.catch((error) => {
				});

			console.log("[Alert]", postData?.data?.data?.message || "No Server Response!")
		} catch (error) {
			// remove card
			console.log("error", error)
		} finally {
			myReader
		}

	})
}

main();

console.log(readJsonFile('./token.json'))


function getToken() {
	const token = readJsonFile("./token.json")
	return token.data
}

function getVillageId() {
	const data = readJsonFile("./token.json")
	return data.village_id;
}

function getWebhookUrl() {
	const data = readJsonFile("./token.json")
	return data.webhook_url;
}


function writeToken(token, village_id, webhook_url) {
	const tokenPath = path.join(__dirname, 'token.json')
	const data = { data: token, village_id: village_id, webhook_url: webhook_url }
	fs.writeFileSync(tokenPath, JSON.stringify(data))
}

function readJsonFile(filePath) {
	try {
		// Read the JSON file synchronously
		const data = fs.readFileSync(filePath, 'utf8');

		// Parse the JSON content into a JavaScript object
		const jsonData = JSON.parse(data);

		// Return the parsed JSON data
		return jsonData;
	} catch (error) {
		console.error('Error reading JSON file:', error);
		return null; // Return null in case of an error
	}
}

const app = express();
app.get('/setToken', (req, res) => {
	const token = req.query.token
	writeToken(token, req.query.village_id, req.query.webhook_url)
	res.send('ลิงค์กับตัวอ่านบัตรเรียบร้อยแล้ว...')
})
app.listen(port, () => {
	console.log(`Reader running on port ${port}`)
})
myReader.on('device-deactivated', () => { console.log('device-deactivated') })