const { onCall } = require("firebase-functions/v2/https");
const { Resend } = require("resend");

// Initialize Resend with the provided API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// TODO: Update this with Tamar's actual email address once provided
const TAMAR_EMAIL = "liriavigdor1302@gmail.com"; 

exports.sendSignedContract = onCall({ cors: true }, async (request) => {
  try {
    const { pdfBase64, clientName, clientPhone, eventDate, guestsCount, location, clientEmail } = request.data;
    
    if (!pdfBase64) {
      throw new Error("Missing pdfBase64 in request");
    }

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

    // Process base64 string (remove data URL part if present)
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "");

    // Send email to Tamar
    const data = await resend.emails.send({
      from: 'Tamar Events <onboarding@resend.dev>', // Resend test domain
      to: TAMAR_EMAIL, 
      subject: `חוזה חתום חדש: ${clientName}`,
      html: htmlContent,
      attachments: [
        {
          filename: `contract_${clientName}.pdf`,
          content: base64Data,
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
            content: base64Data,
          }
        ]
      });
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(error.message);
  }
});
