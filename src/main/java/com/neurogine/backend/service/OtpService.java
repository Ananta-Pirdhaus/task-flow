package com.neurogine.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("🔐 Kode OTP Login Neurogine");
            helper.setFrom("no-reply@neurogine.com");

            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f6f8;
                      padding: 20px;
                    }
                    .container {
                      max-width: 500px;
                      margin: auto;
                      background: #ffffff;
                      border-radius: 8px;
                      padding: 30px;
                      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    }
                    .title {
                      color: #1f2937;
                      font-size: 22px;
                      font-weight: bold;
                      margin-bottom: 10px;
                    }
                    .otp-box {
                      font-size: 28px;
                      letter-spacing: 6px;
                      font-weight: bold;
                      color: #2563eb;
                      background: #eef2ff;
                      padding: 15px;
                      text-align: center;
                      border-radius: 6px;
                      margin: 20px 0;
                    }
                    .info {
                      color: #4b5563;
                      font-size: 14px;
                      line-height: 1.6;
                    }
                    .footer {
                      margin-top: 30px;
                      font-size: 12px;
                      color: #9ca3af;
                      text-align: center;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="title">Verifikasi Login</div>
                    <p class="info">
                      Halo,<br><br>
                      Gunakan kode OTP berikut untuk melanjutkan proses login ke akun <b>Neurogine</b> Anda:
                    </p>

                    <div class="otp-box">%s</div>

                    <p class="info">
                      ⏱ Kode ini berlaku selama <b>5 menit</b>.<br>
                      Jangan bagikan kode ini kepada siapa pun demi keamanan akun Anda.
                    </p>

                    <div class="footer">
                      © 2026 Neurogine • Security System
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(otp);

            helper.setText(htmlContent, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Gagal mengirim email OTP", e);
        }
    }
}
