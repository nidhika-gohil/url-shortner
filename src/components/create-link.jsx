import { UrlContext } from '@/UrlContext'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Error from "./error";
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import * as Yup from "yup"
import { QRCode } from 'react-qrcode-logo';
import useFetch from '@/hooks/useFetch';
import { createUrl } from '@/db/apiUrls';
import { BeatLoader } from 'react-spinners';

const CreateLink = () => {
  const {user} = useContext(UrlContext);
  const ref = useRef();
  const navigate = useNavigate();
  const [searchParams, setSeachParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    originalUrl: longLink ? longLink : "",
    customUrl: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  };

  const createNewUrl = async() => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        title: Yup.string().required("Title is required."),
        originalUrl: Yup.string()
          .url("Invalid email")
          .required("Url must be valid URL."),
        customUrl: Yup.string()
      });
      await schema.validate(formData, {abortEarly: false});
      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve))
      await fnCreateUrl(blob);
    } catch(err) {
      const newErrors = {};
      err?.inner?.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
    }
  };

  const {data, loading, error, fn:fnCreateUrl} = useFetch(createUrl, {...formData,user_id: user?.id});

  useEffect(() => {
    if(error === null && data) {
      navigate(`/link/${data[0].id}`)
    }
  },[error, data]); 
  return (
    <Dialog defaultOpen={longLink} 
      onOpenChange={(result) => {
        if(!result)
           setSeachParams({})
      }}
    >
      <DialogTrigger>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
        </DialogHeader>
        {formData?.originalUrl && <QRCode value={formData?.originalUrl} size={200} ref={ref}/>}
        <Input id="title" placeholder="Short Link's Title"
          value={formData.title}
          onChange={handleInputChange}
        />
        {errors.title && <Error message={errors.title}/> }
        <Input id="originalUrl" placeholder="Enter your Long Link"
          value={formData.originalUrl}
          onChange={handleInputChange}
        />
        {errors.originalUrl && <Error message={errors.originalUrl}/>}
        <div className="flex items-center gap-2">
          <Card className="p-2 text-sm">url-shortner-topaz-chi.vercel.app</Card>
          <Input id="customUrl" placeholder="Create Link (optional)"
            value={formData.customUrl}
            onChange={handleInputChange}
          />
        </div>
        {error && <Error message={error.message}/>}
        <DialogFooter className="sm:justify-start">
          <Button disable={loading?.toString()} variant="destructive" onClick={createNewUrl}>
            {loading ? <BeatLoader size={10} color="white"></BeatLoader> : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateLink