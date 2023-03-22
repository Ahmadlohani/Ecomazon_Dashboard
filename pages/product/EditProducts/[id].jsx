import React, {
	useContext,
	useEffect,
	useState,
} from "react";
import { Grid } from "@mui/material";
import ProductForm from "@/components/Form/ProductForm";
import { nanoid } from "nanoid";
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "@/pages/firebase/Config";
import { toast } from "react-toastify";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

const EditProducts = () => {
	const [details, setDetails] = useState({
		category: "",
		sub_category: "",
		color: "",
		desc: "",
		price: "",
		newPrice: "",
		productId: "",
		size: 0,
		title: "",
		quantity: "",
		image: [],
	});
	const { state } = useContext(AuthContext);
	const [categs, setCategs] = useState([]);
	const [subCategs, setSubCategs] = useState([]);
	const route = useRouter();
	const [image, setImage] = useState([]);
	const [loading, setLoading] = useState(false);
	const [imageLoading, setImageLoading] = useState(false);
	useEffect(() => {
		getCategory();
	}, []);
	useEffect(() => {
		if (
			route.isReady &&
			Object.keys(route.query).length != 0
		) {
			const { id } = route.query;
			getData(id);
		}
	}, [route.isReady]);
	const getData = async (id) => {
		try {
			const docRef = doc(db, "Products", `${id}`);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				await fillData(docSnap.data());
			} else {
				console.log("No such document!");
			}
		} catch (error) {
			console.log(error);
		}
	};
	const fillData = async (data) => {
		const {
			category,
			sub_category,
			color,
			desc,
			price,
			newPrice,
			productId,
			size,
			title,
			quantity,
			image,
		} = data;
		setDetails({
			...details,
			category,
			sub_category,
			color,
			desc,
			price,
			newPrice,
			productId,
			size,
			title,
			quantity,
		});
		setImage(image);
	};
	const getSubCategory = async (categ) => {
		try {
			const q = query(
				collection(db, `Categories/${categ}/sub-categories`)
			);
			const querySnapshot = await getDocs(q);
			let item = [];
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
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
				// doc.data() is never undefined for query doc snapshots
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
			productId: details.productId,
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
		updateDoc(prodRef, product)
			.then(() => {
				toast.success("Product Updated Successfully");
				setLoading(false);
				route.push("/");
			})
			.catch((e) => {
				toast.error("Error adding Product");
				console.log(e);
				setLoading(false);
			});
	};
	const handleEdit = async (e) => {
		const files = e.target.files;
		const totalImages = files.length;
		if (totalImages > 3) {
			toast.error("Only three Images are allowed");
			return false;
		}
		image?.map((val) => {
			handleImageDelete(
				details.productId,
				details.category,
				details.sub_category,
				val.filename
			);
		});
		await handleImage(
			e,
			details.productId,
			details.category,
			details.sub_category
		);
	};
	const handleImageDelete = async (
		id,
		cat,
		sub_cat,
		filename
	) => {
		const desertRef = ref(
			storage,
			`${cat}/${sub_cat}/${id}/${filename}`
		);
		// Delete the file
		deleteObject(desertRef)
			.then(() => {})
			.catch((error) => {
				console.log(error);
			});
	};
	const handleImage = async (e, id, cat, sub_cat) => {
		const files = e.target.files;
		setImage([]);
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
			handleImageUpload(files[i], id, cat, sub_cat);
		}
	};
	const handleImageUpload = async (
		file,
		id,
		cat,
		sub_cat
	) => {
		if (!file) {
			toast.error("There is no file");
			return;
		}
		const sotrageRef = ref(
			storage,
			`${cat}/${sub_cat}/${id}/${file.name}`
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
						handleEdit={handleEdit}
						loading={loading}
						details={details}
						handleImage={handleImage}
						imageLoading={imageLoading}
						image={image}
						categs={categs}
						subCategs={subCategs}
						mode={"update"}
					/>
				</Grid>
			</Grid>
		</div>
	);
};

export default EditProducts;
