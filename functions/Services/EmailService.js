function ServiceEmaiLOTP(otp){
    return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f4f6f9; padding: 20px; }
          .container { background: white; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; }
          .otp { font-size: 24px; color: #2b6cb0; font-weight: bold; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>MathMaster Admin - Password Reset</h2>
          <p>Your OTP is:</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      </body>
    </html>
  `;

}


module.exports={ServiceEmaiLOTP}