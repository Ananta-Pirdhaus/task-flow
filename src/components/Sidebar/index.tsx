import {
  AppsOutline,
  HomeOutline,
  LogOutOutline,
  NewspaperOutline,
  PeopleOutline,
  PieChartOutline,
  GridOutline,
} from "react-ionicons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState("");

  // Check the user's role from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    setUserRole(user?.role_name || ""); // Get the role_name
  }, []);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Admin-specific links
  const adminLinks = [
    {
      title: "Analytics",
      icon: <PieChartOutline color="#555" width="22px" height="22px" />,
      path: "/admin/analytics",
    },
    {
      title: "Workflows",
      icon: <PeopleOutline color="#555" width="22px" height="22px" />,
      path: "/admin/workflow",
    },
    {
      title: "Newsletter",
      icon: <NewspaperOutline color="#555" width="22px" height="22px" />,
      path: "/admin/newsletter",
    },
  ];

  // Project Leader-specific links
  const projectLeaderLinks = [
    {
      title: "Project Dashboard",
      icon: <GridOutline color="#555" width="22px" height="22px" />,
      path: "/project-leader/dashboard",
    },
    {
      title: "Task Details",
      icon: <AppsOutline color="#555" width="22px" height="22px" />,
      path: "/project-leader/task-detail",
    },
    {
      title: "User Tasks",
      icon: <PeopleOutline color="#555" width="22px" height="22px" />,
      path: "/project-leader/user-task",
    },
  ];

  // User-specific links (general user)
  const userLinks = [
    {
      title: "Home",
      icon: <HomeOutline color="#555" width="22px" height="22px" />,
      path: "/",
    },
    {
      title: "Boards",
      icon: <AppsOutline color="#555" width="22px" height="22px" />,
      path: "/boards",
    },
    {
      title: "Projects",
      icon: <GridOutline color="#555" width="22px" height="22px" />,
      path: "/project",
    },
  ];

  // Determine which links to show based on the user's role
  let navLinks = [];
  if (userRole === "Administrator") {
    navLinks = adminLinks;
  } else if (userRole === "Project Leader") {
    navLinks = projectLeaderLinks;
  } else {
    navLinks = userLinks;
  }

  return (
    <div className="fixed left-0 top-0 md:w-[230px] w-[60px] overflow-hidden h-full flex flex-col z-10 transition-all duration-300 ease-in-out">
      {/* Logo Section */}
      <div className="w-full flex items-center md:justify-start justify-center md:pl-5 h-[70px] bg-white">
        <span className="text-orange-400 font-semibold text-2xl md:block hidden">
          Logo
        </span>
        <span className="text-orange-400 font-semibold text-2xl md:hidden block">
          L
        </span>
      </div>

      {/* Navigation Links Section */}
      <div className="w-full h-[calc(100vh-70px)] border-r flex flex-col md:items-start items-center gap-2 border-slate-300 bg-white py-5 md:px-3 px-3 relative">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link to={link.path} key={link.title} className="w-full">
              <div
                className={`flex items-center gap-2 w-full rounded-lg hover:bg-orange-300 px-2 py-3 cursor-pointer transition-colors duration-300 ${
                  isActive ? "bg-orange-300" : "bg-transparent"
                }`}
              >
                {link.icon}
                <span className="font-medium text-[15px] md:block hidden">
                  {link.title}
                </span>
              </div>
            </Link>
          );
        })}

        {/* Logout Button */}
        <div
          className="flex absolute bottom-4 items-center md:justify-start justify-center gap-2 md:w-[90%] w-[70%] rounded-lg hover:bg-orange-300 px-2 py-3 cursor-pointer bg-gray-200 w-full"
          onClick={handleLogout}
        >
          <LogOutOutline color="#555" width="22px" height="22px" />
          <span className="font-medium text-[15px] md:block hidden">
            Log Out
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
