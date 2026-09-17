import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

const WelcomeStep = ({ nextStep }) => {
  return (
    <div className="text-center animate-fade-in" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <Sparkles size={48} color="var(--color-secondary)" />
      </div>
      <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>תמר ביליה</h1>
      <h2 style={{ marginBottom: '2rem', fontSize: '1.2rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', fontWeight: '400' }}>
        הפקות וניהול אירועים
      </h2>
      <p style={{ marginBottom: '3rem', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto 3rem auto' }}>
        ברוכים הבאים! לפנינו תהליך קצר ופשוט לאישור פרטי ההפקה והחוזה לאירוע שלכם.
      </p>
      
      <button className="btn btn-primary" onClick={nextStep} style={{ width: '100%', maxWidth: '300px' }}>
        <span>בואו נתחיל</span>
        <ArrowLeft size={18} />
      </button>
    </div>
  );
};

export default WelcomeStep;
