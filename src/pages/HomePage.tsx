import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetch_apartments } from "../store/apartmentsSlice";
import ApartmentCard from "../components/ApartmentCard";
import SearchFilters from "../components/SearchFilters";
import { BuildingIcon } from "lucide-react";
import { get_user } from "../store/user_slice";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { cleaning_error } from "../store/apartmentsSlice";

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredItems, loading, error } = useSelector(
    (state: RootState) => state.apartments
  );
  const [open, set_open] = useState(true);
  const { email, phone_number } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (filteredItems && filteredItems.length == 0) {
      dispatch(fetch_apartments());
    }
    dispatch(get_user({ email: email, phone_number: phone_number }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      set_open(true);
    }
    if (!error) {
      set_open(false);
    }
  }, [error]);
  useEffect(() => {
    dispatch(cleaning_error());
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchFilters />
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">جاري التحميل...</p>
        </div>
      )}

      {!loading && filteredItems?.length === 0 && (
        <div className="text-center py-20">
          <BuildingIcon className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-2 text-xl font-medium text-gray-900">
            لا توجد شقق متطابقة مع البحث
          </h3>
          <p className="mt-1 text-gray-500">
            حاول تغيير معايير البحث أو إزالة بعض الفلاتر
          </p>
        </div>
      )}
      {Array.isArray(filteredItems) && filteredItems.length > 0 && (
        <>
          <p className="text-gray-600 mb-4">
            تم العثور على {filteredItems.length} شقة
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((apartment) => (
              <ApartmentCard key={apartment?._id} apartment={apartment} />
            ))}
          </div>
        </>
      )}
      {error && (
        <Dialog.Root
          open={open}
          onOpenChange={() => {
            set_open(!open);
          }}
        >
          <Dialog.Portal>
            {/* خلفية */}
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />

            {/* المودال */}
            <Dialog.Content className="fixed top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-lg focus:outline-none">
              <div dir="rtl" className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-semibold text-red-600">
                  خطأ
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </Dialog.Close>
              </div>
              <Dialog.Description dir="rtl" className="text-gray-700 mb-6">
                {error}
              </Dialog.Description>

              <Dialog.Close asChild>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors w-full">
                  إغلاق
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
};
export default HomePage;
