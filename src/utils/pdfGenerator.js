import jsPDF from 'jspdf';

export const generateBrandKitPDF = (brandData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = margin;

  // Title
  doc.setFontSize(28);
  doc.setTextColor(brandData.primary);
  doc.text(brandData.brandName || 'Brand Manuál', pageWidth / 2, y + 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text('Brand Kit - tvojton.online', pageWidth / 2, y + 35, { align: 'center' });

  doc.addPage();
  y = margin;

  // Colors
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text('Farebná paleta', margin, y);
  y += 15;

  const colors = [
    { name: 'Primárna', value: brandData.primary },
    { name: 'Sekundárna', value: brandData.secondary },
    { name: 'Akcentová', value: brandData.accent }
  ];

  colors.forEach((color, i) => {
    const x = margin + (i * 60);
    doc.setFillColor(color.value);
    doc.rect(x, y, 50, 30, 'F');
    doc.setTextColor(brandData.primaryText);
    doc.setFontSize(10);
    doc.text(color.name, x + 25, y + 15, { align: 'center' });
    doc.text(color.value, x + 25, y + 25, { align: 'center' });
  });

  y += 50;

  // Fonts
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text('Typografia', margin, y);
  y += 15;

  doc.setFontSize(12);
  doc.setTextColor(brandData.primary);
  doc.text('Nadpisy: ' + brandData.headingFont, margin, y);
  y += 10;
  doc.text('Text: ' + brandData.bodyFont, margin, y);

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('tvojton.online', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }

  return doc;
};
