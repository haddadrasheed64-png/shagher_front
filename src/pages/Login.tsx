import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/user_slice";
import { AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, is_auth } = useSelector((state: any) => state.user);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    office_name: "",
    phone_number: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (is_auth) {
      navigate("/");
    }
  }, [is_auth, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.firstName = "يرجى إدخال الاسم";
    }
    if (!formData.last_name.trim()) {
      newErrors.lastName = "يرجى إدخال الكنية";
    }
    if (!/^09\d{8}$/.test(formData.phone_number)) {
      newErrors.phone = "يجب أن يبدأ الرقم بـ 09 ويتألف من 10 أرقام";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "يرجى إدخال بريد إلكتروني صالح";
    }
    if (formData.password.length < 6) {
      newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(
      login({
        first_name: formData.first_name,
        last_name: formData.last_name,
        office_name: formData.office_name,
        phone_number: Number(formData.phone_number),
        email: formData.email,
        password: formData.password,
      })
    );
  };

  return (
    <div className="max-w-md mx-auto mt-4 bg-white shadow-lg rounded-lg p-6">
      {error && (
        <div className="p-3 mb-6 rounded-lg bg-red-100 border border-red-300">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      <h1 className="text-2xl font-bold text-yellow-600 mb-6 text-center">
        تسجيل الدخول
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* الاسم */}
        <div>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="الاسم"
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* الكنية */}
        <div>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="الكنية"
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* اسم المكتب (اختياري) */}
        <div>
          <input
            type="text"
            name="office_name"
            value={formData.office_name}
            onChange={handleChange}
            placeholder="اسم المكتب إن وجد"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border-gray-300"
          />
        </div>

        {/* رقم الموبايل */}
        <div>
          <input
            dir="rtl"
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="رقم الموبايل"
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* الايميل */}
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="البريد الإلكتروني"
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* كلمة المرور */}
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="كلمة المرور"
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* زر التسجيل */}
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            "تسجيل"
          )}
        </button>
      </form>
    </div>
  );
}
