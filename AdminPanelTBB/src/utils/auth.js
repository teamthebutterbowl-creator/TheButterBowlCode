export const logoutAdmin = (navigate) => {
    localStorage.removeItem("token");  // apna actual key name
    localStorage.removeItem("user");   // apna actual key name
  
    if (navigate) {
      navigate("/login", { replace: true });
    } else {
      window.location.href = "/login";
    }
  };