import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { HomeIcon, PlusIcon, UserIcon, XIcon, Plus } from "lucide-react";
const Header: React.FC = () => {
  const { is_auth } = useSelector((state: any) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}

        <h1 className="text-2xl md:text-3xl font-bold text-yellow-500">
          الكفو
        </h1>

        {/* زر القائمة في الموبايل */}
        <button
          className="md:hidden text-yellow-500 "
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <XIcon className="w-6 h-6" />
          ) : (
            <Plus className="w-8 h-8" />
          )}
        </button>

        {/* روابط الديسكتوب */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center text-gray-700 hover:text-yellow-500"
          >
            <HomeIcon className="w-5 h-5 ml-1" />
            <span>الرئيسية</span>
          </Link>
          {is_auth && (
            <Link
              to="/add-apartment"
              className="flex items-center text-gray-700 hover:text-yellow-500"
            >
              <PlusIcon className="w-5 h-5 ml-1" />
              <span>إضافة عقار</span>
            </Link>
          )}

          {!is_auth ? (
            <Link to={"/login"}>
              <button className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-700">
                <UserIcon className="w-5 h-5 ml-1" />
                <span className="text-sm">تسجيل الدخول لإضافة العقارات</span>
              </button>
            </Link>
          ) : (
            ""
          )}
          {/*<button
              className="flex items-center text-gray-700 hover:text-yellow-500"
              onClick={() => {
                dispatch(logout());
              }}
            >
              <LogOutIcon className="w-5 h-5 ml-1 text-red-500" />
              <span className="text-red-500">تسجيل الخروج</span>
            </button>*/}
        </nav>
      </div>

      {/* قائمة الموبايل */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <nav className="flex flex-col p-4 gap-4">
            <Link
              to="/"
              className="flex items-center text-gray-700 hover:text-yellow-500"
              onClick={() => setMenuOpen(false)}
            >
              <HomeIcon className="w-5 h-5 ml-1" />
              <span>الرئيسية</span>
            </Link>
            {is_auth && (
              <Link
                to="/add-apartment"
                className="flex items-center text-gray-700 hover:text-yellow-500"
                onClick={() => setMenuOpen(false)}
              >
                <PlusIcon className="w-5 h-5 ml-1" />
                <span>إضافة عقار</span>
              </Link>
            )}
            {!is_auth ? (
              <Link to={"/login"}>
                <button className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-700">
                  <UserIcon className="w-5 h-5 ml-1" />
                  <span className="text-sm">تسجيل الدخول لإضافة العقارات</span>
                </button>
              </Link>
            ) : (
              ""
            )}
            {/*<button
                className="flex items-center text-gray-700 hover:text-yellow-500"
                onClick={() => {
                  dispatch(logout());
                }}
              >
                <LogOutIcon className="w-5 h-5 ml-1 text-red-500" />
                <span className="text-red-500">تسجيل الخروج</span>
              </button>*/}
          </nav>
        </div>
      )}
    </header>
  );
};
export default Header;
