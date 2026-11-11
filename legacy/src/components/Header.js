import { useQuery } from "@apollo/client";
import { useContext } from "react";
import Nav from "./Nav";

const Header = () => {
	return (
		<div className="header">
			<Nav />
		</div>
	)
};

export default Header;
