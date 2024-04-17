import React, { useEffect, useState } from 'react';
export const AppContext = React.createContext([
	{},
	() => { }
]);

export const AppProvider = (props) => {

	const [cart, setCart] = useState(null);
	const [user, setUser] = useState(null);

	useEffect(() => {

		// @TODO Will add option to show the cart with localStorage later.
		if (process.browser) {

			let cartData = localStorage.getItem('woo-next-cart');
			cartData = null !== cartData ? JSON.parse(cartData) : '';
			setCart(cartData);

		}

	}, []);

	return (
		<AppContext.Provider value={{ cartInfo: { cart, setCart }, userInfo: { user, setUser } }}>
			{props.children}
		</AppContext.Provider>
	);
};
