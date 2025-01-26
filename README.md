
---

# Sketch Calculator

This project is a **Sketch Calculator** web application where users can perform basic calculations. It consists of a **frontend** built with **React (Vite)** for a fast and responsive UI, and a **backend** built using **Flask** to handle the calculation logic and any additional integrations using the **Gemini API**.

---

## Features

- **Frontend**: Built using React with Vite for fast development and build times.
- **Backend**: Flask serves as the backend to handle user requests, perform calculations, and interact with the Gemini API.
- **API Integration**: Uses the Gemini API for additional functionality (if applicable).
- **Responsive UI**: The user interface is designed to work seamlessly across devices.

---

## Technologies Used

- **Frontend**: React.js, Vite, JavaScript (ES6+), CSS
- **Backend**: Flask (Python)
- **API Integration**: Gemini API (if applicable)
- **Other Libraries**: Axios for HTTP requests, Flask-SQLAlchemy (if applicable)

---

## Setup Instructions

### Prerequisites

- Python 3.x
- Node.js & npm (for React)
- Gemini API Key (if applicable)

### Steps to Set Up:

#### 1. Clone the repository:
```bash
git clone https://github.com/your-username/sketch-calculator.git
cd sketch-calculator
```

#### 2. **Backend Setup (Flask)**

- Navigate to the `backend` directory:
  ```bash
  cd backend
  ```

- Create a virtual environment (optional but recommended):
  ```bash
  python3 -m venv venv
  source venv/bin/activate  # On Windows, use venv\Scripts\activate
  ```

- Install the backend dependencies:
  ```bash
  pip install -r requirements.txt
  ```

- Set up your **Gemini API Key** (if applicable):
  - Create a `.env` file in the `backend` directory with the following content:
    ```env
    GEMINI_API_KEY=your-gemini-api-key-here
    ```

- Run the Flask backend:
  ```bash
  flask run
  ```

The backend will be available at [http://localhost:5000](http://localhost:5000).

#### 3. **Frontend Setup (React + Vite)**

- Navigate to the `frontend` directory:
  ```bash
  cd ../frontend
  ```

- Install the frontend dependencies:
  ```bash
  npm install
  ```

- Start the React development server:
  ```bash
  npm run dev
  ```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

- `POST /calculate`: Accepts user input for a calculation request and returns the result.
  Example request body:
  ```json
  {
    "expression": "5 + 3"
  }
  ```
  Example response:
  ```json
  {
    "result": 8
  }
  ```

---

## License

MIT License

---

