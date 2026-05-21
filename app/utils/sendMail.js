export const sendInviteMail = async (email, link) => {
  // Use Resend HTTP API to bypass Render's SMTP firewall
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer re_VkfnTMCr_B4mH9WJCaPiG8crDxqaUrmKa`,
    },
    body: JSON.stringify({
      from: "TaskFlow <onboarding@resend.dev>", // Required sender for free tier
      to: [email],
      subject: "Board Invitation 🚀",
      html: `
        <h2>You are invited to collaborate</h2>
        <p>Someone has invited you to collaborate on a board in TaskFlow.</p>
        <a href="${link}" style="display:inline-block;padding:10px 20px;background-color:#2563eb;color:white;text-decoration:none;border-radius:5px;font-weight:bold;">Click here to join</a>
      `,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send email via Resend");
  }
  
  return data;
};