import React, { useState, useRef, useEffect } from 'react';
import WelcomeStep from './steps/WelcomeStep';
import ClientInfoStep from './steps/ClientInfoStep';
import EventDetailsStep from './steps/EventDetailsStep';
import PackageDetailsStep from './steps/PackageDetailsStep';
import SignatureStep from './steps/SignatureStep';
import TermsStep from './steps/TermsStep';
import { functions } from '../firebase';
import { httpsCallable } from 'firebase/functions';

const STEPS = [
  WelcomeStep,
  ClientInfoStep,
  EventDetailsStep,
  PackageDetailsStep,
  TermsStep,
  SignatureStep
];

const Wizard = () => {
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = sessionStorage.getItem('wizardStep');
    return savedStep ? parseInt(savedStep, 10) : 0;
  });
  
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [debugMsg, setDebugMsg] = useState("");
  
  const [formData, setFormData] = useState(() => {
    const savedData = sessionStorage.getItem('wizardData');
    return savedData ? JSON.parse(savedData) : {
      clientName: '',
      clientPhone: '',
      eventDate: '',
      guestsCount: '',
      location: '',
      signature: null,
    };
  });

  useEffect(() => {
    sessionStorage.setItem('wizardStep', currentStep);
  }, [currentStep]);

  useEffect(() => {
    sessionStorage.setItem('wizardData', JSON.stringify(formData));
  }, [formData]);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const submitForm = async (signatureData) => {
    try {
      setDebugMsg("Step 1: מעדכן נתונים אחרונים...");
      const finalData = { ...formData, signature: signatureData };
      setFormData(finalData);
      setIsGeneratingPDF(true);

      setDebugMsg("Step 2: שולח נתונים לשרת להפקת PDF...");
      
      const sendContract = httpsCallable(functions, 'sendSignedContract');
      
      await sendContract({
        clientName: finalData.clientName,
        clientPhone: finalData.clientPhone,
        eventDate: finalData.eventDate,
        guestsCount: finalData.guestsCount,
        location: finalData.location,
        clientEmail: finalData.clientEmail || '',
        signature: finalData.signature // Base64 signature image
      });

      setDebugMsg("Done! החוזה נשלח בהצלחה למייל.");

      // Notify Tamar via WhatsApp
      const text = `*חוזה חדש נחתם!* 🎉\n\n*שם הלקוח:* ${finalData.clientName}\n*טלפון:* ${finalData.clientPhone}\n*תאריך האירוע:* ${finalData.eventDate}\n*כמות מוזמנים:* ${finalData.guestsCount}\n*מיקום:* ${finalData.location}\n\nהחוזה נשלח למייל בהצלחה.`;
      const phoneNumber = "972546231678";
      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
      
      // Clear session storage on success
      sessionStorage.removeItem('wizardData');
      sessionStorage.removeItem('wizardStep');
      
      window.location.href = whatsappUrl;

    } catch (error) {
      console.error("Error generating or sharing PDF:", error);
      alert("Error: " + error.message);
      setDebugMsg("Error: " + error.message);
    } finally {
      setTimeout(() => setIsGeneratingPDF(false), 2000);
    }
  };

  const CurrentComponent = STEPS[currentStep];
  const progressPercentage = ((currentStep) / (STEPS.length - 1)) * 100;

  return (
    <>
      <div className="wizard-card animate-fade-in" style={{ opacity: isGeneratingPDF ? 0.5 : 1, pointerEvents: isGeneratingPDF ? 'none' : 'auto' }}>
        {currentStep > 0 && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        )}
        
        {isGeneratingPDF && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.9)', zIndex: 10 }}>
            <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-primary)' }}>מייצר חוזה חתום, נא להמתין...</p>
            <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666', direction: 'ltr' }}>{debugMsg}</p>
          </div>
        )}

        <CurrentComponent 
          formData={formData} 
          updateFormData={updateFormData} 
          nextStep={nextStep} 
          prevStep={prevStep}
          submitForm={submitForm}
        />
      </div>
    </>
  );
};

export default Wizard;
