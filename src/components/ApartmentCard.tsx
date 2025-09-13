import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Apartment } from "../store/apartmentsSlice";
import { delete_apartment } from "../store/apartmentsSlice";
import {
  BedIcon,
  MapPinIcon,
  UsersIcon,
  BanknoteIcon,
  LinkIcon,
} from "lucide-react";
import { AppDispatch, RootState } from "../store/store";

// استيراد Radix Dialog
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";

interface ApartmentCardProps {
  apartment: Apartment;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { email, apartments, is_auth } = useSelector(
    (state: RootState) => state.user
  );

  const [open, setOpen] = useState(false);

  const handleConfirmDelete = () => {
    dispatch(delete_apartment({ apartment_id: apartment._id, email: email }));
    setOpen(false);
  };

  return (
    apartment && (
      <div
        onClick={() => {
          axios.post("https://shagher.onrender.com/website", {
            method: "click_on_apartment",
            content: apartment._id,
          });
        }}
      >
        <Link
          to={`/apartment/${apartment._id}`}
          className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div
            className={`relative h-48 ${
              apartment.images[0].type == "video"
                ? "bg-yellow-500 flex items-center justify-center"
                : ""
            }`}
          >
            {/* صورة أو فيديو */}
            {apartment.images[0].type === "video" ? (
              <div className="relative w-full h-48 bg-black rounded-lg shadow-md flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40 rounded-lg"></div>
                <div className="relative flex flex-col items-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 mb-2 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="text-sm font-medium">يوجد فيديو</span>
                </div>
              </div>
            ) : (
              <img
                src={apartment.images[0].url.replace(
                  "/upload/",
                  "/upload/q_30,f_auto/"
                )}
                alt={apartment.title}
                crossOrigin="anonymous"
                className="w-full h-48 object-cover rounded-lg shadow-sm"
                loading="lazy"
              />
            )}

            {/* زر نسخ الرابط - ظاهر دائماً */}
            <button
              onClick={(e) => {
                e.preventDefault(); // منع انتقال الرابط
                navigator.clipboard.writeText(
                  `${window.location.origin}/apartment/${apartment._id}`
                );

                alert("تم نسخ رابط العقار");
              }}
              className="absolute top-2 left-2 bg-green-500 text-white p-2 rounded-md hover:bg-gray-700"
            >
              {/* أيقونة نسخ (من react-icons أو SVG عادي) */}
              <LinkIcon />
            </button>

            {/* زر الحذف */}
            {apartments?.some((apt) => apt.apartment_id == apartment._id) &&
              is_auth && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(true);
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 text-lg"
                >
                  حذف
                </button>
              )}

            {/* زر التعديل */}
            {apartments?.some((apt) => apt.apartment_id == apartment._id) &&
              is_auth && (
                <Link to={`/editapartment/${apartment._id}`}>
                  <button className="absolute top-2 right-20 bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-700 text-lg">
                    تعديل
                  </button>
                </Link>
              )}
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              {apartment.title}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPinIcon className="w-4 h-4 ml-1" />
              <span className="text-sm">{apartment.location}</span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center text-gray-600">
                <BedIcon className="w-4 h-4 ml-1" />
                <span className="text-sm">{apartment.rooms} غرف</span>
              </div>
              <div className="flex items-center text-gray-600">
                <UsersIcon className="w-4 h-4 ml-1" />
                <span className="text-sm">{apartment.gender}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <BanknoteIcon className="w-4 h-4 ml-1" />
                <span className="text-sm">{apartment.payment_method}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-lg font-bold text-yellow-500">
                {Number(apartment.rent).toLocaleString("en")} ليرة
              </span>

              <button className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-200 transition-colors">
                التفاصيل
              </button>
            </div>
          </div>
        </Link>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
            <Dialog.Content
              dir="rtl"
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-72 shadow-lg"
            >
              <Dialog.Title className="text-lg font-bold text-red-600 mb-2">
                تأكيد الحذف
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-600 mb-4">
                هل أنت متأكد أنك تريد حذف هذه الشقة؟ هذا الإجراء لا يمكن التراجع
                عنه
              </Dialog.Description>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  حذف
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    )
  );
};

export default ApartmentCard;
