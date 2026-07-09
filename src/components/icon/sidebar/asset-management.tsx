import type { SVGProps } from "react";

const AssetManagementIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4 8.5C4 6.61438 4 5.67157 4.58579 5.08579C5.17157 4.5 6.11438 4.5 8 4.5H16C17.8856 4.5 18.8284 4.5 19.4142 5.08579C20 5.67157 20 6.61438 20 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M3 12C3 10.5949 3 9.89237 3.34673 9.39421C3.47607 9.20762 3.63633 9.04406 3.82048 8.90993C4.31063 8.5 5.00596 8.5 6.39662 8.5H17.6034C18.994 8.5 19.6894 8.5 20.1795 8.90993C20.3637 9.04406 20.5239 9.20762 20.6533 9.39421C21 9.89237 21 10.5949 21 12C21 12 21 15.5 21 17C21 18.8856 21 19.8284 20.4142 20.4142C19.8284 21 18.8856 21 17 21H7C5.11438 21 4.17157 21 3.58579 20.4142C3 19.8284 3 18.8856 3 17C3 15.5 3 12 3 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 12.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export default AssetManagementIcon;
