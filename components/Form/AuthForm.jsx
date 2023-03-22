import React from "react";
import {
	Button,
	Box,
	TextField,
	styled,
	Paper,
} from "@mui/material";
import {
	RotateLeftOutlined,
	Send,
} from "@mui/icons-material";

const AuthForm = ({
	loading,
	handleChange,
	handleSubmit,
	detail,
}) => {
	const SubmitButton = styled(Button)(({ theme }) => ({
		marginTop: 10,
		marginBottom: 10,
		width: "40ch",
		borderRadius: 20,
	}));
	return (
		<Paper
			elevation={5}
			sx={{
				padding: 1,
				width: "60ch",
				marginLeft: 1,
				marginRight: 1,
				display: "flex",
				justifyContent: "center",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<div style={{ textAlign: "center", color: "orange" }}>
				{" "}
				<h1>Admin Login</h1>{" "}
			</div>
			<Box component="form">
				<div
					style={{
						paddingTop: 10,
						paddingBottom: 10,
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<div>
						<TextField
							variant="filled"
							sx={{ width: "40ch", marginBottom: 2 }}
							color="success"
							label="ID *"
							name="id"
							value={detail.id}
							onChange={handleChange}
						/>
					</div>
					<div>
						<TextField
							variant="filled"
							sx={{ width: "40ch", marginBottom: 2 }}
							color="success"
							label="Password *"
							name="psw"
							value={detail.psw}
							onChange={handleChange}
						/>
					</div>

					<div>
						<SubmitButton
							variant="outlined"
							color="warning"
							endIcon={
								loading ? <RotateLeftOutlined /> : <Send />
							}
							onClick={handleSubmit}
							disabled={
								detail.id == "" ||
								detail.psw == "" ||
								loading
							}
						>
							Submit
						</SubmitButton>
					</div>
				</div>
			</Box>
		</Paper>
	);
};

export default AuthForm;
