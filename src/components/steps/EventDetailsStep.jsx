import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarHeart } from 'lucide-react';

const EventDetailsStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const newErrors = {};
    if (!formData.eventDate) newErrors.eventDate = 'שדה חובה';
    if (!formData.guestsCount) newErrors.guestsCount = 'שדה חובה';
    if (!formData.location.trim()) newErrors.location = 'שדה חובה';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      nextStep();
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
        <CalendarHeart size={28} color="var(--color-secondary)" />
        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>פרטי האירוע</h2>
      </div>

      <div className="form-group">
        <label className="form-label">תאריך האירוע</label>
        <input 
          type="date" 
          className="form-input" 
          value={formData.eventDate}
          onChange={(e) => updateFormData({ eventDate: e.target.value })}
        />
        {errors.eventDate && <span style={{ color: 'var(--color-error)', fontSize: '0.85rem' }}>{errors.eventDate}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">כמות מוזמנים (משוערת)</label>
        <input 
          type="number" 
          className="form-input" 
          placeholder="למשל: 350"
          value={formData.guestsCount}
          onChange={(e) => updateFormData({ guestsCount: e.target.value })}
        />
        {errors.guestsCount && <span style={{ color: 'var(--color-error)', fontSize: '0.85rem' }}>{errors.guestsCount}</span>}
      </div>

      <div className="form-group" style={{ marginBottom: '3rem' }}>
        <label className="form-label">מיקום (שם האולם/גן)</label>
        <input 
          type="text" 
          className="form-input" 
          placeholder="למשל: אגדתא"
          value={formData.location}
          onChange={(e) => updateFormData({ location: e.target.value })}
        />
        {errors.location && <span style={{ color: 'var(--color-error)', fontSize: '0.85rem' }}>{errors.location}</span>}
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

export default EventDetailsStep;
