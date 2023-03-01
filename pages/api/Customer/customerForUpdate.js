import WebCustomers from "@/models/WebCustomer";

export default async function handler(req, res) {
	const { method } = req;
	switch (method) {
		case "GET":
			const { id } = req.query;
			try {
				const result = await WebCustomers.findOne({
					where: {
						id: id,
					},
				});
				res.json({
					success: true,
					message: "Data Found",
					data: result,
				});
			} catch (error) {
				res.json({
					success: false,
					message: "Data not Found",
					error,
				});
			}
			break;
		default:
			break;
	}
}
