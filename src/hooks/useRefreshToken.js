import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);

      return {
        ...prev,
        // role: response.data.Role,
        accessToken: response.data.accessToken,
        Nom: response?.data?.User.Nom,
        Prenom: response?.data?.User.Prenom,
        _id: response?.data?.User._id,
        Email: response?.data?.User.Email,
        Role: response?.data?.User.Role,
        photo: response?.data?.User.photo,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
