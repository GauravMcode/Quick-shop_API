const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.SHOP_EMAIL,
		pass: process.env.SHOP_EMAIL_PASSWORD
	}
})

exports.sendResetEmail = (name, email, otp) => {
	const logoUrl = 'https://st.depositphotos.com/1005920/1471/i/950/depositphotos_14713611-stock-photo-shopping-cart-icon.jpg';
	transporter.sendMail({
		to: email,
		from: process.env.SHOP_EMAIL,
		subject: 'Reset Pasword for Flutter-Shop',
		html: `
        <!DOCTYPE html>
<html>
<head>
	<title>Password Reset for Quickly</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #f5f5f5; font-family: Arial, sans-serif;">

	<div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px;">
		
		<!-- Header -->
		<div style="text-align: center;">
			<img src=${logoUrl} alt="Quickly Logo" style="max-height: 100px; margin-bottom: 20px;">
			<h1 style="font-size: 24px; color: #333333; margin: 0;">Password Reset for Quickly</h1>
		</div>

		<!-- Main Content -->
		<p style="font-size: 16px; color: #333333; margin-top: 30px;">Dear ${name},</p>

		<p style="font-size: 16px; color: #333333; margin-top: 20px;">We received a request to reset your password for your Quickly account. If you did not request a password reset, please ignore this message.</p>

		<p style="font-size: 16px; color: #333333; margin-top: 20px;">Please use the following One-Time Password (OTP) to reset your password:</p>

		<div style="text-align: center; margin-top: 30px;">
			<h2 style="font-size: 32px; color: #333333; margin: 0;">${otp}</h2>
		</div>

		<p style="font-size: 16px; color: #333333; margin-top: 20px;">Please note that this OTP is valid for 10 minutes. If you do not reset your password within this time, you will need to request another password reset.</p>

		<!-- Footer -->
		<div style="text-align: center; margin-top: 50px;">
			<p style="font-size: 14px; color: #888888;">&copy; 2023 Quickly. All rights reserved.</p>
		</div>

	</div>

</body>
</html>

        `
	})
}

