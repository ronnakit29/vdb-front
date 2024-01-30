const routes = [
	{
		key: "dashboard",
		title: "หน้าหลัก",
		path: "/dashboard",
	},
	{
		key: "promise",
		title: "การทำสัญญา",
		path: "/",
		children: [
			{
				title: "เช็คโควต้า/สัญญา",
				path: "/dashboard/check-quota",
				key: "check-quota"
			},
			{
				title: "สัญญาระยะสั้น",
				path: "/dashboard?type=short",
				key: "promise-short"
			},
			{
				title: "สัญญาระยะยาว",
				path: "/dashboard?type=long",
				key: "promise-long"
			},
			{
				title: "สัญญาฉุกเฉิน/ธุรกิจ",
				path: "/dashboard?type=business",
				key: "promise-business"
			},
		]
	},
	{
		key: "promise-list",
		title: "รายการสัญญา",
		path: "/",
		children: [
			{
				title: "รายการสัญญาทั้งหมด",
				path: "/dashboard/promise-list",
				key: "promise-list-all"
			},
			
		]
	},
	{
		key: "report",
		title: "รายงาน",
		path: "/",
		children: [
			{
				title: "รายรับรายจ่าย",
				path: "/dashboard/income-expense",
				key: "report-income-expense"
			},
			{
				title: "รายชื่อสมาชิก",
				path: "/dashboard/member",
				key: "member"
			}
		]
	},
	{
		key: "super",
		title: "ผู้ดูแลระบบ",
		path: "/",
		children: [
			{
				key: "village",
				title: "รายการหมู่บ้าน",
				path: "/dashboard/village",
			},
			{
				title: "ปีสัญญา",
				path: "/dashboard/promise-year",
				key: "promise-year"
			}
		]
	}
]

export default routes;