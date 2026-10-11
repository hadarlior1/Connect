// English version of lessons.ts (same ids). Screenshots stay in Hebrew, so on-screen labels are
// given in English with the Hebrew label in parentheses the first time they appear in a step.
export interface EnStep { id: string; title: string; script: string; tip?: string; warning?: string }
export interface EnModule { id: string; title: string; intro?: string; steps: EnStep[] }

export const modulesEn: EnModule[] = [
  {
    id: "0",
    title: "Welcome",
    steps: [
      {
        id: "0.1",
        title: "Introduction",
        script: `Hello, I am Ohad Menkin, finance-systems lead at EPR, and I will guide you through this training on the Supplier Portal. In the portal, you can view the purchase orders the local authority has issued to you, submit invoices directly from your computer, track the status of each invoice, and see the transactions and payments in your account with the local authority. At any time, you can listen to an explanation again or move on to the next step.`,
      },
    ],
  },
  {
    id: "1",
    title: "Signing In to the Portal",
    intro: `Now we will learn how to sign in to the portal. Signing in is fast and secure: you choose a local authority, enter your company or business registration number, and receive a verification code by phone or email. Let us go through it together, step by step.`,
    steps: [
      {
        id: "1.1",
        title: "Choosing a Local Authority",
        script: `Let us start by signing in to the portal. On the "Sign In to My Account" ("כניסה לחשבון שלי") screen, open the "Select Local Authority" ("בחר רשות") list and choose the local authority where you want to upload an invoice or view your account ledger.`,
      },
      {
        id: "1.2",
        title: "Company Number and Phone or Email",
        script: `After you choose a local authority, enter the company or business registration number of your business. Then enter your email address or phone number, and continue to sign in to the system.`,
      },
      {
        id: "1.3",
        title: "Verification Code",
        script: `Now a one-time verification code will be sent to you, by phone or by email, depending on what you chose. Enter the code in the field on the screen and confirm. If the code does not arrive, check that you chose the correct option, phone or email, and try again.`,
      },
    ],
  },
  {
    id: "2",
    title: "Dashboard",
    intro: `After you sign in, you will arrive at the dashboard. This is your main screen: here you will see your account card details and shortcuts to the most important actions.`,
    steps: [
      {
        id: "2.1",
        title: "Business Details Card",
        script: `After you sign in, you will arrive at the "Dashboard" ("שולחן עבודה"). Here you can view the details of your account card exactly as they currently appear in the local authority's records.`,
      },
      {
        id: "2.2",
        title: "Shortcuts",
        script: `The dashboard also has three shortcuts: "Account Transactions" ("תנועות בחשבון"), "My Orders" ("ההזמנות שלי") and "My Invoices" ("החשבוניות שלי"). Clicking any of them takes you directly to the matching screen. You will also find the same screens in the side menu, under "Supplier Personal Area" ("איזור אישי לספק"), together with the "New Invoice" ("חשבונית חדשה") button.`,
      },
      {
        id: "2.3",
        title: "Switching Local Authority or Card",
        script: `The side menu shows the local authority and the company you are currently connected with. If you work with several local authorities that use EPR, click "Switch Local Authority" ("החלף רשות") and choose the one you need. This way, you can move between local authorities and submit invoices in each of them, with a single sign-in and without signing in again.`,
      },
    ],
  },
  {
    id: "3",
    title: "My Orders",
    intro: `In this part, we will look at the purchase orders the local authority has issued to you. You will learn how to read the statuses, see the remaining balance of each order, search and filter, and export the list to Excel.`,
    steps: [
      {
        id: "3.1",
        title: "Purchase Order List and Statuses",
        script: `The "My Orders" ("ההזמנות שלי") screen shows the purchase orders the local authority has issued to you. At the top of the list are status filter buttons: "All" ("הכל"), "Approved" ("מאושרת"), "Completed" ("בוצעה"), "Closed Without Invoice" ("סגורה ללא חשבונית") and "Cancelled" ("מבוטלת"). For each order, you will see its number and department, date, status and amount. Important: only an approved order can be linked to a new invoice in the Supplier Portal.`,
      },
      {
        id: "3.2",
        title: "Balance and Order Lines",
        script: `In the "Balance" ("יתרה") column, you will see the balance of each order. The balance shows how much can still be invoiced against the order. Click the arrow in the "Lines" ("שורות") column to open the order lines and see the details of each item or service ordered. This way, you will know exactly what was ordered from you.`,
      },
      {
        id: "3.3",
        title: "Search and Filter",
        script: `Looking for a specific order? In the search field, enter an order number, a department name or a word from the line description, and the list will update. You can combine the search with the status buttons. For a more focused search, click "Advanced Filter" ("סינון מתקדם") and narrow down the list as needed.`,
        tip: "You do not need to enter the full number or description. Part of the text is enough.",
      },
      {
        id: "3.4",
        title: "Export to Excel",
        script: `Do you want to keep a copy of the order list, or send it to your accounting department? Click "Export Excel" ("ייצוא Excel"), and a file with the orders will download to your computer. You can open the file in Excel, then sort and total it in any way that suits you.`,
      },
    ],
  },
  {
    id: "4",
    title: "Submitting a New Invoice",
    intro: `This is the most important process in the portal: submitting a new invoice. We will go through every stage together, from uploading the PDF file, through checking the details and linking to the purchase order, to the submission itself. Take your time. At every stage, you can listen to the explanation again.`,
    steps: [
      {
        id: "4.1",
        title: "Before You Start",
        script: `We have reached the most important stage: submitting a new invoice. Click "New Invoice" ("חשבונית חדשה") in the side menu. Before you start, please note: not every local authority allows invoice submission through the portal. If it is not possible, please contact the local authority and ask to join the EPR Supplier Portal.`,
      },
      {
        id: "4.2",
        title: "Uploading the PDF File",
        script: `The "Upload New Invoice" ("העלאת חשבונית חדשה") wizard opens, with five stages at the top of the screen. In the first stage, "Upload File" ("העלאת קובץ"), drag the invoice PDF file into the marked area, or click it and choose the file from your computer. Then click "Continue to Details" ("המשך לפרטים"). While the system reads the invoice, "Processing..." ("מעבד...") appears on the screen.`,
      },
      {
        id: "4.3",
        title: "Invoice Details",
        script: `In the "Invoice Details" ("פרטי חשבונית") stage, the system reads the data from the file automatically: document type, number, date and amounts. "Amount Before VAT" ("סכום לפני מס ערך מוסף") and "VAT Amount" ("סכום מס ערך מוסף") cannot be edited. You can edit the amount including VAT if it does not match the invoice, or to round the agorot to match the order. Check everything, add a note if needed, and click "View Invoice" ("צפה בחשבונית") to compare with the file. Then click "Continue to Source Link" ("המשך לקישור מקור").`,
      },
      {
        id: "4.4",
        title: "Source Link: Choosing the Type",
        script: `Now you link the invoice to its source. In the "Source Link" ("קישור למקור") stage, choose the source type: "Link to Orders" ("קישור להזמנות"), if the invoice belongs to a purchase order from the local authority, or "Link to Proforma Invoice" ("קישור לחשבונית עסקה"), if you already submitted a proforma invoice and are now submitting its tax invoice. For orders, click "Select Orders" ("בחר הזמנות"). The "Continue" ("המשך") button becomes available only after you make a selection.`,
      },
      {
        id: "4.5",
        title: "Selecting Orders and Lines",
        script: `The selection screen shows only approved orders. Select a whole order, or click "Select Lines" ("בחר שורות") to choose specific lines, and enter an amount for each line. At the top of the screen, you will see "Selected" ("נבחר") and "Remaining" ("נותר"), with a progress bar. Keep selecting until "Remaining" reaches zero, then click "Confirm" ("אשר") with the number of selections.`,
        tip: 'The "Remaining" amount must reach ₪0 before you confirm the selection.',
      },
      {
        id: "4.6",
        title: "Link Summary",
        script: `You are back at the "Source Link" ("קישור למקור") stage, which now shows a summary of the orders you selected, with the amount for each one. Check that everything is correct. Want to change something? Click "Edit Selection" ("ערוך בחירה") to return to the selection screen. If everything is correct, click "Continue" ("המשך"), and the message "Link completed successfully!" ("הקישור בוצע בהצלחה!") appears.`,
      },
      {
        id: "4.7",
        title: "Submit or Add Documents",
        script: `Now you have two options. If you do not need any more attachments, click "Submit Invoice" ("הגש חשבונית"). If you want to attach more documents, such as supporting documents the local authority requests, click "Continue to Additional Documents" ("המשך למסמכים נוספים") and attach them. If you notice a mistake in the link, click "Back to Link" ("חזרה לקישור") to correct it.`,
      },
      {
        id: "4.8",
        title: "Completion and Tracking",
        script: `You are done! When the message "Invoice sent successfully!" ("החשבונית נשלחה בהצלחה!") appears, the invoice has been sent to the local authority. Click "Back to List" ("חזרה לרשימה") to return to the invoice list. From there, you can track the invoice status on the "My Invoices" ("החשבוניות שלי") screen until it is approved and paid.`,
      },
      {
        id: "4.9",
        title: "Tax Invoice Closing a Proforma Invoice",
        script: `Did you submit a proforma invoice in the past, and are you now submitting the tax invoice that closes it? In the "Source Link" ("קישור למקור") stage, choose "Link to Proforma Invoice" ("קישור לחשבונית עסקה"), which converts the proforma invoice to a tax invoice. Then select the proforma invoice, or several proforma invoices, that the tax invoice closes. Make sure the total of the selected proforma invoices is exactly equal to the tax invoice amount.`,
        tip: "You can close several proforma invoices with one tax invoice, as long as the totals are equal.",
      },
    ],
  },
  {
    id: "5",
    title: "Rules and Common Errors",
    intro: `Here are some important rules that will help you avoid mistakes. The system checks every invoice you submit. Here you will learn what it checks and what to do if an error message appears.`,
    steps: [
      {
        id: "5.1",
        title: "Company Number on the Invoice",
        script: `Now let us go over some important rules that will help you avoid mistakes. The first rule: the company or business registration number on the invoice must belong to the business currently signed in to the portal. If it does not match, a message will appear saying that the invoice cannot be submitted. In this case, check that the invoice was issued in the name of the correct business, or sign in with the matching number.`,
        warning: "The company number on the invoice does not match your business registration number. This invoice cannot be submitted.",
      },
      {
        id: "5.2",
        title: "No Duplicate Submission",
        script: `The second rule: you cannot submit the same invoice twice. If the invoice was already submitted, the system will not let you upload it again. Before you submit, it is a good idea to go to "My Invoices" ("החשבוניות שלי") and search for the invoice number, to make sure it has not been submitted yet.`,
        warning: "Rule: The same invoice cannot be submitted twice.",
      },
      {
        id: "5.3",
        title: "Matching Amounts",
        script: `The third rule is about amounts. When you submit an invoice based on a purchase order, the order amount must match the invoice amount. If there is a difference, you cannot submit. Before submission, the system checks that the order total equals the tax invoice. If needed, for rounding of agorot, you can change the amount including VAT on the invoice entry screen, or correct the invoice in your own system.`,
        warning: "Rule: The total of the orders you linked to the invoice must match the amount of the invoice you uploaded to the system.",
      },
      {
        id: "5.4",
        title: "Invoice Higher Than the Order",
        script: `When the invoice amount equals the order amount, you simply select the order. But what if the invoice is higher than the order? If you have another order for the same purpose, add it to the selection and cover the difference from its balance. If there is no other order, you cannot submit the invoice. You can correct the invoice amount to match the order, usually for rounding, or cancel the invoice in your own system and issue a new one that matches the order.`,
        tip: "A small difference of a few agorot usually comes from rounding, and you can correct it in the invoice amount including VAT.",
      },
      {
        id: "5.5",
        title: "Invoice Lower Than the Order",
        script: `And when the invoice amount is lower than the order amount? No problem. When selecting orders, click "Select Lines" ("בחר שורות"), and on the order line enter only the amount you are charging now. This way, you link only part of the order to the invoice, and the balance stays open for future invoices.`,
        tip: "You can link one order to several partial invoices, until its balance reaches zero.",
      },
    ],
  },
  {
    id: "6",
    title: "My Invoices",
    intro: `After you submit, it is important to know what happens to the invoice. On the My Invoices screen, you can track the status of each invoice, search and filter, and export the list to Excel.`,
    steps: [
      {
        id: "6.1",
        title: "Invoice Statuses",
        script: `On the "My Invoices" ("החשבוניות שלי") screen, you will find all the invoices you have submitted. The filter buttons show the statuses: "Sent" ("נשלח"), meaning the invoice was sent to the local authority, "Approved" ("אושר"), "Paid" ("שולם") or "Cancelled" ("בוטל"). For each invoice, you will see its number, source, update date, document type, status and amount. Click the arrow in the "Lines" ("שורות") column to see the details.`,
      },
      {
        id: "6.2",
        title: "Search, Filter and Export",
        script: `To find an invoice, enter an invoice number or a word from the description in the search field. You can filter quickly with the status buttons, or click "Advanced Filter" ("סינון מתקדם") and choose a range of update dates and amounts. Finally, "Export Excel" ("ייצוא Excel") saves the list as a file on your computer.`,
        tip: "The search works with part of a word or number. You do not need to enter the full value.",
      },
    ],
  },
  {
    id: "7",
    title: "Account Transactions",
    intro: `And finally, account transactions. Here you will see all your debits, credits and your balance with the local authority, and you can filter by date. Let us see how.`,
    steps: [
      {
        id: "7.1",
        title: "Account Ledger: Debit, Credit, Balance",
        script: `The last screen is "Account Transactions" ("תנועות בחשבון"), your account ledger with the local authority. The first line is "Opening Balance" ("יתרת פתיחה"), which shows the correct balance up to the date from which you chose to view the ledger. For each transaction, you will see the event date, due date, details and reference. The "Debit" ("חובה") and "Credit" ("זכות") columns show the amounts, and the "Balance" ("יתרה") column shows the running balance after each transaction.`,
      },
      {
        id: "7.2",
        title: "Filtering and Choosing a Card",
        script: `To focus on a specific period, choose "From Date" ("מתאריך") and "To Date" ("עד תאריך"). In the "All Transactions" ("כל התנועות") list, you can choose a specific transaction type. If you have several cards, choose the one you need at the top of the screen. Click "Export" ("ייצוא") to download the ledger to Excel or print it. That is it, we are done! You are now ready to work with the portal with confidence.`,
      },
    ],
  },
];
