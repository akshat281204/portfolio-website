from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

app = Flask(__name__, static_folder='static', static_url_path='/static')

# Flask-Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASS')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('EMAIL_USER')

mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/send_email', methods=['POST'])
def send_email():
    data = request.get_json()
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    subject = data.get('subject')
    message_body = data.get('message')

    if not all([first_name, last_name, email, subject, message_body]):
        return jsonify({'error': 'All fields are required.'}), 400

    try:
        msg = Message(
            subject=f"Portfolio Contact: {subject} from {first_name} {last_name}",
            recipients=[os.getenv('EMAIL_USER')], # Send to your email
            reply_to=email,
            body=f"From: {first_name} {last_name} <{email}>\n\n{message_body}"
        )
        mail.send(msg)
        return jsonify({'message': 'Email sent successfully!'}), 200
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({'error': 'Failed to send email. Please try again later.'}), 500
