import React from "react";

import delivery_icon from "../icons/delivery_icon.png";

function ShowLogo() {
  return (
    <div>
      <h2 class="text-center title-font text-6xl font-medium text-black mb-6">
        Courier<span style={{ color: "orange" }}>do</span>
      </h2>

      <div className="flex justify-center">
        <img alt="*" src={delivery_icon} />
      </div>

      <div className="flex justify-center">
        <p className="text-xs text-gray-500 p-2 underline">Privacy Policy</p>
        <p className="text-xs text-gray-500 p-2 underline">Terms & Condition</p>
      </div>
    </div>
  );
}

export default ShowLogo;
