import React from "react";

import { HashLink } from "react-router-hash-link";

function Footer() {
  return (
    <div>
      <footer class="bg-yellow-500 body-font mt-5">
        <div class="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <div class="flex title-font font-medium items-center md:justify-start justify-center text-white">
            <span class="ml-3 text-xl">Courierdo</span>
          </div>
          <p class="text-sm text-white sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-white sm:py-2 sm:mt-0 mt-4">
            © 2021 courierdo -
            <a
              href={`mailto:info@courierdo.com?subject=&body=`}
              class="text-white ml-1 underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              info@courierdo.com
            </a>
          </p>

          <HashLink
            to="/myorders"
            class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start"
          >
            <p className="flex items-center text-white text-lg text-center border-2 border-white py-1 px-3">
              My Orders
            </p>
          </HashLink>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
