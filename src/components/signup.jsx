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
import { signup } from "@/db/apiAuth";
import useFetch from "@/hooks/useFetch";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlContext } from "@/UrlContext";

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name:"",
    email: "",
    password: "",
    profile_pic: null
  });
  
  const {fetchUser} = useContext(UrlContext);

  const handleInputChange = (e) => {
    const {name, value, files} = e.target;
    setFormData((prev) =>({
      ...prev,
      [name]: files ? files[0] : value
    }))
  };

  const {data, loading, error, fn:fnSignup} = useFetch(signup, formData);

  const handleSignup = async() => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Email is required."),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required."),
        password: Yup.string()
          .min(6, "Password must be 6 characters.")
          .required("Password is required"),
        profile_pic: Yup.mixed().required("Profile picture is required")
      });
      await schema.validate(formData, {abortEarly: false});
      await fnSignup();
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
          <CardTitle>Signup</CardTitle>
          <CardDescription>Create a new account if you havent already</CardDescription>
          {error ? <Error message={error.message}/> : ""}
        </CardHeader>
        <CardContent className="space-y-2">
        <div className="space-y-1">
            <Input name="name" type="text" placeholder="Enter Name" onChange={handleInputChange}/>
            {errors.name ? <Error message={errors.name}/>: ""}
          </div>
          <div className="space-y-1">
            <Input name="email" type="email" placeholder="Enter Email" onChange={handleInputChange}/>
            {errors.email ? <Error message={errors.email}/>: ""}
          </div>
          <div className="space-y-1">
            <Input name="password" type="password" placeholder="Enter Password" onChange={handleInputChange}/>
            {errors.password ? <Error message={errors.password}/>: ""}
          </div>
          <div className="space-y-1">
            <Input name="profile_pic" type="file" accept="image/*" onChange={handleInputChange}/>
            {errors.profile_pic ? <Error message={errors.profile_pic}/>: ""}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSignup}>
            {loading ? <BeatLoader size={10} color="#36d7b7"></BeatLoader> : "Create Account"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
};

export default Signup;