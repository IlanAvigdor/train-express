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
      const finalData = { ...formData, signature: signatureData };
      setFormData(finalData); // update state so PDF ref has the signature
      setIsGeneratingPDF(true);

      // Wait for React to render the signature in the hidden template
      await new Promise(resolve => setTimeout(resolve, 300));

      const element = pdfRef.current;
      if (!element) {
        throw new Error("PDF Template element is null");
      }

      const canvas = await html2canvas(element, {
        scale: 2, // High quality
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], "Tamar_Contract.pdf", { type: 'application/pdf' });

      const text = `*חוזה חדש נחתם!* 🎉\n\n*שם הלקוח:* ${finalData.clientName}\n*טלפון:* ${finalData.clientPhone}\n*תאריך האירוע:* ${finalData.eventDate}\n*כמות מוזמנים:* ${finalData.guestsCount}\n*מיקום:* ${finalData.location}\n\nמצורף החוזה החתום כקובץ PDF.`;

      // Try Web Share API (mostly mobile)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'חוזה התקשרות חתום',
          text: text,
          files: [file]
        });
      } else {
        // Fallback for desktop or unsupported browsers
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
    } finally {
      setIsGeneratingPDF(false);
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
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 10 }}>
            <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-primary)' }}>מייצר חוזה חתום, נא להמתין...</p>
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
      <ContractPDFTemplate ref={pdfRef} formData={formData} />
    </>
  );
};

export default Wizard;
