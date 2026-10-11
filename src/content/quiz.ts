// Knowledge check at the end of each module (modules 1–7; the welcome module has none).
// Every answer is taken from the step scripts in lessons.ts (`source` = the step it comes from).
export interface QuizQuestion {
  source: string; // step id, e.g. "4.5"
  he: { q: string; options: string[]; explain: string };
  en: { q: string; options: string[]; explain: string };
  answer: number; // index of the correct option (same order in he and en)
}

export const quiz: Record<string, QuizQuestion[]> = {
  "1": [
    {
      source: "1.1",
      he: {
        q: `מה הדבר הראשון שעושים במסך "כניסה לחשבון שלי"?`,
        options: [
          `מקלידים את קוד האימות`,
          `מקלידים את המייל או הטלפון`,
          `בוחרים רשות מהרשימה "בחר רשות"`,
        ],
        explain: `הכניסה מתחילה בבחירת הרשות שאליה תרצו להעלות חשבונית או לצפות בכרטסת, ורק אחר כך מקלידים את פרטי העסק.`,
      },
      en: {
        q: `What is the first thing you do on the "Log in to my account" screen?`,
        options: [
          `Enter the verification code`,
          `Enter your email or phone number`,
          `Select a local authority from the "Select authority" list`,
        ],
        explain: `Login starts by choosing the local authority you want to submit an invoice to or view your account ledger in; only then do you enter your business details.`,
      },
      answer: 2,
    },
    {
      source: "1.3",
      he: {
        q: `קוד האימות לא הגיע. מה כדאי לעשות?`,
        options: [
          `לפנות לרשות ולבקש קוד ידני`,
          `לבדוק שבחרתם את האפשרות הנכונה, טלפון או מייל, ולנסות שוב`,
          `לבחור רשות אחרת ולהתחבר דרכה`,
        ],
        explain: `לפי ההדרכה, אם הקוד לא הגיע בודקים שבחרתם נכון בין טלפון למייל ומנסים שוב.`,
      },
      en: {
        q: `The verification code did not arrive. What should you do?`,
        options: [
          `Contact the local authority and ask for a manual code`,
          `Check that you chose the right option, phone or email, and try again`,
          `Choose a different local authority and log in through it`,
        ],
        explain: `If the code does not arrive, check that you picked the correct option, phone or email, and try again.`,
      },
      answer: 1,
    },
  ],
  "2": [
    {
      source: "2.3",
      he: {
        q: `אתם עובדים מול כמה רשויות שעובדות עם EPR. איך עוברים מרשות לרשות?`,
        options: [
          `לוחצים "החלף רשות" בתפריט הצד ובוחרים את הרשות הרצויה`,
          `מתנתקים ומתחברים מחדש עם קוד אימות חדש`,
          `פותחים את קיצור הדרך "ההזמנות שלי"`,
        ],
        explain: `"החלף רשות" מאפשר לעבור בין רשויות ולהגיש בכל אחת מהן חשבוניות, בכניסה אחת ובלי להתחבר מחדש.`,
      },
      en: {
        q: `You work with several local authorities that use EPR. How do you switch between them?`,
        options: [
          `Click "Switch authority" in the side menu and choose the authority you want`,
          `Log out and log in again with a new verification code`,
          `Open the "My orders" shortcut`,
        ],
        explain: `"Switch authority" lets you move between local authorities and submit invoices in each one with a single login, without signing in again.`,
      },
      answer: 0,
    },
    {
      source: "2.2",
      he: {
        q: `איפה תמצאו, מלבד קיצורי הדרך בשולחן העבודה, את המסכים "תנועות בחשבון", "ההזמנות שלי" ו"החשבוניות שלי"?`,
        options: [
          `רק בקיצורי הדרך שבשולחן העבודה`,
          `במסך "כניסה לחשבון שלי"`,
          `בתפריט הצד, ב"איזור אישי לספק"`,
        ],
        explain: `אותם מסכים מופיעים גם בתפריט הצד, ב"איזור אישי לספק", יחד עם הכפתור "חשבונית חדשה".`,
      },
      en: {
        q: `Besides the dashboard shortcuts, where can you find the "Account transactions", "My orders" and "My invoices" screens?`,
        options: [
          `Only in the dashboard shortcuts`,
          `On the "Log in to my account" screen`,
          `In the side menu, under "Supplier personal area"`,
        ],
        explain: `The same screens appear in the side menu under "Supplier personal area", together with the "New invoice" button.`,
      },
      answer: 2,
    },
  ],
  "3": [
    {
      source: "3.1",
      he: {
        q: `איזו הזמנה אפשר לקשר לחשבונית חדשה בפורטל?`,
        options: [
          `כל הזמנה שמופיעה ברשימה`,
          `רק הזמנה בסטטוס "מאושרת"`,
          `רק הזמנה בסטטוס "בוצעה"`,
        ],
        explain: `רק הזמנה מאושרת אפשר לקשר לחשבונית חדשה בפורטל הספקים.`,
      },
      en: {
        q: `Which purchase order can be linked to a new invoice in the portal?`,
        options: [
          `Any purchase order shown in the list`,
          `Only a purchase order with the status "Approved"`,
          `Only a purchase order with the status "Completed"`,
        ],
        explain: `Only an approved purchase order can be linked to a new invoice in the supplier portal.`,
      },
      answer: 1,
    },
    {
      source: "3.2",
      he: {
        q: `מה מראה העמודה "יתרה" ברשימת ההזמנות?`,
        options: [
          `את הסכום שהרשות כבר שילמה לכם`,
          `את מספר השורות בהזמנה`,
          `כמה עוד אפשר לחייב מול ההזמנה`,
        ],
        explain: `היתרה מראה כמה עוד אפשר לחייב מול כל הזמנה.`,
      },
      en: {
        q: `What does the "Balance" column in the purchase order list show?`,
        options: [
          `The amount the local authority has already paid you`,
          `The number of lines in the purchase order`,
          `How much can still be billed against the purchase order`,
        ],
        explain: `The balance shows how much can still be billed against each purchase order.`,
      },
      answer: 2,
    },
  ],
  "4": [
    {
      source: "4.3",
      he: {
        q: `בשלב "פרטי חשבונית", איזה סכום ניתן לערוך, למשל לצורך עיגול אגורות מול ההזמנה?`,
        options: [
          `הסכום לפני מס ערך מוסף`,
          `סכום מס ערך מוסף`,
          `הסכום הכולל מס ערך מוסף`,
        ],
        explain: `השדות "סכום לפני מס ערך מוסף" ו"סכום מס ערך מוסף" נעולים, ורק הסכום הכולל מס ערך מוסף ניתן לעריכה.`,
      },
      en: {
        q: `In the "Invoice details" step, which amount can you edit, for example to round agorot against the purchase order?`,
        options: [
          `The amount before VAT`,
          `The VAT amount`,
          `The amount including VAT`,
        ],
        explain: `The "Amount before VAT" and "VAT amount" fields are locked; only the VAT-inclusive amount can be edited.`,
      },
      answer: 2,
    },
    {
      source: "4.5",
      he: {
        q: `במסך בחירת ההזמנות והשורות, מתי אפשר ללחוץ "אשר"?`,
        options: [
          `כש"נותר" מגיע לאפס`,
          `מיד אחרי שסימנתם הזמנה אחת לפחות`,
          `כש"נבחר" גדול מסכום החשבונית`,
        ],
        explain: `ממשיכים לבחור עד שהסכום ב"נותר" מגיע ל-₪0, ורק אז מאשרים את הבחירה.`,
      },
      en: {
        q: `On the order and line selection screen, when can you click "Confirm"?`,
        options: [
          `When "Remaining" reaches zero`,
          `As soon as you have selected at least one purchase order`,
          `When "Selected" is higher than the invoice amount`,
        ],
        explain: `You keep selecting until the "Remaining" amount reaches ₪0, and only then confirm the selection.`,
      },
      answer: 0,
    },
    {
      source: "4.9",
      he: {
        q: `אתם מגישים חשבונית מס שסוגרת חשבונית עסקה שהגשתם בעבר. מה נכון?`,
        options: [
          `בוחרים "קישור להזמנות" ומקשרים שוב את ההזמנה המקורית`,
          `בוחרים "קישור לחשבונית עסקה", וסך חשבוניות העסקה שבחרתם חייב להיות שווה בדיוק לסכום חשבונית המס`,
          `אפשר לסגור רק חשבונית עסקה אחת בכל חשבונית מס`,
        ],
        explain: `בשלב "קישור למקור" בוחרים "קישור לחשבונית עסקה", ואפשר לסגור כמה חשבוניות עסקה כל עוד סך הסכומים זהה לחשבונית המס.`,
      },
      en: {
        q: `You are submitting a tax invoice that closes a proforma invoice you submitted earlier. Which statement is correct?`,
        options: [
          `Choose "Link to purchase orders" and link the original purchase order again`,
          `Choose "Link to proforma invoice"; the total of the proforma invoices you select must exactly equal the tax invoice amount`,
          `Each tax invoice can close only one proforma invoice`,
        ],
        explain: `In the "Link to source" step you choose "Link to proforma invoice", and you may close several proforma invoices as long as their total equals the tax invoice amount.`,
      },
      answer: 1,
    },
  ],
  "5": [
    {
      source: "5.1",
      he: {
        q: `מספר החברה או העוסק שעל החשבונית אינו תואם לעסק שמחובר לפורטל. מה יקרה?`,
        options: [
          `החשבונית תוגש, והרשות תתקן את המספר`,
          `לא ניתן להגיש את החשבונית; בדקו שהיא הופקה בשם העסק הנכון או התחברו עם המספר המתאים`,
          `החשבונית תוגש כחשבונית עסקה`,
        ],
        explain: `מספר החברה או העוסק על החשבונית חייב להיות של העסק המחובר, ואם אינו תואם, לא ניתן להגיש את החשבונית.`,
      },
      en: {
        q: `The company or business number on the invoice does not match the business logged in to the portal. What happens?`,
        options: [
          `The invoice is submitted and the local authority corrects the number`,
          `The invoice cannot be submitted; check that it was issued in the right business name, or log in with the matching number`,
          `The invoice is submitted as a proforma invoice`,
        ],
        explain: `The company or business number on the invoice must belong to the logged-in business; if it does not match, the invoice cannot be submitted.`,
      },
      answer: 1,
    },
    {
      source: "5.5",
      he: {
        q: `סכום החשבונית נמוך מסכום ההזמנה. מה עושים?`,
        options: [
          `לא ניתן להגיש; צריך לבקש מהרשות הזמנה חדשה`,
          `מגישים בלי קישור להזמנה`,
          `לוחצים "בחר שורות" ומקלידים רק את הסכום שאתם מחייבים עכשיו`,
        ],
        explain: `כך מושכים לחשבונית רק חלק מההזמנה, והיתרה נשארת פתוחה לחשבוניות הבאות.`,
      },
      en: {
        q: `The invoice amount is lower than the purchase order amount. What do you do?`,
        options: [
          `You cannot submit; ask the local authority for a new purchase order`,
          `Submit the invoice without linking it to a purchase order`,
          `Click "Select lines" and enter only the amount you are billing now`,
        ],
        explain: `This bills only part of the purchase order, and the remaining balance stays open for future invoices.`,
      },
      answer: 2,
    },
  ],
  "6": [
    {
      source: "6.1",
      he: {
        q: `מה פירוש המצב "נשלח" במסך "החשבוניות שלי"?`,
        options: [
          `החשבונית נשלחה לרשות`,
          `החשבונית אושרה לתשלום`,
          `החשבונית שולמה`,
        ],
        explain: `"נשלח" פירושו שהחשבונית נשלחה לרשות; "אושר" ו"שולם" הם מצבים נפרדים.`,
      },
      en: {
        q: `What does the status "Sent" mean on the "My invoices" screen?`,
        options: [
          `The invoice was sent to the local authority`,
          `The invoice was approved for payment`,
          `The invoice was paid`,
        ],
        explain: `"Sent" means the invoice was sent to the local authority; "Approved" and "Paid" are separate statuses.`,
      },
      answer: 0,
    },
    {
      source: "6.2",
      he: {
        q: `לפי מה אפשר לסנן ב"סינון מתקדם" במסך "החשבוניות שלי"?`,
        options: [
          `לפי שם המחלקה בלבד`,
          `לפי טווח של תאריך עדכון ושל סכום`,
          `לפי מספר החברה או העוסק`,
        ],
        explain: `"סינון מתקדם" מאפשר לבחור טווח של תאריך עדכון ושל סכום.`,
      },
      en: {
        q: `What can you filter by in "Advanced filter" on the "My invoices" screen?`,
        options: [
          `Department name only`,
          `A range of update dates and of amounts`,
          `The company or business number`,
        ],
        explain: `"Advanced filter" lets you choose a range of update dates and a range of amounts.`,
      },
      answer: 1,
    },
  ],
  "7": [
    {
      source: "7.1",
      he: {
        q: `מה מבטאת השורה "יתרת פתיחה" בכרטסת?`,
        options: [
          `את סכום החשבונית האחרונה שהגשתם`,
          `את סך כל התשלומים שקיבלתם השנה`,
          `את היתרה הנכונה עד לתאריך שבו בחרתם לראות את הכרטסת`,
        ],
        explain: `"יתרת פתיחה" היא השורה הראשונה בכרטסת ומבטאת את היתרה הנכונה עד לתאריך שבחרתם.`,
      },
      en: {
        q: `What does the "Opening balance" row in the account ledger represent?`,
        options: [
          `The amount of the last invoice you submitted`,
          `The total of all payments you received this year`,
          `The correct balance up to the date from which you chose to view the ledger`,
        ],
        explain: `"Opening balance" is the first row of the ledger and shows the correct balance up to the date you selected.`,
      },
      answer: 2,
    },
    {
      source: "7.2",
      he: {
        q: `איך מתמקדים בתנועות של תקופה מסוימת במסך "תנועות בחשבון"?`,
        options: [
          `בוחרים "מתאריך" ו"עד תאריך"`,
          `לוחצים "ייצוא" ומסננים באקסל בלבד`,
          `לוחצים "החלף רשות"`,
        ],
        explain: `כדי להתמקד בתקופה מסוימת בוחרים "מתאריך" ו"עד תאריך".`,
      },
      en: {
        q: `How do you focus on transactions from a specific period on the "Account transactions" screen?`,
        options: [
          `Select "From date" and "To date"`,
          `Click "Export" and filter only in Excel`,
          `Click "Switch authority"`,
        ],
        explain: `To focus on a specific period, select "From date" and "To date".`,
      },
      answer: 0,
    },
  ],
};
