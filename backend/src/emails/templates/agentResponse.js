const agentResponseTemplate = ({ name, propertyTitle, response }) => {
  return {
    subject: "Response to your inquiry",

    html: `
      <h2>Hello ${name || "User"},</h2>

      <p>Your inquiry for <strong>${propertyTitle || "the property"}</strong> has been answered.</p>

      <p><strong>Agent Response:</strong></p>

      <p style="background:#f4f4f4;padding:10px;border-radius:5px;">
        ${response}
      </p>

      <br/>

      <p>Our team is happy to assist you further.</p>

      <p>Regards,<br/>DreamHaven</p>
    `,
  };
};

module.exports = agentResponseTemplate;