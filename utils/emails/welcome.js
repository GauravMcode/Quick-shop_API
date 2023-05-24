const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.SHOP_EMAIL,
		pass: process.env.SHOP_EMAIL_PASSWORD
	}
})

exports.sendWelcomeMail = (name, email, type) => {
	const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/flutter-shop-f2274.appspot.com/o/logo%20.png?alt=media&token=0e0ac96f-2551-43df-9c83-927809332459';
	transporter.sendMail({
		to: email,
		from: process.env.SHOP_EMAIL,
		subject: 'Welcome to Quickly',
		html: type == 'user' ? `
        <!DOCTYPE html>
<html>
<head>
	<title>Welcome to Quickly</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #f5f5f5; font-family: Arial, sans-serif;">

	<div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px;">
		
		<!-- Header -->
		<div style="text-align: center;">
			<img src=${logoUrl} alt="Quickly Logo" style="max-height: 100px; margin-bottom: 20px;">
			<h1 style="font-size: 24px; color: #333333; margin: 0;">Welcome to Quickly</h1>
		</div>

		<!-- Main Content -->
		<p style="font-size: 16px; color: #333333; margin-top: 30px;">Dear ${name},</p>

		<p style="font-size: 16px; color: #333333; margin-top: 20px;">Thank you for joining Quickly. We're excited to have you as a new customer!</p>

		<p style="font-size: 16px; color: #333333; margin-top: 20px;">As a registered user, you'll be able to:</p>

		<ul style="font-size: 16px; color: #333333; margin-top: 10px;">
			<li>Save and manage your personal information</li>
			<li>View your order history and tracking information</li>
			<li>Receive exclusive discounts and promotions</li>
			<li>And more!</li>
		</ul>

		 <p style="font-size: 16px; color: #333333; margin-top: 20px;">Please visit our website at <a href="https://express-shop.cyclic.app/">https://express-shop.cyclic.app/</a> to start shopping today.</p>

		<!-- Footer -->
		<div style="text-align: center; margin-top: 50px;">
			<p style="font-size: 14px; color: #888888;">&copy; 2023 Quickly. All rights reserved.</p>
		</div>

	</div>

</body>
</html>
        `: // send email according to type of user
			`
        <!DOCTYPE html>
<html>
<head>
	<title>Welcome to Quickly</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background-color: #f5f5f5; font-family: Arial, sans-serif;">

	<div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px;">
		
		<!-- Header -->
		<div style="text-align: center;">
			<img src=${logoUrl} alt="Quickly Logo" style="max-height: 100px; margin-bottom: 20px;">
			<h1 style="font-size: 24px; color: #333333; margin: 0;">Welcome to Quickly</h1>
		</div>

		<!-- Main Content -->
		<p style="font-size: 16px; color: #333333; margin-top: 30px;">Dear ${name},</p>

		<p style="font-size: 16px; color: #333333; margin-top: 20px;">Thank you for joining Quickly. We're excited to have you as a Seller!</p>

		<p style="font-size: 16px; color: #333333; margin-top: 20px;">As a registered user, you'll be able to:</p>

		<ul style="font-size: 16px; color: #333333; margin-top: 10px;">
			<li>Save and manage your personal information</li>
			<li>List Products to sell to a wider consumer market</li>
			<li>View insights of your sales</li>
			<li>Be part of our exclusive Partner Program</li>
			<li>Support from our staff to fulfill your business needs</li>
			<li>And more!</li>
		</ul>

		 <p style="font-size: 16px; color: #333333; margin-top: 20px;">Please visit our website at <a href="https://express-shop.cyclic.app/">https://express-shop.cyclic.app/</a> to start selling today.</p>

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

