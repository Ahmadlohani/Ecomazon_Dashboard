import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { Grid } from "@mui/material";
import AuthForm from "@/components/Form/AuthForm";
import { toast } from "react-toastify";
import { AuthContext } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/Config";

const Login = () => {
	const route = useRouter();
	const [detail, setDetail] = useState({
		id: "",
		psw: "",
	});
	const { state, setState } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const handleChange = async (e) => {
		setDetail({
			...detail,
			[e.target.name]: e.target.value,
		});
	};
	const handleSubmit = async () => {
		const confirm = window.confirm(
			"Are you sure to Submit?"
		);
		if (!confirm) {
			return;
		}
		const docRef = doc(db, "admin", "admin-auth");
		getDoc(docRef)
			.then((docSnap) => {
				setLoading(true);
				if (docSnap.exists()) {
					const data = docSnap.data();
					if (
						data.id == detail.id &&
						data.password == detail.psw
					) {
						const user = {
							name: "Asadullah",
							login: true,
						};
						setState({
							user,
						});
						window.localStorage.setItem(
							"admin-asad",
							JSON.stringify(user)
						);
						setLoading(false);
						route.push("/");
					} else {
						setLoading(false);
						toast.error("Wrong Credentials.Try Again!");
					}
				} else {
					toast.error("Document Not Found");
					setLoading(false);
				}
			})
			.catch((error) => {
				toast.error("Exception Occured");
				setLoading(false);
				console.log(error);
			});
	};
	if (route.isReady && state && state.login) {
		route.push("/");
	}
	return (
		<div
			style={{
				width: "100%",
				height: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
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
					<AuthForm
						loading={loading}
						handleSubmit={handleSubmit}
						detail={detail}
						handleChange={handleChange}
					/>
				</Grid>
			</Grid>
		</div>
	);
};

export default Login;
