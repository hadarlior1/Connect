import { createContext, useContext } from "react";

// Interface language. Hebrew is the default (RTL); English switches the page to LTR and
// the course text to src/content/lessons.en.ts. The portal screenshots stay in Hebrew.
export type Lang = "he" | "en";

const KEY = "eprconnect-training-lang-v1";

export function loadLang(): Lang {
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === "he" || v === "en") return v;
  } catch {
    /* storage unavailable */
  }
  return "he";
}

export function saveLang(lang: Lang): void {
  try {
    window.localStorage.setItem(KEY, lang);
  } catch {
    /* ignore */
  }
}

export const LangContext = createContext<Lang>("he");
export const useLang = () => useContext(LangContext);

const he = {
  brand: "מרכז ההדרכה של EPR",
  course: "EprConnect",
  courseFull: "הכניסה החדשה למערכות EPR",
  openMenu: "פתיחת תפריט",
  closeMenu: "סגירת תפריט",
  contents: "תוכן ההדרכה",
  resetProgress: "איפוס התקדמות",
  resetConfirm: "לאפס את ההתקדמות?",
  completed: "הושלם",
  home: "דף הבית",
  progress: "התקדמות",
  stepsDone: "שלבים שהושלמו",
  lessons: "תהליכי ההדרכה",
  topic: "פרק",
  step: "שלב",
  of: "מתוך",
  transcript: "התמלול המלא של השלב",
  note: "שימו לב:",
  tip: "טיפ:",
  wholeScreen: "כל המסך",
  focusArea: "התמקד באזור",
  enlarge: "הגדל",
  screenshot: "צילום מסך",
  screenSoon: "צילום המסך לשלב זה יתווסף בקרוב",
  replay: "מההתחלה",
  replayTitle: "השמע שוב מההתחלה",
  sound: "קול",
  muted: "מושתק",
  soundOn: "קריינות פעילה",
  soundOff: "קריינות כבויה",
  prev: "הקודם",
  next: "הבא",
  finish: "סיום ההדרכה",
  pause: "השהה",
  resume: "המשך",
  auto: "אוטומטי",
  manual: "ידני",
  autoOn: "מעבר אוטומטי",
  autoOff: "מעבר ידני",
  speed: "מהירות",
  captions: "כתוביות",
  captionsOn: "הסתרת הכתוביות",
  captionsOff: "הצגת הכתוביות",
  explainProgress: "התקדמות ההסבר",
  doneAll: "כל הכבוד! סיימתם את ההדרכה.",
  presenter: "המדריך הקולי",
  presenterRole: "EPR מערכות",
  statusPaused: "מושהה",
  statusVideo: "מציג סרטון",
  statusSpeaking: "מסביר…",
  statusReady: "מוכן",
  statusMuted: "קריינות כבויה",
  introVideo: "סרטון פתיחה של הפרק",
  stepVideo: "סרטון הסבר",
  help: "צריכים עזרה?",
  helpTitle: "עזרה ותמיכה",
  helpBody: "נתקעתם בהתקנה או בכניסה? פנו לאיש המחשוב ברשות, או לצוות התמיכה של EPR.",
  close: "סגירה",
  language: "English",
  languageLabel: "Switch to English",
  // welcome
  heroEyebrow: "חדש · EPR מערכות",
  heroPromise: "EprConnect: הכניסה החדשה, הפשוטה והמאובטחת למערכות EPR",
  heroSub: "הדרכה קצרה, צעד אחר צעד: הורדת קובץ ההתקנה, התקנה בכמה לחיצות, הזדהות עם תעודת זהות וקוד אימות, ובחירת התוכנה.",
  heroStart: "התחילו את ההדרכה",
  heroContinue: "המשיכו מאיפה שעצרתם",
  heroRestart: "התחילו מההתחלה",
  statTopics: "פרקים",
  statSteps: "שלבים",
  statMinutes: "דקות",
  statCert: "תעודת סיום",
  modulesTitle: "מה תלמדו",
  minutes: "דק׳",
  notStarted: "טרם התחיל",
  inProgress: "בתהליך",
  trust: "מבית EPR מערכות · לעובדי הרשויות המקומיות",
  // quiz
  quizTitle: "בדיקת הבנה",
  quizIntro: "שאלה או שתיים לסיום הפרק",
  check: "בדיקה",
  correct: "נכון!",
  wrong: "לא בדיוק.",
  nextQuestion: "לשאלה הבאה",
  quizDone: "סיימתם את הפרק",
  score: "תשובות נכונות",
  continueCourse: "להמשך ההדרכה",
  skipQuiz: "דלגו על הבדיקה",
  // certificate
  certTitle: "תעודת סיום",
  certCongrats: "סיימתם את ההדרכה!",
  certName: "השם המלא שלכם (יופיע על התעודה)",
  certShow: "הצגת התעודה",
  certPrint: "הדפסה / שמירה כ-PDF",
  certAwarded: "מוענקת בזאת ל",
  certFor: "על השלמת",
  certDate: "תאריך",
  certIssuer: "EPR מערכות",
  backToCourse: "חזרה להדרכה",
} as const;

type Strings = { [K in keyof typeof he]: string };

const en: Strings = {
  brand: "EPR Training Center",
  course: "EprConnect",
  courseFull: "The new sign-in to EPR systems",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  contents: "Course contents",
  resetProgress: "Reset progress",
  resetConfirm: "Reset your progress?",
  completed: "completed",
  home: "Home",
  progress: "Progress",
  stepsDone: "Steps completed",
  lessons: "Course chapters",
  topic: "Chapter",
  step: "Step",
  of: "of",
  transcript: "Full transcript of this step",
  note: "Note:",
  tip: "Tip:",
  wholeScreen: "Whole screen",
  focusArea: "Focus on area",
  enlarge: "Enlarge",
  screenshot: "Screenshot",
  screenSoon: "The screenshot for this step is coming soon",
  replay: "Restart",
  replayTitle: "Play again from the start",
  sound: "Sound",
  muted: "Muted",
  soundOn: "Narration on",
  soundOff: "Narration off",
  prev: "Previous",
  next: "Next",
  finish: "Finish the course",
  pause: "Pause",
  resume: "Resume",
  auto: "Auto",
  manual: "Manual",
  autoOn: "Auto-advance",
  autoOff: "Manual advance",
  speed: "Speed",
  captions: "Captions",
  captionsOn: "Hide captions",
  captionsOff: "Show captions",
  explainProgress: "Explanation progress",
  doneAll: "Well done! You have completed the course.",
  presenter: "Voice guide",
  presenterRole: "EPR Systems",
  statusPaused: "Paused",
  statusVideo: "Playing",
  statusSpeaking: "Explaining…",
  statusReady: "Ready",
  statusMuted: "Narration off",
  introVideo: "Chapter opening video",
  stepVideo: "Explanation video",
  help: "Need help?",
  helpTitle: "Help & support",
  helpBody: "Stuck installing or signing in? Contact your authority's IT person or the EPR support team.",
  close: "Close",
  language: "עברית",
  languageLabel: "החלפה לעברית",
  heroEyebrow: "Official training · EPR Systems",
  heroPromise: "EprConnect: the new, simple and secure sign-in to EPR systems",
  heroSub: "A short step-by-step guide: download the installer, install in a few clicks, verify with your ID and a code, and choose your program.",
  heroStart: "Start the course",
  heroContinue: "Continue where you left off",
  heroRestart: "Start from the beginning",
  statTopics: "chapters",
  statSteps: "steps",
  statMinutes: "minutes",
  statCert: "certificate",
  modulesTitle: "What you will learn",
  minutes: "min",
  notStarted: "Not started",
  inProgress: "In progress",
  trust: "By EPR Systems · for local-authority staff",
  quizTitle: "Knowledge check",
  quizIntro: "One or two questions to wrap up the chapter",
  check: "Check",
  correct: "Correct!",
  wrong: "Not quite.",
  nextQuestion: "Next question",
  quizDone: "Chapter complete",
  score: "correct answers",
  continueCourse: "Continue the course",
  skipQuiz: "Skip the check",
  certTitle: "Certificate of Completion",
  certCongrats: "You have completed the course!",
  certName: "Your full name (shown on the certificate)",
  certShow: "Show certificate",
  certPrint: "Print / save as PDF",
  certAwarded: "is hereby awarded to",
  certFor: "for completing",
  certDate: "Date",
  certIssuer: "EPR Systems",
  backToCourse: "Back to the course",
};

const STRINGS: Record<Lang, Strings> = { he, en };

export type StringKey = keyof typeof he;

/** Translator for the current language. */
export function useT() {
  const lang = useLang();
  return (key: StringKey) => STRINGS[lang][key];
}

export function tFor(lang: Lang, key: StringKey): string {
  return STRINGS[lang][key];
}
