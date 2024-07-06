import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {BeatLoader} from "react-spinners"
import Error from "./error";
import { useContext, useEffect, useState } from "react";
import * as Yup from 'yup';
import { login } from "@/db/apiAuth";
import useFetch from "@/hooks/useFetch";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlContext } from "@/UrlContext";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const {data, loading, error, fn:fnLogin} = useFetch(login, formData);
  // const {fetchUser} = UrlState();
  const {fetchUser} = useContext(UrlContext);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) =>({
      ...prev,
      [name]: value
    }))
  };

  const handleLogin = async() => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required."),
        password: Yup.string()
          .min(6, "Password must be 6 characters.")
          .required("Password is required")
      });
      await schema.validate(formData, {abortEarly: false});
      await fnLogin();
      //APi call
    } catch(err) {
      const newErrors = {};
      err?.inner?.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
    }
  };

  useEffect(() => {
    if(error === null && data){
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUser();
    }
  }, [data, error])
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>to your accound if you already have one</CardDescription>
          {error ? <Error message={error.message}/> : ""}
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Input name="email" type="email" placeholder="Enter Email" onChange={handleInputChange}/>
            {errors.email ? <Error message={errors.email}/>: ""}
          </div>
          <div className="space-y-1">
            <Input name="password" type="password" placeholder="Enter Password" onChange={handleInputChange}/>
            {errors.password ? <Error message={errors.password}/>: ""}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogin}>
            {loading ? <BeatLoader size={10} color="#36d7b7"></BeatLoader> : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
};

export default Login;