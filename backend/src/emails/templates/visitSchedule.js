const visitScheduledTemplate = ({ name, propertyTitle, date, time }) => {
  return {
    subject: "Property Visit Scheduled",

    html: `
      <h2>Hello ${name || "User"},</h2>

      <p>Your visit for <strong>${propertyTitle || "the property"}</strong> has been scheduled.</p>

      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>

      <br/>

      <p>The agent will meet you at the property.</p>

      <p>Regards,<br/>DreamHaven</p>
    `,
  };
};

module.exports = visitScheduledTemplate;