import React, { forwardRef } from 'react';

// Helper to force physical spaces and fix BiDi for html2canvas
const SpacedText = ({ children }) => {
  if (typeof children !== 'string') return children;
  return (
    <>
      {children.split(' ').map((word, i, arr) => (
        <React.Fragment key={i}>
          {word}
          {i < arr.length - 1 && <span style={{ display: 'inline-block', width: '4px' }}></span>}
        </React.Fragment>
      ))}
    </>
  );
};

const RLM = '\u200F'; // Right-to-Left Mark to fix punctuation flipping
const S = () => <span style={{ display: 'inline-block', width: '4px' }}></span>;

const ContractPDFTemplate = forwardRef(({ formData }, ref) => {
  return (
    <div 
      ref={ref}
      id="contract-content"
      style={{
        width: '800px',
        padding: '40px',
        backgroundColor: '#ffffff',
        fontFamily: "'Heebo', Arial, sans-serif",
        color: '#1c1c1c',
        direction: 'rtl',
        unicodeBidi: 'embed',
        textAlign: 'right'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#c9a76d', fontSize: '32px', marginBottom: '10px' }}>
          <SpacedText>הסכם התקשרות - תמר הפקות</SpacedText>
        </h1>
        <p style={{ fontSize: '14px', color: '#666666' }}>
          <SpacedText>מסמך זה מהווה חוזה מחייב בין תמר לבין הלקוח</SpacedText>
        </p>
      </div>

      <div className="contract-section" style={{ marginBottom: '25px', padding: '20px', backgroundColor: '#faf9f6', borderRadius: '12px', border: '1px solid #e2e8f0', pageBreakInside: 'avoid' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#1c1c1c' }}>
          <SpacedText>פרטי הלקוח והאירוע</SpacedText>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '15px' }}>
          <div><strong><SpacedText>שם הלקוח</SpacedText>:{RLM}</strong><S/>{formData.clientName}</div>
          <div><strong><SpacedText>טלפון</SpacedText>:{RLM}</strong><S/>{formData.clientPhone}</div>
          <div><strong><SpacedText>תאריך האירוע</SpacedText>:{RLM}</strong><S/>{formData.eventDate}</div>
          <div><strong><SpacedText>כמות מוזמנים (משוערת)</SpacedText>:{RLM}</strong><S/>{formData.guestsCount}</div>
          <div style={{ gridColumn: 'span 2' }}><strong><SpacedText>מיקום / אולם</SpacedText>:{RLM}</strong><S/>{formData.location}</div>
        </div>
      </div>

      <div className="contract-section" style={{ marginBottom: '25px', padding: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', pageBreakInside: 'avoid' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#1c1c1c' }}>
          <SpacedText>פרטי החבילה והתשלום</SpacedText>
        </h2>
        <p style={{ fontSize: '15px', marginBottom: '10px' }}><strong><SpacedText>עלות השירות</SpacedText>:{RLM}</strong><S/><SpacedText>2,700 ש"ח</SpacedText></p>
        <p style={{ fontSize: '15px', marginBottom: '10px' }}><strong><SpacedText>תנאי התשלום</SpacedText>:{RLM}</strong><S/><SpacedText>מקדמה ע"ס 500 ₪ משולמת במעמד זה לטובת שריון התאריך. היתרה תשולם ביום האירוע.</SpacedText></p>
        <p style={{ fontSize: '15px' }}><strong><SpacedText>מדיניות ביטולים</SpacedText>:{RLM}</strong></p>
        <ul style={{ paddingRight: '20px', fontSize: '14px', color: '#666666', marginTop: '5px' }}>
          <li><SpacedText>ביטול עד 14 יום לפני האירוע: 50% מהתמורה.</SpacedText></li>
          <li><SpacedText>ביטול פחות מ-14 יום לפני האירוע: 80% מהתמורה.</SpacedText></li>
          <li><SpacedText>ביטול בטווח 48 שעות: תשלום מלא (100%).</SpacedText></li>
        </ul>
      </div>

      <div className="contract-section signature-block" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #f1f5f9', pageBreakInside: 'avoid' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#1c1c1c' }}>
          <SpacedText>חתימת הלקוח</SpacedText>
        </h2>
        <p style={{ fontSize: '14px', marginBottom: '15px', lineHeight: '1.8' }}>
          <SpacedText>אני,</SpacedText><S/><strong>{formData.clientName}</strong>{RLM},<S/>
          <SpacedText>מאשר/ת את פרטי ההתקשרות, החבילה ומדיניות הביטולים, וחותם/ת על הסכם זה מרצוני הטוב.</SpacedText>
        </p>
        {formData.signature && (
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', display: 'inline-block', backgroundColor: '#faf9f6' }}>
            <img src={formData.signature} alt="חתימה" style={{ height: '100px', objectFit: 'contain' }} />
          </div>
        )}
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666666' }}>
          <SpacedText>נחתם דיגיטלית בתאריך:</SpacedText><S/>{new Date().toLocaleDateString('he-IL')}
        </div>
      </div>
    </div>
  );
});

export default ContractPDFTemplate;
