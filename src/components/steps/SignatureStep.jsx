import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { ArrowRight, Check, PenTool } from 'lucide-react';

const SignatureStep = ({ prevStep, submitForm, formData }) => {
  const sigPad = useRef({});
  const [error, setError] = useState('');

  const clearSignature = () => {
    sigPad.current.clear();
    setError('');
  };

  const handleSubmit = () => {
    if (sigPad.current.isEmpty()) {
      setError('נא לחתום במשבצת למעלה לפני האישור');
      return;
    }
    const signatureData = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
    submitForm(signatureData);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
        <PenTool size={28} color="var(--color-secondary)" />
        <h2 style={{ fontSize: '1.8rem', margin: 0 }}>חתימה דיגיטלית</h2>
      </div>

      <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        אני, <strong style={{ color: 'var(--color-primary)' }}>{formData.clientName}</strong>, מאשר/ת את פרטי ההתקשרות, החבילה ומדיניות הביטולים, וחותם/ת על הסכם זה מרצוני הטוב.
      </p>

      <div style={{ 
        border: '2px dashed #cbd5e1', 
        borderRadius: 'var(--radius-md)', 
        backgroundColor: '#f8fafc',
        marginBottom: '0.5rem',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <SignatureCanvas 
          ref={sigPad}
          penColor="black"
          canvasProps={{
            width: 500, 
            height: 200, 
            className: 'sigCanvas',
            style: { width: '100%', height: '200px', touchAction: 'none' }
          }} 
        />
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          color: '#94a3b8',
          fontSize: '0.8rem',
          pointerEvents: 'none'
        }}>
          חתמו כאן
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
        {error ? (
          <span style={{ color: 'var(--color-error)', fontSize: '0.85rem' }}>{error}</span>
        ) : (
          <span></span>
        )}
        <button 
          onClick={clearSignature} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--color-text-muted)', 
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          נקה חתימה
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={prevStep}>
          <ArrowRight size={18} />
          <span>חזור</span>
        </button>
        <button className="btn btn-primary" onClick={handleSubmit} style={{ backgroundColor: 'var(--color-secondary)' }}>
          <span>אישור וסיום</span>
          <Check size={18} />
        </button>
      </div>
    </div>
  );
};

export default SignatureStep;
