import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link2Icon, LogInIcon, LogOutIcon } from "lucide-react";
import { useContext } from "react";
import { UrlContext } from "@/UrlContext";
import useFetch from "@/hooks/useFetch";
import { logout } from "@/db/apiAuth";
import { BarLoader } from "react-spinners";

const Header = () => {
  const navigate = useNavigate();
  const {user, fetchUser} = useContext(UrlContext);
  const {loading, fn:fnLogout} = useFetch(logout);
  return (
    <>
      <nav className="flex justify-between items-center">
        <Link to="/">
        <img src="./logo.png" className="h-14 w-28 border rounded-sm" alt="Trimrr logo"/>
        </Link>
        <div>
          {
            !user ? <Button onClick={() => {navigate("/auth")}}>Login</Button> : <DropdownMenu>
            <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
            <Avatar>
              <AvatarImage src={user.user_metadata?.profile_pic} />
              <AvatarFallback>NG</AvatarFallback>
            </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link2Icon className="mr-2 h-4 w-4 cursor-pointer"/>
                My Link
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400">
                <LogOutIcon className="mr-2 h-4 w-4 cursor-pointer" />
                <span onClick={() => {
                  fnLogout().then(() => {
                    fetchUser();
                    navigate("/")
                  });
                }} className="mr-2 h-4 w-4">
                  Logout
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          }
        </div>
      </nav>
      {loading && <BarLoader className="mb-4" width={"100%"} color="#36d7b7"></BarLoader>}
    </>
  )
};
export default Header;