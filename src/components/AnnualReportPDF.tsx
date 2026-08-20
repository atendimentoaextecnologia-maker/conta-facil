import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { AnnualSummary } from '@/hooks/useAnnualSummary';

interface GeneratePDFOptions {
  summary: AnnualSummary;
  chartElement: HTMLElement | null;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export async function generateAnnualReportPDF({ summary, chartElement }: GeneratePDFOptions) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 20;

  // Title
  pdf.setFontSize(24);
  pdf.setTextColor(79, 70, 229); // Primary color
  pdf.text(`Relatório Anual ${summary.year}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Subtitle
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Summary Stats Section
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Resumo Financeiro', margin, yPosition);
  yPosition += 10;

  // Draw stats boxes
  const boxWidth = (pageWidth - margin * 2 - 10) / 2;
  const boxHeight = 25;

  // Total Income Box
  pdf.setFillColor(240, 253, 244); // Success light
  pdf.roundedRect(margin, yPosition, boxWidth, boxHeight, 3, 3, 'F');
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Total Receitas', margin + 5, yPosition + 8);
  pdf.setFontSize(14);
  pdf.setTextColor(22, 163, 74); // Success color
  pdf.text(formatCurrency(summary.totals.totalIncome), margin + 5, yPosition + 18);

  // Total Spent Box
  pdf.setFillColor(254, 242, 242); // Destructive light
  pdf.roundedRect(margin + boxWidth + 10, yPosition, boxWidth, boxHeight, 3, 3, 'F');
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Total Gastos', margin + boxWidth + 15, yPosition + 8);
  pdf.setFontSize(14);
  pdf.setTextColor(220, 38, 38); // Destructive color
  pdf.text(formatCurrency(summary.totals.totalSpent), margin + boxWidth + 15, yPosition + 18);

  yPosition += boxHeight + 10;

  // Total Budget Box
  pdf.setFillColor(238, 242, 255); // Primary light
  pdf.roundedRect(margin, yPosition, boxWidth, boxHeight, 3, 3, 'F');
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Total Orçado', margin + 5, yPosition + 8);
  pdf.setFontSize(14);
  pdf.setTextColor(79, 70, 229); // Primary color
  pdf.text(formatCurrency(summary.totals.totalBudget), margin + 5, yPosition + 18);

  // Balance Box
  const balanceColor = summary.totals.totalBalance >= 0 ? [22, 163, 74] : [220, 38, 38];
  const balanceBg = summary.totals.totalBalance >= 0 ? [240, 253, 244] : [254, 242, 242];
  pdf.setFillColor(balanceBg[0], balanceBg[1], balanceBg[2]);
  pdf.roundedRect(margin + boxWidth + 10, yPosition, boxWidth, boxHeight, 3, 3, 'F');
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Saldo Anual', margin + boxWidth + 15, yPosition + 8);
  pdf.setFontSize(14);
  pdf.setTextColor(balanceColor[0], balanceColor[1], balanceColor[2]);
  pdf.text(formatCurrency(summary.totals.totalBalance), margin + boxWidth + 15, yPosition + 18);

  yPosition += boxHeight + 15;

  // Best/Worst Month
  if (summary.totals.bestMonth || summary.totals.worstMonth) {
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Destaques do Ano', margin, yPosition);
    yPosition += 8;

    if (summary.totals.bestMonth) {
      pdf.setFontSize(11);
      pdf.setTextColor(22, 163, 74);
      pdf.text(`🏆 Melhor mês: ${summary.totals.bestMonth.monthLabel.toUpperCase()} (${summary.totals.bestMonth.savingsRate.toFixed(1)}% de economia)`, margin, yPosition);
      yPosition += 7;
    }

    if (summary.totals.worstMonth && summary.totals.bestMonth !== summary.totals.worstMonth) {
      pdf.setFontSize(11);
      pdf.setTextColor(220, 38, 38);
      pdf.text(`⚠️ Pior mês: ${summary.totals.worstMonth.monthLabel.toUpperCase()} (${summary.totals.worstMonth.savingsRate.toFixed(1)}% de economia)`, margin, yPosition);
      yPosition += 7;
    }

    yPosition += 8;
  }

  // Average Savings Rate
  pdf.setFontSize(12);
  pdf.setTextColor(79, 70, 229);
  pdf.text(`Taxa média de economia: ${summary.totals.avgSavingsRate.toFixed(1)}%`, margin, yPosition);
  yPosition += 15;

  // Monthly Breakdown Table
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Detalhamento Mensal', margin, yPosition);
  yPosition += 10;

  // Table Header
  const colWidths = [25, 40, 40, 40, 25];
  const headers = ['Mês', 'Receitas', 'Despesas', 'Saldo', 'Economia'];
  
  pdf.setFillColor(79, 70, 229);
  pdf.rect(margin, yPosition, pageWidth - margin * 2, 8, 'F');
  pdf.setFontSize(9);
  pdf.setTextColor(255, 255, 255);
  
  let xPos = margin + 3;
  headers.forEach((header, i) => {
    pdf.text(header, xPos, yPosition + 5.5);
    xPos += colWidths[i];
  });
  yPosition += 8;

  // Table Rows
  const monthsWithData = summary.months.filter(m => m.totalIncome > 0 || m.totalSpent > 0);
  
  monthsWithData.forEach((month, index) => {
    const bgColor = index % 2 === 0 ? [249, 250, 251] : [255, 255, 255];
    pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    pdf.rect(margin, yPosition, pageWidth - margin * 2, 7, 'F');
    
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    
    xPos = margin + 3;
    pdf.text(month.monthLabel.toUpperCase(), xPos, yPosition + 5);
    xPos += colWidths[0];
    
    pdf.setTextColor(22, 163, 74);
    pdf.text(formatCurrency(month.totalIncome), xPos, yPosition + 5);
    xPos += colWidths[1];
    
    pdf.setTextColor(220, 38, 38);
    pdf.text(formatCurrency(month.totalSpent), xPos, yPosition + 5);
    xPos += colWidths[2];
    
    const balColor = month.balance >= 0 ? [22, 163, 74] : [220, 38, 38];
    pdf.setTextColor(balColor[0], balColor[1], balColor[2]);
    pdf.text(formatCurrency(month.balance), xPos, yPosition + 5);
    xPos += colWidths[3];
    
    pdf.setTextColor(79, 70, 229);
    pdf.text(`${month.savingsRate.toFixed(0)}%`, xPos, yPosition + 5);
    
    yPosition += 7;
  });

  yPosition += 10;

  // Capture chart if available
  if (chartElement) {
    try {
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Check if we need a new page
      if (yPosition + imgHeight > pdf.internal.pageSize.getHeight() - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Gráfico Anual', margin, yPosition);
      yPosition += 8;
      
      pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
    } catch (error) {
      console.error('Error capturing chart:', error);
    }
  }

  // Footer
  const footerY = pdf.internal.pageSize.getHeight() - 10;
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text('Relatório gerado automaticamente pelo sistema de controle financeiro', pageWidth / 2, footerY, { align: 'center' });

  // Download
  pdf.save(`relatorio-anual-${summary.year}.pdf`);
}
