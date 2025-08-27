# Akshat Agarwal - Personal Portfolio Website

![Hero Section Screenshot](https://raw.githubusercontent.com/akshat281204/portfolio-website/main/static/images/axat.png) <!-- Placeholder, replace with actual screenshot -->

A modern, responsive, and interactive personal portfolio website showcasing Akshat Agarwal's skills, projects, experience, and activities. Built with Python Flask for a lightweight backend and a dynamic frontend using HTML, CSS, and JavaScript. This portfolio features a user-friendly dark/light theme toggle, smooth scroll animations, a functional contact form, and an engaging custom cursor, designed to provide an immersive browsing experience.

## Table of Contents

- [Project Title and Description](#akshat-agarwal---personal-portfolio-website)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Dependencies](#dependencies)
- [Deployment](#deployment)
- [License](#license)
- [Contact](#contact)

---

## Features

This portfolio website is packed with interactive and modern features:

*   **Dynamic Sections**: Comprehensive sections covering Home, About, Projects, Skills, Experience, Activities, Gallery, and Contact information.
*   **Responsive Design**: Fully adaptable layout ensuring a seamless experience across all devices, from mobile phones to large desktop screens.
*   **Dark/Light Mode Toggle**: User-friendly theme switching functionality with local storage persistence to remember user preferences.
*   **Smooth Scroll Navigation**: Interactive navigation links with active state highlighting for effortless browsing between sections.
*   **Scroll Animations**: Elements gracefully fade in and slide (`fade-in-up`, `fade-in-left`, `fade-in-right`) as they enter the viewport, enhancing visual appeal.
*   **Custom Cursor**: An engaging custom mouse cursor and its follower provide a unique and interactive user experience. (Disabled on mobile for usability).
*   **Contact Form**: A fully functional contact form that allows visitors to send emails directly from the website, powered by Flask-Mail. Includes client-side validation and server-side email sending.
*   **Project Showcase**: Detailed project cards featuring images, comprehensive descriptions, technology stacks, and direct links to GitHub repositories and live demos/APKs. Includes dynamic hover effects and status badges (Completed, In Progress).
*   **Skills Section**: A visually appealing display of technical skills, highlighted by an animated infinite scroller for technology logos and a comprehensive list of libraries and concepts.
*   **Experience & Activities**: Dedicated sections to showcase professional work experience and co-curricular involvement, providing insights into hands-on contributions and leadership roles.
*   **Image Gallery**: An auto-scrolling photo gallery with a lightbox feature for full-screen viewing of images, offering a glimpse into college activities and experiences.
*   **Particle Background**: A subtle, dynamic particle animation in the hero section adds a modern and captivating visual touch.
*   **Notification System**: Custom toast notifications for real-time feedback on actions, such as successful form submissions or errors.
*   **Vercel Deployment Ready**: Configured for easy and efficient deployment on Vercel, ensuring quick setup and continuous integration.

## Project Structure

```
.
├── .gitignore
├── __pycache__
│   └── app.cpython-312.pyc
├── app.py
├── requirements.txt
├── static
│   ├── Akshat_Agarwal_26_07_25.pdf
│   ├── images
│   │   ├── axat.jpg
│   │   ├── gi1.jpg
│   │   ├── gi2.jpg
│   │   ├── gi3.JPG
│   │   ├── gi4.jpg
│   │   ├── gi5.jpg
│   │   ├── gi6.jpg
│   │   ├── hope-scan-bg.png
│   │   ├── hyd-db-bg.png
│   │   ├── novaflex-bg.png
│   │   ├── rp-gen-bg.png
│   │   └── screenshot-hero.png
│   ├── script.js
│   └── styles.css
├── templates
│   └── index.html
├── vercel.json
└── wsgi.py
```

## Installation

Follow these steps to set up and run the project locally.

### Prerequisites

*   **Python 3.x**: Ensure you have Python installed. You can download it from [python.org](https://www.python.org/downloads/).

### Steps

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/akshat281204/portfolio-website.git
    cd portfolio-website
    ```

2.  **Create a Virtual Environment**:
    It's recommended to use a virtual environment to manage dependencies.
    ```bash
    python -m venv venv
    ```

3.  **Activate the Virtual Environment**:
    *   **On Windows**:
        ```bash
        .\venv\Scripts\activate
        ```
    *   **On macOS/Linux**:
        ```bash
        source venv/bin/activate
        ```

4.  **Install Dependencies**:
    The project relies on `Flask`, `Flask-Mail`, and `python-dotenv`.
    Create a `requirements.txt` file in your root directory if it doesn't exist, and add these lines:
    ```
    Flask
    Flask-Mail
    python-dotenv
    ```
    Then install them:
    ```bash
    pip install -r requirements.txt
    ```

## Environment Variables

The `app.py` uses `python-dotenv` to load environment variables. You need to create a `.env` file in the root directory of your project (same level as `app.py`) and add the following:

```dotenv
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

*   `EMAIL_USER`: Your Gmail address (or other SMTP-enabled email).
*   `EMAIL_PASS`: An **App Password** for your Gmail account. If you're using Gmail, you'll need to generate an App Password as regular passwords won't work due to security policies. [How to generate an App Password](https://support.google.com/accounts/answer/185833). Make sure 2-Factor Authentication is enabled on your Google account.

## Usage

Once installed and configured, you can run the Flask application:

1.  **Ensure your virtual environment is active.**
2.  **Run the application**:
    ```bash
    python app.py
    ```
    or using Flask's CLI:
    ```bash
    export FLASK_APP=app.py
    flask run
    ```

    The application will typically start on `http://127.0.0.1:5000/`. Open this URL in your web browser.

## API Documentation

The portfolio website includes a single API endpoint for handling contact form submissions.

### `POST /api/send_email`

Handles sending an email from the contact form to the configured recipient.

#### Request

*   **Method**: `POST`
*   **URL**: `/api/send_email`
*   **Content-Type**: `application/json`

#### Request Body (JSON)

| Field        | Type     | Description                                | Required |
| :----------- | :------- | :----------------------------------------- | :------- |
| `firstName`  | `string` | The first name of the sender.              | Yes      |
| `lastName`   | `string` | The last name of the sender.               | Yes      |
| `email`      | `string` | The email address of the sender.           | Yes      |
| `subject`    | `string` | The subject line for the contact message.  | Yes      |
| `message`    | `string` | The body of the message from the sender.   | Yes      |

**Example Request:**

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "subject": "Inquiry about your project",
    "message": "Hello Akshat, I'm interested in collaborating on a project..."
}
```

#### Responses

*   **`200 OK`**:
    ```json
    {
        "message": "Email sent successfully!"
    }
    ```
*   **`400 Bad Request`**:
    Returned if any required field is missing from the request body.
    ```json
    {
        "error": "All fields are required."
    }
    ```
*   **`500 Internal Server Error`**:
    Returned if there's an issue sending the email (e.g., incorrect email credentials, mail server issues).
    ```json
    {
        "error": "Failed to send email. Please try again later."
    }
    ```

## Dependencies

*   `Flask`: A lightweight WSGI web application framework.
*   `Flask-Mail`: Provides email sending capabilities for Flask applications.
*   `python-dotenv`: Reads key-value pairs from a `.env` file and sets them as environment variables.

*(These dependencies are specified in the `requirements.txt` file.)*

## Deployment

This project is configured for deployment on Vercel using the provided `vercel.json` file. The `wsgi.py` entry point ensures that Vercel correctly serves the Flask application.

To deploy on Vercel:

1.  Push your code to a GitHub repository.
2.  Import your GitHub repository into Vercel.
3.  Vercel will automatically detect the Python project and the `vercel.json` configuration.
4.  Set your `EMAIL_USER` and `EMAIL_PASS` environment variables in Vercel's project settings (under "Environment Variables") for security.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Contact

For any inquiries, collaborations, or feedback, please reach out:

*   **Email**: [akshat28122004@gmail.com](mailto:akshat28122004@gmail.com)
*   **LinkedIn**: [Akshat Agarwal](https://www.linkedin.com/in/akshat-agarwal-92a50524b)
*   **GitHub**: [akshat281204](https://github.com/akshat281204)
