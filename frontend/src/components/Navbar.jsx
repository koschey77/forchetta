import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react"
import { Link } from "react-router-dom"
import { useUserStore } from "../stores/useUserStore"

const Navbar = () => {
  const { user, logout } = useUserStore()
  const isAdmin = user?.role === "admin"

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-100 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto py-3">
        <div className="flex flex-wrap justify-between items-center px-3">
          <Link to="/" className="text-2xl font-bold text-indigo-950">
            Forchetta
          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            {isAdmin && (
              <>
                <Link
                  className="text-pink-950 px-3 py-1 rounded-md font-medium
                  transition duration-300 ease-in-out flex items-center"
                  to={"/secret-dashboard"}
                >
                  <Lock className="inline-block mr-1" size={18} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <span className="hidden sm:inline ml-10">Привіт, {user.name}</span>
              </>
            )}
            {user && !isAdmin && (
              <>
                <Link to={"/cart"} className="relative group text-black transition duration-300 ease-in-out">
                  <ShoppingCart className="inline-block mr-1 group-hover:text-emerald-400" size={24} />
                  <span className="hidden sm:inline">0</span>
                </Link>
                <span className="hidden sm:inline ml-2">Привіт, {user.name}</span>{" "}
              </>
            )}

            {user || isAdmin ? (
              <button onClick={logout} className="text-pink-950 py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out">
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link to={"/signup"} className="text-pink-950 py-2 px-2 rounded-md flex items-center transition duration-300 ease-in-out">
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link to={"/login"} className="text-pink-950 py-2 px-2 rounded-md flex items-center transition duration-300 ease-in-out">
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar
