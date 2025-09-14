import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetch_apartments } from "../store/apartmentsSlice";
import { website_analytics } from "../store/apartmentsSlice";
import {
  MapPinIcon,
  BedIcon,
  UsersIcon,
  BanknoteIcon,
  SunIcon,
  WifiIcon,
  DropletIcon,
  BuildingIcon,
  ShieldIcon,
  ArrowRightIcon,
  PhoneIcon,
  MessageSquareIcon,
} from "lucide-react";

const ApartmentDetailPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { _id } = useParams<{
    _id: string;
  }>();
  const { items } = useSelector((state: RootState) => state.apartments);
  const apartment = items.find((apt) => apt._id == _id);
  const [activeImage, setActiveImage] = useState(0);

  const handle_owner_phone_copy = () => {
    dispatch(
      website_analytics({
        method: "owner_phone",
        content: apartment?.owner_phone,
      })
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetch_apartments());
  }, []);

  if (!apartment) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          العقار غير موجودة
        </h2>
        <Link to="/" className="text-yellow-500 hover:underline">
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    );
  }

  const currencyLabel = apartment.currency === "USD" ? "دولار" : "ليرة";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="flex items-center text-yellow-500 hover:underline"
        >
          <ArrowRightIcon className="w-4 h-4 ml-1" />
          <span>العودة إلى القائمة</span>
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Image / Video Gallery */}
        <div className="relative">
          <div className="h-96">
            {apartment.images[activeImage].type === "video" ? (
              <video
                src={apartment.images[activeImage].url.replace(
                  "/upload/",
                  "/upload/f_mp4,w_320,vc_h264,br_400k/"
                )}
                className="w-full h-full object-cover"
                controls
                crossOrigin="anonymous"
                autoPlay
              />
            ) : (
              <img
                src={apartment.images[activeImage].url.replace(
                  "/upload/",
                  "/upload/q_20,f_auto/"
                )}
                alt={apartment.title}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            )}
          </div>

          {apartment.images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 rtl:space-x-reverse">
              {apartment.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-3 h-3 rounded-full ${
                    activeImage === index ? "bg-yellow-500" : "bg-white"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {apartment.images.length > 1 && (
          <div className="flex overflow-x-auto p-4 space-x-2 rtl:space-x-reverse">
            {apartment.images.map((media, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                  activeImage === index ? "ring-2 ring-yellow-500" : ""
                }`}
              >
                {media.type === "video" ? (
                  ""
                ) : (
                  <img
                    src={media.url.replace("/upload/", "/upload/q_20,f_auto/")}
                    alt={`صورة ${index + 1}`}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Apartment Details */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-lg sm:text-3xl font-bold text-gray-800 mb-2">
                {apartment.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPinIcon className="w-5 ه-5 ml-1 shrink-0" />
                <span className="truncate">{apartment.location}</span>
              </div>
            </div>

            <div className="text-lg flex font-bold text-yellow-500 text-left sm:text-right">
              {apartment.listing_type === "sell" ? (
                <>
                  {Number(apartment.sale_price).toLocaleString("en")}{" "}
                  {currencyLabel}
                </>
              ) : (
                <>
                  {Number(apartment.rent).toLocaleString("en")} {currencyLabel}
                  <span className="text-lg font-normal text-gray-600 mr-4">
                    {apartment.payment_method === "شهري"
                      ? "شهرياً"
                      : apartment.payment_method}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-6">
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <BedIcon className="w-6 h-6 text-yellow-500 ml-2" />
              <div>
                <p className="text-sm text-gray-500">عدد الغرف</p>
                <p className="font-semibold">{apartment.rooms} </p>
              </div>
            </div>
            {apartment.listing_type == "rent" && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <UsersIcon className="w-6 h-6 text-yellow-500 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">مناسب لـ</p>
                  <p className="font-semibold">{apartment.gender}</p>
                </div>
              </div>
            )}
            {apartment.listing_type === "rent" && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <BanknoteIcon className="w-6 h-6 text-yellow-500 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">طريقة الدفع</p>
                  <p className="font-semibold">{apartment.payment_method}</p>
                </div>
              </div>
            )}
            {apartment.listing_type == "rent" && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <ShieldIcon className="w-6 h-6 text-yellow-500 ml-2" />
                <div>
                  <p className="text-sm text-gray-500">تأمين</p>
                  <p className="font-semibold">
                    {apartment.services.secure_month ? "مطلوب" : "غير مطلوب"}
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* services */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              خدمات إضافية
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {apartment.services.solar_power ? (
                <div
                  className={`flex items-center p-3 rounded-lg ${
                    apartment.services.solar_power
                      ? "bg-green-50"
                      : "bg-gray-50"
                  }`}
                >
                  <SunIcon
                    className={`w-5 h-5 ml-2 ${
                      apartment.services.solar_power
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={
                      apartment.services.solar_power
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {apartment.services.solar_power
                      ? "طاقة شمسية متوفرة"
                      : "طاقة شمسية غير متوفرة"}
                  </span>
                </div>
              ) : (
                ""
              )}
              {apartment.services.internet ? (
                <div
                  className={`flex items-center p-3 rounded-lg ${
                    apartment.services.internet ? "bg-green-50" : "bg-gray-50"
                  }`}
                >
                  <WifiIcon
                    className={`w-5 h-5 ml-2 ${
                      apartment.services.internet
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={
                      apartment.services.internet
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {apartment.services.internet ? "يوجد راوتر" : ""}
                  </span>
                </div>
              ) : (
                ""
              )}
              <div
                className={`flex items-center p-3 rounded-lg ${
                  apartment.services.main_water ? "bg-green-50" : "bg-gray-50"
                }`}
              >
                <DropletIcon
                  className={`w-5 h-5 ml-2 ${
                    apartment.services.main_water
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={
                    apartment.services.main_water
                      ? "text-green-600"
                      : "text-gray-500"
                  }
                >
                  {apartment.services.main_water
                    ? "مياه رئيسية متوفرة"
                    : "مياه رئيسية غير متوفرة"}
                </span>
              </div>
              <div
                className={`flex items-center p-3 rounded-lg ${
                  apartment.services.office ? "bg-green-50" : "bg-gray-50"
                }`}
              >
                <BuildingIcon
                  className={`w-5 h-5 ml-2 ${
                    apartment.services.office
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
                <span
                  className={
                    apartment.services.office
                      ? "text-green-600"
                      : "text-gray-800"
                  }
                >
                  {apartment.services.office
                    ? "يدار عبر مكتب عقاري"
                    : "لا يوجد مكتب عقاري"}
                </span>
              </div>
            </div>
          </div>
          {/* Description */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              ملاحظات إضافية
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {apartment.description}
            </p>
          </div>
          {/* Contact Section */}
          <div className="mt-10 border-t pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* زر الاتصال */}
              <a
                onClick={handle_owner_phone_copy}
                href={`tel:${apartment.owner_phone}`}
                className="flex-1 flex justify-center items-center bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-700"
              >
                <PhoneIcon className="w-5 h-5 ml-2" />
                <span>اتصل الآن</span>
              </a>

              {/* زر نسخ الرقم */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    String("0" + apartment.owner_phone)
                  );
                  alert(`تم نسخ الرقم: ${"0" + apartment.owner_phone}`);
                  handle_owner_phone_copy();
                }}
                className="flex-1 flex justify-center items-center bg-white border border-yellow-500 text-yellow-500 py-3 px-4 rounded-lg hover:bg-yellow-50"
              >
                <MessageSquareIcon className="w-5 h-5 ml-2" />
                <span>نسخ رقم التواصل</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ApartmentDetailPage;
