import { useState } from "react";
import HamburgerIcon from "../icons/HamburgerIcon";
import Sidebar from "./Sidebar";
import CrossIcon from "../icons/CrossIcon";

const Header = ({ currentItem, setCurrentItem }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="fixed top-0 select-none z-30">
      <div className="flex justify-between items-center w-screen h-16 bg-slate-800 p-3">
        <h3 className="text-xl font-bold cursor-pointer pl-2">
          Three Showcase
        </h3>

        <div onClick={() => setIsSidebarOpen((prev) => !prev)}>
          {isSidebarOpen ? <CrossIcon /> : <HamburgerIcon />}
        </div>
      </div>

      <Sidebar
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </div>
  );
};

export default Header;
