package com.smarthire.service.impl;

import sendinblue.ApiClient;
import sendinblue.ApiException;
import sendinblue.Configuration;
import sendinblue.auth.ApiKeyAuth;
import sibApi.TransactionalEmailsApi;
import sibModel.SendSmtpEmail;
import sibModel.SendSmtpEmailSender;
import sibModel.SendSmtpEmailTo;
import com.smarthire.enums.InterviewType;
import com.smarthire.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class EmailServiceImpl implements EmailService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    private void sendEmail(String to, String subject, String html) {
        try {
            ApiClient client = Configuration.getDefaultApiClient();
            ApiKeyAuth apiKey = (ApiKeyAuth) client.getAuthentication("api-key");
            apiKey.setApiKey(brevoApiKey);

            TransactionalEmailsApi api = new TransactionalEmailsApi();

            SendSmtpEmailSender sender = new SendSmtpEmailSender();
            sender.setEmail("smarthire.js@gmail.com");
            sender.setName("SmartHire");

            SendSmtpEmailTo recipient = new SendSmtpEmailTo();
            recipient.setEmail(to);

            SendSmtpEmail email = new SendSmtpEmail();
            email.setSender(sender);
            email.setTo(List.of(recipient));
            email.setSubject(subject);
            email.setHtmlContent(html);

            api.sendTransacEmail(email);
        } catch (ApiException e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        sendEmail(toEmail, "SmartHire — Your verification code", buildOtpEmailHtml(otp));
    }

    @Override
    public void sendRecruiterApprovalEmail(String toEmail, String fullName) {
        sendEmail(toEmail, "SmartHire — Recruiter Account Approved", buildRecruiterApprovalEmailHtml(fullName));
    }

    @Override
    public void sendRecruiterRejectionEmail(String toEmail, String fullName, String adminEmail) {
        sendEmail(toEmail, "SmartHire — Recruiter Registration Update", buildRecruiterRejectionEmailHtml(fullName, adminEmail));
    }

    @Override
    public void sendStudentDeletionEmail(String toEmail, String fullName, String reason) {
        sendEmail(toEmail, "SmartHire — Student Account Deleted", buildStudentDeletionEmailHtml(fullName, reason));
    }

    @Override
    public void sendRecruiterDeletionEmail(String toEmail, String fullName, String reason) {
        sendEmail(toEmail, "SmartHire — Recruiter Account Deleted", buildRecruiterDeletionEmailHtml(fullName, reason));
    }

    @Override
    public void sendStudentShortlistEmail(String toEmail, String fullName, String jobTitle, LocalDate interviewDate, LocalTime interviewTime, InterviewType interviewType, String interviewLocation) {
        sendEmail(toEmail, "SmartHire — You have been shortlisted", buildStudentShortlistEmailHtml(fullName, jobTitle, interviewDate, interviewTime, interviewType, interviewLocation));
    }

    @Override
    public void sendStudentApprovalEmail(String toEmail, String fullName, String jobTitle, LocalDate joiningDate) {
        sendEmail(toEmail, "SmartHire — Congratulations! Your application is approved", buildStudentApprovalEmailHtml(fullName, jobTitle, joiningDate));
    }

    @Override
    public void sendStudentRejectionEmail(String toEmail, String fullName, String jobTitle) {
        sendEmail(toEmail, "SmartHire — Application Update", buildStudentRejectionEmailHtml(fullName, jobTitle));
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
    
    private String buildRecruiterRejectionEmailHtml(String fullName, String adminEmail) {
        String logoUrl = "https://raw.githubusercontent.com/Jit-codes-ez/SmartHire/main/Assets/Logo.png";

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
                            If you believe this was unexpected or need further information, please contact the administrator at
                            <a href="mailto:%s" style="color:#4F46E5;text-decoration:none;font-weight:600;">
                              %s
                            </a>
                            for further resolution.
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
            """.formatted(logoUrl, fullName, adminEmail, adminEmail);
    }
    
    private String buildStudentDeletionEmailHtml(String fullName, String reason) {
        String logoUrl = "https://raw.githubusercontent.com/Jit-codes-ez/SmartHire/main/Assets/Logo.png";
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
                    <table width="480" cellpadding="0" cellspacing="0" style="width:480px;max-width:480px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">
                      <tr>
                        <td style="background:linear-gradient(135deg,#4F46E5 0%%,#6366F1 100%%);padding:32px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:40px;height:40px;padding:3px;">
                                <img src="%s" width="34" height="34" alt="SmartHire" style="display:block;width:34px;height:34px;object-fit:contain;border-radius:8px;background:#FFFFFF;">
                              </td>
                              <td style="padding-left:10px;">
                                <span style="color:#FFFFFF;font-size:19px;font-weight:bold;">SmartHire</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:36px 32px 30px;">
                          <div style="display:inline-block;background:#FEF2F2;color:#B91C1C;font-size:11px;font-weight:bold;padding:4px 10px;border-radius:20px;margin-bottom:14px;">ACCOUNT DELETED</div>
                          <h2 style="margin:0 0 10px;color:#0F172A;font-size:21px;">Hello, %s</h2>
                          <p style="margin:0 0 18px;color:#64748B;font-size:14px;line-height:21px;">Your SmartHire student account has been deleted by an administrator.</p>
                          <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;padding:20px;margin-bottom:24px;">
                            <strong style="color:#9A3412;font-size:15px;">Reason for deletion</strong>
                            <p style="color:#475569;font-size:14px;line-height:21px;margin:10px 0 0;">%s</p>
                          </div>
                          <p style="margin:0 0 24px;color:#64748B;font-size:14px;line-height:21px;">If you believe this action was taken in error or require further information, please contact SmartHire support.</p>
                          <hr style="border:none;border-top:1px solid #E2E8F0;margin:0 0 20px;">
                          <p style="margin:0;color:#94A3B8;font-size:12px;text-align:center;">Need help? <a href="mailto:smarthire.js@gmail.com" style="color:#4F46E5;text-decoration:none;">SmartHire Support</a></p>
                        </td>
                      </tr>
                      <tr>
                        <td style="background:#F8FAFC;padding:18px 32px;border-top:1px solid #E2E8F0;text-align:center;">
                          <span style="color:#94A3B8;font-size:11px;">© 2026 SmartHire. All rights reserved.</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(logoUrl, fullName, reason);
    }
    
    private String buildRecruiterDeletionEmailHtml(String fullName, String reason) {
        String logoUrl = "https://raw.githubusercontent.com/Jit-codes-ez/SmartHire/main/Assets/Logo.png";
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
                    <table width="480" cellpadding="0" cellspacing="0" style="width:480px;max-width:480px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">
                      <tr>
                        <td style="background:linear-gradient(135deg,#4F46E5 0%%,#6366F1 100%%);padding:32px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:40px;height:40px;padding:3px;">
                                <img src="%s" width="34" height="34" alt="SmartHire" style="display:block;width:34px;height:34px;object-fit:contain;border-radius:8px;background:#FFFFFF;">
                              </td>
                              <td style="padding-left:10px;">
                                <span style="color:#FFFFFF;font-size:19px;font-weight:bold;">SmartHire</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:36px 32px 30px;">
                          <div style="display:inline-block;background:#FEF2F2;color:#B91C1C;font-size:11px;font-weight:bold;padding:4px 10px;border-radius:20px;margin-bottom:14px;">ACCOUNT DELETED</div>
                          <h2 style="margin:0 0 10px;color:#0F172A;font-size:21px;">Hello, %s</h2>
                          <p style="margin:0 0 18px;color:#64748B;font-size:14px;line-height:21px;">Your SmartHire recruiter account has been deleted by an administrator.</p>
                          <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;padding:20px;margin-bottom:24px;">
                            <strong style="color:#9A3412;font-size:15px;">Reason for deletion</strong>
                            <p style="color:#475569;font-size:14px;line-height:21px;margin:10px 0 0;">%s</p>
                          </div>
                          <p style="margin:0 0 24px;color:#64748B;font-size:14px;line-height:21px;">If you believe this action was taken in error or require further information, please contact SmartHire support.</p>
                          <hr style="border:none;border-top:1px solid #E2E8F0;margin:0 0 20px;">
                          <p style="margin:0;color:#94A3B8;font-size:12px;text-align:center;">Need help? <a href="mailto:smarthire.js@gmail.com" style="color:#4F46E5;text-decoration:none;">SmartHire Support</a></p>
                        </td>
                      </tr>
                      <tr>
                        <td style="background:#F8FAFC;padding:18px 32px;border-top:1px solid #E2E8F0;text-align:center;">
                          <span style="color:#94A3B8;font-size:11px;">© 2026 SmartHire. All rights reserved.</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(logoUrl, fullName, reason);
    }
    
    private String buildStudentShortlistEmailHtml(String fullName, String jobTitle, LocalDate interviewDate, LocalTime interviewTime, InterviewType interviewType, String interviewLocation) {

        String logoUrl = "https://raw.githubusercontent.com/Jit-codes-ez/SmartHire/main/Assets/Logo.png";

        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport"
                    content="width=device-width, initial-scale=1.0">
            </head>

            <body style="margin:0;padding:0;background:#EEF1F6;font-family:Helvetica,Arial,sans-serif;">

              <table width="100%%"
                     cellpadding="0"
                     cellspacing="0"
                     style="padding:48px 16px;">

                <tr>
                  <td align="center">

                    <table width="480"
                           cellpadding="0"
                           cellspacing="0"
                           style="width:480px;
                                  max-width:480px;
                                  background:#FFFFFF;
                                  border-radius:16px;
                                  overflow:hidden;
                                  border:1px solid #E2E8F0;">

                      <!-- Header -->
                      <tr>
                        <td style="background:linear-gradient(135deg,#4F46E5 0%%,#6366F1 100%%);
                                   padding:32px;">

                          <table cellpadding="0" cellspacing="0">

                            <tr>

                              <td style="width:40px;height:40px;padding:3px;">

                                <img src="%s"
                                     width="34"
                                     height="34"
                                     alt="SmartHire"
                                     style="display:block;
                                            width:34px;
                                            height:34px;
                                            object-fit:contain;
                                            border-radius:8px;
                                            background:#FFFFFF;">

                              </td>

                              <td style="padding-left:10px;">

                                <span style="color:#FFFFFF;
                                             font-size:19px;
                                             font-weight:bold;">
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

                          <div style="display:inline-block;
                                      background:#DCFCE7;
                                      color:#15803D;
                                      font-size:11px;
                                      font-weight:bold;
                                      padding:4px 10px;
                                      border-radius:20px;
                                      margin-bottom:14px;">

                            APPLICATION SHORTLISTED

                          </div>

                          <h2 style="margin:0 0 10px;
                                     color:#0F172A;
                                     font-size:21px;">

                            Congratulations, %s!

                          </h2>

                          <p style="margin:0 0 18px;
                                    color:#64748B;
                                    font-size:14px;
                                    line-height:21px;">

                            You have been shortlisted for an interview
                            through SmartHire.

                          </p>

                          <!-- Interview Details -->

                          <div style="background:#F8FAFC;
                                      border:1px solid #E2E8F0;
                                      border-radius:12px;
                                      padding:20px;
                                      margin-bottom:24px;">

                            <strong style="color:#0F172A;
                                           font-size:15px;">

                              Interview Details

                            </strong>

                            <table width="100%%"
                                   cellpadding="0"
                                   cellspacing="0"
                                   style="margin-top:14px;">

                              <tr>
                                <td style="padding:6px 0;
                                           color:#64748B;
                                           font-size:13px;">
                                  Date
                                </td>

                                <td style="padding:6px 0;
                                           color:#0F172A;
                                           font-size:13px;
                                           font-weight:600;
                                           text-align:right;">
                                  %s
                                </td>
                              </tr>

                              <tr>
                                <td style="padding:6px 0;
                                           color:#64748B;
                                           font-size:13px;">
                                  Time
                                </td>

                                <td style="padding:6px 0;
                                           color:#0F172A;
                                           font-size:13px;
                                           font-weight:600;
                                           text-align:right;">
                                  %s
                                </td>
                              </tr>

                              <tr>
                                <td style="padding:6px 0;
                                           color:#64748B;
                                           font-size:13px;">
                                  Interview Type
                                </td>

                                <td style="padding:6px 0;
                                           color:#0F172A;
                                           font-size:13px;
                                           font-weight:600;
                                           text-align:right;">
                                  %s
                                </td>
                              </tr>

                              <tr>
                                <td style="padding:6px 0;
                                           color:#64748B;
                                           font-size:13px;">
                                  Location / Link
                                </td>

                                <td style="padding:6px 0;
                                           color:#0F172A;
                                           font-size:13px;
                                           font-weight:600;
                                           text-align:right;">
                                  %s
                                </td>
                              </tr>

                            </table>

                          </div>

                          <p style="margin:0 0 24px;
                                    color:#64748B;
                                    font-size:14px;
                                    line-height:21px;">

                            Please make sure you are available at the
                            scheduled time. We wish you the very best
                            for your interview!

                          </p>

                          <hr style="border:none;
                                     border-top:1px solid #E2E8F0;
                                     margin:0 0 20px;">

                          <p style="margin:0;
                                    color:#94A3B8;
                                    font-size:12px;
                                    text-align:center;">

                            Need help?

                            <a href="mailto:smarthire.js@gmail.com"
                               style="color:#4F46E5;
                                      text-decoration:none;">

                              SmartHire Support

                            </a>

                          </p>

                        </td>

                      </tr>

                      <!-- Footer -->

                      <tr>

                        <td style="background:#F8FAFC;
                                   padding:18px 32px;
                                   border-top:1px solid #E2E8F0;
                                   text-align:center;">

                          <span style="color:#94A3B8;
                                       font-size:11px;">

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
            """
            .formatted(logoUrl, fullName, interviewDate, interviewTime, interviewType, interviewLocation);
    }
    
    private String buildStudentApprovalEmailHtml(String fullName, String jobTitle, LocalDate joiningDate) {

        String logoUrl = "https://raw.githubusercontent.com/Jit-codes-ez/SmartHire/main/Assets/Logo.png";

        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport"
                    content="width=device-width, initial-scale=1.0">
            </head>

            <body style="margin:0;padding:0;background:#EEF1F6;font-family:Helvetica,Arial,sans-serif;">

              <table width="100%%"
                     cellpadding="0"
                     cellspacing="0"
                     style="padding:48px 16px;">

                <tr>
                  <td align="center">

                    <table width="480"
                           cellpadding="0"
                           cellspacing="0"
                           style="width:480px;
                                  max-width:480px;
                                  background:#FFFFFF;
                                  border-radius:16px;
                                  overflow:hidden;
                                  border:1px solid #E2E8F0;">

                      <!-- Header -->
                      <tr>
                        <td style="background:linear-gradient(135deg,#4F46E5 0%%,#6366F1 100%%);
                                   padding:32px;">

                          <table cellpadding="0" cellspacing="0">

                            <tr>

                              <td style="width:40px;height:40px;padding:3px;">

                                <img src="%s"
                                     width="34"
                                     height="34"
                                     alt="SmartHire"
                                     style="display:block;
                                            width:34px;
                                            height:34px;
                                            object-fit:contain;
                                            border-radius:8px;
                                            background:#FFFFFF;">

                              </td>

                              <td style="padding-left:10px;">

                                <span style="color:#FFFFFF;
                                             font-size:19px;
                                             font-weight:bold;">
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

                          <div style="display:inline-block;
                                      background:#DCFCE7;
                                      color:#15803D;
                                      font-size:11px;
                                      font-weight:bold;
                                      padding:4px 10px;
                                      border-radius:20px;
                                      margin-bottom:14px;">

                            APPLICATION APPROVED

                          </div>

                          <h2 style="margin:0 0 10px;
                                     color:#0F172A;
                                     font-size:21px;">

                            Congratulations, %s!

                          </h2>

                          <p style="margin:0 0 18px;
                                    color:#64748B;
                                    font-size:14px;
                                    line-height:21px;">

                            We are pleased to inform you that your application
                            has been approved. You have been selected for the
                            position of <strong>%s</strong>.

                          </p>

                          <!-- Joining Details -->

                          <div style="background:#F8FAFC;
                                      border:1px solid #E2E8F0;
                                      border-radius:12px;
                                      padding:20px;
                                      margin-bottom:24px;">

                            <strong style="color:#0F172A;
                                           font-size:15px;">

                              Joining Details

                            </strong>

                            <table width="100%%"
                                   cellpadding="0"
                                   cellspacing="0"
                                   style="margin-top:14px;">

                              <tr>
                                <td style="padding:6px 0;
                                           color:#64748B;
                                           font-size:13px;">
                                  Joining Date - 
                                </td>

                                <td style="padding:6px 0;
                                           color:#0F172A;
                                           font-size:13px;
                                           font-weight:600;
                                           text-align:right;">
                                  %s
                                </td>
                              </tr>

                            </table>

                          </div>

                          <p style="margin:0 0 24px;
                                    color:#64748B;
                                    font-size:14px;
                                    line-height:21px;">

                            Please make sure you are available on the
                            scheduled joining date. We look forward to
                            having you on board.

                          </p>

                          <hr style="border:none;
                                     border-top:1px solid #E2E8F0;
                                     margin:0 0 20px;">

                          <p style="margin:0;
                                    color:#94A3B8;
                                    font-size:12px;
                                    text-align:center;">

                            Need help?

                            <a href="mailto:smarthire.js@gmail.com"
                               style="color:#4F46E5;
                                      text-decoration:none;">

                              SmartHire Support

                            </a>

                          </p>

                        </td>

                      </tr>

                      <!-- Footer -->

                      <tr>

                        <td style="background:#F8FAFC;
                                   padding:18px 32px;
                                   border-top:1px solid #E2E8F0;
                                   text-align:center;">

                          <span style="color:#94A3B8;
                                       font-size:11px;">

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
            """
            .formatted(logoUrl, fullName, jobTitle, joiningDate);
    }
    
    private String buildStudentRejectionEmailHtml(String fullName, String jobTitle) {

        String logoUrl = "https://raw.githubusercontent.com/Jit-codes-ez/SmartHire/main/Assets/Logo.png";

        return """
            <!DOCTYPE html>
            <html>

            <head>
              <meta charset="UTF-8">
              <meta name="viewport"
                    content="width=device-width, initial-scale=1.0">
            </head>

            <body style="
              margin:0;
              padding:0;
              background:#EEF1F6;
              font-family:Helvetica,Arial,sans-serif;
            ">

              <table
                width="100%%"
                cellpadding="0"
                cellspacing="0"
                style="padding:48px 16px;"
              >

                <tr>
                  <td align="center">

                    <!-- Main Card -->
                    <table
                      width="480"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        width:480px;
                        max-width:480px;
                        background:#FFFFFF;
                        border-radius:16px;
                        overflow:hidden;
                        border:1px solid #E2E8F0;
                      "
                    >

                      <!-- Header -->
                      <tr>

                        <td
                          style="
                            background:linear-gradient(
                              135deg,
                              #4F46E5 0%%,
                              #6366F1 100%%
                            );
                            padding:32px;
                          "
                        >

                          <table
                            cellpadding="0"
                            cellspacing="0"
                          >

                            <tr>

                              <!-- Logo -->
                              <td
                                style="
                                  width:40px;
                                  height:40px;
                                  padding:3px;
                                "
                              >

                                <img
                                  src="%s"
                                  width="34"
                                  height="34"
                                  alt="SmartHire"
                                  style="
                                    display:block;
                                    width:34px;
                                    height:34px;
                                    object-fit:contain;
                                    border-radius:8px;
                                    background:#FFFFFF;
                                  "
                                >

                              </td>

                              <!-- Brand -->
                              <td style="padding-left:10px;">

                                <span
                                  style="
                                    color:#FFFFFF;
                                    font-size:19px;
                                    font-weight:bold;
                                    letter-spacing:-0.3px;
                                  "
                                >
                                  SmartHire
                                </span>

                              </td>

                            </tr>

                          </table>

                        </td>

                      </tr>


                      <!-- Body -->
                      <tr>

                        <td
                          style="
                            padding:36px 32px 30px;
                          "
                        >

                          <!-- Status Badge -->
                          <div
                            style="
                              display:inline-block;
                              background:#FEF2F2;
                              color:#B91C1C;
                              font-size:11px;
                              font-weight:bold;
                              letter-spacing:0.3px;
                              padding:4px 10px;
                              border-radius:20px;
                              margin-bottom:14px;
                            "
                          >
                            APPLICATION UPDATE
                          </div>


                          <!-- Greeting -->
                          <h2
                            style="
                              margin:0 0 10px;
                              color:#0F172A;
                              font-size:21px;
                              font-weight:bold;
                            "
                          >
                            Hello, %s
                          </h2>


                          <!-- Introduction -->
                          <p
                            style="
                              margin:0 0 18px;
                              color:#64748B;
                              font-size:14px;
                              line-height:21px;
                            "
                          >
                            Thank you for your interest in the
                            <strong style="color:#334155;">
                              %s
                            </strong>
                            position through SmartHire.
                          </p>


                          <!-- Rejection Notice -->
                          <div
                            style="
                              background:#FFF7ED;
                              border:1px solid #FED7AA;
                              border-radius:12px;
                              padding:20px;
                              margin-bottom:24px;
                            "
                          >

                            <strong
                              style="
                                color:#9A3412;
                                font-size:15px;
                              "
                            >
                              Application not selected
                            </strong>

                            <p
                              style="
                                color:#64748B;
                                font-size:13px;
                                line-height:20px;
                                margin:8px 0 0;
                              "
                            >
                              After careful consideration, the recruiter
                              has decided not to move forward with your
                              application for this position.
                            </p>

                          </div>


                          <!-- Closing -->
                          <p
                            style="
                              margin:0 0 24px;
                              color:#64748B;
                              font-size:14px;
                              line-height:21px;
                            "
                          >
                            We appreciate the time and effort you put
                            into your application. We encourage you to
                            continue exploring opportunities on SmartHire
                            that match your skills and career goals.
                          </p>


                          <!-- Divider -->
                          <hr
                            style="
                              border:none;
                              border-top:1px solid #E2E8F0;
                              margin:0 0 20px;
                            "
                          >


                          <!-- Support -->
                          <p
                            style="
                              margin:0;
                              color:#94A3B8;
                              font-size:12px;
                              line-height:18px;
                              text-align:center;
                            "
                          >

                            Need help?

                            
							<a href="mailto:smarthire.js@gmail.com"
							                               style="color:#4F46E5;
							                                      text-decoration:none;">
                              SmartHire Support
                            </a>

                          </p>

                        </td>

                      </tr>


                      <!-- Footer -->
                      <tr>

                        <td
                          style="
                            background:#F8FAFC;
                            padding:18px 32px;
                            border-top:1px solid #E2E8F0;
                            text-align:center;
                          "
                        >

                          <span
                            style="
                              color:#94A3B8;
                              font-size:11px;
                            "
                          >
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
            """
            .formatted(logoUrl, fullName, jobTitle);
    }
}