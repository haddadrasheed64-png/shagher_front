import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  HomeIcon,
  PlusIcon,
  UserIcon,
  XIcon,
  MoreHorizontal,
  LogOutIcon,
} from "lucide-react";
import { logout } from "../store/user_slice";
import { AppDispatch } from "../store/store";
const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { is_auth } = useSelector((state: any) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}

        <h1 className="text-2xl md:text-3xl font-bold text-yellow-600">شاغر</h1>

        {/* زر القائمة في الموبايل */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <XIcon className="w-6 h-6" />
          ) : (
            <MoreHorizontal className="w-6 h-6" />
          )}
        </button>

        {/* روابط الديسكتوب */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center text-gray-700 hover:text-yellow-600"
          >
            <HomeIcon className="w-5 h-5 ml-1" />
            <span>الرئيسية</span>
          </Link>
          {is_auth && (
            <Link
              to="/add-apartment"
              className="flex items-center text-gray-700 hover:text-yellow-600"
            >
              <PlusIcon className="w-5 h-5 ml-1" />
              <span>إضافة شقة</span>
            </Link>
          )}

          {!is_auth ? (
            <Link to={"/login"}>
              <button className="flex items-center bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700">
                <UserIcon className="w-5 h-5 ml-1" />
                <span className="text-sm">تسجيل الدخول لإضافة الشقق</span>
              </button>
            </Link>
          ) : (
            <button
              className="flex items-center text-gray-700 hover:text-yellow-600"
              onClick={() => {
                dispatch(logout());
              }}
            >
              <LogOutIcon className="w-5 h-5 ml-1 text-red-500" />
              <span className="text-red-500">تسجيل الخروج</span>
            </button>
          )}
        </nav>
      </div>

      {/* قائمة الموبايل */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <nav className="flex flex-col p-4 gap-4">
            <Link
              to="/"
              className="flex items-center text-gray-700 hover:text-yellow-600"
              onClick={() => setMenuOpen(false)}
            >
              <HomeIcon className="w-5 h-5 ml-1" />
              <span>الرئيسية</span>
            </Link>
            {is_auth && (
              <Link
                to="/add-apartment"
                className="flex items-center text-gray-700 hover:text-yellow-600"
                onClick={() => setMenuOpen(false)}
              >
                <PlusIcon className="w-5 h-5 ml-1" />
                <span>إضافة شقة</span>
              </Link>
            )}
            {!is_auth ? (
              <Link to={"/login"}>
                <button className="flex items-center bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700">
                  <UserIcon className="w-5 h-5 ml-1" />
                  <span className="text-sm">تسجيل الدخول لإضافة الشقق</span>
                </button>
              </Link>
            ) : (
              <button
                className="flex items-center text-gray-700 hover:text-yellow-600"
                onClick={() => {
                  dispatch(logout());
                }}
              >
                <LogOutIcon className="w-5 h-5 ml-1 text-red-500" />
                <span className="text-red-500">تسجيل الخروج</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
export default Header;
