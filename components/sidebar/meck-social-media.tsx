import Image from "next/image";
import * as React from "react";

export const MecklenburgLogo = () => (
    <Image
        src="/opendata-viewer/logo/mecklenburg-county-logo.png"
        alt="Mecklenburg County Logo"
        width={48}
        height={48}
    />
);

export const MecklenburgGISLogo = () => (
    <Image
        src="/opendata-viewer/logo/mecklenburg-gis-logo.png"
        alt="Mecklenburg County GIS Logo"
        width={48}
        height={48}
    />
);

export const FacebookSVG = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        className="svg-inline--fa fa-facebook-f meckco-fa-icon fa-lg meckco-circle-icon"
        aria-labelledby="svg-inline--fa-title-1bOISgprUOoI"
        data-prefix="fab"
        data-icon="facebook-f"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
        data-fa-i2svg=""
        {...props}
    >
        <title id="svg-inline--fa-title-1bOISgprUOoI">{"Facebook"}</title>
        <path
            fill="currentColor"
            d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"
        />
    </svg>
);


export const XTwitterSVG = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        className="svg-inline--fa fa-x-twitter meckco-fa-icon fa-lg meckco-circle-icon"
        aria-labelledby="svg-inline--fa-title-ARONCS9PzbSp"
        data-prefix="fab"
        data-icon="x-twitter"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        data-fa-i2svg=""
        {...props}
    >
        <title id="svg-inline--fa-title-ARONCS9PzbSp">{"Twitter - X"}</title>
        <path
            fill="currentColor"
            d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
        />
    </svg>
);

export const YouTubeSVG = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        className="svg-inline--fa fa-youtube meckco-fa-icon fa-lg meckco-circle-icon"
        aria-labelledby="svg-inline--fa-title-VvuBEy65fO3P"
        data-prefix="fab"
        data-icon="youtube"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        data-fa-i2svg=""
        {...props}
    >
        <title id="svg-inline--fa-title-VvuBEy65fO3P">{"YouTube"}</title>
        <path
            fill="currentColor"
            d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
        />
    </svg>
);

export const LinkedInSVG = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        className="svg-inline--fa fa-linkedin-in meckco-fa-icon fa-lg meckco-circle-icon"
        aria-labelledby="svg-inline--fa-title-WjX5sE3CIcTe"
        data-prefix="fab"
        data-icon="linkedin-in"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        data-fa-i2svg=""
        {...props}
    >
        <title id="svg-inline--fa-title-WjX5sE3CIcTe">{"LinkedIn"}</title>
        <path
            fill="currentColor"
            d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
        />
    </svg>
);

export const InstagramSVG = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        className="svg-inline--fa fa-instagram meckco-fa-icon fa-lg meckco-circle-icon"
        aria-labelledby="svg-inline--fa-title-PGCp7gdsjzfz"
        data-prefix="fab"
        data-icon="instagram"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        data-fa-i2svg=""
        {...props}
    >
        <title id="svg-inline--fa-title-PGCp7gdsjzfz">{"Instagram"}</title>
        <path
            fill="currentColor"
            d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
        />
    </svg>
);
