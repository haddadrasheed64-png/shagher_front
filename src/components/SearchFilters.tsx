import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterApartments, fetch_apartments } from "../store/apartmentsSlice";
import {
  SearchIcon,
  SlidersIcon,
  ArrowDown,
  ArrowUp,
  RefreshCwIcon,
} from "lucide-react";
import { AppDispatch, RootState } from "../store/store";
import { filter_my_apartments } from "../store/apartmentsSlice";

const SearchFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { apartments, is_auth } = useSelector((state: RootState) => state.user);
  const [filters, setFilters] = useState({
    my_apartments: false,
    search: "",
    rooms: "",
    gender: "",
    payment_method: "",
    listing_type: "",
    services: {
      solar_power: false,
      internet: false,
      main_water: false,
      no_office: false,
      no_secure: false,
    },
  });

  const handle_my_apartments_filter = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked;
    setFilters((prev) => ({ ...prev, my_apartments: checked }));

    if (checked) {
      dispatch(
        filter_my_apartments({
          apartments: apartments.map((a) => a.apartment_id),
        })
      );
    } else {
      // رجع كل العقارات
      dispatch(filterApartments({ ...filters, my_apartments: false }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFilters({
      ...filters,
      services: {
        ...filters.services,
        [name]: checked,
      },
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //dispatch(fetch_apartments());
    dispatch(filterApartments(filters));
  };
  const handleClearFilters = () => {
    setFilters({
      my_apartments: false,
      search: "",
      rooms: "",
      gender: "",
      payment_method: "",
      listing_type: "",
      services: {
        solar_power: false,
        internet: false,
        main_water: false,
        no_office: false,
        no_secure: false,
      },
    });
    dispatch(filterApartments({}));
  };
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 transition-all duration-500 ease-in-out">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* مربع البحث */}
        <div className="relative">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            placeholder="ابحث عن عقار...."
            className="w-full py-3 px-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
          />
          <SearchIcon className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
        </div>

        {/* الأزرار */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center justify-center w-full sm:w-auto bg-yellow-200 text-yellow-800 py-2 px-4 rounded-lg hover:bg-yellow-100 transition"
          >
            {isFiltersOpen ? (
              <ArrowUp className="ml-2" />
            ) : (
              <ArrowDown className="ml-2" />
            )}
            <SlidersIcon className="w-5 h-5 ml-1" />
            <span>فلترة</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-700 transition"
          >
            {filters.search !== "" ? "بحث" : "تطبيق الفلاتر"}
          </button>

          <button
            type="button"
            onClick={() => dispatch(fetch_apartments())}
            className="w-full sm:w-auto flex items-center justify-center gap-4 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-800 transition"
          >
            <RefreshCwIcon />
            تحديث
          </button>
        </div>

        {/* الفلاتر */}
        {isFiltersOpen && (
          <div className="grid grid-cols-1 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
            {is_auth && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="my_apartments"
                  name="my_apartments"
                  checked={filters.my_apartments}
                  onChange={handle_my_apartments_filter}
                  className="size-5"
                />
                <label
                  htmlFor="my_apartments"
                  className="text-gray-700 text-sm"
                >
                  العقارات الخاصة بي
                </label>
              </div>
            )}
            <div>
              <label className="block text-gray-700 mb-2">عدد الغرف</label>
              <select
                name="rooms"
                value={filters.rooms}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">الكل</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">نوع الإعلان</label>
              <select
                name="listing_type"
                value={filters.listing_type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">الكل</option>
                <option value="sell">للبيع</option>
                <option value="rent">للإيجار</option>
              </select>
            </div>
            {filters.listing_type == "rent" && (
              <div>
                <label className="block text-gray-700 mb-2">مناسب لـ</label>
                <select
                  name="gender"
                  value={filters.gender}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">الكل</option>
                  <option value="ذكور">ذكور</option>
                  <option value="إناث">إناث</option>
                  <option value="ذكور أو إناث">ذكور أو إناث</option>
                  <option value="عائلات">عائلات</option>
                </select>
              </div>
            )}
            {filters.listing_type == "rent" && (
              <div>
                <label className="block text-gray-700 mb-2">طريقة الدفع</label>
                <select
                  name="payment_method"
                  value={filters.payment_method}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">الكل</option>
                  <option value="يومي">يومي</option>
                  <option value="شهري">شهري</option>
                  <option value="سلف 3 أشهر">سلف 3 أشهر</option>
                  <option value="سلف 6 أشهر">سلف 6 أشهر</option>
                  <option value="سلف سنة">سلف سنة</option>
                </select>
              </div>
            )}
            <div>
              <label className="block text-gray-700 mb-2">المميزات</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="solar_power"
                    name="solar_power"
                    checked={filters.services.solar_power}
                    onChange={handleCheckboxChange}
                    className="ml-2"
                  />
                  <label htmlFor="solar_power" className="text-gray-600">
                    طاقة شمسية
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="internet"
                    name="internet"
                    checked={filters.services.internet}
                    onChange={handleCheckboxChange}
                    className="ml-2"
                  />
                  <label htmlFor="internet" className="text-gray-600">
                    راوتر
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="main_water"
                    name="main_water"
                    checked={filters.services.main_water}
                    onChange={handleCheckboxChange}
                    className="ml-2"
                  />
                  <label htmlFor="main_water" className="text-gray-600">
                    مياه رئيسية
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="no_office"
                    name="no_office"
                    checked={filters.services.no_office}
                    onChange={handleCheckboxChange}
                    className="ml-2"
                  />
                  <label htmlFor="no_office" className="text-gray-600">
                    بدون مكتب عقاري
                  </label>
                </div>
                {filters.listing_type == "rent" && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="no_secure"
                      name="no_secure"
                      checked={filters.services.no_secure}
                      onChange={handleCheckboxChange}
                      className="ml-2"
                    />
                    <label htmlFor="no_secure" className="text-gray-600">
                      بدون دفع تأمين
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-gray-600 hover:text-yellow-500"
              >
                مسح الفلاتر
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
export default SearchFilters;
