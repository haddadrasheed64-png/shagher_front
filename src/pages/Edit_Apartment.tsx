import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { loading_fun } from "../store/apartmentsSlice";
import { cleaning_error } from "../store/apartmentsSlice";
import { edit_apartment } from "../store/apartmentsSlice";
import { useParams, Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

const Edit_Apartment_Page: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { _id } = useParams<{
    _id: string;
  }>();
  const { items } = useSelector((state: RootState) => state.apartments);
  const apartment = items.find((apt) => apt._id == _id);
  const [formData, setFormData] = useState<any>({
    gender: apartment?.gender || "ذكور أو إناث",
    rent: apartment?.rent || Number(""),
    payment_method: apartment?.payment_method || "شهري",
    services: {
      main_water: apartment?.services.main_water || false,
      office: apartment?.services.office || false,
      secure_month: apartment?.services.secure_month || false,
    },
    description: apartment?.description || "",
    owner_phone: apartment?.owner_phone || "",
  });
  const { error, loading } = useSelector(
    (state: RootState) => state.apartments
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name.startsWith("services.")) {
      const amenityName = name.split(".")[1];
      setFormData({
        ...formData,
        services: {
          ...formData.services,
          [amenityName]: checked,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: checked,
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (Number(formData.rent) <= 0) {
      newErrors.rent = "يرجى إدخال قيمة إيجار صحيحة";
    }
    if (!formData.description.trim()) {
      newErrors.description = "يرجى إدخال وصف للشقة";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(loading_fun());
    dispatch(
      edit_apartment({
        _id: _id,
        gender: formData.gender,
        rent: Number(String(formData.rent).replace(/,/g, "")),
        payment_method: formData.payment_method,
        services: formData.services,
        description: formData.description,
        owner_phone: formData.owner_phone,
      })
    );
    navigate("/");
  };

  useEffect(() => {
    dispatch(cleaning_error());
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center text-yellow-600 hover:underline"
          >
            <ArrowRightIcon className="w-4 h-4 ml-1" />
            <span>العودة إلى القائمة</span>
          </Link>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          تعديل معلومات الشقة
        </h2>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                تفاصيل الشقة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="gender" className="block text-gray-700 mb-1">
                    مناسب لـ
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="ذكور">ذكور</option>
                    <option value="إناث">إناث</option>
                    <option value="ذكور أو إناث">ذكور أو إناث</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="rent" className="block text-gray-700 mb-1">
                    قيمة الإيجار بالليرة السورية
                  </label>
                  <input
                    type="text"
                    id="rent"
                    name="rent"
                    inputMode="numeric"
                    value={
                      formData.rent
                        ? Number(formData.rent).toLocaleString("en")
                        : ""
                    }
                    onChange={(e) => {
                      // السماح فقط بالأرقام
                      const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                      handleInputChange({
                        target: { name: "rent", value: onlyNums },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 no-spinner ${
                      errors.rent ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.rent && (
                    <p className="text-red-500 text-sm mt-1">{errors.rent}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="payment_method"
                    className="block text-gray-700 mb-1"
                  >
                    طريقة الدفع
                  </label>
                  <select
                    id="payment_method"
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="شهري">شهري</option>
                    <option value="سلف 3 أشهر">سلف 3 أشهر</option>
                    <option value="سلف 6 أشهر">سلف 6 أشهر</option>
                    <option value="سلف سنة">سلف سنة</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">خدمات إضافية</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="main_water"
                      name="services.main_water"
                      checked={formData.services.main_water}
                      onChange={handleCheckboxChange}
                      className="ml-2"
                    />
                    <label htmlFor="main_water" className="text-gray-700">
                      مياه رئيسية
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="office"
                    name="services.office"
                    checked={formData.services.office}
                    onChange={handleCheckboxChange}
                    className="ml-2"
                  />
                  <label htmlFor="office" className="text-gray-700">
                    يدار عبر مكتب عقاري
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="secure_month"
                    name="services.secure_month"
                    checked={formData.services.secure_month}
                    onChange={handleCheckboxChange}
                    className="ml-2"
                  />
                  <label htmlFor="secure_month" className="text-gray-700">
                    يتطلب دفع تأمين
                  </label>
                </div>
              </div>
            </div>
            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 mb-1">
                الملاحظات
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full text-sm p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                maxLength={100}
                placeholder="مثلا يفضل أن يكون المستأجر من منطقة معينة, شيء عاطل, شيء مفقود, تغيير مع الزمن..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Submit Button */}
            {loading ? (
              <div className="text-center py-5">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-600 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">جاري التحميل...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg items-center justify-cente bg-yellow-600 hover:bg-yellow-700 text-white`}
                >
                  حفظ التعديلات
                </button>
              </div>
            )}
            {error && (
              <div className="text-center py-5">
                <p className="text-red-600">{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
export default Edit_Apartment_Page;
