import React, { useContext, useState } from "react";
import { Grid } from "@mui/material";

import { db } from "@/pages/firebase/Config";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import CategoryForm from "@/components/Form/CategoryForm";
import { AuthContext } from "@/context/AuthContext";
const AddCategory = () => {
	const [details, setDetails] = useState({
		category: "",
		sub_category: "",
	});
	const { state } = useContext(AuthContext);
	const route = useRouter();
	const [loading, setLoading] = useState(false);
	const handleSubmit = async () => {
		const confirm = window.confirm(
			"Are you sure to Submit?"
		);
		if (!confirm) {
			return;
		}
		const product = {
			category: details.category,
			sub_category: details.sub_category,
		};
		setLoading(true);
		await AddCategory(product);
		await AddSubCategory(product);
		setLoading(false);
	};
	const AddCategory = async (product) => {
		const catRef = doc(
			db,
			`Categories/${product.category}`
		);
		setDoc(catRef, {})
			.then(() => {})
			.catch((e) => {
				toast.error("Error adding Category");
				console.log(e);
				return;
			});
	};
	const AddSubCategory = async (product) => {
		const catRef = doc(
			db,
			`Categories/${product.category}/sub-categories/${product.sub_category}`
		);
		setDoc(catRef, {})
			.then(() => {
				toast.success("Added Category Successfully");
				route.push("/product/AddProducts");
			})
			.catch((e) => {
				toast.error("Error adding Product");
				console.log(e);
				return;
			});
	};
	const handleChange = async (e) => {
		const name = e.target.name;
		if (name == "category" || name == "sub_category") {
			const value = e.target.value;
			const lowered = value.toLowerCase();
			if (name == "category") {
				setDetails({
					...details,
					category: lowered,
				});
			}
			if (name == "sub_category") {
				setDetails({
					...details,
					sub_category: lowered,
				});
			}
		}
	};
	if (route.isReady && state == null) {
		route.push("/login");
	}
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: "100%",
				height: "100vh",
			}}
		>
			<Grid container>
				<Grid
					item
					xs={12}
					display={"flex"}
					justifyContent={"center"}
					alignItems={"center"}
				>
					<CategoryForm
						handleChange={handleChange}
						handleSubmit={handleSubmit}
						loading={loading}
						details={details}
					/>
				</Grid>
			</Grid>
		</div>
	);
};

export default AddCategory;
