import React from "react";

function NavBar() {
  return (
    <header class="text-white body-font bg-yellow-500">
      <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span class="ml-3 text-sm">Delhi / NCR</span>

        <nav class="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center"></nav>
        <a
          href={`mailto:info@courierdo.com?subject=&body=`}
          rel="noopener noreferrer"
          target="_blank"
          class="hover:bg-gray-50 rounded"
        >
          <button class="text-black inline-flex items-center bg-white border-0 py-1 px-3 focus:outline-none hover:bg-gray-50 rounded text-base mt-4 md:mt-0">
            Contact Us
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              class="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </a>
      </div>
    </header>
  );
}

export default NavBar;
