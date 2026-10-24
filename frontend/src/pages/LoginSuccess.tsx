import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as api from "api";
import { extractUserId } from "../utils/jwt";
import { useAuth } from "../contexts/AuthContext";

export default function LoginSuccess() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("token", token);
    api.setAuthToken(token);

    const uid = extractUserId(token);
    if (!uid) {
      navigate("/login");
      return;
    }

    api.getUser(uid)
      .then((res) => {
        const user = res.data;
        setUser(user);

        // Redirect based on role
        if (user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (user.role === "employer") {
          navigate("/employer/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user", err);
        navigate("/login");
      });
  }, [search, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Logging you in…</p>
    </div>
  );
}
