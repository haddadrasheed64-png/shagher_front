import React from "react";
import { useState } from "react";
const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // إخفاء رسالة النسخ بعد 1.5 ثانية
    });
  };
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          {/* العنوان */}
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-bold text-yellow-600">شاغر</h2>
          </div>

          {/* خيارات التواصل */}
          <div className="flex flex-col items-center md:items-end gap-3">
            {/* واتساب */}
            <div className="flex items-center gap-2 text-gray-600 hover:text-green-600">
              <a
                href="https://wa.me/963939551436"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.34 0 11.93c0 2.1.55 4.16 1.59 5.98L0 24l6.27-1.64c1.73.95 3.67 1.45 5.73 1.45 6.63 0 12-5.34 12-11.93C24 5.34 18.63 0 12 0zm0 21.54c-1.72 0-3.39-.45-4.86-1.29l-.35-.2-3.72.97.99-3.62-.23-.37C3.19 15.6 2.63 13.8 2.63 11.93c0-5.17 4.23-9.37 9.37-9.37s9.37 4.2 9.37 9.37-4.23 9.37-9.37 9.37zm5.11-7.05c-.28-.14-1.65-.81-1.91-.9-.26-.1-.45-.14-.64.14-.19.27-.73.9-.9 1.08-.17.18-.35.2-.64.07-.28-.14-1.19-.44-2.26-1.4-.83-.74-1.39-1.65-1.56-1.93-.16-.27-.02-.42.12-.55.12-.12.28-.3.42-.45.14-.15.18-.25.27-.43.09-.18.05-.34-.02-.48-.07-.14-.64-1.53-.88-2.1-.23-.55-.46-.47-.64-.48h-.55c-.18 0-.48.07-.73.34s-.96.94-.96 2.3.99 2.67 1.13 2.85c.14.18 1.96 3.1 4.75 4.35.66.29 1.17.46 1.57.59.66.21 1.26.18 1.73.11.53-.08 1.65-.68 1.89-1.34.23-.67.23-1.25.16-1.34-.07-.09-.25-.14-.52-.27z" />
                </svg>
                <span>واتس أب : 0939551436</span>
              </a>
              <button
                onClick={() => copyToClipboard("0939551436")}
                className="text-yellow-600 hover:text-yellow-600 mr-4 text-xs border border-yellow-600 p-1 px-3 rounded-md"
                title="نسخ الرقم"
              >
                نسخ
              </button>
            </div>

            {/* رسالة نجاح النسخ */}
            {copied && (
              <span className="text-green-600 text-sm"> تم نسخ الرقم</span>
            )}
          </div>

          {/* الحقوق */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-center">
              جميع الحقوق محفوظة &copy; {new Date().getFullYear()} - شاغر
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
