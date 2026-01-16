import Cookies from "js-cookie";

export const getRoleFromCookie = (): string | null => {
  const role = Cookies.get("role_name");
  return role ? decodeURIComponent(role) : null;
};
