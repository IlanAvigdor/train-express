import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import WelcomeStep from './steps/WelcomeStep';
import ClientInfoStep from './steps/ClientInfoStep';
import EventDetailsStep from './steps/EventDetailsStep';
import PackageDetailsStep from './steps/PackageDetailsStep';
import TermsStep from './steps/TermsStep';
import SignatureStep from './steps/SignatureStep';
import ContractPDFTemplate from './ContractPDFTemplate';

const STEPS = [
  WelcomeStep,
  ClientInfoStep,
  EventDetailsStep,
  PackageDetailsStep,
  TermsStep,
  SignatureStep
];

const Wizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [debugMsg, setDebugMsg] = useState("");
  const pdfRef = useRef(null);
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    eventDate: '',
    guestsCount: '',
    location: '',
    signature: null,
  });

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

      setDebugMsg("Step 3: Taking screenshot (html2canvas)...");
      const canvas = await html2canvas(element, {
        scale: 2, // High quality
        useCORS: true,
        logging: true
      });
      
      setDebugMsg("Step 4: Creating PDF (jsPDF)...");
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      
      setDebugMsg("Step 5: Preparing file...");
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], "Tamar_Contract.pdf", { type: 'application/pdf' });

      const text = `*חוזה חדש נחתם!* 🎉\n\n*שם הלקוח:* ${finalData.clientName}\n*טלפון:* ${finalData.clientPhone}\n*תאריך האירוע:* ${finalData.eventDate}\n*כמות מוזמנים:* ${finalData.guestsCount}\n*מיקום:* ${finalData.location}\n\nמצורף החוזה החתום כקובץ PDF.`;

      setDebugMsg("Step 6: Triggering Web Share...");
      // Try Web Share API (mostly mobile)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'חוזה התקשרות חתום',
          text: text,
          files: [file]
        });
        setDebugMsg("Done! Shared via navigator.share");
      } else {
        // Fallback for desktop or unsupported browsers
        setDebugMsg("Step 6b: Fallback to download...");
        try {
          pdf.save("Tamar_Contract_Signed.pdf");
        } catch (e) {
          console.error("Could not save PDF locally", e);
        }
        
        const phoneNumber = "972585800933";
        const encodedText = encodeURIComponent(text + '\n(שים לב: הקובץ ירד למחשב, נא לצרף אותו ידנית)');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
        window.location.href = whatsappUrl;
      }
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
      
      {/* Hidden PDF Template for rendering */}
      <div style={{ position: 'absolute', top: 0, left: 0, opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
        <ContractPDFTemplate ref={pdfRef} formData={formData} />
      </div>
    </>
  );
};

export default Wizard;
