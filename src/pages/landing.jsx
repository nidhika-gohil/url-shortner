import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();
  const handleShorten = (e) =>{
    e.preventDefault();
    if(longUrl)
      navigate(`/auth?createNew=${longUrl}`);
  };
  return (
    <div className="flex flex-col items-center">
      <h2 className="my-10 sm:my-16 text-4xl sm:text-3xl text-center font-extrabold">
        The URL shortner created by Nidhika
      </h2>
      <form onSubmit={handleShorten} className="flex flex-col sm:flex-row w-full md:w-2/4 gap-2">
        <Input 
          value={longUrl}
          onChange={(e) => {setLongUrl(e.target.value)}}
          className="h-full flex-1" 
          type="url" 
          placeholder="Enter your looong url"
        ></Input>
        <Button className="h-full" type="submit" variant="destructive">Shorten!</Button>
      </form>
      <img className="w-full md:px-11 p-10" src="/landing.png" alt="" />
      <Accordion className="w-full md:py-10" type="multiple" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>How does the trimrr URL shortner works?</AccordionTrigger>
          <AccordionContent>
            When you enter a long URL, our system generates a shorter version of that URL. This shortened  URL redirects to the original long URL when accessed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Do I need an account to use the app?</AccordionTrigger>
          <AccordionContent>
            Yes. Creating an account allows you to manage your URLs, view analytics, and customize your shor URLs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>What analytics are available for my shortened URL?</AccordionTrigger>
          <AccordionContent>
            You can view the number of clicks, geolocation data of the clicks and device types (mobile/desktop) for each of your short URLs. 
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
};
export default Landing;