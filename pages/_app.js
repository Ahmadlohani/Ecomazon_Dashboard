import "@/styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }) {
	return (
		<>
			<AuthProvider>
				<ToastContainer
					autoClose={1000}
					pauseOnHover={false}
				/>
				<Component {...pageProps} />
			</AuthProvider>
		</>
	);
}
