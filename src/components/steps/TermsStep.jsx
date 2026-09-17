import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';

const TermsStep = ({ nextStep, prevStep }) => {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
        <ShieldCheck size={28} color="var(--color-secondary)" />
        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>תנאים ומחיר</h2>
      </div>

      <div style={{ 
        backgroundColor: '#f8fafc', 
        padding: '1.5rem', 
        borderRadius: 'var(--radius-md)',
        marginBottom: '2rem',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>מחיר שירות</h3>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-secondary)', marginBottom: '1rem' }}>
          2,700 ש"ח
        </p>

        <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>אופן התשלום:</h4>
        <ul style={{ paddingRight: '1.2rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
          <li>תשלום מקדמה בסך 500 ₪ במעמד חתימת ההסכם.</li>
          <li>המקדמה מבטיחה את שריון התאריך ולא תוחזר במקרה של ביטול.</li>
          <li>יתרת התשלום תשולם ביום האירוע עצמו.</li>
        </ul>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          backgroundColor: '#fff',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginTop: '1rem'
        }}>
          <CreditCard size={20} color="var(--color-text-muted)" />
          <div>
            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>פרטי חשבון להעברה (תמר ביליה):</p>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>בנק 10 | סניף 998 | ח. 22152372</p>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>או בביט: 058-5800933</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--color-error)' }}>מדיניות ביטולים עיקרית:</h4>
        <ul style={{ paddingRight: '1.2rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          <li>ביטול עד 14 יום לפני האירוע: 50% מהתמורה.</li>
          <li>ביטול פחות מ-14 יום לפני האירוע: 80% מהתמורה.</li>
          <li>ביטול בטווח 48 שעות: תשלום מלא (100%).</li>
          <li>כוח עליון: אופציה לדחייה למועד חלופי.</li>
        </ul>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={prevStep}>
          <ArrowRight size={18} />
          <span>חזור</span>
        </button>
        <button className="btn btn-primary" onClick={nextStep}>
          <span>קראתי ואני מסכים/ה</span>
          <ArrowLeft size={18} />
        </button>
      </div>
    </div>
  );
};

export default TermsStep;
