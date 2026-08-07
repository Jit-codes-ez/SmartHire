package com.smarthire.service.impl;

import com.smarthire.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(new InternetAddress(fromEmail, "SmartHire"));
            helper.setTo(toEmail);
            helper.setSubject("SmartHire — Your verification code");
            helper.setText(buildOtpEmailHtml(otp), true);

            mailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
    @Override
    public void sendRecruiterApprovalEmail(String toEmail, String fullName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(new InternetAddress(fromEmail, "SmartHire"));
            helper.setTo(toEmail);
            helper.setSubject("SmartHire — Recruiter Account Approved");
            helper.setText(buildRecruiterApprovalEmailHtml(fullName),true);
            mailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to send recruiter approval email",e);
        }
    }

    @Override
    public void sendRecruiterRejectionEmail(String toEmail, String fullName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(new InternetAddress(fromEmail, "SmartHire"));
            helper.setTo(toEmail);
            helper.setSubject("SmartHire — Recruiter Registration Update");
            helper.setText(buildRecruiterRejectionEmailHtml(fullName), true);
            mailSender.send(message);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to send recruiter rejection email",e);
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
                              <td style="width:40px; height:40px; padding: 3px;">
        						<img src="%s" width="34" height="34" alt="SmartHire" style="-display:block; width:34px; height:34px; object-fit:contain; border-radius:8px; background-color:#FFFFFF;" />
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
                            Enter the code below to verify your email and continue using SmartHire.
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

                          <p style="margin:0; color:#94A3B8; font-size:12px; line-height:18px; text-align: center;">
                            Need help? Reach us anytime at
                            <a href="mailto:smarthire.js@gmail.com" style="color:#4F46E5; text-decoration:none;">SmartHire Support</a>
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td class="footer-cell" style="background-color:#F8FAFC; padding: 18px 32px; border-top:1px solid #E2E8F0;">
                          <table width="100%%" cellpadding="0" cellspacing="0" class="footer-table" align = "centre" >
                            <tr>
                              <td style="text-align:center;">
                                <span style="color:#94A3B8; font-size:11px;">© 2026 SmartHire. All rights reserved.</span>
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
    
    private String buildRecruiterApprovalEmailHtml(String fullName) {
        String logoUrl =
            "https://raw.githubusercontent.com/Jit-codes-ez/SmartHire/main/Assets/Logo.png";

        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0;padding:0;background:#EEF1F6;font-family:Helvetica,Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="padding:48px 16px;">
                <tr>
                  <td align="center">

                    <table width="480" cellpadding="0" cellspacing="0"
                           style="width:480px;max-width:480px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">

                      <!-- Header -->
                      <tr>
                        <td class="header-cell"
                            style="background:linear-gradient(135deg,#4F46E5 0%%,#6366F1 100%%);padding:32px 32px 28px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:40px;height:40px;padding:3px;">
                                <img src="%s"
                                     width="34"
                                     height="34"
                                     alt="SmartHire"
                                     style="display:block;width:34px;height:34px;object-fit:contain;border-radius:8px;background-color:#FFFFFF;">
                              </td>
                              <td style="padding-left:10px;">
                                <span style="color:#FFFFFF;font-size:19px;font-weight:bold;letter-spacing:-0.3px;">
                                  SmartHire
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Body -->
                      <tr>
                        <td style="padding:36px 32px 30px;">

                          <div style="display:inline-block;background:#DCFCE7;color:#15803D;font-size:11px;font-weight:bold;padding:4px 10px;border-radius:20px;margin-bottom:14px;">
                            ACCOUNT APPROVED
                          </div>

                          <h2 style="margin:0 0 10px;color:#0F172A;font-size:21px;">
                            Congratulations, %s!
                          </h2>

                          <p style="margin:0 0 18px;color:#64748B;font-size:14px;line-height:21px;">
                            Your SmartHire recruiter registration has been reviewed and approved by the administrator.
                          </p>

                          <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
                            <strong style="color:#15803D;font-size:15px;">
                              Your recruiter account is now active.
                            </strong>
                            <p style="color:#64748B;font-size:13px;margin:6px 0 0;">
                              You can now log in to SmartHire.
                            </p>
                          </div>

                          <p style="margin:0 0 24px;color:#64748B;font-size:14px;line-height:21px;">
                            Thank you for choosing SmartHire. We look forward to helping you connect with talented students.
                          </p>

                          <hr style="border:none;border-top:1px solid #E2E8F0;margin:0 0 20px;">

                          <p style="margin:0;color:#94A3B8;font-size:12px;text-align:center;">
                            Need help?
                            <a href="mailto:smarthire.js@gmail.com"
                               style="color:#4F46E5;text-decoration:none;">
                              SmartHire Support
                            </a>
                          </p>

                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background:#F8FAFC;padding:18px 32px;border-top:1px solid #E2E8F0;text-align:center;">
                          <span style="color:#94A3B8;font-size:11px;">
                            © 2026 SmartHire. All rights reserved.
                          </span>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(logoUrl, fullName);
    }
    
    private String buildRecruiterRejectionEmailHtml(String fullName) {
        String logoUrl =
            "https://raw.githubusercontent.com/Jit-codes-ez/SmartHire/main/Assets/Logo.png";

        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>

            <body style="margin:0;padding:0;background:#EEF1F6;font-family:Helvetica,Arial,sans-serif;">

              <table width="100%%" cellpadding="0" cellspacing="0"
                     style="padding:48px 16px;">
                <tr>
                  <td align="center">

                    <table width="480" cellpadding="0" cellspacing="0"
                           style="width:480px;max-width:480px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">

                      <!-- Header -->
                      <tr>
                        <td class="header-cell"
                            style="background:linear-gradient(135deg,#4F46E5 0%%,#6366F1 100%%);padding:32px 32px 28px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:40px;height:40px;padding:3px;">
                                <img src="%s"
                                     width="34"
                                     height="34"
                                     alt="SmartHire"
                                     style="display:block;width:34px;height:34px;object-fit:contain;border-radius:8px;background-color:#FFFFFF;">
                              </td>

                              <td style="padding-left:10px;">
                                <span style="color:#FFFFFF;font-size:19px;font-weight:bold;letter-spacing:-0.3px;">
                                  SmartHire
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Body -->
                      <tr>
                        <td style="padding:36px 32px 30px;">

                          <div style="display:inline-block;background:#FEF2F2;color:#B91C1C;font-size:11px;font-weight:bold;padding:4px 10px;border-radius:20px;margin-bottom:14px;">
                            REGISTRATION UPDATE
                          </div>

                          <h2 style="margin:0 0 10px;color:#0F172A;font-size:21px;">
                            Hello, %s
                          </h2>

                          <p style="margin:0 0 18px;color:#64748B;font-size:14px;line-height:21px;">
                            Thank you for your interest in joining SmartHire as a recruiter.
                          </p>

                          <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;padding:20px;margin-bottom:24px;">
                            <strong style="color:#9A3412;font-size:15px;">
                              Registration not approved
                            </strong>

                            <p style="color:#64748B;font-size:13px;line-height:20px;margin:8px 0 0;">
                              We’re sorry to inform you that your recruiter registration has not been approved by the administrator at this time.
                            </p>
                          </div>

                          <p style="margin:0 0 24px;color:#64748B;font-size:14px;line-height:21px;">
                            If you believe this was unexpected or need further information, please contact SmartHire support.
                          </p>

                          <hr style="border:none;border-top:1px solid #E2E8F0;margin:0 0 20px;">

                          <p style="margin:0;color:#94A3B8;font-size:12px;text-align:center;">
                            Need help?
                            <a href="mailto:smarthire.js@gmail.com"
                               style="color:#4F46E5;text-decoration:none;">
                              SmartHire Support
                            </a>
                          </p>

                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background:#F8FAFC;padding:18px 32px;border-top:1px solid #E2E8F0;text-align:center;">
                          <span style="color:#94A3B8;font-size:11px;">
                            © 2026 SmartHire. All rights reserved.
                          </span>
                        </td>
                      </tr>

                    </table>

                  </td>
                </tr>
              </table>

            </body>
            </html>
            """.formatted(logoUrl, fullName);
    }
}