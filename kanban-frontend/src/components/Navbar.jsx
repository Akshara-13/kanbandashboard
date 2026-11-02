import {useNavigate} from 'react-router-dom'

import Cookies from 'js-cookie';
import {
  FiGrid,
  FiSearch,
  FiBell,
  FiSettings,
  FiUser,
  FiMenu,
  FiLogOut,
} from "react-icons/fi";

function Navbar(){
const navigate=useNavigate()

const onClickLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/login', { replace: true });
  };

    return (
      <nav className="w-full h-[72px] bg-white border-b border-gray-200 px-4 md:px-8 flex items-center justify-between shadow-sm">

        {/* Left section */}
        <div className="flex items-center gap-3">
          <button className="md:hidden text-gray-600 text-xl">
            <FiMenu />
          </button>

          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white text-xl">
            <FiGrid />
          </div>

          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Kanban<span className="text-violet-600">Flow</span>
          </h1>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center w-[35%] max-w-md bg-gray-100 rounded-xl px-4 py-2.5">
          <FiSearch className="text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search boards, tasks..."
            className="w-full bg-transparent outline-none border-none ml-3 text-sm text-gray-700 placeholder-gray-400"
          />
          <span className="text-xs text-gray-400 border border-gray-300 rounded px-2 py-1">
            Ctrl K
          </span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3 md:gap-5">
          <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600">
            <FiBell className="text-xl" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <button className="hidden sm:flex w-10 h-10 items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600">
            <FiSettings className="text-xl" />
          </button>

          <div className="h-9 w-px bg-gray-200 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
              <FiUser />
            </div>

            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-gray-800">
                My Account
              </p>
              <p className="text-xs text-gray-500">
                Workspace Member
              </p>
            </div>
          </div>

          <button
            className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
            title="Logout"
            onClick={onClickLogout}
          >
            <FiLogOut className="text-lg" />
          </button>
        </div>
      </nav>
    );
}
export default Navbar;
