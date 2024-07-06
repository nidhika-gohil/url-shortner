import { UrlContext } from "@/UrlContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RequireAuth = ({children}) => {
    const navigate = useNavigate();
    const {isAuthenticated, loading} = useContext(UrlContext);
    useEffect(() =>{
        if(!isAuthenticated && loading === false)
            navigate("/auth");
    }, [isAuthenticated, loading])
    if(loading) return <BarLoader width={"100%"} color="#36d7b7"></BarLoader>
    return children;
};

export default RequireAuth;