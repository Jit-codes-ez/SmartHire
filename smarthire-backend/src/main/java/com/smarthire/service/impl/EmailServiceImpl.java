package com.smarthire.service.impl;

import com.smarthire.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("SmartHire — Your verification code");
            helper.setText(buildOtpEmailHtml(otp), true); // true = isHtml

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }

    private String buildOtpEmailHtml(String otp) {
    	String logoUrl = "https://raw.githubusercontent.com/Jit-codes-ez/SmartHire/main/Assets/Logo.png";

        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <style>
                body { margin:0; padding:0; background-color:#EEF1F6; }
                @media only screen and (max-width: 480px) {
                  .email-wrapper { padding: 24px 12px !important; }
                  .email-card { width: 100%% !important; border-radius: 12px !important; }
                  .header-cell { padding: 24px 20px !important; }
                  .body-cell { padding: 28px 20px 8px !important; }
                  .otp-text { font-size: 26px !important; letter-spacing: 4px !important; }
                  .heading-text { font-size: 19px !important; }
                  .footer-cell { padding: 16px 20px !important; }
                  .footer-table td { display:block !important; text-align:center !important; padding-bottom:4px; }
                }
              </style>
            </head>
            <body style="margin:0; padding:0; background-color:#EEF1F6; font-family: Helvetica, Arial, sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" class="email-wrapper" style="padding: 48px 16px;">
                <tr>
                  <td align="center">
                    <table width="480" cellpadding="0" cellspacing="0" class="email-card" style="width:480px; max-width:480px; background-color:#FFFFFF; border-radius:16px; overflow:hidden; box-shadow: 0 8px 24px rgba(15,23,42,0.08); border: 1px solid #E2E8F0;">

                      <!-- Header with logo -->
                      <tr>
                        <td class="header-cell" style="background: linear-gradient(135deg, #4F46E5 0%%, #6366F1 100%%); padding: 32px 32px 28px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:36px; height:36px;">
                                <img src="%s" width="36" height="36" alt="SmartHire"
                                     style="display:block; border-radius:9px; background-color:#FFFFFF;" />
                              </td>
                              <td style="padding-left:10px;">
                                <span style="color:#FFFFFF; font-size:19px; font-weight:bold; letter-spacing:-0.3px;">SmartHire</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Body -->
                      <tr>
                        <td class="body-cell" style="padding: 36px 32px 8px;">
                          <div style="display:inline-block; background-color:#EEF2FF; color:#4F46E5; font-size:11px; font-weight:bold; letter-spacing:0.5px; padding:4px 10px; border-radius:20px; margin-bottom:14px;">
                            EMAIL VERIFICATION
                          </div>
                          <h2 class="heading-text" style="margin:0 0 8px; color:#0F172A; font-size:21px; font-weight:bold;">Verify your email</h2>
                          <p style="margin:0 0 24px; color:#64748B; font-size:14px; line-height:21px;">
                            Enter the code below to verify your email and continue creating your SmartHire account.
                          </p>

                          <!-- OTP box -->
                          <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC; border:1.5px dashed #C7D2FE; border-radius:12px; margin-bottom:20px;">
                            <tr>
                              <td style="padding: 24px 12px; text-align:center;">
                                <span class="otp-text" style="font-size:34px; font-weight:bold; letter-spacing:6px; color:#4F46E5; font-family: 'Courier New', monospace;">%s</span>
                              </td>
                            </tr>
                          </table>

                          <!-- Expiry notice -->
                          <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                            <tr>
                              <td style="vertical-align:middle; padding-right:8px;">
                                <span style="display:inline-block; width:6px; height:6px; border-radius:50%%; background-color:#F59E0B;"></span>
                              </td>
                              <td>
                                <span style="color:#64748B; font-size:13px;">
                                  Expires in <strong style="color:#334155;">10 minutes</strong> — didn't request this? Just ignore this email.
                                </span>
                              </td>
                            </tr>
                          </table>

                          <hr style="border:none; border-top:1px solid #E2E8F0; margin: 0 0 20px;" />

                          <p style="margin:0; color:#94A3B8; font-size:12px; line-height:18px;">
                            Need help? Reach us anytime at
                            <a href="mailto:support@smarthire.com" style="color:#4F46E5; text-decoration:none;">support@smarthire.com</a>
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td class="footer-cell" style="background-color:#F8FAFC; padding: 18px 32px; border-top:1px solid #E2E8F0;">
                          <table width="100%%" cellpadding="0" cellspacing="0" class="footer-table">
                            <tr>
                              <td>
                                <span style="color:#94A3B8; font-size:11px;">© 2026 SmartHire. All rights reserved.</span>
                              </td>
                              <td align="right">
                                <span style="color:#CBD5E1; font-size:11px;">Placement made simple.</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(logoUrl, otp);
    }
}