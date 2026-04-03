const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (payment, user, plan) => {
  return new Promise((resolve, reject) => {

    const invoiceNumber = `INV-${Date.now()}`;

    const invoiceDir = path.join(process.cwd(), "uploads", "invoices");

    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir, { recursive: true });
    }

    const filePath = path.join(invoiceDir, `${invoiceNumber}.pdf`);

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    /* ================= HEADER ================= */

    doc
      .fontSize(24)
      .fillColor("#4F46E5")
      .text("DreamHaven", { align: "left" });

    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Real Estate Platform", { align: "left" });

    doc.moveDown();

    doc
      .fontSize(20)
      .fillColor("black")
      .text("INVOICE", { align: "right" });

    doc.moveDown();

    /* ================= INVOICE DETAILS ================= */

    doc
      .fontSize(11)
      .text(`Invoice Number: ${invoiceNumber}`)
      .text(`Transaction ID: ${payment.transactionId}`)
      .text(
        `Date: ${new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        })}`
      );

    doc.moveDown();

    /* ================= BILL TO ================= */

    doc
      .fontSize(13)
      .fillColor("#4F46E5")
      .text("Bill To");

    doc
      .fontSize(11)
      .fillColor("black")
      .text(user.name)
      .text(user.email);

    doc.moveDown(2);

    /* ================= PLAN DETAILS ================= */

    doc
      .fontSize(13)
      .fillColor("#4F46E5")
      .text("Subscription Details");

    doc
      .fontSize(11)
      .fillColor("black")
      .text(`Plan: ${plan.name}`)
      .text(`Payment Type: ${payment.type}`)
      .text(`Gateway: ${payment.gateway}`);

    if (payment.subscriptionStart) {
      doc.text(
        `Start Date: ${new Date(payment.subscriptionStart).toLocaleDateString(
          "en-IN"
        )}`
      );
    }

    if (payment.subscriptionExpiry) {
      doc.text(
        `Expiry Date: ${new Date(payment.subscriptionExpiry).toLocaleDateString(
          "en-IN"
        )}`
      );
    }

    doc.moveDown(2);

    /* ================= AMOUNT ================= */

    doc
      .fontSize(14)
      .fillColor("#4F46E5")
      .text("Amount Paid");

    doc
      .fontSize(18)
      .fillColor("black")
      .text(`₹${payment.amount.toLocaleString("en-IN")}`);

    doc.moveDown(3);

    /* ================= FOOTER ================= */

    doc
      .fontSize(10)
      .fillColor("gray")
      .text(
        "Thank you for choosing DreamHaven.",
        { align: "center" }
      );

    doc.text(
      "This is a system generated invoice.",
      { align: "center" }
    );

    doc.end();

    stream.on("finish", () => {
      resolve({
        invoiceNumber,
        invoicePath: `uploads/invoices/${invoiceNumber}.pdf`
      });
    });

    stream.on("error", reject);

  });
};

module.exports = {
  generateInvoice
};