import { siteConfig } from "../../config/siteConfig";

export default function Footer() {
  return (
    <footer
      className="w-full z-50 shadow-md text-white bg-(--brand-primary)"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 py-4">

        <div className="flex flex-col gap-2">
          <p className="font-bold">
            {siteConfig.webName}
          </p>
          <p className="font-bold">
            © 2025 - {new Date().getFullYear()} {siteConfig.webName}
          </p>
          <p className="text-sm">
            This website belongs to {siteConfig.webName},<br />
            developed by Mr. Qui.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-bold">
            Address
          </p>
          <address className="not-italic text-sm">
            Thoai Ngoc Hau Street, Phu Thanh Ward,<br />
            Ho Chi Minh City
          </address>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-bold">
            Contact:
          </p>
          <p className="text-sm">
            0938259213 (Mr. Qui)
          </p>
        </div>
      </div>
    </footer>
  );
};
