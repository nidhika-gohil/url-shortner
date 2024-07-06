import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate, useSearchParams } from "react-router-dom";
import Login from "@/components/login";
import Signup from "@/components/signup";
import { useContext, useEffect } from "react";
import { UrlContext } from "@/UrlContext";

const Auth = () => {
  const {isAuthenticated, loading} = useContext(UrlContext);
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();

  useEffect(() => {
    if(isAuthenticated && !loading)
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""} `);
  },[isAuthenticated, loading]);
  return (
    <div className="mt-25 flex flex-col items-center gap-10">
      <h1 className="font-extrabold text-5xl">
        {longLink ? "Hold on !! Let's login first" : "Login / Signup"}
      </h1>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 ">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login/>
        </TabsContent>
        <TabsContent value="signup">
          <Signup/>
        </TabsContent>
      </Tabs>
    </div>
  )
};
export default Auth;