import jsPDF from 'jspdf';
import chroma from 'chroma-js';

export const generateBrandKitPDF = (brandData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = margin;

  // Title page
  doc.setFontSize(28);
  doc.setTextColor(brandData.primary);
  doc.text(brandData.brandName || 'Brand Manuál', pageWidth / 2, y + 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text('Brand Kit - Vygenerované na tvojton.online', pageWidth / 2, y + 35, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(new Date().toLocaleDateString('sk-SK'), pageWidth / 2, y + 45, { align: 'center' });

  doc.addPage();
  y = margin;

  // Color Palette
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text('Farebná paleta', margin, y);
  y += 15;

  const colors = [
    { name: 'Primárna', value: brandData.primary, text: brandData.primaryText },
    { name: 'Sekundárna', value: brandData.secondary, text: brandData.secondaryText },
    { name: 'Akcentová', value: brandData.accent, text: brandData.accentText },
  ];

  colors.forEach((color, i) => {
    const x = margin + (i * ((pageWidth - margin * 2) / 3));
    doc.setFillColor(color.value);
    doc.rect(x, y, 50, 30, 'F');
    doc.setTextColor(color.text);
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
  doc.text(`Nadpisy: ${brandData.headingFont}`, margin, y);
  y += 10;
  doc.text(`Text: ${brandData.bodyFont}`, margin, y);
  y += 20;

  // Tone of Voice
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text('Tón komunikácie', margin, y);
  y += 15;

  doc.setFontSize(10);
  doc.setTextColor(50);
  const toneLines = doc.splitTextToSize(brandData.tone || 'Profesionálny a dôveryhodný prístup.', pageWidth - margin * 2);
  doc.text(toneLines, margin, y);
  y += toneLines.length * 5 + 10;

  // Logo Preview
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text('Logo koncept', margin, y);
  y += 15;

  doc.setFontSize(24);
  doc.setTextColor(brandData.primary);
  doc.text(brandData.brandName || 'Vaša Značka', margin, y);

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Vygenerované na tvojton.online | 100% zadarmo', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }

  return doc;
};
