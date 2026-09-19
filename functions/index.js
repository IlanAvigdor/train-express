const { onCall } = require("firebase-functions/v2/https");
const { Resend } = require("resend");

let resend;
const TAMAR_EMAIL = "liriavigdor1302@gmail.com"; 

exports.sendSignedContract = onCall({ cors: true, memory: "1GiB", timeoutSeconds: 120 }, async (request) => {
  try {
    if (!resend) {
      resend = new Resend(process.env.RESEND_API_KEY);
    }
    
    // Lazy load puppeteer to prevent deployment timeouts during initialization
    const puppeteer = require("puppeteer");
    
    const { clientName, clientPhone, eventDate, guestsCount, location, clientEmail, signature } = request.data;
    
    if (!signature) {
      throw new Error("Missing signature data in request");
    }

    // Build the Contract HTML string for Puppeteer
    const contractHtml = `
      <!DOCTYPE html>
      <html lang="he" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Heebo', Arial, sans-serif;
            margin: 0;
            padding: 40px;
            background-color: #ffffff;
            color: #1c1c1c;
            direction: rtl;
          }
          .text-center { text-align: center; margin-bottom: 30px; }
          h1 { color: #c9a76d; font-size: 32px; margin-bottom: 10px; font-weight: 700; }
          h2 { font-size: 20px; margin-bottom: 15px; color: #1c1c1c; font-weight: 700; }
          p { font-size: 14px; color: #666666; margin: 0 0 10px 0; }
          .contract-section {
            margin-bottom: 25px;
            padding: 20px;
            background-color: #faf9f6;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            page-break-inside: avoid;
          }
          .contract-section.white { background-color: #ffffff; }
          .contract-section.no-bg { background-color: transparent; border: none; border-top: 2px solid #f1f5f9; border-radius: 0; padding-top: 20px; margin-top: 40px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 15px; }
          .span-2 { grid-column: span 2; }
          ul { padding-right: 20px; font-size: 14px; color: #666666; margin-top: 5px; }
          .signature-img { height: 100px; object-fit: contain; }
          .signature-box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; display: inline-block; background-color: #faf9f6; }
        </style>
      </head>
      <body>
        <div class="text-center">
          <h1>הסכם התקשרות - תמר הפקות</h1>
          <p>מסמך זה מהווה חוזה מחייב בין תמר לבין הלקוח</p>
        </div>

        <div class="contract-section">
          <h2>פרטי הלקוח והאירוע</h2>
          <div class="grid">
            <div><strong>שם הלקוח: </strong>${clientName}</div>
            <div><strong>טלפון: </strong>${clientPhone}</div>
            <div><strong>תאריך האירוע: </strong>${eventDate}</div>
            <div><strong>כמות מוזמנים (משוערת): </strong>${guestsCount}</div>
            <div class="span-2"><strong>מיקום / אולם: </strong>${location}</div>
          </div>
        </div>

        <div class="contract-section white">
          <h2>פרטי החבילה והתשלום</h2>
          <p style="font-size: 15px;"><strong>עלות השירות: </strong>2,700 ש"ח</p>
          <p style="font-size: 15px;"><strong>תנאי התשלום: </strong>מקדמה ע"ס 500 ₪ משולמת במעמד זה לטובת שריון התאריך. היתרה תשולם ביום האירוע.</p>
          <p style="font-size: 15px;"><strong>מדיניות ביטולים: </strong></p>
          <ul>
            <li>ביטול עד 14 יום לפני האירוע: 50% מהתמורה.</li>
            <li>ביטול פחות מ-14 יום לפני האירוע: 80% מהתמורה.</li>
            <li>ביטול בטווח 48 שעות: תשלום מלא (100%).</li>
          </ul>
        </div>

        <div class="contract-section no-bg">
          <h2>חתימת הלקוח</h2>
          <p style="font-size: 14px; margin-bottom: 15px; line-height: 1.8;">
            אני, <strong>${clientName}</strong>, מאשר/ת את פרטי ההתקשרות, החבילה ומדיניות הביטולים, וחותם/ת על הסכם זה מרצוני הטוב.
          </p>
          <div class="signature-box">
            <img src="${signature}" class="signature-img" alt="חתימה" />
          </div>
          <div style="margin-top: 10px; font-size: 12px; color: #666666;">
            נחתם דיגיטלית בתאריך: ${new Date().toLocaleDateString('he-IL')}
          </div>
        </div>
      </body>
      </html>
    `;

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    
    const page = await browser.newPage();
    await page.setContent(contractHtml, { waitUntil: 'networkidle0' }); // Wait for fonts to load
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
    });
    
    await browser.close();

    const pdfBase64 = pdfBuffer.toString('base64');

    const htmlContent = `
      <div dir="rtl" style="font-family: Arial, sans-serif; color: #1c1c1c;">
        <h2 style="color: #c9a76d;">חוזה חדש נחתם! 🎉</h2>
        <p>מזל טוב! הלקוח/ה <strong>${clientName}</strong> בדיוק חתם/ה על החוזה.</p>
        <h3>פרטי האירוע:</h3>
        <ul>
          <li><strong>טלפון:</strong> ${clientPhone}</li>
          <li><strong>תאריך:</strong> ${eventDate}</li>
          <li><strong>כמות מוזמנים:</strong> ${guestsCount}</li>
          <li><strong>מיקום:</strong> ${location}</li>
        </ul>
        <p>ניתן להוריד ולצפות בחוזה החתום שמצורף למייל זה.</p>
      </div>
    `;

    // Send email to Tamar
    const data = await resend.emails.send({
      from: 'Tamar Events <onboarding@resend.dev>',
      to: TAMAR_EMAIL, 
      subject: `חוזה חתום חדש: ${clientName}`,
      html: htmlContent,
      attachments: [
        {
          filename: `contract_${clientName}.pdf`,
          content: pdfBase64,
        }
      ]
    });

    // If a client email was provided, send a copy to the client as well
    if (clientEmail) {
      await resend.emails.send({
        from: 'Tamar Events <onboarding@resend.dev>',
        to: clientEmail,
        subject: `העתק החוזה החתום שלך עם תמר`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; color: #1c1c1c;">
            <h2 style="color: #c9a76d;">תודה רבה ${clientName}!</h2>
            <p>החוזה שלך נחתם בהצלחה והועבר אלינו.</p>
            <p>מצורף עותק של החוזה החתום לשימושך.</p>
            <p>ניפגש בשמחות!</p>
          </div>
        `,
        attachments: [
          {
            filename: `Tamar_Contract_${clientName}.pdf`,
            content: pdfBase64,
          }
        ]
      });
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error generating or sending contract:", error);
    throw new Error(error.message);
  }
});
