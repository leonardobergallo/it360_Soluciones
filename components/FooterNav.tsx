import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FooterNav() {
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();
  useEffect(() => {
    function checkLogin() {
      const token = localStorage.getItem("authToken");
      setIsLogged(!!token);
    }
    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/login");
  };
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg flex justify-around items-center py-2 z-50">
      <Link href="/catalogo" className="flex flex-col items-center text-gray-700 hover:text-blue-700 text-sm">
        <span role="img" aria-label="Catálogo" className="text-2xl">🛒</span>
        Catálogo
      </Link>
      <Link href="/carrito" className="flex flex-col items-center text-gray-700 hover:text-blue-700 text-sm">
        <span role="img" aria-label="Carrito" className="text-2xl">🛍️</span>
        Carrito
      </Link>
      {!isLogged ? (
        <Link href="/login" className="flex flex-col items-center text-gray-700 hover:text-blue-700 text-sm">
          <span role="img" aria-label="Login" className="text-2xl">🔑</span>
          Login
        </Link>
      ) : (
        <button onClick={handleLogout} className="flex flex-col items-center text-gray-700 hover:text-red-600 text-sm focus:outline-none">
          <span role="img" aria-label="Logout" className="text-2xl">🚪</span>
          Logout
        </button>
      )}
    </footer>
  );
} 