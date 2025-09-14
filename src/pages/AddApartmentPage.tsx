import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "lucide-react";
import imageCompression from "browser-image-compression";
import { add_apartment } from "../store/apartmentsSlice";
import { AppDispatch, RootState } from "../store/store";
import { loading_fun } from "../store/apartmentsSlice";
import { cleaning_error } from "../store/apartmentsSlice";

const AddApartmentPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    title: string;
    location: string;
    images: File[];
    rooms: number;
    gender: string;
    // نوع الإدراج
    listing_type: "sell" | "rent";
    // للإيجار
    rent?: number;
    payment_method?: string;
    // للبيع
    sale_price?: number;
    // العملة
    currency: "USD" | "SYP";
    services: {
      solar_power: boolean;
      internet: boolean;
      main_water: boolean;
      office: boolean;
      secure_month: boolean;
    };
    description: string;
    owner_phone: string;
  }>({
    title: "",
    location: "",
    images: [], // ✅ TS بيعرفها File[]
    rooms: 1,
    gender: "ذكور أو إناث",
    listing_type: "rent",
    rent: Number(""),
    payment_method: "شهري",
    sale_price: Number(""),
    currency: "SYP",
    services: {
      solar_power: false,
      internet: false,
      main_water: false,
      office: false,
      secure_month: false,
    },
    description: "",
    owner_phone: "",
  });

  const { error, loading } = useSelector(
    (state: RootState) => state.apartments
  );
  const { limit, email } = useSelector((state: RootState) => state.user);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value as any,
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
        [name]: checked as any,
      });
    }
  };
  const removeImageField = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = "يرجى إدخال عنوان للشقة";
    }
    if (!formData.location.trim()) {
      newErrors.location = "يرجى إدخال موقع العقار";
    }
    if (formData.listing_type === "rent") {
      if (!formData.rent || Number(formData.rent) <= 0) {
        newErrors.rent = "يرجى إدخال قيمة إيجار صحيحة";
      }
      if (!formData.payment_method) {
        newErrors.payment_method = "يرجى تحديد طريقة الدفع";
      }
    } else if (formData.listing_type === "sell") {
      if (!formData.sale_price || Number(formData.sale_price) <= 0) {
        newErrors.sale_price = "يرجى إدخال سعر بيع صحيح";
      }
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

    try {
      const uploadedFiles: {
        url: string;
        public_id: string;
        type: "image" | "video";
      }[] = [];

      // ✅ دالة ضغط الصور
      async function compressToTarget(file: File, maxSizeKB = 200) {
        let quality = 0.8;
        let compressed = file;

        while (true) {
          const options = {
            maxSizeMB: maxSizeKB / 1024,
            maxWidthOrHeight: 800,
            useWebWorker: true,
            fileType: "image/jpeg",
            initialQuality: quality,
          };
          compressed = await imageCompression(file, options);

          if (compressed.size / 1024 <= maxSizeKB || quality <= 0.3) {
            break;
          }

          quality -= 0.1;
        }

        return compressed;
      }

      for (const file of formData.images) {
        if (file.type.startsWith("image/")) {
          // ✅ صور
          const compressed = await compressToTarget(file, 300);
          const formDataCloud = new FormData();
          formDataCloud.append("file", compressed);
          formDataCloud.append("upload_preset", "my_unsigned_preset");

          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dcvmfnhhk/image/upload",
            { method: "POST", body: formDataCloud }
          );

          if (!res.ok) throw new Error("فشل رفع الصورة إلى Cloudinary");

          const data = await res.json();
          uploadedFiles.push({
            url: data.secure_url, // الصورة الأصلية (مضغوطة مسبقاً)
            public_id: data.public_id,
            type: "image",
          });
        } else if (file.type.startsWith("video/")) {
          // ✅ فيديو
          const formDataCloud = new FormData();
          formDataCloud.append("file", file); // الملف الأصلي
          formDataCloud.append("upload_preset", "my_unsigned_preset");
          console.log("Uploading file:", file);

          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dcvmfnhhk/video/upload",
            { method: "POST", body: formDataCloud }
          );
          console.log("Response status:", res.status, res.statusText);

          if (!res.ok) throw new Error("فشل رفع الفيديو إلى Cloudinary");

          const data = await res.json();

          const encodedId = encodeURIComponent(data.public_id);
          const compressedUrl = `https://res.cloudinary.com/dcvmfnhhk/video/upload/w_640,q_auto,f_mp4/${encodedId}.mp4`;

          uploadedFiles.push({
            url: compressedUrl, // نستخدم الرابط المضغوط بدل الأصل
            public_id: data.public_id,
            type: "video",
          });
        }
      }

      // إرسال البيانات مع الروابط للسيرفر
      dispatch(
        add_apartment({
          title: formData.title,
          location: formData.location,
          images: uploadedFiles,
          rooms: formData.rooms,
          gender: formData.gender,
          listing_type: formData.listing_type,
          rent:
            formData.listing_type === "rent"
              ? Number(String(formData.rent).replace(/,/g, ""))
              : undefined,
          payment_method:
            formData.listing_type === "rent"
              ? formData.payment_method
              : undefined,
          sale_price:
            formData.listing_type === "sell"
              ? Number(String(formData.sale_price).replace(/,/g, ""))
              : undefined,
          currency: formData.currency,
          services: formData.services,
          description: formData.description,
          owner_phone: formData.owner_phone,
          email: email,
        } as any)
      );

      navigate("/");
    } catch (error) {
      console.error("فشل رفع الصور/الفيديو:", error);
    }
  };

  useEffect(() => {
    dispatch(cleaning_error());
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {Number(limit) === 0 ? (
          <p className="text-red-600 text-xl mt-2 text-center">
            لقد استهلكت الحد المجاني المسموح به لإضافة الشقق
          </p>
        ) : (
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            إضافة شقة جديدة
          </h2>
        )}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-gray-700 mb-1">
                    عنوان مختصر
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-gray-700 mb-1"
                  >
                    الموقع
                  </label>
                  <input
                    maxLength={25}
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Images */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                صور العقار
              </h3>

              {/* معاينة الصور والفيديوهات */}
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {formData.images.map((file: File, index: number) => (
                    <div key={index} className="relative">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)} // 🔑 للمعاينة فقط
                          alt={`صورة ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(file)} // 🔑 للمعاينة فقط
                          className="w-24 h-24 object-cover rounded-lg border"
                          controls
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* مدخل رفع الصور */}
              <label
                className={`w-full cursor-pointer p-3 flex items-center justify-center border rounded-lg focus-within:ring-2 focus-within:ring-yellow-500 
  ${errors.images ? "border-red-500" : "border-gray-300"} hover:bg-yellow-50`}
              >
                <input
                  disabled={formData.images.length >= 8}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) => {
                    if (!e.target.files) return;
                    const files = Array.from(e.target.files);

                    files.forEach((file) => {
                      if (
                        !file.type.startsWith("image/") &&
                        !file.type.startsWith("video/")
                      ) {
                        alert(
                          `الملف "${file.name}" غير مدعوم. يرجى رفع صورة أو فيديو فقط.`
                        );
                        return;
                      }

                      setFormData((prev: any) => ({
                        ...prev,
                        images: [...prev.images, file], // 🔑 نخزن الملف نفسه (صورة أو فيديو)
                      }));
                    });

                    e.target.value = ""; // إعادة التعيين بعد كل رفع
                  }}
                  className="hidden"
                />
                <span className="text-yellow-700 font-semibold flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 20h14a1 1 0 001-1v-9h-2v8H6v-8H4v9a1 1 0 001 1zm7-16a1 1 0 011 1v9h2v-9a3 3 0 00-6 0v9h2V5z" />
                  </svg>
                  {formData.images.length < 8 ? (
                    <span>رفع صور أو فيديو</span>
                  ) : (
                    <span>الحد الأقصى هو {formData.images.length} ملفات</span>
                  )}
                </span>
              </label>

              {errors.images && (
                <p className="text-red-500 text-sm mt-2">{errors.images}</p>
              )}
            </div>

            {/* Details */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                تفاصيل العقار
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="rooms" className="block text-gray-700 mb-1">
                    عدد الغرف
                  </label>
                  <select
                    id="rooms"
                    name="rooms"
                    value={formData.rooms}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5+</option>
                  </select>
                </div>
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
                    <option value="عائلات">عائلات</option>
                  </select>
                </div>

                {/* نوع الإدراج */}
                <div>
                  <label
                    htmlFor="listing_type"
                    className="block text-gray-700 mb-1"
                  >
                    نوع الإعلان
                  </label>
                  <select
                    id="listing_type"
                    name="listing_type"
                    value={formData.listing_type}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="rent">للإيجار</option>
                    <option value="sell">للبيع</option>
                  </select>
                </div>
                {/* العملة */}
                <div>
                  <label
                    htmlFor="currency"
                    className="block text-gray-700 mb-1"
                  >
                    العملة
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="SYP">ليرة سورية</option>
                    <option value="USD">دولار</option>
                  </select>
                </div>

                {/* حقول الإيجار */}
                {formData.listing_type === "rent" && (
                  <>
                    <div>
                      <label
                        htmlFor="rent"
                        className="block text-gray-700 mb-1"
                      >
                        قيمة الإيجار
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
                          const onlyNums = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          handleInputChange({
                            target: { name: "rent", value: onlyNums },
                          } as React.ChangeEvent<HTMLInputElement>);
                        }}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 no-spinner ${
                          errors.rent ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.rent && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.rent}
                        </p>
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
                        <option value="يومي">يومي</option>
                        <option value="شهري">شهري</option>
                        <option value="سلف 3 أشهر">سلف 3 أشهر</option>
                        <option value="سلف 6 أشهر">سلف 6 أشهر</option>
                        <option value="سلف سنة">سلف سنة</option>
                      </select>
                    </div>
                  </>
                )}

                {/* حقول البيع */}
                {formData.listing_type === "sell" && (
                  <div>
                    <label
                      htmlFor="sale_price"
                      className="block text-gray-700 mb-1"
                    >
                      سعر البيع
                    </label>
                    <input
                      type="text"
                      id="sale_price"
                      name="sale_price"
                      inputMode="numeric"
                      value={
                        formData.sale_price
                          ? Number(formData.sale_price).toLocaleString("en")
                          : ""
                      }
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                        handleInputChange({
                          target: { name: "sale_price", value: onlyNums },
                        } as React.ChangeEvent<HTMLInputElement>);
                      }}
                      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 no-spinner ${
                        errors.sale_price ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.sale_price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.sale_price}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">خدمات إضافية</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="solar_power"
                      name="services.solar_power"
                      checked={formData.services.solar_power}
                      onChange={handleCheckboxChange}
                      className="ml-2"
                    />
                    <label htmlFor="solar_power" className="text-gray-700">
                      طاقة شمسية
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="internet"
                      name="services.internet"
                      checked={formData.services.internet}
                      onChange={handleCheckboxChange}
                      className="ml-2"
                    />
                    <label htmlFor="internet" className="text-gray-700">
                      راوتر
                    </label>
                  </div>
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
                أي ملاحظات إضافية
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
                placeholder="ميزة معينة, شي رح يتغير أو رح يتجدد, شي عاطل, ملاحظات خاصة"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
            <div className="mb-16">
              <label htmlFor="owner_phone" className="block text-gray-700 mb-1">
                رقم التواصل
              </label>
              <input
                type="tel"
                id="owner_phone"
                name="owner_phone"
                inputMode="numeric" // يعطي كيبورد أرقام على الموبايل
                placeholder="09XXXXXXXX"
                value={formData.owner_phone || ""}
                onChange={(e) => {
                  // فلترة بحيث يقبل أرقام فقط
                  const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                  handleInputChange({
                    target: { name: "owner_phone", value: onlyNums },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 no-spinner ${
                  errors.owner_phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.owner_phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.owner_phone}
                </p>
              )}
            </div>

            {/* Submit Button */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-3">
                {/* لودر دائري */}
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="h-2 w-2 bg-yellow-500 rounded-full animate-ping"></span>
                  </div>
                </div>

                {/* نقاط نابضة لزيادة الحيوية */}
                <div className="flex space-x-1 rtl:space-x-reverse">
                  <span className="h-2 w-2 bg-yellow-500 rounded-full animate-bounce"></span>
                  <span className="h-2 w-2 bg-yellow-500 rounded-full animate-bounce delay-150"></span>
                  <span className="h-2 w-2 bg-yellow-500 rounded-full animate-bounce delay-300"></span>
                </div>

                {/* تنبيه إضافي */}
                <p className="text-xs text-gray-500 mt-2 text-center">
                  ملاحظة: في حال رفع فيديو ممكن تستغرق العملية وقت أطول من
                  المعتاد
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <button
                  disabled={Number(limit) === 0}
                  type="submit"
                  className={`px-6 py-2 rounded-lg items-center justify-center 
        ${
          Number(limit) === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm transition"
        }`}
                >
                  إضافة العقار
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
export default AddApartmentPage;
