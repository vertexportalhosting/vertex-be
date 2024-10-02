export function getTemplateHTML(doctor: any) {
   return ` <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doctor Registration Notification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #007bff; padding: 20px; color: #ffffff; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 24px;">Doctor Registration</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 20px; color: #333333;">
                            <h2 style="margin-top: 0;">Hello,</h2>
                            <p>We are pleased to inform you that a new doctor has successfully registered on our portal.</p>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding: 10px 0;"><strong>Doctor Name:</strong></td>
                                    <td style="padding: 10px 0;">${doctor.username}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;"><strong>Email:</strong></td>
                                    <td style="padding: 10px 0;">${doctor.email}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;"><strong>Specialization:</strong></td>
                                    <td style="padding: 10px 0;">Dentist</td>
                                </tr>
                            </table>

                            <p>Thank you for trusting our services.</p>
                            <p style="text-align: center;">
                                <a href="https://vertexdentalstudiocases.com/" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Visit Portal</a>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f4f4f4; padding: 20px; font-size: 12px; color: #999999; border-radius: 0 0 10px 10px;">
                            <p>&copy; 2024 vertexdentalstudios. All Rights Reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
}