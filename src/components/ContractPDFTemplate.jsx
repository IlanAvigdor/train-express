import React, { forwardRef } from 'react';

const ContractPDFTemplate = forwardRef(({ formData }, ref) => {
  return (
    <div 
      ref={ref}
      style={{
        width: '800px',
        padding: '40px',
        backgroundColor: '#ffffff',
        fontFamily: "'Heebo', sans-serif",
        color: '#1c1c1c',
        direction: 'rtl',
        position: 'absolute',
        left: '-9999px',
        top: 0
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#c9a76d', fontSize: '32px', marginBottom: '10px' }}>
          הסכם התקשרות - תמר הפקות
        </h1>
        <p style={{ fontSize: '14px', color: '#666666' }}>מסמך זה מהווה חוזה מחייב בין תמר לבין הלקוח</p>
      </div>

      <div style={{ marginBottom: '25px', padding: '20px', backgroundColor: '#faf9f6', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '15px', color: '#1c1c1c' }}>פרטי הלקוח והאירוע</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '15px' }}>
          <div><strong>שם הלקוח:</strong> {formData.clientName}</div>
          <div><strong>טלפון:</strong> {formData.clientPhone}</div>
          <div><strong>תאריך האירוע:</strong> {formData.eventDate}</div>
          <div><strong>כמות מוזמנים (משוערת):</strong> {formData.guestsCount}</div>
          <div style={{ gridColumn: 'span 2' }}><strong>מיקום / אולם:</strong> {formData.location}</div>
        </div>
      </div>

      <div style={{ marginBottom: '25px', padding: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '15px', color: '#1c1c1c' }}>פרטי החבילה והתשלום</h2>
        <p style={{ fontSize: '15px', marginBottom: '10px' }}><strong>עלות השירות:</strong> 2,700 ש"ח</p>
        <p style={{ fontSize: '15px', marginBottom: '10px' }}><strong>תנאי התשלום:</strong> מקדמה ע"ס 500 ₪ משולמת במעמד זה לטובת שריון התאריך. היתרה תשולם ביום האירוע.</p>
        <p style={{ fontSize: '15px' }}><strong>מדיניות ביטולים:</strong></p>
        <ul style={{ paddingRight: '20px', fontSize: '14px', color: '#666666', marginTop: '5px' }}>
          <li>ביטול עד 14 יום לפני האירוע: 50% מהתמורה.</li>
          <li>ביטול פחות מ-14 יום לפני האירוע: 80% מהתמורה.</li>
          <li>ביטול בטווח 48 שעות: תשלום מלא (100%).</li>
        </ul>
      </div>

      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #f1f5f9' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '15px', color: '#1c1c1c' }}>חתימת הלקוח</h2>
        <p style={{ fontSize: '14px', marginBottom: '15px' }}>
          אני, <strong>{formData.clientName}</strong>, מאשר/ת את פרטי ההתקשרות, החבילה ומדיניות הביטולים, וחותם/ת על הסכם זה מרצוני הטוב.
        </p>
        {formData.signature && (
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', display: 'inline-block', backgroundColor: '#faf9f6' }}>
            <img src={formData.signature} alt="חתימה" style={{ height: '100px', objectFit: 'contain' }} />
          </div>
        )}
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666666' }}>
          נחתם דיגיטלית בתאריך: {new Date().toLocaleDateString('he-IL')}
        </div>
      </div>
    </div>
  );
});

export default ContractPDFTemplate;
