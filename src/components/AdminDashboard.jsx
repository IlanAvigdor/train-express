import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Link, Copy, Check, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const [clientName, setClientName] = useState('');
  const [price, setPrice] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!clientName || !price) {
      setError('נא למלא את כל השדות');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      const docRef = await addDoc(collection(db, 'contracts'), {
        clientName: clientName.trim(),
        price: price.trim(),
        createdAt: serverTimestamp(),
      });
      
      const link = `${window.location.origin}/?id=${docRef.id}`;
      setGeneratedLink(link);
      setCopied(false);
    } catch (err) {
      console.error("Error creating contract:", err);
      setError('שגיאה ביצירת החוזה');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-background-app, #faf9f6)', padding: '1rem' }}>
      <div className="wizard-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', backgroundColor: '#ffffff', borderRadius: '20px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
          <Settings size={28} color="var(--color-secondary, #c9a76d)" />
          <h2 style={{ fontSize: '1.8rem', margin: 0, fontFamily: 'Playfair Display, serif', color: 'var(--color-primary, #1c1c1c)' }}>יצירת חוזה חדש</h2>
        </div>

        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-primary, #1c1c1c)' }}>שמות בני הזוג</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder='למשל: ישראל וישראלה'
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-secondary, #c9a76d)';
                e.target.style.boxShadow = '0 0 0 3px rgba(201, 167, 109, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-primary, #1c1c1c)' }}>מחיר מוסכם</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder='למשל: 3,500'
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-secondary, #c9a76d)';
                e.target.style.boxShadow = '0 0 0 3px rgba(201, 167, 109, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {error && <p style={{ color: '#e03131', margin: 0, fontSize: '0.9rem' }}>{error}</p>}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isGenerating}
            style={{ 
              marginTop: '1rem', 
              width: '100%', 
              backgroundColor: 'var(--color-primary, #1c1c1c)', 
              color: '#ffffff',
              borderRadius: '9999px',
              padding: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              border: 'none',
              cursor: isGenerating ? 'not-allowed' : 'pointer'
            }}
          >
            {isGenerating ? 'מייצר...' : 'צור קישור לחוזה'}
          </button>
        </form>

        {generatedLink && (
          <div className="animate-fade-in" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500', color: 'var(--color-primary, #1c1c1c)' }}>הקישור נוצר בהצלחה!</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem' }}>
              <input 
                type="text" 
                value={generatedLink} 
                readOnly 
                style={{ flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '0.9rem', direction: 'ltr', textAlign: 'left' }}
              />
              <button 
                onClick={copyToClipboard}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: '6px', backgroundColor: copied ? '#e6f4ea' : '#f1f5f9' }}
                title="העתק קישור"
              >
                {copied ? <Check size={18} color="#137333" /> : <Copy size={18} color="var(--color-text-muted, #666666)" />}
              </button>
            </div>
            <a href={generatedLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '1rem', color: 'var(--color-secondary, #c9a76d)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
              <Link size={16} />
              פתח בחלון חדש
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
