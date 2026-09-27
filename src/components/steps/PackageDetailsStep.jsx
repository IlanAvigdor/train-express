import React from 'react';
import { ArrowLeft, ArrowRight, Gift, CheckCircle2 } from 'lucide-react';

const PackageDetailsStep = ({ nextStep, prevStep }) => {
  const packageItems = [
    "פגישה פרונטלית עם הזוג",
    "הכנסת תקציב למבנה אקסל",
    "לו״ז ליום האירוע מרגע ההגעה לאולם והפצתו לכלל הספקים",
    "פיקוח על עיצוב ותפריט לפי החוזה שנחתם מול האולם",
    "פיקוח על סידורי הושבה באולם ועזרה במידת הצורך לדיילות",
    "בקרה וניהול רזרבות",
    "ניהול ובקרה על מלאי האלכוהול החיצוני",
    "סנכרון מול ספקים - ניהול תקשורת שוטפת מול כלל הספקים ביום האירוע",
    "ערכת חירום ( עזרה ראשונה , ערכת תפירה, וכ׳ו...)",
    "פגישת זום מסכמת לפני האירוע ודרישות מיוחדות של הזוג",
    "זמינות מלאה לכל שאלה ובקשה ביום האירוע"
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
        <Gift size={28} color="var(--color-secondary)" />
        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>תיאור החבילה</h2>
      </div>
      
      <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
        השירות מתחיל כחודש לפני האירוע וכולל את הסעיפים הבאים:
      </p>

      <ul style={{ listStyle: 'none', padding: 0, marginBottom: '3rem' }}>
        {packageItems.map((item, index) => (
          <li key={index} style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '0.8rem', 
            marginBottom: '0.8rem',
            padding: '0.5rem',
            backgroundColor: '#f8fafc',
            borderRadius: 'var(--radius-md)'
          }}>
            <CheckCircle2 size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.95rem' }}>{item}</span>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={prevStep}>
          <ArrowRight size={18} />
          <span>חזור</span>
        </button>
        <button className="btn btn-primary" onClick={nextStep}>
          <span>אישור והמשך</span>
          <ArrowLeft size={18} />
        </button>
      </div>
    </div>
  );
};

export default PackageDetailsStep;
