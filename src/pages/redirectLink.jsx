import { getLongUrl } from "@/db/apiUrls";
import { storeClicks }from "@/db/apiClicks";
import useFetch from "@/hooks/useFetch";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const {id} = useParams();
  const {data, error, loading, fn:fnLongUrl} = useFetch(getLongUrl, id);
  const {loading: loadingStats, fn: fnStats} = useFetch(storeClicks,{
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    fnLongUrl();
  }, []);

  useEffect(() => {
    if(!loading && data)
      fnStats();
  }, [loading]);

  if(loading || loadingStats) {
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7"></BarLoader>
        <br/>
        Redirecting...
      </>
    )
  }
  return null;
};
export default RedirectLink;