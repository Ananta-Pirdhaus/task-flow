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
import Cookies from "js-cookie";

type NavLink = {
  title: string;
  icon: JSX.Element;
  path: string;
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>("Employee");

  /**
   * Ambil role dari cookies
   * Contoh cookie:
   * role_name=Project%20Lead
   */
  useEffect(() => {
    const roleFromCookie = Cookies.get("role_name");

    if (!roleFromCookie) {
      setUserRole("Employee");
      return;
    }

    // Decode: Project%20Lead -> Project Lead
    setUserRole(decodeURIComponent(roleFromCookie));
  }, []);

  const handleLogout = () => {
    Cookies.remove("role_name");
    Cookies.remove("token"); // kalau ada token
    navigate("/login", { replace: true });
  };

  /* =======================
     NAVIGATION CONFIG
  ======================== */

  const adminLinks: NavLink[] = [
    {
      title: "Analytics",
      icon: <PieChartOutline color="#555" width="22px" height="22px" />,
      path: "/admin/analytics",
    },
    {
      title: "Workflow",
      icon: <PeopleOutline color="#555" width="22px" height="22px" />,
      path: "/admin/workflow",
    },
    {
      title: "Newsletter",
      icon: <NewspaperOutline color="#555" width="22px" height="22px" />,
      path: "/admin/newsletter",
    },
  ];

  const projectLeadLinks: NavLink[] = [
    {
      title: "Dashboard",
      icon: <GridOutline color="#555" width="22px" height="22px" />,
      path: "/project-leader/dashboard",
    },
    {
      title: "List Project",
      icon: <AppsOutline color="#555" width="22px" height="22px" />,
      path: "/project-leader/list-project",
    },
    {
      title: "User Tasks",
      icon: <PeopleOutline color="#555" width="22px" height="22px" />,
      path: "/project-leader/user-task",
    },
  ];

  const employeeLinks: NavLink[] = [
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

  /* =======================
     ROLE SWITCH
  ======================== */

  const navLinks: NavLink[] =
    userRole === "Admin"
      ? adminLinks
      : userRole === "Project Lead"
      ? projectLeadLinks
      : employeeLinks;

  /* =======================
     RENDER
  ======================== */

  return (
    <div className="fixed left-0 top-0 md:w-[230px] w-[60px] h-full flex flex-col z-10">
      {/* Logo */}
      <div className="w-full h-[70px] bg-white flex items-center md:justify-start justify-center md:pl-5 border-b">
        <span className="text-orange-400 font-semibold text-2xl md:block hidden">
          Logo
        </span>
        <span className="text-orange-400 font-semibold text-2xl md:hidden block">
          L
        </span>
      </div>

      {/* Menu */}
      <div className="flex-1 bg-white border-r border-slate-300 py-5 px-3 flex flex-col gap-2 relative">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;

          return (
            <Link key={link.title} to={link.path} className="w-full">
              <div
                className={`flex items-center gap-2 px-2 py-3 rounded-lg transition-colors
                  ${isActive ? "bg-orange-300" : "hover:bg-orange-200"}
                `}
              >
                {link.icon}
                <span className="font-medium text-[15px] md:block hidden">
                  {link.title}
                </span>
              </div>
            </Link>
          );
        })}

        {/* Logout */}
        <div
          onClick={handleLogout}
          className="absolute bottom-4 left-3 right-3 flex items-center gap-2 px-2 py-3 rounded-lg bg-gray-200 hover:bg-orange-300 cursor-pointer"
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
