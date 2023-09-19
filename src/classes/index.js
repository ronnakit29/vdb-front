const { default: Client } = require("./Client.class");

const client = new Client(process.env.NEXT_PUBLIC_SERVER_URL);

export {
	client,
}