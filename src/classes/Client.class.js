const { default: axios } = require("axios");

class Client {
	constructor(baseUrl) {
		this.baseUrl = baseUrl;
		this.headers = {}
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("token");
			if (token) {
				this.setAuth(token);
			}
		}
	}
	async call(method, url, params) {
		try {
			const { data } = await axios.request({
				method,
				url: `${this.baseUrl}${url}`,
				data: params,
				headers: this.headers,
			});
			return data;
		} catch (error) {
			throw error?.response?.data?.error || error?.message || error;
		}
	}
	async login(username, password) {
		const response = await this.call("POST", "/api/auth/login", {
			username,
			password,
		});
		if (response?.data?.token) {
			this.setAuth(response.data.token);
		}
	}
	async profile() {
		return await this.call("GET", "/api/user/profile");
	}
	setAuth(token) {
		this.headers = {
			Authorization: `Bearer ${token}`,
		}
		// to storage
		localStorage.setItem("token", token);
	}
	async getMemberFromCard() {
		return await this.call("GET", '/api/member/read-from-card');
	}
	async getPromiseDocumentList(type, startDate, endDate, vid) {
		return await this.call("GET", '/api/promise-document?type=' + type + '&startDate=' + startDate + '&endDate=' + endDate + '&vid=' + vid);
	}
	async checkQuota(citizen_id) {
		return await this.call("GET", `/api/promise-document/checkQuota/${citizen_id}`);
	}
	async getPromiseDocumentAnalysis(type, startDate, endDate, vid) {
		return await this.call("GET", `/api/promise-document/analysis?type=${type}&startDate=${startDate}&endDate=${endDate}&vid=${vid}`);
	}
	async createPromiseDocument(data) {
		return await this.call("POST", "/api/promise-document", data);
	}
	async updatePromiseDocument(data) {
		return await this.call("PUT", "/api/promise-document", data);
	}
	async getMemberList() {
		return await this.call("GET", "/api/member/list");
	}
	async getPromiseDocumentByGroupId(groupId) {
		return await this.call("GET", `/api/promise-document/group/${groupId}`);
	}
	async getPromiseDocumentListByCitizenId(citizen_id) {
		return await this.call("GET", `/api/promise-document/member/${citizen_id}`);
	}
	async cancelPromiseDocument(groupId) {
		return await this.call("POST", `/api/promise-document/cancel/${groupId}`);
	}
	async endPromiseDocument(groupId) {
		return await this.call("POST", `/api/promise-document/end/${groupId}`);
	}
	async acceptPromiseDocument(groupId) {
		return await this.call("POST", `/api/promise-document/accept/${groupId}`);
	}
	async updatePromiseDocumentCitizenCard(groupId, data) {
		return await this.call("POST", `/api/promise-document/citizen-data/${groupId}`, data);
	}
	async createIncomeExpense(data) {
		return await this.call("POST", "/api/income-expenses/create", data);
	}
	async getIncomeExpenseList(vid, startDate, endDate) {
		return await this.call("GET", "/api/income-expenses/list?vid=" + vid + "&startDate=" + startDate + "&endDate=" + endDate);
	}
	async checkManager(citizen_id) {
		return await this.call("GET", `/api/user/checkManager?citizen_id=${citizen_id}`);
	}
	async createIncomeExpenses(data) {
		return await this.call("POST", "/api/income-expenses/create", data);
	}
	async getVillageList() {
		return await this.call("GET", "/api/village");
	}
	async createVillage(data) {
		return await this.call("POST", "/api/village/create", data);
	}
	async updateVillage(data) {
		return await this.call("POST", "/api/village/update", data);
	}
	async deleteVillage(id) {
		return await this.call("POST", "/api/village/delete", { id });
	}
	async deleteIncomeExpenses(id) {
		return await this.call("POST", "/api/income-expenses/delete", { id });
	}
	async getUserList(village_code) {
		return await this.call("GET", "/api/user/list?village_code=" + village_code);
	}
	async createUser(data) {
		return await this.call("POST", "/api/user/create", data);
	}
	async checkLoanQuota(citizen_id) {
		return await this.call("GET", `/api/promise-document/loanQuota/${citizen_id}`);
	}
	async getAnalysis(village_code) {
		return await this.call("GET", "/api/analysis/dashboard?village_code=" + village_code);
	}
	async getVillage(id) {
		return await this.call("GET", "/api/village/" + id);
	}
	async getPromiseYear() {
		return await this.call("GET", "/api/promise-year");
	}
	async updatePromiseYear(year) {
		return await this.call("POST", "/api/promise-year", { year });
	}
	async loginToken(username) {
		return await this.call("POST", "/api/user/login-token", { username });
	}
}

export default Client;