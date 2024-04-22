import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
// import Loader from "../layouts/loader/Loader";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  // useEffect(() => {
  //   let isMounted = true;

  //   const verifyRefreshToken = async () => {
  //     try {
  //       await refresh();
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       isMounted && setIsLoading(false);
  //     }
  //   };

  //   // persist added here AFTER tutorial video
  //   // Avoids unwanted call to verifyRefreshToken
  //   !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

  //   return () => (isMounted = false);
  // }, []);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    // Check if there is no accessToken and persistence is enabled
    if (!auth?.accessToken && persist) {
      verifyRefreshToken();
    } else {
      // Set isLoading to false if there is no need for token refresh
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []); // Include dependencies

  // useEffect(() => {
  //   console.log(`isLoading: ${isLoading}`);
  //   console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
  // }, [isLoading]); // ! ___for_debugging_only_REMEMBER_TO_DELETE_LATER___

  return <>{!persist ? <Outlet /> : isLoading ? <>Loading...</> : <Outlet />}</>;
};

export default PersistLogin;