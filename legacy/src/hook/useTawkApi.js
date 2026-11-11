import { useContext, useEffect } from "react";
import { genHashTawkApi, isUserLoggedIn } from "../utils/functions";
import { AppContext } from "../components/context/AppContext";

const useTawkApi = () => {
  const { userInfo: { user } } = useContext(AppContext);
  useEffect(() => {
    const auth = isUserLoggedIn();
    setTimeout(() => {
      try {
        if (window.Tawk_API.isChatMaximized()) {
          window.Tawk_API.toggle();
        }
      } catch (e) {
        console.log(e)
      }
    }, 2000)
    if (!auth) {
      if (typeof window !== "undefined" && typeof window.Tawk_API !== "undefined") {
        console.log("logout")
        window.Tawk_API.logout(
          function (error) {
          }
        )
      }
    } else {
      if (typeof window !== "undefined" && typeof window.Tawk_API !== "undefined") {
        console.log("login")

        window.Tawk_API.login({
          hash: genHashTawkApi(auth.user.id),    // required
          userId: auth.user.id.toString(),            // required
          name: auth.user.name,
          email: auth.user?.email ?? "",
        }, function (error) {
        });
      }
    }
  }, [user]);
  return;
}
export default useTawkApi;