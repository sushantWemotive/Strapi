module.exports = {
  routes: [
    // ✅ Create Invoice
    {
      method: 'POST',
      path: '/invoices',
      handler: 'invoice.createInvoice',
      config: {
        auth: false
      }
    },

    // ✅ Get All Invoices
    {
      method: 'GET',
      path: '/invoices',
      handler: 'invoice.getAllInvoices',
      config: {
        auth: false
      }
    },

    // ✅ Get Single Invoice
    {
      method: 'GET',
      path: '/invoices/:id',
      handler: 'invoice.getInvoiceById',
      config: {
        auth: false
      }
    },

    // ✅ Update Invoice
    {
      method: 'PUT',
      path: '/invoices/:id',
      handler: 'invoice.updateInvoice',
      config: {
        auth: false
      }
    },

    // ✅ Delete Invoice
    {
      method: 'DELETE',
      path: '/invoices/:id',
      handler: 'invoice.deleteInvoice',
      config: {
        auth: false
      }
    },

    // ✅ Generate PDF for Invoice
    {
      method: 'GET',
      path: '/invoices/:id/generate-pdf',
      handler: 'invoice.generatePDF',
      config: {
        auth: false
      }
    }
  ]
};
