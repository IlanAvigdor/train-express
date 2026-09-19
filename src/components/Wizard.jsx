import React, { useState, useRef, useEffect } from 'react';
import WelcomeStep from './steps/WelcomeStep';
import ClientInfoStep from './steps/ClientInfoStep';
import EventDetailsStep from './steps/EventDetailsStep';
import PackageDetailsStep from './steps/PackageDetailsStep';
import SignatureStep from './steps/SignatureStep';
import TermsStep from './steps/TermsStep';
import ContractPDFTemplate from './ContractPDFTemplate';
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
  const pdfRef = useRef(null);
  
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
      setDebugMsg("Step 1: Updating state...");
      const finalData = { ...formData, signature: signatureData };
      setFormData(finalData); // update state so PDF ref has the signature
      setIsGeneratingPDF(true);

      // Wait for React to render the signature in the hidden template
      setDebugMsg("Step 2: Waiting for render...");
      await new Promise(resolve => setTimeout(resolve, 500));

      const element = pdfRef.current;
      if (!element) {
        throw new Error("PDF Template element is null");
      }

      setDebugMsg("Step 3: Preparing PDF...");

      setDebugMsg("Step 4: Generating PDF as Base64...");
      const opt = {
        margin:       [10, 10, 10, 10],
        filename:     `Tamar_Contract_${finalData.clientName}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true,
          windowWidth: 800,
          rtl: true,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc, clonedElement) => {
            // The cloned element inside the iframe needs its position reset so it isn't rendered off-screen
            const el = clonedElement || clonedDoc.getElementById('contract-content') || clonedDoc.body.firstChild;
            if (el && el.style) {
              el.style.position = 'static';
              el.style.left = '0';
              el.style.top = '0';
              el.style.margin = '0 auto';
              el.style.transform = 'none';
            }
          }
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // Use window.html2pdf loaded from CDN
      const pdfBase64Raw = await window.html2pdf().set(opt).from(element).outputPdf('datauristring');
      
      if (!pdfBase64Raw) {
        throw new Error("Failed to generate PDF Base64");
      }

      // Ensure we extract ONLY the raw base64 string, ignoring any data prefix (like filename)
      const cleanBase64 = pdfBase64Raw.includes("base64,") ? pdfBase64Raw.split("base64,")[1] : pdfBase64Raw;

      setDebugMsg("Step 5: Sending contract to server...");
      
      const sendContract = httpsCallable(functions, 'sendSignedContract');
      
      await sendContract({
        pdfBase64: cleanBase64,
        clientName: finalData.clientName,
        clientPhone: finalData.clientPhone,
        eventDate: finalData.eventDate,
        guestsCount: finalData.guestsCount,
        location: finalData.location,
        clientEmail: finalData.clientEmail || ''
      });

      setDebugMsg("Done! Contract sent successfully via Email.");

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
      
      {/* Hidden PDF Template for rendering - moved far off-screen to hide it from the user */}
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px', pointerEvents: 'none', zIndex: -1 }}>
        <ContractPDFTemplate ref={pdfRef} formData={formData} />
      </div>
    </>
  );
};

export default Wizard;
