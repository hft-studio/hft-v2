import { Navbar } from "@/app/components/navbar";
import { Social } from "@/app/components/social";

export default function Page ({ children } : { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar  />
      <div className="flex-1">
        {children}
      </div>
      {/* Social  I want to center this*/}
     
    </div>
  );
}