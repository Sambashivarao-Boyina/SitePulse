const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_PASSKEY, 
  },
});

const sendMail = async (emails, website, error) => {

  // Generate status code specific error messages
  const getErrorMessage = (statusCode) => {
    switch (statusCode) {
      case 503:
        return "Service Unavailable - The server is temporarily unable to handle requests.";
      case 500:
        return "Internal Server Error - The server encountered an unexpected condition.";
      case 502:
        return "Bad Gateway - The server received an invalid response from upstream.";
      case 504:
        return "Gateway Timeout - The server didn't receive a timely response from upstream.";
      case 404:
        return "Not Found - The requested resource could not be found.";
      case 403:
        return "Forbidden - Access to the resource is forbidden.";
      case 401:
        return "Unauthorized - Authentication is required to access the resource.";
      case 408:
        return "Request Timeout - The server timed out waiting for the request.";
      case 429:
        return "Too Many Requests - The user has sent too many requests in a given time.";
      default:
        return "Unknown Error - An unexpected error occurred.";
    }
  };

  const errorMessage = getErrorMessage(error.statusCode);
  const currentTime = new Date().toLocaleString();

  // Create the HTML email template
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Website Down Alert</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #e74c3c;
                padding-bottom: 20px;
            }
            .logo {
                display: inline-block;
                margin-bottom: 10px;
            }
            .alert-icon {
                color: #e74c3c;
                font-size: 48px;
                margin-bottom: 10px;
            }
            .title {
                color: #e74c3c;
                margin: 0;
                font-size: 28px;
            }
            .website-info {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #e74c3c;
            }
            .status-badge {
                display: inline-block;
                background-color: #e74c3c;
                color: white;
                padding: 5px 15px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 14px;
            }
            .error-details {
                background-color: #fff5f5;
                border: 1px solid #fed7d7;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .warning-box {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #f39c12;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }
            .btn {
                display: inline-block;
                background-color: #3498db;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 5px;
                margin: 10px 0;
            }
            .info-row {
                margin: 10px 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .info-label {
                font-weight: bold;
                color: #555;
            }
            .info-value {
                color: #333;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="alert-icon">⚠️</div>
                <h1 class="title">Website Down Alert</h1>
                <p style="margin: 0; color: #666;">SitePulse Monitoring Service</p>
            </div>

            <div class="website-info">
                <div class="info-row">
                    <span class="info-label">Website:</span>
                    <span class="info-value">${website.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">URL:</span>
                    <span class="info-value"><a href="${
                      website.url
                    }" target="_blank">${website.url}</a></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="status-badge">DOWN</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Detected At:</span>
                    <span class="info-value">${currentTime}</span>
                </div>
            </div>

            <div class="error-details">
                <h3 style="margin-top: 0; color: #e74c3c;">Error Details</h3>
                <div class="info-row">
                    <span class="info-label">Status Code:</span>
                    <span class="info-value">${error.statusCode}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Response Time:</span>
                    <span class="info-value">${error.responseTime}ms</span>
                </div>
                <div style="margin-top: 15px;">
                    <div class="info-label">Error Message:</div>
                    <div style="margin-top: 5px; padding: 10px; background-color: #f8f8f8; border-radius: 4px; font-family: monospace;">
                        ${errorMessage}
                    </div>
                </div>
            </div>

            <div class="warning-box">
                <h3 style="margin-top: 0; color: #856404;">⚠️ Important Warning</h3>
                <p style="margin-bottom: 0;">
                    <strong>Please note:</strong> If your website remains down for 3 consecutive monitoring checks, 
                    your website monitoring service will be automatically disabled in SitePulse to prevent 
                    further alert spam. You can re-enable monitoring once your website is back online.
                </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${
                  website.url
                }" class="btn" target="_blank">Check Website</a>
                <a href="https://sitepulse.com/dashboard" class="btn" target="_blank">View Dashboard</a>
            </div>

            <div class="footer">
                <p>
                    This alert was sent by <strong>SitePulse</strong> - Website Monitoring Service<br>
                    If you no longer wish to receive these alerts, you can disable them in your dashboard.
                </p>
                <p style="font-size: 12px; color: #999;">
                    Alert ID: ${new Date().getTime()}<br>
                    Time: ${currentTime}
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"SitePulse Alert" <alerts@sitepulse.com>',
      to: emails.join(", "), // Send to all emails in the array
      subject: `🚨 Website Down Alert: ${website.name} (${error.statusCode})`,
      html: htmlTemplate,
    });
    return info;
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};

module.exports = sendMail;
