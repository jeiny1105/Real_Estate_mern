const inquiryConfirmationTemplate = ({ name, propertyTitle }) => {
  return {
    subject: "Inquiry Received",

    html: `
      <h2>Hello ${name || "User"},</h2>

      <p>Thank you for your inquiry.</p>

      <p>
        We have received your request for 
        <strong>${propertyTitle || "the property"}</strong>.
      </p>

      <p>Our agent will contact you shortly.</p>

      <br/>

      <p>Regards,<br/>Real Estate Team</p>
    `,
  };
};

module.exports = inquiryConfirmationTemplate;