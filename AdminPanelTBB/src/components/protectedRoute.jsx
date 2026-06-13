import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const location = useLocation();
  const [authState, setAuthState] = useState({ loading: true, isAuth: false });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      setAuthState({ loading: false, isAuth: false });
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user?.role !== "admin") {
        setAuthState({ loading: false, isAuth: false });
        return;
      }
      setAuthState({ loading: false, isAuth: true });
    } catch {
      setAuthState({ loading: false, isAuth: false });
    }
  }, []);

  if (authState.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!authState.isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;