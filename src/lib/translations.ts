export type SupportedLocale = "en" | "hi";

export interface Translations {
  common: {
    appName: string;
    tagline: string;
    demoDataWarning: string;
    emergencyCallout: string;
    searchPlaceholder: string;
    findHospitals: string;
    findBloodBanks: string;
    exploreFacilities: string;
    staffPortal: string;
    callNow: string;
    viewDetails: string;
    lastUpdated: string;
    dataSource: string;
    statusAvailable: string;
    statusLimited: string;
    statusUnavailable: string;
    statusUnknown: string;
    unitsAvailable: string;
    totalBeds: string;
    emergencyPhone: string;
    contactFacility: string;
    noResultsFound: string;
    loading: string;
    filterBy: string;
    allAreas: string;
    search: string;
    resetFilters: string;
  };
  nav: {
    home: string;
    hospitals: string;
    bloodBanks: string;
    howItWorks: string;
    about: string;
    login: string;
    dashboard: string;
    logout: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    voiceSearchTooltip: string;
    voiceListening: string;
    voiceTrySpeaking: string;
    searchCategoryHospital: string;
    searchCategoryBlood: string;
    disclaimer: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  footer: {
    description: string;
    quickLinks: string;
    legal: string;
    privacy: string;
    terms: string;
    accessibility: string;
    copyright: string;
  };
}

export const translations: Record<SupportedLocale, Translations> = {
  en: {
    common: {
      appName: "MediConnect",
      tagline: "Smart Hospital Resource & Blood Bank Availability",
      demoDataWarning: "DEMO DATA — Simulated availability for demonstration. Confirm with facility before traveling.",
      emergencyCallout: "For life-threatening medical emergencies, please dial 112 or 108 immediately.",
      searchPlaceholder: "Search hospital name, area, or facility (e.g. ICU, Ventilator, O-Negative)...",
      findHospitals: "Find Hospitals",
      findBloodBanks: "Find Blood Banks",
      exploreFacilities: "Explore Facilities",
      staffPortal: "Staff Portal",
      callNow: "Call Facility",
      viewDetails: "View Details",
      lastUpdated: "Updated",
      dataSource: "Source",
      statusAvailable: "Available",
      statusLimited: "Limited",
      statusUnavailable: "Unavailable",
      statusUnknown: "Unknown",
      unitsAvailable: "Units Available",
      totalBeds: "Total Beds",
      emergencyPhone: "Emergency Triage",
      contactFacility: "Contact Facility",
      noResultsFound: "No matching healthcare facilities found. Try adjusting your search query or filters.",
      loading: "Fetching verified resource data...",
      filterBy: "Filter By",
      allAreas: "All Areas",
      search: "Search",
      resetFilters: "Clear Filters",
    },
    nav: {
      home: "Home",
      hospitals: "Hospitals & ICU",
      bloodBanks: "Blood Banks",
      howItWorks: "How It Works",
      about: "About",
      login: "Staff Login",
      dashboard: "Staff Dashboard",
      logout: "Log Out",
    },
    hero: {
      badge: "Real-time Medical Resource Discovery",
      title: "Better Information. Faster Connections to Care.",
      subtitle: "Find hospitals, explore listed critical care facilities, and connect with verified blood banks—all in one place.",
      voiceSearchTooltip: "Search with voice (English or Hindi)",
      voiceListening: "Listening... speak now",
      voiceTrySpeaking: "Try saying: 'Find ICU beds in Lucknow' or 'Search O negative blood'",
      searchCategoryHospital: "Hospitals & Beds",
      searchCategoryBlood: "Blood Inventory",
      disclaimer: "MediConnect provides informational discovery and does not dispatch emergency response services.",
    },
    howItWorks: {
      title: "How MediConnect Works",
      subtitle: "Empowering patients, caregivers, and responders with verified, transparent facility intelligence.",
      step1Title: "1. Search by Need",
      step1Desc: "Filter by specific medical resources such as ICU beds, ventilators, diagnostics, or ABO/Rh blood groups.",
      step2Title: "2. Inspect Verified Freshness",
      step2Desc: "Review exact audit timestamps, data-source origins, and authorized staff update logs.",
      step3Title: "3. Confirm Before Travel",
      step3Desc: "Directly contact the hospital triage or blood bank via one-click emergency lines before transit.",
    },
    footer: {
      description: "MediConnect is a next-generation healthcare coordination platform designed to bridge information gaps between healthcare centers and citizens.",
      quickLinks: "Platform Links",
      legal: "Compliance & Governance",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      accessibility: "Accessibility",
      copyright: "© 2026 MediConnect. All rights reserved. Hackathon Demonstration Edition.",
    },
  },
  hi: {
    common: {
      appName: "मेडीकनेक्ट",
      tagline: "स्मार्ट अस्पताल संसाधन एवं ब्लड बैंक उपलब्धता प्रणाली",
      demoDataWarning: "डेमो डेटा — प्रदर्शन हेतु सांकेतिक उपलब्धता। अस्पताल जाने से पहले सीधे पुष्टि करें।",
      emergencyCallout: "गंभीर आपातकालीन चिकित्सा सहायता के लिए तुरंत 112 या 108 डायल करें।",
      searchPlaceholder: "अस्पताल का नाम, क्षेत्र या सुविधा खोजें (उदा: ICU, वेंटिलेटर, O-नेगेटिव)...",
      findHospitals: "अस्पताल खोजें",
      findBloodBanks: "ब्लड बैंक खोजें",
      exploreFacilities: "सुविधाएं देखें",
      staffPortal: "स्टाफ पोर्टल",
      callNow: "अस्पताल को कॉल करें",
      viewDetails: "विवरण देखें",
      lastUpdated: "अद्यतन समय",
      dataSource: "डेटा स्रोत",
      statusAvailable: "उपलब्ध",
      statusLimited: "सीमित",
      statusUnavailable: "अनुपलब्ध",
      statusUnknown: "अज्ञात",
      unitsAvailable: "उपलब्ध यूनिट्स",
      totalBeds: "कुल बेड्स",
      emergencyPhone: "आपातकालीन नंबर",
      contactFacility: "संस्थान से संपर्क करें",
      noResultsFound: "कोई स्वास्थ्य केंद्र नहीं मिला। कृपया अपने फ़िल्टर या खोज शब्द बदलें।",
      loading: "संसाधन डेटा लोड हो रहा है...",
      filterBy: "फ़िल्टर करें",
      allAreas: "सभी क्षेत्र",
      search: "खोजें",
      resetFilters: "फ़िल्टर हटाएं",
    },
    nav: {
      home: "होम",
      hospitals: "अस्पताल एवं ICU",
      bloodBanks: "ब्लड बैंक",
      howItWorks: "यह कैसे कार्य करता है",
      about: "हमारे बारे में",
      login: "स्टाफ लॉगिन",
      dashboard: "स्टाफ डैशबोर्ड",
      logout: "लॉगआउट",
    },
    hero: {
      badge: "विश्वसनीय चिकित्सा संसाधन खोज प्रणाली",
      title: "सटीक जानकारी। जीवन रक्षक स्वास्थ्य सेवाओं से तीव्र जुड़ाव।",
      subtitle: "अस्पताल खोजें, वेंटिलेटर व आईसीयू बेड्स की स्थिति देखें और ब्लड बैंकों से तुरंत संपर्क करें—एक ही स्थान पर।",
      voiceSearchTooltip: "आवाज से खोजें (हिंदी अथवा अंग्रेजी)",
      voiceListening: "सुन रहे हैं... कृपया बोलें",
      voiceTrySpeaking: "बोलकर देखें: 'लखनऊ में आईसीयू बेड खोजें' या 'ओ नेगेटिव ब्लड बैंक'",
      searchCategoryHospital: "अस्पताल एवं बेड्स",
      searchCategoryBlood: "ब्लड बैंक इन्वेंटरी",
      disclaimer: "मेडीकनेक्ट केवल सूचनात्मक सुविधा प्रदान करता है और आपातकालीन एम्बुलेंस सेवा नहीं भेजता।",
    },
    howItWorks: {
      title: "मेडीकनेक्ट कैसे काम करता है",
      subtitle: "मरीजों, तीमारदारों एवं स्वास्थ्यकर्मियों को पारदर्शी एवं अद्यतन जानकारी प्रदान करने हेतु निर्मित।",
      step1Title: "1. आवश्यकतानुसार खोजें",
      step1Desc: "आईसीयू, वेंटिलेटर, डायग्नोस्टिक्स अथवा अपने ब्लड ग्रुप (ABO/Rh) के आधार पर खोजें।",
      step2Title: "2. समय और स्रोत जांचें",
      step2Desc: "प्रत्येक संसाधन का अंतिम अपडेट समय और अधिकृत स्टाफ का डेटा स्रोत देखें।",
      step3Title: "3. यात्रा से पूर्व पुष्टि करें",
      step3Desc: "निकलने से पहले अस्पताल या ब्लड बैंक के आपातकालीन नंबर पर कॉल करके पुष्टि करें।",
    },
    footer: {
      description: "मेडीकनेक्ट एक आधुनिक स्वास्थ्य सेवा सूचना प्लेटफ़ॉर्म है जिसका उद्देश्य नागरिकों और अस्पतालों के बीच जानकारी का अंतर समाप्त करना है।",
      quickLinks: "त्वरित लिंक्स",
      legal: "कानूनी एवं नीतियां",
      privacy: "गोपनीयता नीति",
      terms: "नियम एवं शर्तें",
      accessibility: "सुगमता (Accessibility)",
      copyright: "© 2026 मेडीकनेक्ट. सर्वाधिकार सुरक्षित। हैकथॉन प्रोटोटाइप संस्करण।",
    },
  },
};
