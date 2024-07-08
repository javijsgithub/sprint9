import React from 'react';
import { Helmet } from 'react-helmet';
import '../styles/iubenda.css';

const Iubenda = () => {
    
  return (
    <div className='container-privacy-cookies'>
     <Helmet>
        <script type="text/javascript">
          {`(function (w,d) {
            var loader = function () {
              var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0];
              s.src="https://cdn.iubenda.com/iubenda.js";
              tag.parentNode.insertBefore(s,tag);
            };
            if(w.addEventListener){
              w.addEventListener("load", loader, false);
            } else if(w.attachEvent){
              w.attachEvent("onload", loader);
            } else {
              w.onload = loader;
            }
          })(window, document);`}
        </script>
        <script type="text/javascript">
          {`var _iub = _iub || [];
          _iub.csConfiguration = {
            "askConsentAtCookiePolicyUpdate": true,
            "floatingPreferencesButtonDisplay": "bottom-right",
            "lang": "es",
            "perPurposeConsent": true,
            "siteId": 3695855,
            "whitelabel": false,
            "cookiePolicyId": 77389228,
            "banner": {
              "acceptButtonDisplay": true,
              "closeButtonDisplay": false,
              "customizeButtonDisplay": true,
              "listPurposes": true,
              "position": "bottom",
              "rejectButtonDisplay": true,
              "showTitle": false
            }
          };`}
        </script>
        <script type="text/javascript" src="https://cs.iubenda.com/autoblocking/3695855.js"></script>
        <script type="text/javascript" src="//cdn.iubenda.com/cs/iubenda_cs.js" charset="UTF-8" async></script>
      </Helmet>
    
      <a
        href="https://www.iubenda.com/privacy-policy/77389228"
        className="iubenda-black iubenda-noiframe iubenda-embed iubenda-noiframe"
        title="Política de Privacidad"
        id="privacy"
      >
        Política de Privacidad
      </a>

      <a
        href="https://www.iubenda.com/privacy-policy/77389228/cookie-policy"
        className="iubenda-black iubenda-noiframe iubenda-embed iubenda-noiframe"
        title="Política de Cookies"
        id="cookies"
      >
        Política de Cookies
      </a>
    </div>
  );
};

export default Iubenda;
