// /js/buja-translator.js
// Centralized translation system for BUJA Branding Agency
// Usage:
//  - BujaTranslator.setLanguage('en'|'sw')
//  - BujaTranslator.getLanguage()
//  - BujaTranslator.t('key')
//  - BujaTranslator.translate() // apply to DOM elements with data-i18n
//  - BujaTranslator.markTextNodes() // (optional) try to tag exact English text nodes with data-i18n using dictionary

(function(window, document){
  const STORAGE_KEY = 'buja_language';
  const DEFAULT_LANG = 'en';

  // Translation dictionary: key -> { en: '', sw: '' }
  // Add or change entries here. This initial set covers index.html visible strings.
  const translations = {
    "meta.title": { "en": "BUJA Branding Agency | We Build Brands That Stand Out With Purpose", "sw": "BUJA Branding Agency | Tunaunda Brand Zinazojitokeza Kwa Kusudi" },
    "meta.description": { "en": "BUJA Branding Agency helps businesses build strategic, memorable and professional brands that stand out with purpose.", "sw": "BUJA Branding Agency inasaidia biashara kujenga brand za kimkakati, zinazokumbukwa na za kitaalamu zinazoonekana kwa kusudi." },

    "nav.home": { "en": "Home", "sw": "Nyumbani" },
    "nav.about": { "en": "About", "sw": "Kuhusu" },
    "nav.services": { "en": "Services", "sw": "Huduma" },
    "nav.portfolio": { "en": "Portfolio", "sw": "Kazi Zetu" },
    "nav.process": { "en": "Process", "sw": "Mchakato" },
    "nav.contact": { "en": "Contact", "sw": "Wasiliana" },
    "nav.book": { "en": "Book a Consultation", "sw": "Weka Miadi ya Ushauri" },

    "hero.eyebrow": { "en": "Moshi, Kilimanjaro, Tanzania", "sw": "Moshi, Kilimanjaro, Tanzania" },
    "hero.title": { "en": "We Build Brands That Stands Out With Purpose.", "sw": "Tunajenga brand zinazojitokeza kwa kusudi." },
    "hero.description": { "en": "BUJA Branding Agency helps businesses build strategic, memorable and professional brands through strategy, visual identity, digital branding and content systems that build trust and drive growth.", "sw": "BUJA Branding Agency inasaidia biashara kujenga brand za kimkakati, za kukumbukwa na za kitaalamu kupitia mikakati, utambulisho wa kuona, uuzaji wa dijitali na mifumo ya maudhui inayojenga uaminifu na kukuza biashara." },
    "hero.book": { "en": "Book a Consultation", "sw": "Weka Miadi ya Ushauri" },
    "hero.explore": { "en": "Explore Services", "sw": "Chunguza Huduma" },

    "trusted.title": { "en": "Trusted By", "sw": "Wamekubali" },

    "marquee.brandStrategy": { "en": "Brand Strategy", "sw": "Mikakati ya Brand" },
    "marquee.socialMedia": { "en": "Social Media", "sw": "Mitandao ya Kijamii" },
    "marquee.tourPlatforms": { "en": "Tour Platforms", "sw": "Majukwaa ya Utalii" },
    "marquee.contentCreation": { "en": "Content Creation", "sw": "Uundaji wa Maudhui" },
    "marquee.digitalBranding": { "en": "Digital Branding", "sw": "Uuzaji wa Dijitali" },
    "marquee.moshi": { "en": "Moshi Tanzania", "sw": "Moshi, Tanzania" },

    "about.eyebrow": { "en": "About BUJA", "sw": "Kuhusu BUJA" },
    "about.title": { "en": "Strategic Branding for Businesses Ready to Stand Out", "sw": "Mikakati ya Brand kwa Biashara Zinazotaka Kujitokeza" },
    "about.p1": { "en": "BUJA Branding Agency helps businesses build strong brands, stand out in competitive markets, and communicate clearly with the customers who matter most.", "sw": "BUJA Branding Agency inasaidia biashara kujenga brand imara, kujitokeza katika masoko yenye ushindani, na kuwasiliana wazi na wateja muhimu." },
    "about.tag.build": { "en": "Build Strong Brands", "sw": "Jenga Brand Imara" },
    "about.tag.communication": { "en": "Clear Communication", "sw": "Mawasiliano Wazi" },
    "about.tag.identity": { "en": "Professional Identity", "sw": "Utambulisho wa Kitaalamu" },
    "about.tag.trust": { "en": "Customer Trust", "sw": "Uaminifu wa Wateja" },
    "about.tag.growth": { "en": "Digital Growth", "sw": "Ukuaji wa Dijitali" },
    "about.tag.consistency": { "en": "Platform Consistency", "sw": "Ulinganifu wa Majukwaa" },

    "services.eyebrow": { "en": "Social Media Services", "sw": "Huduma za Mitandao ya Kijamii" },
    "services.title": { "en": "Dominate Every Social Platform", "sw": "Tawala Kila Jukwaa la Kijamii" },
    "services.p": { "en": "Your audience is scrolling right now. Make sure they find your brand.", "sw": "Hadhira yako inatazama sasa hivi. Hakikisha wanakutana na brand yako." },

    "service.instagram.title": { "en": "Instagram", "sw": "Instagram" },
    "service.instagram.p": { "en": "Visual brand growth through scroll-stopping content, profile optimization, and proven growth strategies that turn Instagram into a revenue machine.", "sw": "Ukuaji wa brand kupitia maudhui yanayotawaza, uboreshaji wa profaili, na mikakati ya ukuaji iliyothibitishwa inayofanya Instagram kuwa chanzo cha mapato." },

    "service.facebook.title": { "en": "Facebook", "sw": "Facebook" },
    "service.facebook.p": { "en": "Community building, ad management, and advanced targeting to grow your audience and drive measurable business results on the world's largest network.", "sw": "Ujenzi wa jamii, usimamizi wa matangazo, na kulenga kwa ufanisi kukuza hadhira yako na kuleta matokeo ya biashara yanayopimika." },

    "service.linkedin.title": { "en": "LinkedIn", "sw": "LinkedIn" },
    "service.linkedin.p": { "en": "Professional network that builds B2B credibility and connects you with high-value decision-makers.", "sw": "Mtandao wa kitaalamu unaojenga uhalali wa B2B na kukuunganisha na waliobeba maamuzi wa thamani." },

    "service.tiktok.title": { "en": "TikTok", "sw": "TikTok" },
    "service.tiktok.p": { "en": "Trend-savvy, authentic content that captures attention in seconds and drives massive brand awareness.", "sw": "Maudhui yenye mtazamo wa mitindo, ya kweli yanayovutia umakini kwa sekunde na kuleta ufahamu mkubwa wa brand." },

    "service.youtube.title": { "en": "YouTube", "sw": "YouTube" },
    "service.youtube.p": { "en": "Long-form brand storytelling that drives organic traffic for years after publication.", "sw": "Ushairi wa hadithi za brand kwa muundo mrefu unaochangia trafiki ya kiasili kwa miaka baada ya kuchapishwa." },

    "service.x.title": { "en": "X (Twitter)", "sw": "X (Twitter)" },
    "service.x.p": { "en": "Real-time conversations shape brand perception.", "sw": "Mazungumzo ya wakati-halisi yanaunda mtazamo wa brand." },

    "tours.eyebrow": { "en": "Tour Platform Services", "sw": "Huduma za Majukwaa ya Utalii" },
    "tours.title": { "en": "Get Found by Travelers Worldwide", "sw": "Patikana kwa Wasafiri Duniani" },
    "tours.p": { "en": "Millions of travelers search for experiences every day. BUJA ensures your tours and safaris appear at the top of the world's most popular travel platforms.", "sw": "Mamilioni ya wasafiri wanautafuta uzoefu kila siku. BUJA inahakikisha safari zako zinaonekana juu kwenye majukwaa maarufu ya utalii duniani." },

    "tour.tripadvisor": { "en": "TripAdvisor", "sw": "TripAdvisor" },
    "tour.viator": { "en": "Viator", "sw": "Viator" },
    "tour.tourradar": { "en": "TourRadar", "sw": "TourRadar" },
    "tour.safaribookings": { "en": "SafariBookings", "sw": "SafariBookings" },
    "tour.wetravel": { "en": "WeTravel", "sw": "WeTravel" },
    "tour.booking": { "en": "Booking.com", "sw": "Booking.com" },
    "tour.airbnb": { "en": "Airbnb", "sw": "Airbnb" },
    "tour.getyourguide": { "en": "GetYourGuide Supply", "sw": "GetYourGuide Supply" },

    "portfolio.eyebrow": { "en": "Our Work", "sw": "Kazi Zetu" },
    "portfolio.title": { "en": "Brands We've Built & Managed", "sw": "Brand Zilizojengwa na Kusimamiwa Na Sisi" },
    "portfolio.p": { "en": "Real businesses, real results. These are the brands we partner with across Kilimanjaro and East Africa.", "sw": "Biashara halisi, matokeo halisi. Hizi ndizo brand tunazoendesha ushirikiano nazo Kilimanjaro na Afrika Mashariki." },
    "portfolio.visit": { "en": "Visit Website", "sw": "Tembelea Tovuti" },

    "engagement.eyebrow": { "en": "How We Work With You", "sw": "Jinsi Tunavyofanya Kazi Nanyi" },
    "engagement.title": { "en": "Continuous Brand Growth, Managed for You", "sw": "Ukuaji Endelevu wa Brand, Ukisimamiwa Kwako" },
    "engagement.p": { "en": "Great brands aren't built overnight. They're nurtured consistently.", "sw": "Brand nzuri hazijengi kwa usiku mmoja. Zinaleaida kwa uthabiti." },

    "sub.focused": { "en": "Focused", "sw": "Iliyolengwa" },
    "sub.growth": { "en": "Growth", "sw": "Ukuaji" },
    "sub.fullService": { "en": "Full-Service", "sw": "Huduma Kamili" },

    "process.eyebrow": { "en": "Process", "sw": "Mchakato" },
    "process.title": { "en": "How It Works", "sw": "Jinsi Inavyofanya Kazi" },
    "process.step1.title": { "en": "Choose a Service", "sw": "Chagua Huduma" },
    "process.step1.p": { "en": "Browse our social media and tour platform services. Pick the platforms that matter most to your business.", "sw": "Angalia huduma zetu za mitandao ya kijamii na majukwaa ya utalii. Chagua majukwaa yanayofaa zaidi kwa biashara yako." },
    "process.step2.title": { "en": "Book a Consultation", "sw": "Weka Miadi ya Ushauri" },
    "process.step2.p": { "en": "Contact us via WhatsApp for a free brand consultation.", "sw": "Wasiliana nasi kupitia WhatsApp kwa ushauri wa bure kuhusu brand." },
    "process.step3.title": { "en": "Complete Payment", "sw": "Kamilisha Malipo" },
    "process.step3.p": { "en": "Pay securely via mobile money (M-Pesa, Tigo, Airtel) or CRDB bank transfer.", "sw": "Lipa kwa usalama kupitia simu za pesa (M-Pesa, Tigo, Airtel) au uhamisho wa benki CRDB." },
    "process.step4.title": { "en": "We Launch Your Brand", "sw": "Tunazindua Brand Yako" },
    "process.step4.p": { "en": "BUJA becomes your brand partner. We set up, optimize, and manage everything so you can focus on your business.", "sw": "BUJA inakuwa mshirika wako wa brand. Tunakusanya, kuboresha, na kusimamia kila kitu ili wewe uweze kuzingatia biashara yako." },

    "cta.title": { "en": "Ready to Build a Brand That Stands Out?", "sw": "Uko Tayari Kuunda Brand Inayotofautisha?" },
    "cta.p": { "en": "Let's discuss your goals and recommend the best branding solution for your business. Free consultation, no commitment.", "sw": "Tujadili malengo yako na kupendekeza suluhisho bora la brand kwa biashara yako. Ushauri wa bure, hakuna ahadi." },
    "cta.button": { "en": "Book a Free Consultation", "sw": "Weka Miadi ya Ushauri wa Bure" },

    "contact.eyebrow": { "en": "Get in Touch", "sw": "Wasiliana Nasi" },
    "contact.title": { "en": "Let's Build Your Brand Together", "sw": "Tujenge Brand Yako Pamoja" },
    "contact.p": { "en": "Ready to transform your digital presence? Reach out directly or fill in the form and we'll get back to you via WhatsApp.", "sw": "Tayari kubadilisha uwepo wako dijitali? Wasiliana nasi moja kwa moja au jaza fomu na tutakurudishia kupitia WhatsApp." },

    "form.label.firstName": { "en": "First Name", "sw": "Jina la Kwanza" },
    "form.label.lastName": { "en": "Last Name", "sw": "Jina la Mwisho" },
    "form.label.email": { "en": "Email Address", "sw": "Barua Pepe" },
    "form.label.phone": { "en": "WhatsApp / Phone", "sw": "WhatsApp / Simu" },
    "form.label.service": { "en": "Service Interested In", "sw": "Huduma Unayopendelea" },
    "form.label.message": { "en": "Message", "sw": "Ujumbe" },

    "form.placeholder.firstName": { "en": "John", "sw": "Jina" },
    "form.placeholder.lastName": { "en": "Doe", "sw": "Jina la Mwisho" },
    "form.placeholder.email": { "en": "john@example.com", "sw": "barua@mfano.com" },
    "form.placeholder.phone": { "en": "+255 7XX XXX XXX", "sw": "+255 7XX XXX XXX" },
    "form.placeholder.message": { "en": "Tell us about your business and what you're looking to achieve...", "sw": "Tuambie kuhusu biashara yako na unachotaka kufanikisha..." },
    "form.option.selectService": { "en": "Select a service...", "sw": "Chagua huduma..." },
    "form.option.notSure": { "en": "Not Sure, Need Advice", "sw": "Sijui, Nahitaji Ushauri" },
    "form.submit": { "en": "Send via WhatsApp", "sw": "Tuma kupitia WhatsApp" },

    "footer.brand.p1": { "en": "We Build Brands That Stands Out With Purpose.", "sw": "Tunajenga brand zinazojitokeza kwa kusudi." },
    "footer.location": { "en": "Moshi, Kilimanjaro, Tanzania", "sw": "Moshi, Kilimanjaro, Tanzania" },
    "footer.services": { "en": "Social Media Management", "sw": "Usimamizi wa Mitandao ya Kijamii" },
    "footer.tours": { "en": "Tour Platform Optimization", "sw": "Uboreshaji wa Majukwaa ya Utalii" },
    "footer.approach": { "en": "Our Approach", "sw": "Mbinu Yetu" },
    "footer.work": { "en": "Our Work", "sw": "Kazi Zetu" },
    "footer.how": { "en": "How It Works", "sw": "Jinsi Inavyofanya Kazi" },
    "footer.contactUs": { "en": "Contact Us", "sw": "Wasiliana Nasi" },
    "footer.whatsapp": { "en": "WhatsApp Chat", "sw": "Chat ya WhatsApp" },
    "footer.payment": { "en": "Make a Payment", "sw": "Lipa" },
    "footer.copy": { "en": "© {year} BUJA Branding Agency. All rights reserved. Designed with purpose. Built for growth.", "sw": "© {year} BUJA Branding Agency. Haki zote zimehifadhiwa. Imetengenezwa kwa kusudi. Imetengenezwa kwa ukuaji." },

    "misc.loading": { "en": "Loading...", "sw": "Inapakia..." },
    "misc.error": { "en": "An error occurred.", "sw": "Kulikuwepo tatizo." }
  };

  function isString(s){ return typeof s === 'string' || s instanceof String; }

  function safeGetTranslation(key, lang){
    const entry = translations[key];
    if(!entry){
      // fallback to English if missing
      console.warn('[BujaTranslator] missing key:', key);
      return key in translations ? translations[key][DEFAULT_LANG] : null;
    }
    return entry[lang] || entry[DEFAULT_LANG] || '';
  }

  function replaceTokens(str, tokens){
    if(!isString(str)) return str;
    if(!tokens) return str;
    return str.replace(/\{(.*?)\}/g, function(_, k){ return tokens[k] !== undefined ? tokens[k] : '{'+k+'}'; });
  }

  function translateElement(el, lang){
    const key = el.getAttribute('data-i18n');
    if(!key) return;
    const attr = el.getAttribute('data-i18n-attr') || 'text';
    const tokensAttr = el.getAttribute('data-i18n-tokens');
    let tokens = null;
    if(tokensAttr){ try{ tokens = JSON.parse(tokensAttr); } catch(e){ tokens = null; } }
    let translated = safeGetTranslation(key, lang);
    if(translated === null) return;
    translated = replaceTokens(translated, tokens);

    switch(attr){
      case 'placeholder':
        if('placeholder' in el) el.placeholder = translated; else el.setAttribute('placeholder', translated);
        break;
      case 'title':
        el.title = translated;
        break;
      case 'aria-label':
        el.setAttribute('aria-label', translated);
        break;
      case 'value':
        if('value' in el) el.value = translated; else el.setAttribute('value', translated);
        break;
      case 'html':
        el.innerHTML = translated;
        break;
      default:
        // default to textContent
        // if element contains only text node(s), replace textContent
        // otherwise, replace small inline element's text children conservatively
        if(el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE){
          el.textContent = translated;
        } else {
          // try to replace direct text nodes
          for(let node of Array.from(el.childNodes)){
            if(node.nodeType === Node.TEXT_NODE && node.textContent.trim().length>0){
              node.textContent = translated;
              break;
            }
          }
        }
    }
  }

  function translateDocument(lang){
    // set html lang attribute
    try{ document.documentElement.lang = lang; } catch(e){}

    // meta title/description update if keys present on html or use defaults
    const metaTitleKey = document.documentElement.getAttribute('data-meta-title-i18n') || 'meta.title';
    const metaDescKey = document.documentElement.getAttribute('data-meta-desc-i18n') || 'meta.description';
    const titleText = safeGetTranslation(metaTitleKey, lang) || document.title;
    document.title = titleText;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if(ogTitle) ogTitle.setAttribute('content', titleText);
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if(twitterTitle) twitterTitle.setAttribute('content', titleText);

    const descText = safeGetTranslation(metaDescKey, lang) || '';
    const metaDesc = document.querySelector('meta[name="description"]');
    if(metaDesc) metaDesc.setAttribute('content', descText);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if(ogDesc) ogDesc.setAttribute('content', descText);
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if(twitterDesc) twitterDesc.setAttribute('content', descText);

    // translate all elements with data-i18n
    const els = document.querySelectorAll('[data-i18n]');
    els.forEach(el=>translateElement(el, lang));

    // placeholders mapped via data-i18n-placeholder attribute
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el=>{
      const k = el.getAttribute('data-i18n-placeholder');
      const t = safeGetTranslation(k, lang);
      if(t!==null){ if('placeholder' in el) el.placeholder = t; else el.setAttribute('placeholder', t); }
    });

    // select options: if option has data-i18n attribute, translate
    document.querySelectorAll('select').forEach(sel=>{
      Array.from(sel.options).forEach(opt=>{
        const k = opt.getAttribute('data-i18n');
        if(k){ const t = safeGetTranslation(k, lang); if(t!==null) opt.textContent = t; }
      });
    });

    // ARIA and title attributes mapping
    const ariaEls = document.querySelectorAll('[data-i18n-aria]');
    ariaEls.forEach(el=>{ const k = el.getAttribute('data-i18n-aria'); const t = safeGetTranslation(k, lang); if(t!==null) el.setAttribute('aria-label', t); });
    const titleEls = document.querySelectorAll('[data-i18n-title]');
    titleEls.forEach(el=>{ const k = el.getAttribute('data-i18n-title'); const t = safeGetTranslation(k, lang); if(t!==null) el.title = t; });

    // run callbacks for any dynamic content
    if(window.BujaTranslatorOnTranslateCallbacks) window.BujaTranslatorOnTranslateCallbacks.forEach(cb => { try{ cb(lang); }catch(e){console.error(e);} });
  }

  function markTextNodes(){
    // Try to conservatively tag DOM elements whose exact trimmed textContent equals an English translation.
    // This helps quickly mark many elements without manual edit. It only marks elements where text exactly matches.
    const enMap = new Map();
    for(const k in translations){ if(translations[k] && translations[k].en) enMap.set(translations[k].en.trim(), k); }

    function walk(el){
      for(const child of Array.from(el.children)){
        // skip inputs, selects, nav links that have href external etc. We'll still allow <a> if internal anchor
        const text = child.textContent && child.textContent.trim();
        if(text && enMap.has(text)){
          // If element already has data-i18n, skip
          if(!child.hasAttribute('data-i18n')){
            child.setAttribute('data-i18n', enMap.get(text));
          }
        } else {
          // check placeholders and labels
          if(child.placeholder){ const ph = child.placeholder.trim(); if(enMap.has(ph) && !child.hasAttribute('data-i18n-placeholder')) child.setAttribute('data-i18n-placeholder', enMap.get(ph)); }
          // recurse
          if(child.children && child.children.length>0) walk(child);
        }
      }
    }
    walk(document.body);
  }

  // utility: safe set language and persist
  let currentLanguage = (function(){ try{ return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG; }catch(e){ return DEFAULT_LANG; }})();

  function setLanguage(lang){ if(!lang) return; currentLanguage = lang; try{ localStorage.setItem(STORAGE_KEY, lang); }catch(e){} translateDocument(lang); }
  function getLanguage(){ return currentLanguage; }
  function t(key, tokens){ const raw = safeGetTranslation(key, currentLanguage); return replaceTokens(raw, tokens); }

  // On load initialize translation (deferred safe)
  document.addEventListener('DOMContentLoaded', function(){
    // expose quick selector wiring: if there is element with data-i18n-lang-selector, wire it
    document.querySelectorAll('[data-i18n-lang-selector]').forEach(sel=>{
      if(sel.tagName==='SELECT'){
        sel.value = currentLanguage;
        sel.addEventListener('change', function(){ setLanguage(sel.value); });
      } else {
        sel.querySelectorAll('[data-lang]').forEach(btn=>{ btn.addEventListener('click', function(){ setLanguage(btn.getAttribute('data-lang')); }); });
      }
    });

    // initial translate
    translateDocument(currentLanguage);
  });

  // expose API
  window.BujaTranslator = {
    setLanguage,
    getLanguage,
    t,
    translate: function(){ translateDocument(currentLanguage); },
    markTextNodes,
    _translations: translations,
    onTranslate: function(cb){ window.BujaTranslatorOnTranslateCallbacks = window.BujaTranslatorOnTranslateCallbacks || []; window.BujaTranslatorOnTranslateCallbacks.push(cb); }
  };

})(window, document);
