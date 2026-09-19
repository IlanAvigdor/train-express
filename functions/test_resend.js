const { Resend } = require('resend');

const pdfBuffer = Buffer.from('fake pdf data');
const pdfBase64 = pdfBuffer.toString('base64');

console.log("With Buffer:", JSON.stringify({ attachments: [{ filename: 'test.pdf', content: pdfBuffer }] }));
console.log("With Base64:", JSON.stringify({ attachments: [{ filename: 'test.pdf', content: pdfBase64 }] }));
