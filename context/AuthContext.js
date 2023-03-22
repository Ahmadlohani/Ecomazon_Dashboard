import { useState, createContext, useEffect } from "react";
const AuthContext = createContext();
const AuthProvider = ({ children }) => {
	const [state, setState] = useState({
		user: null,
	});
	useEffect(() => {
		setState(
			JSON.parse(window.localStorage.getItem("admin-asad"))
		);
	}, []);
	return (
		<AuthContext.Provider
			value={{
				state,
				setState,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
export { AuthContext, AuthProvider };
