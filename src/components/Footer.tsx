import React from "react";

export default function Footer() {
  return (
    <footer className="p-6 bg-neutral-200">
      <div className="flex justify-between items-center">
        <p className="text-neutral-600">
          &copy; 2025 Connection Visualizer. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-facebook text-neutral-600 hover:text-primary-500"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-twitter text-neutral-600 hover:text-primary-500"></i>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-linkedin text-neutral-600 hover:text-primary-500"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
