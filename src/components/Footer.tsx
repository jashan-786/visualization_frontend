import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="p-4 sm:p-6 bg-neutral-200">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <p className="text-neutral-600 text-center sm:text-left text-sm sm:text-base">
         &copy; { t("2025 Connection Visualizer. All rights reserved.")}
        </p>
        <div className="flex gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-facebook text-2xl sm:text-xl text-neutral-600 hover:text-primary-500"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-twitter text-2xl sm:text-xl text-neutral-600 hover:text-primary-500"></i>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-linkedin text-2xl sm:text-xl text-neutral-600 hover:text-primary-500"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
