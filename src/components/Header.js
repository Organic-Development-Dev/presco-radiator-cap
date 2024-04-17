import { useQuery } from "@apollo/client";
import { useContext } from "react";
import GET_USER_INFO from "../queries/get-user-info";
import { isUserLoggedIn } from "../utils/functions";
import Nav from "./Nav";
import { AppContext } from "./context/AppContext";

const Header = () => {
	const auth = isUserLoggedIn();
	const { userInfo: { user, setUser } } = useContext(AppContext);

	if (auth?.user.id) {
		const { data, refetch } = useQuery(GET_USER_INFO, {
			variables: {
				id: auth.user.id ?? ""
			},
			onCompleted: () => {
				setUser(data.user);

			}
		})
	}

	return (
		<div className="header">
			<Nav />
		</div>
	)
};

export default Header;
