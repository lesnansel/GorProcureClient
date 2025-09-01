const functions = require("firebase-functions");
const emailjs = require("emailjs-com");

exports.sendInvitationEmail = functions.https.onCall(async (data) => {
  const { title, category, budget, deadline, description, recipients } = data;

  try {
    console.log("Sending email with data:", { title, category, budget, deadline, description, recipients }); // Debugging
    const response = await emailjs.send(
      "service_p54c9ci", // Replace with your EmailJS service ID
      "template_69uwc1m", // Replace with your EmailJS template ID
      {
        title,
        category,
        budget,
        deadline,
        description,
        recipients,
      },
      "ebHpGetwDLsdJ_lOL" // Replace with the correct Public Key from EmailJS
    );
    return { success: true, response };
  } catch (error) {
    console.error("EmailJS Error:", error); // Debugging
    throw new functions.https.HttpsError("internal", error.message);
  }
});
