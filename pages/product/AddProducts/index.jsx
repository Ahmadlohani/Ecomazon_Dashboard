import React, {
	useContext,
	useEffect,
	useState,
} from "react";
import { Grid } from "@mui/material";
import ProductForm from "@/components/Form/ProductForm";
import { nanoid } from "nanoid";
import {
	getDownloadURL,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "@/pages/firebase/Config";
import { toast } from "react-toastify";
import {
	collection,
	doc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

const AddProducts = () => {
	const [details, setDetails] = useState({
		category: "",
		sub_category: "",
		color: "",
		desc: "",
		price: "",
		newPrice: "",
		size: 0,
		title: "",
		quantity: "",
		image: [],
	});
	const { state } = useContext(AuthContext);
	const [productId, setProductId] = useState("");
	const [categs, setCategs] = useState([]);
	const [subCategs, setSubCategs] = useState([]);
	const route = useRouter();
	const [image, setImage] = useState([]);
	const [loading, setLoading] = useState(false);
	const [imageLoading, setImageLoading] = useState(false);
	useEffect(() => {
		getCategory();
	}, []);
	const getSubCategory = async (categ) => {
		try {
			const q = query(
				collection(db, `Categories/${categ}/sub-categories`)
			);
			const querySnapshot = await getDocs(q);
			let item = [];
			querySnapshot.forEach((doc) => {
				item.push(doc.id);
			});
			setSubCategs(item);
		} catch (error) {
			console.log(error);
		}
	};
	const getCategory = async () => {
		try {
			const q = query(collection(db, "Categories"));
			const querySnapshot = await getDocs(q);
			let item = [];
			querySnapshot.forEach((doc) => {
				item.push(doc.id);
			});
			setCategs(item);
		} catch (error) {
			console.log(error);
		}
	};
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
			color: details.color,
			desc: details.desc,
			image: image,
			newPrice: details.newPrice,
			price: details.price,
			productId,
			size: details.size,
			title: details.title,
			quantity: details.quantity,
			createdAt: serverTimestamp(),
		};
		setLoading(true);
		const prodRef = doc(
			db,
			"Products",
			`${product.productId}`
		);
		setDoc(prodRef, product)
			.then(() => {
				toast.success("Product Added Successfully");
				setLoading(false);
				route.push("/");
			})
			.catch((e) => {
				toast.error("Error adding Product");
				console.log(e);
				setLoading(false);
			});
	};
	const handleImage = async (e) => {
		const files = e.target.files;
		if (files.length > 3) {
			toast.error("Only three images allowed");
			return false;
		}
		const prodId = nanoid(5);
		setProductId(prodId);
		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append("document", files[i]);
			const filedata = [...formData];
			const filename = filedata[i][1].name;
			const filesize = filedata[i][1].size;
			const extension = filename.split(".").pop();
			if (
				extension != "png" &&
				extension != "PNG" &&
				extension != "jpg" &&
				extension != "JPG" &&
				extension != "jpeg" &&
				extension != "JPEG" &&
				extension != "tiff" &&
				extension != "TIFF"
			) {
				toast.error(
					"Only PNG, JPG, JPEG and TIFF are allowed. Try to re-upload"
				);
				return;
			}
			if (filesize > 2000000) {
				toast.error("Image should be less than 2MB");
				return;
			}
			handleImageUpload(files[i], prodId);
		}
	};
	const handleImageUpload = async (file, prodId) => {
		if (!file) {
			toast.error("There is no file");
			return;
		}
		const sotrageRef = ref(
			storage,
			`${details.category}/${details.sub_category}/${prodId}/${file.name}`
		);
		const uploadTask = uploadBytesResumable(
			sotrageRef,
			file
		);
		setImageLoading(true);
		uploadTask.on("state_changed", () => {
			getDownloadURL(uploadTask.snapshot.ref)
				.then((downloadURL) => {
					const filename = file.name;
					setImage((image) => [
						...image,
						{ downloadURL, filename },
					]);
					setImageLoading(false);
				})
				.catch((error) => {
					console.log(error);
					setImageLoading(false);
				});
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
				getSubCategory(lowered);
			}
			if (name == "sub_category") {
				setDetails({
					...details,
					sub_category: lowered,
				});
			}
		} else {
			setDetails({
				...details,
				[e.target.name]: e.target.value,
			});
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
					<ProductForm
						handleChange={handleChange}
						handleSubmit={handleSubmit}
						loading={loading}
						details={details}
						handleImage={handleImage}
						imageLoading={imageLoading}
						image={image}
						categs={categs}
						subCategs={subCategs}
					/>
				</Grid>
			</Grid>
		</div>
	);
};

export default AddProducts;
