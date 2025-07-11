"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import CartIconWithBadge from "@/components/CartIconWithBadge";

export default function GlobalHeader() {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("user");
      setIsLogged(!!token && !!userStr);
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setIsAdmin(user.role === "ADMIN");
        } catch {}
      }
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };
  return (
    <header className="bg-white shadow border-b sticky top-0 z-50 min-h-[1rem]">{/* Header minimal, sin menú */}</header>
  );
} 