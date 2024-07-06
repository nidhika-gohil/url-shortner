import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen container">
        <Header/>
        <Outlet/>
      </main>
      <div className="bg-gray-800 p-10 text-center">
        Made By Nidhika Gohil
      </div>
    </div>
  )
};
export default AppLayout;