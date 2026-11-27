/* 
 * Google AdSense loader for every public-benefits page.
 * After Google approves the site, replace the empty string below with the
 * publisher ID shown in the AdSense account (format: ca-pub- followed by 16 digits).
 * Auto Ads must also be enabled in the AdSense dashboard.
 */
(function () {
  "use strict";
  const publisherId = "";

  if (!/^ca-pub-\\d{16}$/.test(publisherId)) return;
  if (document.querySelector("script[data-rm-adsense]")) return;

  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.dataset.rmAdsense = "true";
  script.dataset.adClient = publisherId;
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(publisherId);
  document.head.appendChild(script);
})();