import { BarLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useState } from "react";
import { Filter } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { getUrls } from "@/db/apiUrls";
import { UrlContext } from "@/UrlContext";
import { getClicksForUrl } from "@/db/apiClicks";
import LinkCards from "@/components/link-cards";
import CreateLink from "@/components/create-link";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {user} = useContext(UrlContext);
  const {loading, error, data: urls, fn:fnUrls}= useFetch(getUrls, user?.id)
  const {loading: loadingClicks, data: clicks, fn:fnClicks}= useFetch(getClicksForUrl, urls?.map((url)=> url.id));

  useEffect(()=> {
    fnUrls();
  },[]);
  useEffect(()=> {
    if(urls?.length)
      fnClicks();
  },[urls?.length]);

  const filterUrls = urls?.filter((url) => {
    return url.title.toLowerCase().includes(searchQuery.toLowerCase());
  });
  return (
    <div className="flex flex-col gap-8 pt-8">
      {(loading || loadingClicks) && (<BarLoader width={"100%"} color="#36d7b7"></BarLoader>) }
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between">
        <h1 className="text-4xl font-extrabold">My Links</h1>
        <CreateLink/>
      </div>
      <div className="relative">
        <Input 
          value={searchQuery}
          type="text"
          placeholder="Filter Links..."
          onChange={(e)=>{setSearchQuery(e.target.value)}}  
        />
        <Filter className="absolute top-2 right-2 p-1"></Filter>
      </div>
      {error && <Error message={error?.message}></Error>}
      {(filterUrls || []).map((url, index) => {
        return <LinkCards key={index} url={url} fetchUrls={fnUrls}/>
      })}
    </div>
  )
};
export default Dashboard;