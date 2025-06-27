'use strict';

const PDFDocument = require('pdfkit');
const stream = require('stream');

module.exports = {
  //  Create Invoice
  async createInvoice(ctx) {
    const { data } = ctx.request.body;
    const invoice = await strapi.entityService.create('api::invoice.invoice', { data });
    ctx.send(invoice);
  },

  // Get All Invoices
  async getAllInvoices(ctx) {
    const invoices = await strapi.entityService.findMany('api::invoice.invoice', {});

    ctx.send(invoices);
  },

  // Get Single Invoice by ID
  async getInvoiceById(ctx) {
    const { id } = ctx.params;

    const invoice = await strapi.entityService.findOne('api::invoice.invoice', id);

    if (!invoice) {
      return ctx.notFound('Invoice not found');
    }

    ctx.send(invoice);
  },

  //  Update Invoice
  async updateInvoice(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    const invoice = await strapi.entityService.update('api::invoice.invoice', id, { data });

    ctx.send(invoice);
  },

  // Delete Invoice
  async deleteInvoice(ctx) {
    const { id } = ctx.params;

    const invoice = await strapi.entityService.delete('api::invoice.invoice', id);

    ctx.send({ message: 'Invoice deleted successfully', invoice });
  },

  // Generate PDF for Invoice
async generatePDF(ctx) {
  const { id } = ctx.params;

  try {
    const invoice = await strapi.entityService.findOne('api::invoice.invoice', id);
    
    if (!invoice) {
      return ctx.notFound('Invoice not found');
    }

    const doc = new PDFDocument();
    
    // Set response headers before piping
    ctx.set('Content-Type', 'application/pdf');
    ctx.set(
      'Content-Disposition',
      `inline; filename=invoice-${invoice.invoiceNumber}.pdf`
    );

    // Pipe directly to the response
    doc.pipe(ctx.res);

    // 🎨 Stylish PDF Content
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .fillColor('#333333')
       .text('INVOICE', { align: 'center', underline: true });

    doc.moveDown(0.5);

    // Add a decorative line
    doc.strokeColor('#3498db')
       .lineWidth(2)
       .moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .stroke();

    doc.moveDown(1);

    // Invoice details with better formatting
    const leftColumn = 50;
    const rightColumn = 300;

    // Invoice header
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text('Invoice Details', leftColumn, doc.y);

    doc.moveDown(0.5);

    // Invoice information
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#333');

    // Left column items
    const startY = doc.y;
    doc.text('Invoice Number:', leftColumn, startY)
       .text('Date:', leftColumn, startY + 25)
       .text('Customer:', leftColumn, startY + 50)
       .text('Amount:', leftColumn, startY + 75)
       .text('Status:', leftColumn, startY + 100);

    // Right column values with some styling
    doc.font('Helvetica-Bold')
       .fillColor('#2980b9')
       .text(invoice.invoiceNumber, rightColumn, startY)
       .text(new Date(invoice.date).toLocaleDateString(), rightColumn, startY + 25)
       .text(invoice.customerName, rightColumn, startY + 50)
       .text(`₹${invoice.amount}`, rightColumn, startY + 75);

    // Style status based on value
    const status = invoice.status?.toLowerCase() || '';
    if (status === 'paid') {
      doc.fillColor('#27ae60');
    } else if (status === 'pending') {
      doc.fillColor('#e67e22');
    } else {
      doc.fillColor('#e74c3c');
    }
    doc.text(invoice.status, rightColumn, startY + 100);

    // Add some decorative elements
    doc.moveDown(2);
    doc.strokeColor('#ecf0f1')
       .lineWidth(10)
       .moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .stroke();

    // Add footer
    doc.fontSize(10)
       .font('Helvetica-Oblique')
       .fillColor('#7f8c8d')
       .text('Thank you for your business!', { align: 'center', width: 500 });

    doc.end();

  } catch (error) {
    strapi.log.error('PDF generation error:', error);
    return ctx.internalServerError('Failed to generate PDF');
  }
}
};
