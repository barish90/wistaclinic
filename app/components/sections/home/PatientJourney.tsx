'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useGsap } from '@/app/hooks/useGsap';
import { NAVBAR_HEIGHT_PX } from '@/lib/constants';

interface PatientJourneyDict {
  home?: {
    journey?: {
      title?: string;
      subtitle?: string;
      steps?: Array<{ title: string; description: string }>;
    };
  };
}

interface PatientJourneyProps {
  dict: PatientJourneyDict;
}

/* ══════════════════════════════════════════════════════════════
   THE MORPHING JOURNEY — PATIENT JOURNEY

   Uses CSS `position: sticky` for pinning (no GSAP pin) to avoid
   the push-down issue. An outer wrapper provides scroll height,
   and ScrollTrigger drives morph + text animations via scrub.

   Shapes (derived from /public/images/svgs/, normalized to 500×500):
   1. chat.svg (main bubble) — Free Consultation
   2. paper.svg (document) — Personalized Plan
   3. plane.svg (airplane) — Travel & Arrival
   4. surgery.svg (scissors) — Your Procedure
   5. sparkle (inline) — Recovery & Follow-up
   ══════════════════════════════════════════════════════════════ */

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const panelKickers = [
  'The Conversation',
  'The Blueprint',
  'The Arrival',
  'The Transformation',
  'The Bloom',
];

const FONT = "var(--font-cormorant), 'Cormorant Garamond', serif";
const GOLD = '#B8860B';
const GOLD_LIGHT = 'rgba(184,134,11,0.25)';

/* ── All paths normalized to viewBox 0 0 500 500 with 30px padding ── */

const PATH_CHAT = "M 132.5 428.5 C 130.6 428.5 128.8 428.2 127 427.6 C 120.8 425.5 116.4 420.2 115.5 413.7 C 113.5 399.4 110.8 379.1 108.8 360.1 C 95.9 358.9 83.3 357.7 71.1 356.5 C 59.5 355.4 48.9 349.9 41.3 341 C 33.8 332.2 30 320.9 30.7 309.2 C 32 289.5 33.4 268.2 34.9 247.6 C 37 217.2 39.2 185.8 40.6 158.7 C 41.8 137.2 58.2 119.6 79.6 116.8 L 418.5 73.3 C 432.1 71.5 445.5 76 455.3 85.5 C 465.1 94.9 470 108.2 468.7 121.7 C 463.4 178.4 454.4 274.8 447.6 347.1 C 446.5 359 440.8 369.8 431.6 377.4 C 422.4 385 410.8 388.6 398.9 387.4 C 346.9 382.4 285.7 377.4 226.9 371.8 L 199.1 368.6 C 186.5 381.3 164.5 403.5 144.6 423.4 C 141.3 426.7 136.9 428.5 132.5 428.5 Z M 424.3 86.6 C 423 86.6 421.6 86.7 420.3 86.8 L 81.3 130.4 C 66.5 132.3 55.1 144.5 54.3 159.4 C 52.8 186.6 50.6 218.1 48.5 248.6 C 47.1 269.1 45.6 290.4 44.4 310.1 C 43.3 326.9 55.6 341.3 72.4 342.9 C 86.4 344.2 100.8 345.6 115.6 347 C 118.9 347.3 121.4 349.9 121.8 353.1 C 123.9 373.4 126.9 396.3 129 411.8 C 129.3 413.7 130.7 414.4 131.3 414.6 C 131.9 414.8 133.5 415.1 134.9 413.8 C 156 392.6 179.6 368.9 191.7 356.7 C 193.2 355.2 195.2 354.5 197.2 354.7 L 228.4 357.6 C 287.3 363.1 348.2 368.8 400.2 373.8 C 408.4 374.6 416.5 372.1 422.9 366.8 C 429.3 361.5 433.2 354.1 434 345.8 C 440.8 273.5 449.8 177.1 455.1 120.5 C 455.1 120.5 455.1 120.5 455.1 120.5 C 456 111 452.6 101.9 445.8 95.3 C 439.9 89.6 432.3 86.6 424.3 86.6 Z";

const PATH_PAPER = "M 405.6 86.1 L 405.6 470 L 94.4 470 L 94.4 30 L 349.4 30 L 405.6 86.1 Z M 349.4 86.1 L 405.6 86.1 L 349.4 30 L 349.4 86.1 Z";

const PATH_PLANE = "M 311 271.3 L 417.5 457.4 L 426.1 448.3 L 350.1 221.1 C 350.1 221.1 426.6 130.7 442 106.1 C 447 96.3 467.8 56.9 449.7 42.5 C 449.6 42.5 449.5 42.4 449.5 42.4 C 449.4 42.3 449.3 42.3 449.2 42.2 C 429.4 30 394.7 59.7 386.1 67 C 365.2 87.6 293.8 181.6 293.8 181.6 L 39.1 177 L 32.2 187.3 L 253.1 230.8 C 253.1 230.8 220.2 279.3 204.2 304.8 C 188.1 330.3 153.9 391.3 153.9 391.3 L 74.4 397.2 L 75.5 401.9 L 146.8 419.7 L 182.8 470 L 187.9 469.7 L 173.9 405.4 C 173.9 405.4 227 357.6 248.7 336 C 270.4 314.5 311 271.3 311 271.3 Z";

const PATH_SURGERY = "M 365.6 213 C 380.1 203.2 390.9 199.7 401.7 202.3 C 412.6 205 420.5 215.1 423.7 223.1 C 432.7 246 414.6 264.4 397.8 275.8 C 370 294.6 348.8 278.1 342.5 262.8 C 336.2 247.5 343.3 228.1 365.6 213 Z M 69.7 463.9 C 69.8 461.6 68.5 449 75.4 435 C 84.2 417.1 88.3 403.7 159.7 355.2 C 186.9 336.8 280.3 273.4 309.7 253.5 C 314.6 250.2 321.1 251.8 324.2 257.1 C 326.8 261.5 329.8 266.7 332.2 270.8 C 343.6 290.2 371.8 303.9 402.2 283.3 C 432.6 262.7 439.2 239.5 431.3 219.6 C 423.5 199.8 400 179.1 368.8 200.3 C 368.8 200.3 349.8 213.2 322.5 231.6 C 318.1 234.6 312.4 233.7 309 229.5 L 288.7 204.2 L 278 213 L 295.3 234.8 C 297.3 237.3 298.2 240.6 297.7 243.9 C 297.3 247.1 295.5 250 292.9 251.7 C 234.5 291.3 160.3 341.7 139.2 356 C 102.9 380.6 80.6 400 71.2 422 C 60.8 446 67 464.7 68.1 466.6 C 69.2 468.5 69.4 467.6 69.7 463.9 Z M 222.9 134.1 C 208.5 127.4 193.1 104.6 210.5 74.7 C 221 56.6 238 37 259.3 46.6 C 266.8 49.9 276.2 58.5 278.8 70.1 C 281.3 81.7 278.1 93.4 269.1 109 C 255.1 133.1 237.1 140.8 222.9 134.1 Z M 83.2 467.7 C 84.7 470 84.2 468 84.9 463.2 C 85.6 458.6 87.5 451.3 91.4 440.4 C 96.3 426.1 101.9 416 131.9 362.5 C 131.9 362.5 135.4 356.4 137.2 353.2 C 150.4 330.4 196.9 250.4 233.4 187.3 C 235 184.6 237.7 182.7 240.7 182.2 C 243.7 181.6 246.8 182.6 249.1 184.7 L 269.5 203.2 L 278.1 192 L 254 170 C 250.1 166.3 249.2 160.1 251.9 155.4 C 269 126 280.9 105.5 280.9 105.5 C 300.4 71.9 281 46.7 262.5 38.3 C 244 30 222.5 37.2 203.5 70 C 184.4 102.8 197.3 133 215.5 145.2 C 219.2 147.7 224.1 151 228.3 153.8 C 233.2 157.1 234.7 164 231.6 169.3 C 213.3 201 154.8 301.8 137.8 331.1 C 132.6 340.1 123.4 355.3 123.4 355.3 C 103.9 388.8 90.6 413 84.1 433.9 C 76.4 458.8 81.7 465.6 83.2 467.7 Z";

const PATH_SPARKLE = "M 250 30 C 255.4 105.1 271.5 153.4 298.3 191 C 325.1 228.5 362.7 244.6 416.3 250 C 362.7 255.4 325.1 271.5 298.3 309 C 271.5 346.6 255.4 394.9 250 470 C 244.6 394.9 228.5 346.6 201.7 309 C 174.9 271.5 137.3 255.4 83.7 250 C 137.3 244.6 174.9 228.5 201.7 191 C 228.5 153.4 244.6 105.1 250 30 Z";

const MORPH_PATHS = [PATH_CHAT, PATH_PAPER, PATH_PLANE, PATH_SURGERY, PATH_SPARKLE];

/* ── Mobile inline SVG shapes (original viewBoxes from files) ── */

function ChatShape({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 2200 1466" style={style}>
      <path d="M 1438.03 1045.97 C 1431.76 1045.97 1425.66 1043.51 1421.05 1038.89 C 1396.87 1014.69 1370.52 988.164 1351.54 969.044 L 1316.59 972.318 C 1240.86 979.413 1162.55 986.748 1095.73 993.166 C 1079.87 994.687 1064.38 989.94 1052.11 979.792 C 1039.84 969.646 1032.27 955.328 1030.78 939.475 L 1022.75 850.083 C 1022.19 844.114 1031.28 839.31 1036.1 835.747 C 1042.49 831.025 1051.47 834.151 1049.98 860.833 L 1052.4 937.453 C 1053.34 947.523 1058.15 956.616 1065.94 963.059 C 1073.74 969.505 1083.58 972.525 1093.65 971.553 C 1160.5 965.133 1238.82 957.797 1314.56 950.701 L 1354.62 946.948 C 1357.85 946.648 1361.05 947.805 1363.34 950.11 C 1382.47 969.392 1410.68 997.785 1436.41 1023.54 C 1437.1 1024.23 1437.92 1024.43 1438.85 1024.12 C 1439.77 1023.81 1440.31 1023.16 1440.44 1022.19 C 1443.2 1002.22 1447.05 972.916 1449.76 946.778 C 1450.29 941.632 1454.38 937.576 1459.53 937.09 C 1478.53 935.294 1497.11 933.533 1515.11 931.817 C 1535.54 929.865 1550.53 912.294 1549.24 891.813 C 1547.65 866.487 1545.76 839.181 1543.93 812.774 C 1541.21 773.595 1538.41 733.083 1536.5 698.119 C 1535.51 679.911 1521.65 665.011 1503.57 662.689 L 1398.73 651.346 C 1392.78 650.582 1382.29 642.903 1383.05 636.956 C 1383.82 631.01 1391.96 625.46 1397.91 626.223 L 1506.33 641.154 C 1534.81 644.809 1556.61 668.27 1558.18 696.937 C 1560.08 731.741 1562.88 772.173 1565.59 811.274 C 1567.42 837.713 1569.31 865.053 1570.91 890.45 C 1572.94 922.694 1549.33 950.357 1517.17 953.43 C 1501.96 954.881 1486.34 956.363 1470.4 957.87 C 1467.77 981.866 1464.42 1007.24 1461.95 1025.16 C 1460.69 1034.29 1454.48 1041.77 1445.76 1044.7 C 1443.21 1045.56 1440.61 1045.97 1438.03 1045.97 Z" fill="none" stroke={GOLD} strokeWidth="18" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 876.063 935.681 C 873.155 935.682 870.217 935.212 867.347 934.249 C 857.493 930.942 850.486 922.49 849.062 912.191 C 845.944 889.561 841.693 857.307 838.406 827.101 C 818.009 825.172 798.027 823.278 778.593 821.423 C 760.158 819.661 743.388 810.934 731.37 796.85 C 719.352 782.766 713.372 764.832 714.534 746.354 C 716.511 715.001 718.849 681.246 721.111 648.603 C 724.457 600.311 727.917 550.375 730.262 507.378 C 732.125 473.208 758.116 445.244 792.065 440.886 L 1330.23 371.747 C 1351.71 368.988 1372.98 376.036 1388.57 391.094 C 1404.15 406.148 1411.92 427.153 1409.9 448.72 C 1401.49 538.588 1387.16 691.634 1376.41 806.491 C 1374.64 825.387 1365.61 842.456 1350.99 854.549 C 1336.36 866.646 1317.88 872.304 1298.99 870.488 C 1216.52 862.567 1119.37 854.539 1025.9 845.785 L 981.913 840.59 C 961.806 860.851 926.829 896.059 895.237 927.684 C 890.028 932.899 883.141 935.681 876.063 935.681 Z M 1339.35 392.876 C 1337.24 392.876 1335.12 393.011 1332.99 393.284 L 794.83 462.423 C 771.271 465.447 753.234 484.851 751.942 508.562 C 749.588 551.718 746.123 601.735 742.772 650.105 C 740.513 682.715 738.176 716.436 736.204 747.719 C 734.528 774.386 754.055 797.269 780.658 799.812 C 802.881 801.932 825.824 804.106 849.284 806.323 C 854.436 806.809 858.528 810.865 859.061 816.011 C 862.411 848.324 867.168 884.535 870.57 909.224 C 870.989 912.258 873.286 913.342 874.254 913.666 C 875.222 913.99 877.709 914.513 879.877 912.341 C 913.431 878.75 950.815 841.108 970.113 821.658 C 972.399 819.353 975.599 818.188 978.833 818.496 L 1028.43 823.143 C 1121.91 831.9 1218.57 840.955 1301.07 848.877 C 1314.18 850.148 1327 846.21 1337.15 837.816 C 1347.3 829.425 1353.57 817.583 1354.79 804.469 C 1365.55 689.611 1379.88 536.566 1388.29 446.698 C 1388.29 446.698 1388.29 446.697 1388.29 446.696 C 1389.69 431.73 1384.29 417.154 1373.48 406.708 C 1364.21 397.751 1352.04 392.876 1339.35 392.876 Z" fill="none" stroke={GOLD} strokeWidth="18" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function PaperShape({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 500 500" style={style}>
      <polygon points="323.256 147.839 323.256 354.899 155.452 354.899 155.452 117.584 292.99 117.584" fill="none" stroke={GOLD} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="323.256 147.839 292.99 147.839 292.99 117.584" fill="none" stroke={GOLD} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlaneShape({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 4975 4975" style={style}>
      <path d="M 2738.23 2534.67 L 3213.96 3365.75 L 3252.54 3325.13 L 2912.75 2310.35 C 2912.75 2310.35 3254.52 1906.52 3323.14 1796.85 C 3345.57 1753.23 3438.54 1577.22 3357.55 1512.95 C 3357.25 1512.7 3356.92 1512.48 3356.62 1512.24 C 3356.29 1512.04 3355.97 1511.81 3355.64 1511.6 C 3266.97 1456.93 3112.26 1589.65 3073.74 1621.99 C 2980.35 1714.29 2661.37 2134.13 2661.37 2134.13 L 1524.19 2113.38 L 1493.27 2159.36 L 2479.91 2353.57 C 2479.91 2353.57 2332.79 2570.27 2261.19 2684.2 C 2189.6 2798.12 2036.58 3070.47 2036.58 3070.47 L 1681.85 3096.66 L 1686.8 3117.69 L 2004.99 3197.16 L 2165.71 3421.86 L 2188.7 3420.41 L 2126.23 3133.31 C 2126.23 3133.31 2363.04 2919.73 2459.98 2823.57 C 2556.91 2727.38 2738.23 2534.67 2738.23 2534.67 Z" fill="none" stroke={GOLD} strokeWidth="40" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function SurgeryShape({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 450 450" style={style}>
      <path d="M 252.186 215.236 C 256.704 212.172 260.089 211.098 263.457 211.918 C 266.845 212.744 269.331 215.896 270.32 218.404 C 273.137 225.539 267.471 231.28 262.224 234.839 C 253.57 240.708 246.946 235.578 244.967 230.777 C 243.01 226.024 245.216 219.963 252.186 215.236 Z M 159.809 293.559 C 159.862 292.852 159.448 288.921 161.6 284.54 C 164.339 278.964 165.621 274.763 187.918 259.641 C 196.394 253.892 225.568 234.105 234.727 227.895 C 236.257 226.857 238.282 227.35 239.247 228.995 C 240.066 230.389 241.022 232.019 241.758 233.274 C 245.325 239.356 254.116 243.628 263.606 237.192 C 273.096 230.756 275.153 223.519 272.703 217.316 C 270.254 211.114 262.904 204.67 253.17 211.271 C 253.17 211.271 247.236 215.296 238.74 221.058 C 237.368 221.988 235.567 221.703 234.51 220.379 L 228.186 212.481 L 224.832 215.228 L 230.245 222.056 C 230.861 222.835 231.134 223.864 230.991 224.876 C 230.847 225.887 230.301 226.781 229.497 227.326 C 211.263 239.694 188.088 255.409 181.508 259.871 C 170.193 267.547 163.228 273.623 160.277 280.468 C 157.043 287.965 158.98 293.806 159.326 294.395 C 159.667 294.982 159.721 294.715 159.809 293.559 Z" fill="none" stroke={GOLD} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 207.631 190.617 C 203.157 188.515 198.351 181.419 203.764 172.085 C 207.046 166.425 212.354 160.304 219.005 163.297 C 221.345 164.347 224.289 167.004 225.073 170.642 C 225.853 174.258 224.871 177.905 222.047 182.777 C 217.687 190.295 212.062 192.697 207.631 190.617 Z M 164.018 294.751 C 164.488 295.464 164.342 294.825 164.571 293.355 C 164.795 291.9 165.39 289.642 166.581 286.219 C 168.134 281.765 169.871 278.612 179.22 261.897 C 179.22 261.897 180.324 259.997 180.902 259.004 C 185.018 251.903 199.513 226.907 210.921 207.235 C 211.426 206.368 212.254 205.776 213.193 205.616 C 214.133 205.456 215.091 205.744 215.817 206.402 L 222.198 212.185 L 224.876 208.695 L 217.358 201.806 C 216.122 200.674 215.847 198.74 216.704 197.26 C 222.02 188.096 225.731 181.692 225.731 181.692 C 231.822 171.192 225.79 163.32 220.007 160.721 C 214.226 158.121 207.505 160.37 201.568 170.605 C 195.631 180.843 199.65 190.271 205.326 194.076 C 206.498 194.862 208.016 195.881 209.32 196.754 C 210.856 197.784 211.326 199.959 210.368 201.609 C 204.639 211.488 186.39 242.959 181.087 252.105 C 179.459 254.914 176.571 259.67 176.571 259.67 C 170.505 270.117 166.352 277.672 164.327 284.181 C 161.907 291.956 163.579 294.091 164.018 294.751 Z" fill="none" stroke={GOLD} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function SparkleShape({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 400 400" style={style}>
      <path d="M 200 60 C 205 110 215 150 230 178 C 245 206 270 220 310 225 C 340 228 360 230 370 232 C 360 234 340 236 310 239 C 270 244 245 258 230 286 C 215 314 205 354 200 404 C 195 354 185 314 170 286 C 155 258 130 244 90 239 C 60 236 40 234 30 232 C 40 230 60 228 90 225 C 130 220 155 206 170 178 C 185 150 195 110 200 60 Z" fill="none" stroke={GOLD} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 310 100 C 312 115 316 125 325 128 C 316 131 312 141 310 156 C 308 141 304 131 295 128 C 304 125 308 115 310 100 Z" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.5" />
      <path d="M 100 300 C 102 312 105 320 112 322 C 105 324 102 332 100 344 C 98 332 95 324 88 322 C 95 320 98 312 100 300 Z" fill="none" stroke={GOLD} strokeWidth="1.2" opacity="0.4" />
    </svg>
  );
}

const MOBILE_SHAPES = [ChatShape, PaperShape, PlaneShape, SurgeryShape, SparkleShape];

export default function PatientJourney({ dict }: PatientJourneyProps) {
  const { gsapReady } = useGsap();
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const morphPathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const stepsWrapperRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const steps: Array<{ title: string; description: string }> =
    dict?.home?.journey?.steps || [];

  const stepCount = steps.length;

  // Nothing to render if no steps are defined
  if (stepCount === 0) return null;

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);

  /* ══════════════════════════════════════════════════════════════
     DESKTOP: CSS sticky + ScrollTrigger scrub (NO pin)
     The outer wrapper provides scroll height. The sticky panel
     stays fixed at the top. ScrollTrigger drives animations.
     ══════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!gsapReady || typeof window === 'undefined' || isMobile !== false) return;

    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    const MorphSVGPlugin = (window as any).MorphSVGPlugin;
    if (!gsap || !ScrollTrigger) return;
    if (MorphSVGPlugin) gsap.registerPlugin(MorphSVGPlugin);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const outer = outerRef.current;
    const morphPath = morphPathRef.current;
    const glowPath = glowPathRef.current;
    const stepsWrapper = stepsWrapperRef.current;
    if (!outer || !morphPath || !stepsWrapper) return;

    if (stepCount === 0) return;

    const ctx = gsap.context(() => {
      const stepPanels = stepsWrapper.querySelectorAll('[data-step]');

      // Initial: first step visible, rest hidden
      gsap.set(stepPanels, { yPercent: 80, opacity: 0 });
      gsap.set(stepPanels[0], { yPercent: 0, opacity: 1 });

      // Morph path starts as the first shape
      gsap.set(morphPath, { attr: { d: MORPH_PATHS[0] }, opacity: 1 });
      if (glowPath) {
        gsap.set(glowPath, { attr: { d: MORPH_PATHS[0] }, opacity: 0.06 });
      }

      // ── SCRUB TIMELINE — triggered by the outer wrapper scroll ──
      const segDur = 1 / stepCount;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self: { progress: number }) => {
            if (progressFillRef.current) {
              progressFillRef.current.style.transform = `scaleY(${self.progress})`;
            }
            if (counterRef.current) {
              const activeStep = Math.min(
                Math.floor(self.progress * stepCount),
                stepCount - 1
              );
              counterRef.current.textContent = String(activeStep + 1).padStart(2, '0');
            }
          },
        },
      });

      // For each transition between steps
      for (let i = 1; i < stepCount; i++) {
        const stepStart = segDur * i;
        const transDur = segDur * 0.35;

        // ── Text: slide previous out, slide new in ──
        tl.to(stepPanels[i - 1], {
          yPercent: -50,
          opacity: 0,
          duration: transDur,
          ease: 'power2.in',
        }, stepStart - transDur * 0.4);

        tl.fromTo(stepPanels[i],
          { yPercent: 80, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: transDur, ease: 'power2.out' },
          stepStart + transDur * 0.15
        );

        // ── Shape: MORPH to next shape ──
        if (MorphSVGPlugin) {
          tl.to(morphPath, {
            morphSVG: { shape: MORPH_PATHS[i], shapeIndex: 'auto' },
            duration: transDur * 1.2,
            ease: 'power2.inOut',
          }, stepStart - transDur * 0.1);

          if (glowPath) {
            tl.to(glowPath, {
              morphSVG: { shape: MORPH_PATHS[i], shapeIndex: 'auto' },
              duration: transDur * 1.2,
              ease: 'power2.inOut',
            }, stepStart - transDur * 0.1);
          }
        }
      }

      // Glow grows over entire timeline
      if (glowPath) {
        tl.to(glowPath, {
          opacity: 0.15,
          ease: 'none',
          duration: 1,
        }, 0);
      }

      ScrollTrigger.refresh();
    }, outer);

    return () => ctx.revert();
  }, [gsapReady, isMobile, stepCount]);

  /* ══════════════════════════════════════════════════════════════
     MOBILE ANIMATIONS
     ══════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!gsapReady || typeof window === 'undefined' || isMobile !== true) return;

    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const ctx = gsap.context(() => {
      const cards = mobileRef.current?.querySelectorAll('[data-mcard]');
      if (cards) {
        cards.forEach((card: Element) => {
          gsap.from(card, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', once: true },
          });
        });
      }

      ScrollTrigger.refresh();
    }, mobileRef);

    return () => ctx.revert();
  }, [gsapReady, isMobile]);

  // Don't render until we know mobile/desktop
  if (isMobile === null) {
    return (
      <div
        style={{
          height: `${stepCount * 100}vh`,
          background: 'linear-gradient(180deg, #EDE8E1 0%, #E4DDD4 100%)',
        }}
      />
    );
  }

  /* ══════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════ */
  if (isMobile) {
    return (
      <div
        ref={mobileRef}
        style={{
          background: 'linear-gradient(180deg, #EDE8E1 0%, #E8E0D8 40%, #E4DDD4 70%, #EDE8E1 100%)',
          position: 'relative',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.025, backgroundImage: GRAIN_SVG, zIndex: 1 }}
        />

        <div className="relative z-10 pt-20 pb-8 text-center px-6">
          <p
            className="uppercase mb-4"
            style={{ fontFamily: FONT, fontSize: '10px', fontWeight: 400, color: GOLD, letterSpacing: '0.3em' }}
          >
            {dict?.home?.journey?.subtitle ?? 'From consultation to recovery'}
          </p>
          <h2
            style={{ fontFamily: FONT, fontSize: 'clamp(28px, 7vw, 42px)', fontWeight: 300, color: '#3D3830', letterSpacing: '0.03em', lineHeight: 1.15 }}
          >
            {dict?.home?.journey?.title ?? 'Your Patient Journey'}
          </h2>
          <div className="mx-auto mt-5" style={{ width: '48px', height: '1px', background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }} />
        </div>

        <div className="relative z-10 px-6 pb-16">
          {steps.map((step, i) => {
            const kicker = panelKickers[i] || '';
            const ShapeComp = MOBILE_SHAPES[i] || SparkleShape;
            return (
              <div
                key={i}
                data-mcard
                className="relative mb-8"
                style={{ padding: '28px 24px', borderRadius: '4px', background: 'rgba(250,247,242,0.4)', border: '1px solid rgba(184,134,11,0.06)' }}
              >
                <div className="flex justify-center mb-5">
                  <ShapeComp style={{ width: '100px', height: '100px', filter: `drop-shadow(0 0 8px rgba(184,134,11,0.12))` }} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: GOLD, letterSpacing: '0.1em' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="uppercase" style={{ fontFamily: FONT, fontSize: '10px', fontWeight: 400, color: 'rgba(184,134,11,0.6)', letterSpacing: '0.25em' }}>{kicker}</span>
                </div>
                <h3 className="mb-2" style={{ fontFamily: FONT, fontSize: 'clamp(22px, 5.5vw, 30px)', fontWeight: 300, color: '#3D3830', lineHeight: 1.2, letterSpacing: '0.02em' }}>{step.title}</h3>
                <div className="mb-3" style={{ width: '28px', height: '1px', background: GOLD, opacity: 0.3 }} />
                <p style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 300, color: 'rgba(61,56,48,0.5)', lineHeight: 1.75 }}>{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ═══ DESKTOP ═══
     Outer wrapper: tall div providing scroll distance.
     Inner sticky: 100vh panel that sticks to top as user scrolls.
     ScrollTrigger tracks the outer wrapper and drives animations. */
  return (
    <div
      ref={outerRef}
      style={{
        height: `${stepCount * 100}vh`,
        position: 'relative',
        background: 'linear-gradient(180deg, #EDE8E1 0%, #E8E0D8 40%, #E4DDD4 70%, #EDE8E1 100%)',
      }}
    >
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          paddingTop: `${NAVBAR_HEIGHT_PX}px`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Grain */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.025, backgroundImage: GRAIN_SVG, zIndex: 1 }}
        />

        {/* Corner brackets */}
        <div className="absolute top-8 left-8 lg:left-16 w-10 h-10 lg:w-12 lg:h-12 z-10" style={{ borderTop: `1px solid ${GOLD_LIGHT}`, borderLeft: `1px solid ${GOLD_LIGHT}` }} />
        <div className="absolute top-8 right-8 lg:right-16 w-10 h-10 lg:w-12 lg:h-12 z-10" style={{ borderTop: `1px solid ${GOLD_LIGHT}`, borderRight: `1px solid ${GOLD_LIGHT}` }} />
        <div className="absolute bottom-8 left-8 lg:left-16 w-10 h-10 lg:w-12 lg:h-12 z-10" style={{ borderBottom: `1px solid ${GOLD_LIGHT}`, borderLeft: `1px solid ${GOLD_LIGHT}` }} />
        <div className="absolute bottom-8 right-8 lg:right-16 w-10 h-10 lg:w-12 lg:h-12 z-10" style={{ borderBottom: `1px solid ${GOLD_LIGHT}`, borderRight: `1px solid ${GOLD_LIGHT}` }} />

        {/* ── TITLE ── */}
        <div
          className="relative z-20 text-center"
          style={{ paddingTop: 'clamp(16px, 2vh, 32px)' }}
        >
          <p
            className="uppercase mb-3"
            style={{ fontFamily: FONT, fontSize: 'clamp(10px, 1vw, 12px)', fontWeight: 400, color: GOLD, letterSpacing: '0.35em' }}
          >
            {dict?.home?.journey?.subtitle ?? 'From consultation to recovery'}
          </p>
          <h2
            style={{ fontFamily: FONT, fontSize: 'clamp(30px, 4vw, 56px)', fontWeight: 300, color: '#3D3830', letterSpacing: '0.04em', lineHeight: 1.1 }}
          >
            {dict?.home?.journey?.title ?? 'Your Patient Journey'}
          </h2>
          <div
            className="mx-auto mt-4"
            style={{ width: '56px', height: '1px', background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }}
          />
        </div>

        {/* ── CONTENT: morph SVG left, text right ── */}
        <div
          className="relative z-10"
          style={{ display: 'flex', flex: 1, minHeight: 0, maxWidth: '1360px', margin: '0 auto', padding: '0 clamp(24px, 3vw, 48px)' }}
        >
          {/* LEFT: Morphing SVG */}
          <div
            style={{ flex: '0 0 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
          >
            <svg
              viewBox="0 0 500 500"
              style={{ width: 'clamp(220px, 24vw, 340px)', height: 'clamp(220px, 24vw, 340px)', overflow: 'visible' }}
            >
              <path
                ref={glowPathRef}
                d={MORPH_PATHS[0]}
                fill="none"
                stroke={GOLD}
                strokeWidth="6"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ filter: 'blur(12px)', opacity: 0.06 }}
              />
              <path
                ref={morphPathRef}
                d={MORPH_PATHS[0]}
                fill="none"
                stroke={GOLD}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ opacity: 1 }}
              />
            </svg>

            {/* Step counter */}
            <div
              className="absolute pointer-events-none"
              style={{ bottom: 'clamp(28px, 5vh, 64px)', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <span
                ref={counterRef}
                style={{ fontFamily: FONT, fontSize: '26px', fontWeight: 300, color: GOLD, letterSpacing: '0.05em', lineHeight: 1 }}
              >
                01
              </span>
              <span style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 300, color: 'rgba(184,134,11,0.35)' }}>
                / {String(steps.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Divider with progress */}
          <div
            className="relative"
            style={{ width: '1px', background: 'rgba(184,134,11,0.08)', marginTop: '15vh', marginBottom: 'clamp(40px, 6vh, 72px)' }}
          >
            <div
              ref={progressFillRef}
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: `linear-gradient(to bottom, ${GOLD}, rgba(184,134,11,0.3))`,
                transformOrigin: 'top', transform: 'scaleY(0)',
              }}
            />
          </div>

          {/* RIGHT: Stacked text panels */}
          <div
            style={{ flex: '1 1 50%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 'clamp(32px, 4vw, 72px)', overflow: 'hidden' }}
          >
            <div
              ref={stepsWrapperRef}
              className="relative"
              style={{ width: '100%', maxWidth: '480px' }}
            >
              {steps.map((step, i) => {
                const kicker = panelKickers[i] || '';
                return (
                  <div
                    key={i}
                    data-step
                    style={{ position: i === 0 ? 'relative' : 'absolute', top: 0, left: 0, width: '100%' }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 600, color: GOLD, letterSpacing: '0.1em' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div style={{ width: '20px', height: '1px', background: 'rgba(184,134,11,0.3)' }} />
                      <span className="uppercase" style={{ fontFamily: FONT, fontSize: '11px', fontWeight: 400, color: GOLD, letterSpacing: '0.3em', opacity: 0.7 }}>
                        {kicker}
                      </span>
                    </div>
                    <h3
                      className="mb-5"
                      style={{ fontFamily: FONT, fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 300, color: '#3D3830', lineHeight: 1.2, letterSpacing: '0.02em' }}
                    >
                      {step.title}
                    </h3>
                    <div className="mb-5" style={{ width: '40px', height: '1px', background: `linear-gradient(to right, ${GOLD}, transparent)` }} />
                    <p
                      style={{ fontFamily: FONT, fontSize: 'clamp(15px, 1.3vw, 18px)', fontWeight: 300, color: 'rgba(61,56,48,0.55)', lineHeight: 1.85 }}
                    >
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
