// Knowledge check at the end of each module (modules 1–4; the welcome module has none).
// Every answer is taken from the step scripts in lessons.ts (`source` = the step it comes from).
export interface QuizQuestion {
  source: string; // step id, e.g. "3.3"
  he: { q: string; options: string[]; explain: string };
  en: { q: string; options: string[]; explain: string };
  answer: number; // index of the correct option (same order in he and en)
}

export const quiz: Record<string, QuizQuestion[]> = {
  "1": [
    {
      source: "1.3",
      he: {
        q: `הורדתם את הקובץ ב-Edge והופיעה אזהרה שהקובץ אינו מוכר. מה עושים?`,
        options: [
          `מוחקים את הקובץ ומורידים שוב`,
          `לוחצים על שלוש הנקודות, בוחרים "Keep" ואז "Keep anyway"`,
          `מתקשרים לתמיכה לפני כל פעולה`,
        ],
        explain: `האזהרה תקינה. בוחרים "Keep" ובחלון האימות "Keep anyway", והקובץ נשמר.`,
      },
      en: {
        q: `You downloaded the file in Edge and a warning says it is not commonly downloaded. What do you do?`,
        options: [`Delete it and download again`, `Click the three dots, choose "Keep", then "Keep anyway"`, `Call support before doing anything`],
        explain: `The warning is expected. Choose "Keep" and then "Keep anyway" to save the file.`,
      },
      answer: 1,
    },
  ],
  "2": [
    {
      source: "2.2",
      he: {
        q: `מה כדאי להשאיר מסומן במסך "בחר משימות נוספות"?`,
        options: [`"צור קיצור דרך על שולחן העבודה"`, `שום דבר, מבטלים את כל הסימונים`, `"התקן לכל המשתמשים"`],
        explain: `כך האייקון EprConnect יופיע על שולחן העבודה.`,
      },
      en: {
        q: `What should stay checked on the "Select additional tasks" screen?`,
        options: [`"Create a desktop shortcut"`, `Nothing, clear every option`, `"Install for all users"`],
        explain: `That puts the EprConnect icon on the desktop.`,
      },
      answer: 0,
    },
    {
      source: "2.5",
      he: {
        q: `דרך איזה אייקון נכנסים מעכשיו לתוכנות הרשות?`,
        options: [`EprRdpS`, `EprSetup`, `EprConnect`],
        explain: `מעכשיו נכנסים רק דרך EprConnect, ולא דרך האייקון הישן EprRdpS.`,
      },
      en: {
        q: `Which icon do you use from now on to open the authority's programs?`,
        options: [`EprRdpS`, `EprSetup`, `EprConnect`],
        explain: `From now on you sign in only through EprConnect, not the old EprRdpS icon.`,
      },
      answer: 2,
    },
  ],
  "3": [
    {
      source: "3.2",
      he: {
        q: `בפתיחה הראשונה מופיעה ההודעה "אנא המתן לסיום התהליך". מה עושים?`,
        options: [`סוגרים את החלון ופותחים שוב`, `ממתינים: התוכנה מתעדכנת ונפתחת מחדש בעצמה`, `מתקינים את התוכנה מחדש`],
        explain: `בפתיחה הראשונה התוכנה מורידה עדכונים, נסגרת לרגע ונפתחת מחדש בעצמה.`,
      },
      en: {
        q: `On first launch you see "please wait for the process to finish". What do you do?`,
        options: [`Close the window and open it again`, `Wait: the program updates and reopens by itself`, `Reinstall the program`],
        explain: `On first launch the program downloads updates, closes briefly and reopens by itself.`,
      },
      answer: 1,
    },
    {
      source: "3.4",
      he: {
        q: `לאן נשלח קוד האימות?`,
        options: [`למייל או לטלפון הנייד המעודכנים במערכת`, `לאיש המחשוב ברשות`, `הוא מופיע על המסך`],
        explain: `הקוד נשלח למייל או לטלפון הנייד המעודכנים במערכת.`,
      },
      en: {
        q: `Where is the verification code sent?`,
        options: [`To the email or mobile phone on record`, `To the authority's IT person`, `It is shown on screen`],
        explain: `The code is sent to the email or mobile phone on record.`,
      },
      answer: 0,
    },
  ],
  "4": [
    {
      source: "4.1",
      he: {
        q: `הקוד לא הגיע. מה אפשר לעשות במסך "אימות דו-שלבי"?`,
        options: [`לסגור את התוכנה ולהתקין מחדש`, `לבדוק גם בדואר הזבל, ואחרי חצי דקה ללחוץ "שלח קוד חדש"`, `להקליד שש ספרות כלשהן`],
        explain: `בודקים את המייל, כולל דואר הזבל, ואת הטלפון. אחרי חצי דקה אפשר לבקש קוד חדש.`,
      },
      en: {
        q: `The code did not arrive. What can you do on the "Two-step verification" screen?`,
        options: [`Close the program and reinstall`, `Check spam too, and after half a minute click "Send a new code"`, `Type any six digits`],
        explain: `Check your email, including spam, and your phone. After half a minute you can request a new code.`,
      },
      answer: 1,
    },
  ],
};
