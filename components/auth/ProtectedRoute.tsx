import React, { ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser, getAuthToken } from "../../src/configs/auth";
import Loader from "../shared/loader";

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    const currentUser = getCurrentUser();
    
    if (token && currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
};

export default ProtectedRoute;
