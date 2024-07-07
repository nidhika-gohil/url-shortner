import { UrlContext } from "@/UrlContext";
import { getClicksForSingleUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import { LinkIcon } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Copy, Download, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Link = () => {
  const {id} = useParams();
  const {user} = useContext(UrlContext);
  const navigate = useNavigate();
  const {data: url, loading, error, fn} = useFetch(getUrl, {id, user_id:user?.id});
  const {data: stats, loading: loadingStats, error: statError, fn:fnStats} = useFetch(getClicksForSingleUrl,id);
  const {loading: loadingDelete, error: deleteError, fn:fnDeleteUrl} = useFetch(deleteUrl, id);
  const downloadImage  = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };
  useEffect(() => {
    fn();
    fnStats();
  }, []);

  if(error){
    navigate("/dashboard");
  }

  let link = "";
  if(url) {
    link = url?.custom_url ? url?.custom_url : url?.short_url;
  }
  
  return (
    <>
      {loading || loadingStats && (<BarLoader className="mb-4" width={"100%"} color="#36d7b7"></BarLoader>)}
      <div className="flex flex-col gap-8 sm:flex-row justify-between pt-4">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          <span className="text-6xl font-extrabold hover:underline cursor-pointer">{url?.title}</span>
          <a className="text-3xl text-blue-400 sm:text-4xl font-bold hover:underline cursor-pointer" href={`https://url-shortner-topaz-chi.vercel.app/${link}`} target="_blank" >
            https://url-shortner-topaz-chi.vercel.app/{link}
          </a>
          <a className="flex items-center gap-1 hover:underline cursor-pointer" href={`${url?.original_url}`} target="_blank" >
            <LinkIcon className="p-1"></LinkIcon>
            {url?.original_url}
          </a>
          <span className="flex items-end font-extralight text-sm">{new Date(url?.created_at).toLocaleString()}</span>
          <div className='flex gap-2'>
            <Button variant="ghost" onClick={()=>{
                navigator.clipboard.writeText(`https://url-shortner-topaz-chi.vercel.app/${url?.short_url}`)
              }}>
              <Copy />
            </Button>
            <Button variant="ghost" onClick={downloadImage}>
              <Download />
            </Button>
            <Button variant="ghost"  onClick={()=>{
                fnDeleteUrl()
              }}>
              {loadingDelete ? <BeatLoader size={5} color="#ffffff"></BeatLoader> : <Trash/>}
            </Button>
          </div>
          <img src={url?.qr} alt="qr code" className='w-full self-center sm:self-start object-contain ring'/>
        </div>
        <div className="sm:w-3/5">
        </div>
      </div>
    </>
  )
};
export default Link;