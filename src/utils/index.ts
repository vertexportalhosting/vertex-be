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
</html>`;
}

export function getCaseHTML(_case: any) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #007bff; padding: 20px; color: #ffffff; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 24px;">Case Details</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 20px; color: #333333;">
                            <h2 style="margin-top: 0;">Hello, ${_case?.user?.role === 'admin' ? 'Admin' : _case?.user?.username}</h2>
                            <p>Here are the details of the case submitted on the portal:</p>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding: 10px 0;"><strong>Patient Name:</strong></td>
                                    <td style="padding: 10px 0;">${_case?.patient?.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;"><strong>Type of Case:</strong></td>
                                    <td style="padding: 10px 0;">${_case?.case_type}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;"><strong>Type of Restorations:</strong></td>
                                    <td style="padding: 10px 0;">${_case?.notes}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;"><strong>Case Notes:</strong></td>
                                    <td style="padding: 10px 0;">${_case?.patient?.notes}</td>
                                </tr>
                            </table>

                            <p>For more information, please log in to the portal.</p>
                            <p style="text-align: center;">
                                <a href="https://vertexdentalstudiocases.com/case/view/${_case?.id}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">View Case in Portal</a>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f4f4f4; padding: 20px; font-size: 12px; color: #999999; border-radius: 0 0 10px 10px;">
                            <p>&copy; 2024 Your Portal. All Rights Reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
}

export function getNotifyScanHTML(_case: any) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #007bff; padding: 20px; color: #ffffff; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 24px;">New Scans Uploaded</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 20px; color: #333333;">
                            <h2 style="margin-top: 0;">Hello, ${_case?.user?.role === 'admin' ? 'Admin' : _case?.user?.username}</h2>
                            <h3>New Scans are uploaded by Vertex</h3>
                            <p>The case with the following details has been updated on the portal:</p>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding: 10px 0;"><strong>Patient Name:</strong></td>
                                    <td style="padding: 10px 0;">${_case?.patient?.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;"><strong>Type of Case:</strong></td>
                                    <td style="padding: 10px 0;">${_case?.case_type}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;"><strong>Type of Restorations:</strong></td>
                                    <td style="padding: 10px 0;">${_case?.notes}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;"><strong>Case Notes:</strong></td>
                                    <td style="padding: 10px 0;">${_case?.patient?.notes}</td>
                                </tr>
                            </table>

                            <p>For more information, please log in to the portal.</p>
                            <p style="text-align: center;">
                                <a href="https://vertexdentalstudiocases.com/case/view/${_case?.id}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">View Case in Portal</a>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f4f4f4; padding: 20px; font-size: 12px; color: #999999; border-radius: 0 0 10px 10px;">
                            <p>&copy; 2024 Your Portal. All Rights Reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
}

export function getNotifyCaseHTML(_case: any) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #007bff; padding: 20px; color: #ffffff; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 24px;">Case Status Update</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 20px; color: #333333;">
                            <h2 style="margin-top: 0;">Hello, ${_case?.user?.role === 'admin' ? 'Admin' : _case?.user?.username}</h2>
                            
                            <p>The case with the following details has been 
                                <strong>${_case?.case_status === 'completed' ? 'marked as completed' : 'received'}</strong> on the portal:</p>

                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding: 10px 0;"><strong>Patient Name:</strong></td>
                                    <td style="padding: 10px 0;">${_case?.patient?.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;"><strong>Type of Case:</strong></td>
                                    <td style="padding: 10px 0;">${_case?.case_type}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;"><strong>Type of Restorations:</strong></td>
                                    <td style="padding: 10px 0;">${_case?.notes}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;"><strong>Case Notes:</strong></td>
                                    <td style="padding: 10px 0;">${_case?.patient?.notes}</td>
                                </tr>
                            </table>

                            <p>For more information, please log in to the portal.</p>
                            <p style="text-align: center;">
                                <a href="https://vertexdentalstudiocases.com/case/view/${_case?.id}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">View Case in Portal</a>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #f4f4f4; padding: 20px; font-size: 12px; color: #999999; border-radius: 0 0 10px 10px;">
                            <p>&copy; 2024 Your Portal. All Rights Reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
}

export function getOtpTemplateHTML(doctor: any, otp: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>OTP Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #007bff; padding: 20px; color: #ffffff; border-radius: 10px 10px 0 0;">
                            <h1 style="margin: 0; font-size: 24px;">OTP Verification</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 20px; color: #333333;">
                            <h2 style="margin-top: 0;">Hello ${doctor?.username || ''},</h2>
                            <p>Please use the following One-Time Password (OTP) to verify your email address:</p>

                            <div style="text-align: center; margin: 30px 0;">
                                <span style="display: inline-block; padding: 15px 30px; font-size: 24px; background-color: #f1f1f1; border-radius: 8px; letter-spacing: 6px; font-weight: bold; color: #333;">
                                    ${otp}
                                </span>
                            </div>

                            <p>This code is valid for the next 10 minutes. Do not share it with anyone.</p>
                            <p>If you did not request this, please ignore this email.</p>

                            <p style="text-align: center; margin-top: 30px;">
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
</html>`;
}

export function sendNewsletterTemplateHTML(
  doctor: any,
  wysiwygContent: string,
) {
  const base64Image =
    'https://vertexdentalstudiocases.com/assets/vertex-letterheed.jpg';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Newsletter</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">   
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          
          <!-- Header Image -->
          <tr>
            <td align="center" style="padding: 0; border-radius: 10px 10px 0 0; overflow: hidden;">
              <img src="${base64Image}" alt="Header Image" style="width: 100%; display: block; max-height: 200px; object-fit: cover;"/>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 20px; color: #333333;">
              <div style="margin: 20px 0;">
                ${wysiwygContent}
              </div>
              <p style="text-align: center; margin-top: 30px;">
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
</html>`;
}
