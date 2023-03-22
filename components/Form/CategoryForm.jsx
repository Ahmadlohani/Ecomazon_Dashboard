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
	RotateLeftOutlined,
	Send,
} from "@mui/icons-material";
import Link from "next/link";
const CategoryForm = ({
	details,
	handleChange,
	handleSubmit,
	loading,
}) => {
	return (
		<Paper elevation={5} sx={{ padding: 2, width: "60ch" }}>
			<Box display={"flex"} marginBottom={1}>
				<TextField
					id="outlined-basic"
					label="Category *"
					name="category"
					value={details.category}
					variant="outlined"
					fullWidth
					onChange={handleChange}
				/>
			</Box>
			<Box display={"flex"} marginBottom={1}>
				<TextField
					id="outlined-basic"
					label="Sub Category *"
					name="sub_category"
					value={details.sub_category}
					variant="outlined"
					fullWidth
					multiline
					maxRows={5}
					onChange={handleChange}
				/>
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
				Submit
			</Button>
			<div style={{ marginTop: 10, marginBottom: 10 }}>
				<Link
					className="link"
					href={`/product/AddProducts`}
				>
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
		</Paper>
	);
};

export default CategoryForm;
