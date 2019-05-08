module.exports = {
	provider: "SFTP",
	name: "SFTP",
	auth: {
		host: {
			label: "Host",
			type: "text",
		},
		port: {
			label: "Port",
			type: "text",
		},
		user: {
			label: "User",
			type: "text",
		},
		password: {
			label: "Password",
			type: "password",
		},
		baseUrl: {
			label: "Base URL",
			type: "text",
		},
	},
	init: (config) => {
		const { host, port, user, password, baseUrl } = config;

		return {
			upload(file) {
				return new Promise((resolve, reject) => { });
			},
			delete(file) {
				return new Promise((resolve, reject) => { });
			},
		};
	},
};
