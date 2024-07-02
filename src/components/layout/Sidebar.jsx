const SIDEBAR_CONTENT = [
  { title: "Basic" },
  { title: "Texture" },
  { title: "3D Model" },
];

const Sidebar = ({
  currentItem,
  setCurrentItem,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const onButtonClick = (title) => {
    setCurrentItem(title);
    setIsSidebarOpen(false);
  };

  return (
    <div
      className={`absolute top-0 right-0 w-72 h-screen p-5 bg-slate-900/90 ease-linear duration-300 -z-10 ${
        isSidebarOpen ? "translate-x-0" : "translate-x-72"
      }`}
    >
      <nav className="flex flex-col gap-3 mt-20">
        {SIDEBAR_CONTENT.map((item, index) => (
          <button
            key={index}
            className={`w-full hover:border-slate-50/60 ${
              currentItem === item.title && "border-2 border-white"
            }`}
            onClick={() => onButtonClick(item.title)}
          >
            {item.title}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
