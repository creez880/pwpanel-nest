export const VERIFY_MAIL_TEMPLATE_DATA = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
        }
        h2 {
            color: #333;
        }
        p {
            color: #666;
        }
        .verify-button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
        }
        .verify-button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Email Verification</h2><br>
        <p>Welcome :USERNAME:!</p><br>
        <p>Click the button below to verify your email address.</p><br>
        <a href="http://localhost:3000/auth/verify-email?token=:TOKEN:" class="verify-button">Verify Now</a>
    </div>
</body>
</html>
`;
