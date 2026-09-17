import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, User } from 'lucide-react';

const ClientInfoStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const newErrors = {};
    if (!formData.clientName.trim()) newErrors.clientName = 'שדה חובה';
    if (!formData.clientPhone.trim()) newErrors.clientPhone = 'שדה חובה';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      nextStep();
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
        <User size={28} color="var(--color-secondary)" />
        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>פרטים אישיים</h2>
      </div>

      <div className="form-group">
        <label className="form-label">שם מלא (או שמות בני הזוג)</label>
        <input 
          type="text" 
          className="form-input" 
          placeholder="למשל: דניאל ונועה"
          value={formData.clientName}
          onChange={(e) => updateFormData({ clientName: e.target.value })}
        />
        {errors.clientName && <span style={{ color: 'var(--color-error)', fontSize: '0.85rem' }}>{errors.clientName}</span>}
      </div>

      <div className="form-group" style={{ marginBottom: '3rem' }}>
        <label className="form-label">מספר טלפון ליצירת קשר</label>
        <input 
          type="tel" 
          className="form-input" 
          placeholder="05X-XXXXXXX"
          value={formData.clientPhone}
          onChange={(e) => updateFormData({ clientPhone: e.target.value })}
          dir="ltr"
          style={{ textAlign: 'right' }}
        />
        {errors.clientPhone && <span style={{ color: 'var(--color-error)', fontSize: '0.85rem' }}>{errors.clientPhone}</span>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={prevStep}>
          <ArrowRight size={18} />
          <span>חזור</span>
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          <span>המשך</span>
          <ArrowLeft size={18} />
        </button>
      </div>
    </div>
  );
};

export default ClientInfoStep;
