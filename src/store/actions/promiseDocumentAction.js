import { client } from "@/classes"
import { setAnalysisReport, setMemberDocs, setPromiseDocumentList } from "../slices/promiseDocumentSlice";
import { showToast } from "./toastAction";

export function getPromiseDocumentList(type, startDate, endDate, vid) {
	return async (dispatch) => {
		try {
			const response = await client.getPromiseDocumentList(type, startDate, endDate, vid);
			dispatch(setPromiseDocumentList(response.data))
		} catch (error) {
			dispatch(showToast(error?.response?.data?.error || error?.message || 'เกิดข้อผิดพลาด'))
		}
	}
}

export function checkQuota(citizen_id, errorCallback) {
	return async (dispatch) => {
		try {
			const response = await client.checkQuota(citizen_id);
			dispatch(showToast('หมายเลขบัตรนี้สามารถค้ำได้อีก ' + response.data + ' คน', 'bg-green-500', 3000))
		} catch (error) {
			errorCallback && errorCallback()
			dispatch(showToast(error?.response?.data?.error || error?.message || error || 'เกิดข้อผิดพลาด', 'bg-red-500', 3000))
		}
	}
}

export function getPromiseDocumentAnalysis(type, startDate, endDate, vid) {
	return async (dispatch) => {
		try {
			const response = await client.getPromiseDocumentAnalysis(type, startDate, endDate, vid);
			dispatch(setAnalysisReport(response.data))
		} catch (error) {
			dispatch(showToast(error?.response?.data?.error || error?.message || 'เกิดข้อผิดพลาด'))
		}
	}
}

export function createPromiseDocument({ promiseList, promiseData }, onSuccess) {
	return async (dispatch) => {
		try {
			const responses = await client.createPromiseDocument({ promiseList, promiseData });
			dispatch(showToast('บันทึกข้อมูลสำเร็จ', 'bg-green-500', 3000))
			onSuccess && onSuccess(responses)
		} catch (error) {
			dispatch(showToast(error?.response?.data?.error || error?.message || 'เกิดข้อผิดพลาด'))
		}
	}
}

export function updatePromiseDocument(groupId, { witness1_citizen_id, witness2_citizen_id, manager_citizen_id, employee_citizen_id }) {
	return async (dispatch) => {
		try {
			await client.updatePromiseDocumentCitizenCard(groupId, {
				witness1_citizen_id,
				witness2_citizen_id,
				manager_citizen_id,
				employee_citizen_id
			});
			dispatch(showToast('บันทึกข้อมูลสำเร็จ', 'bg-green-500', 3000))
			dispatch(getPromiseDocumentByGroupId(groupId))
		} catch (error) {
			console.log(error)
			dispatch(showToast(error?.response?.data?.error || error?.message || error || 'เกิดข้อผิดพลาด', 'bg-red-500', 3000))
		}
	}
}

export function getPromiseDocumentByGroupId(groupId) {
	return async (dispatch) => {
		try {
			const response = await client.getPromiseDocumentByGroupId(groupId);
			dispatch(setMemberDocs(response.data))
		} catch (error) {
			dispatch(showToast(error?.response?.data?.error || error?.message || error || 'เกิดข้อผิดพลาด'))
		}
	}
}

export function endPromiseDocument(groupId) {
	return async (dispatch) => {
		try {
			await client.endPromiseDocument(groupId);
			dispatch(showToast('บันทึกข้อมูลสำเร็จ', 'bg-green-500', 3000))
			dispatch(getPromiseDocumentByGroupId(groupId))
		} catch (error) {
			dispatch(showToast(error?.response?.data?.error || error?.message || error || 'เกิดข้อผิดพลาด', 'bg-red-500', 3000))
		}
	}
}

export function cancelPromiseDocument(groupId) {
	return async (dispatch) => {
		try {
			await client.cancelPromiseDocument(groupId);
			dispatch(showToast('บันทึกข้อมูลสำเร็จ', 'bg-green-500', 3000))
			dispatch(getPromiseDocumentByGroupId(groupId))
		} catch (error) {
			dispatch(showToast(error?.response?.data?.error || error?.message || error || 'เกิดข้อผิดพลาด', 'bg-red-500', 3000))
		}
	}
}

export function acceptPromiseDocument(groupId) {
	return async (dispatch) => {
		try {
			await client.acceptPromiseDocument(groupId);
			dispatch(showToast('บันทึกข้อมูลสำเร็จ', 'bg-green-500', 3000))
			dispatch(getPromiseDocumentByGroupId(groupId))
		} catch (error) {
			dispatch(showToast(error?.response?.data?.error || error?.message || error || 'เกิดข้อผิดพลาด', 'bg-red-500', 3000))
		}
	}
}

