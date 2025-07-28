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
    <footer className="fixed bottom-0 left-0 w-full bg-white/10 backdrop-blur-xl border-t border-white/20 shadow-lg flex justify-around items-center py-4 z-50">
      <Link href="/catalogo" className="flex flex-col items-center text-white/70 hover:text-cyan-400 text-sm transition-colors duration-300 group">
        <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center mb-1 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
          <span role="img" aria-label="Catálogo" className="text-xl">🛒</span>
        </div>
        <span className="font-medium text-base">Catálogo</span>
      </Link>
      <Link href="/carrito" className="flex flex-col items-center text-white/70 hover:text-cyan-400 text-sm transition-colors duration-300 group">
        <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center mb-1 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
          <span role="img" aria-label="Carrito" className="text-xl">🛍️</span>
        </div>
        <span className="font-medium text-base">Carrito</span>
      </Link>
      {!isLogged ? (
        <Link href="/login" className="flex flex-col items-center text-white/70 hover:text-cyan-400 text-sm transition-colors duration-300 group">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-1 group-hover:from-cyan-600 group-hover:to-blue-600 group-hover:scale-110 transition-all duration-300">
            <span role="img" aria-label="Login" className="text-xl">🔑</span>
          </div>
          <span className="font-medium text-base">Login</span>
        </Link>
      ) : (
        <button onClick={handleLogout} className="flex flex-col items-center text-white/70 hover:text-red-400 text-sm focus:outline-none transition-colors duration-300 group">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center mb-1 group-hover:bg-red-500/20 group-hover:scale-110 transition-all duration-300">
            <span role="img" aria-label="Logout" className="text-xl">🚪</span>
          </div>
          <span className="font-medium text-base">Logout</span>
        </button>
      )}
    </footer>
  );
} 
