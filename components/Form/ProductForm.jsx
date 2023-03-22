import React from "react";
import { colors } from "@/components/color";
import {
	Avatar,
	Box,
	Button,
	Fab,
	FormControl,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	TextField,
} from "@mui/material";
import {
	Add,
	AddAPhoto,
	AddAPhotoOutlined,
	CameraOutlined,
	CancelOutlined,
	CategoryOutlined,
	Edit,
	RotateLeftOutlined,
	Send,
} from "@mui/icons-material";
import Link from "next/link";
const ProductForm = ({
	details,
	handleChange,
	handleSubmit,
	loading,
	handleImage,
	imageLoading,
	image,
	categs,
	subCategs,
	handleEdit,
	mode,
}) => {
	return (
		<Paper elevation={5} sx={{ padding: 2, width: "60ch" }}>
			<Box display={"flex"} marginBottom={1}>
				<FormControl variant="outlined" fullWidth>
					<InputLabel id="demo-simple-select-label">
						Category *
					</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={details.category}
						name="category"
						label="Category *"
						onChange={handleChange}
					>
						{categs &&
							categs?.map((item) => (
								<MenuItem key={item} value={`${item}`}>
									{item}
								</MenuItem>
							))}
					</Select>
				</FormControl>
				<FormControl
					variant="outlined"
					fullWidth
					sx={{ marginLeft: 1 }}
				>
					<InputLabel id="demo-simple-select-label">
						Sub Category *
					</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={details.sub_category}
						name="sub_category"
						label="Sub Category *"
						onChange={handleChange}
					>
						{subCategs &&
							subCategs?.map((item) => (
								<MenuItem key={item} value={`${item}`}>
									{item}
								</MenuItem>
							))}
					</Select>
				</FormControl>
			</Box>
			<Box display={"flex"} marginBottom={1}>
				<TextField
					id="outlined-basic"
					label="Title *"
					name="title"
					value={details.title}
					variant="outlined"
					fullWidth
					onChange={handleChange}
				/>
				<TextField
					id="outlined-basic"
					label="Quantity *"
					name="quantity"
					value={details.quantity}
					onChange={handleChange}
					variant="outlined"
					type={"number"}
					fullWidth
					sx={{ marginLeft: 1 }}
				/>
			</Box>
			<Box display={"flex"} marginBottom={1}>
				<TextField
					id="outlined-basic"
					label="Price *"
					name="price"
					value={details.price}
					variant="outlined"
					fullWidth
					type={"number"}
					onChange={handleChange}
				/>
				<TextField
					id="outlined-basic"
					label="New Price *"
					name="newPrice"
					value={details.newPrice}
					onChange={handleChange}
					variant="outlined"
					fullWidth
					type={"number"}
					sx={{ marginLeft: 1 }}
				/>
			</Box>
			<Box display={"flex"} marginBottom={1}>
				<TextField
					id="outlined-basic"
					label="Color *"
					name="color"
					value={details.color}
					variant="outlined"
					fullWidth
					onChange={handleChange}
				/>
				<TextField
					id="outlined-basic"
					label="Size *"
					name="size"
					value={details.size}
					onChange={handleChange}
					variant="outlined"
					fullWidth
					type={"number"}
					sx={{ marginLeft: 1 }}
				/>
			</Box>
			<Box display={"flex"} marginBottom={1}>
				<TextField
					id="outlined-basic"
					label="Description *"
					name="desc"
					value={details.desc}
					variant="outlined"
					fullWidth
					multiline
					maxRows={5}
					onChange={handleChange}
				/>
			</Box>
			<Box
				display={"flex"}
				alignItems={"center"}
				marginBottom={1}
			>
				{mode == "update" && (
					<div>
						<label>
							{imageLoading ? (
								"Loading..."
							) : (
								<Edit
									fontSize="large"
									sx={{
										fontSize: 40,
										padding: 1,
										marginTop: 1,
										marginLeft: 1,
										background: `${colors.bg}`,
										color: "white",
										borderRadius: "100%",
									}}
								/>
							)}
							<input
								onChange={handleEdit}
								type="file"
								accept="images/*"
								hidden
								multiple
								disabled={imageLoading}
							/>
						</label>
					</div>
				)}
				<label>
					{image ? (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							{image?.map((val, i) => (
								<Avatar
									key={i}
									size={30}
									src={val.downloadURL}
									sx={{
										marginTop: 1,
										marginLeft: 1,
									}}
								/>
							))}
						</div>
					) : imageLoading ? (
						"Uploading..."
					) : (
						<AddAPhoto
							fontSize="large"
							sx={{
								fontSize: 40,
								padding: 1,
								background: `${colors.color}`,
								color: "white",
								borderRadius: "100%",
							}}
						/>
					)}
					<input
						onChange={handleImage}
						type="file"
						accept="images/*"
						hidden
						multiple
						disabled={
							details.category == "" ||
							details.sub_category == "" ||
							imageLoading
						}
					/>
				</label>
			</Box>
			<Button
				variant="contained"
				sx={{
					backgroundColor: `${colors.bg}`,
					color: "white",
				}}
				endIcon={
					loading ? <RotateLeftOutlined /> : <Send />
				}
				fullWidth
				disabled={loading}
				onClick={handleSubmit}
			>
				{mode == "update" ? "Update" : "Submit"}
			</Button>
			<div style={{ marginTop: 10, marginBottom: 10 }}>
				<Link className="link" href={`/`}>
					<Button
						aria-label="add"
						variant="contained"
						color="error"
						fullWidth
						endIcon={<CancelOutlined />}
					>
						Cancel
					</Button>
				</Link>
			</div>
			<div style={{ marginTop: 10, marginBottom: 10 }}>
				<Link className="link" href={`/category`}>
					<Button
						aria-label="add"
						variant="contained"
						color="primary"
						fullWidth
						endIcon={<CategoryOutlined />}
					>
						Add Category
					</Button>
				</Link>
			</div>
		</Paper>
	);
};

export default ProductForm;
