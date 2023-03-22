import React, {
	useContext,
	useEffect,
	useState,
} from "react";
import {
	Button,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from "@mui/material";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	orderBy,
	query,
} from "firebase/firestore";
import { db, storage } from "@/pages/firebase/Config";
import { Container } from "@mui/system";
import {
	AddCircleOutline,
	DeleteOutline,
	EditOutlined,
	Logout,
} from "@mui/icons-material";
import Link from "next/link";
import { deleteObject, ref } from "firebase/storage";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";
const columns = [
	{ id: "category", label: "Category", minWidth: 100 },
	{
		id: "sub_category",
		label: "SubCategory",
		minWidth: 100,
	},
	{
		id: "title",
		label: "Title",
		minWidth: 100,
	},
	{
		id: "color",
		label: "Color",
		minWidth: 100,
	},
	{
		id: "price",
		label: "Price",
		minWidth: 100,
	},
	{
		id: "size",
		label: "Size",
		minWidth: 100,
	},
	{
		id: "action",
		label: "Action",
		minWidth: 170,
	},
];

const ViewProducts = () => {
	const route = useRouter();
	const { state, setState } = useContext(AuthContext);
	const [products, setProducts] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	useEffect(() => {
		getProducts();
	}, []);
	const getProducts = async () => {
		try {
			const q = query(
				collection(db, "Products"),
				orderBy("createdAt", "desc")
			);
			const querySnapshot = await getDocs(q);
			let item = [];
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				item.push(doc.data());
			});
			setProducts(item);
		} catch (error) {
			console.log(error);
		}
	};
	function createData(
		productId,
		category,
		sub_category,
		title,
		color,
		price,
		image,
		size
	) {
		return {
			productId,
			category,
			sub_category,
			title,
			color,
			price,
			image,
			size,
		};
	}
	const row = products?.map((item) =>
		createData(
			item.productId,
			item.category,
			item.sub_category,
			item.title,
			item.color,
			item.price,
			item.image,
			item.size
		)
	);
	const rows = row;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	const showPromiseConfirm = (id, cat, sub_cat, image) => {
		const confirm = window.confirm(
			"Are you sure to delete?"
		);
		if (!confirm) {
			return;
		}
		handleDelete(id, cat, sub_cat, image);
	};
	const handleDelete = async (id, cat, sub_cat, image) => {
		image.map((val) => {
			handleFileDelete(id, cat, sub_cat, val.filename);
		});
		await deleteDoc(doc(db, `Products/`, `${id}`))
			.then(() => {
				toast.error("Product Deleted");
				getProducts();
			})
			.catch((err) => {
				toast.error("Product Deletion Failed.Try Again!");
				console.log(err);
			});
	};
	const handleFileDelete = async (
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
	const handleLogOut = async () => {
		const confirm = window.confirm(
			"Are you sure to logout?"
		);
		if (!confirm) {
			return;
		}
		if (route.isReady) {
			window.localStorage.removeItem("admin-asad");
			setState({});
			route.push("/login");
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
			<Container>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<div style={{ marginBottom: 10 }}>
						<Link
							className="link"
							href={`/product/AddProducts`}
						>
							<Button
								aria-label="add"
								variant="contained"
								color="success"
								endIcon={<AddCircleOutline />}
							>
								Add New Product
							</Button>
						</Link>
					</div>
					<div style={{ marginBottom: 10 }}>
						<Button
							aria-label="add"
							variant="contained"
							color="error"
							endIcon={<Logout />}
							onClick={handleLogOut}
						>
							LogOut
						</Button>
					</div>
				</div>
				<Paper sx={{ width: "100%", overflow: "hidden" }}>
					<TableContainer sx={{ maxHeight: 440 }}>
						<Table stickyHeader aria-label="sticky table">
							<TableHead>
								<TableRow>
									{columns.map((column) => (
										<TableCell
											key={column.id}
											align={column.align}
											style={{
												minWidth: column.minWidth,
											}}
										>
											{column.label}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{rows
									.slice(
										page * rowsPerPage,
										page * rowsPerPage + rowsPerPage
									)
									.map((row) => {
										return (
											<TableRow
												hover
												role="checkbox"
												tabIndex={-1}
												key={row.code}
											>
												{columns.map((column) => {
													const value = row[column.id];
													const special = row["productId"];
													return (
														<TableCell
															key={column.id}
															align={column.align}
														>
															{column.id == "action" ? (
																<>
																	<IconButton
																		aria-label="delete"
																		onClick={() =>
																			showPromiseConfirm(
																				special,
																				row["category"],
																				row["sub_category"],
																				row["image"]
																			)
																		}
																		color="error"
																	>
																		<DeleteOutline />
																	</IconButton>
																	<Link
																		className="link"
																		href={`/product/EditProducts/${special}`}
																	>
																		<IconButton
																			aria-label="delete"
																			color="primary"
																		>
																			<EditOutlined />
																		</IconButton>
																	</Link>
																</>
															) : column.format &&
															  typeof value ===
																	"number" ? (
																column.format(value)
															) : (
																value
															)}
														</TableCell>
													);
												})}
											</TableRow>
										);
									})}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[10, 25, 100]}
						component="div"
						count={rows.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Paper>
			</Container>
		</div>
	);
};

export default ViewProducts;
