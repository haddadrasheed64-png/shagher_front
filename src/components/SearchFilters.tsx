import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterApartments, fetch_apartments } from "../store/apartmentsSlice";
import { SearchIcon, SlidersIcon, ArrowDown, ArrowUp } from "lucide-react";
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
      // رجع كل الشقق
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
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 transition-all duration-500 ease-in-out">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 mb-4">
          {/* مربع البحث */}
          <div className="relative flex-grow">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              placeholder="ابحث عن موقع..."
              className="w-full py-2 px-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <SearchIcon className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          {/* زر الفلترة */}
          <button
            type="button"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center justify-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200"
          >
            <div className="w-fit ml-4">
              {isFiltersOpen ? <ArrowUp /> : <ArrowDown />}
            </div>
            <SlidersIcon className="w-5 h-5 ml-1" />
            <span>فلترة</span>
          </button>

          {/* زر البحث */}
          <button
            type="submit"
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700"
          >
            تطبيق الفلاتر
          </button>
          <button
            onClick={() => {
              dispatch(fetch_apartments());
            }}
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700"
          >
            تحديث
          </button>
        </div>

        {isFiltersOpen && (
          <div
            className={`grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg
              transition-all duration-500 ease-in-out`}
          >
            {is_auth && (
              <div className="flex gap-4 items-center justify-center">
                <label className="block text-gray-700 mb-2">
                  الشقق الخاصة بي
                </label>
                <input
                  type="checkbox"
                  id="my_apartments"
                  name="my_apartments"
                  checked={filters.my_apartments}
                  onChange={handle_my_apartments_filter}
                  className="mr-2 size-5 mb-2"
                />
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
                    بدون شهر تأمين
                  </label>
                </div>
              </div>
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-gray-600 hover:text-yellow-600"
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
