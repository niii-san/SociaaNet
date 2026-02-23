export const otpEmailTemplate = (otp: string, fullName: string) => {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your OTP Code</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f6f8">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Email Container -->
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" 
               style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 40px 20px;">
              <h1 style="color:#ffffff; margin:0; font-size:24px; letter-spacing:1px;">
                🔐 Verification Code
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 30px; color:#333333;">
              
              <p style="margin:0 0 16px 0; font-size:16px;">
                Hi <strong>${fullName}</strong>,
              </p>

              <p style="margin:0 0 24px 0; font-size:15px; line-height:1.6; color:#555;">
                Use the One-Time Password (OTP) below to complete your verification. 
                This code is valid for <strong>15 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <div style="
                      display:inline-block;
                      padding:18px 36px;
                      font-size:32px;
                      letter-spacing:8px;
                      font-weight:bold;
                      color:#4f46e5;
                      background:#f3f4f6;
                      border-radius:8px;
                      border:2px dashed #4f46e5;">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0 0; font-size:14px; line-height:1.6; color:#777;">
                If you did not request this code, please ignore this email or contact our support team immediately.
              </p>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="height:1px; background:#eeeeee;"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px 30px; font-size:12px; color:#999999;">
              © ${new Date().getFullYear()} SociaaNet<br>
              This is an automated message. Please do not reply.
            </td>
          </tr>

        </table>
        <!-- End Container -->

      </td>
    </tr>
  </table>

</body>
</html>`;
};
