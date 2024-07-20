# Account Management Application

This project is a simple account management application for a company. It includes features for uploading accounts with their balance via CSV file, transferring money between accounts, displaying account transaction history, and deleting accounts.

## Technologies Used

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool for modern web projects.

### Backend
- **Django**: A high-level Python web framework.
- **SQLite**: A lightweight, disk-based database.

### Deployment
- **Docker**: A platform to develop, ship, and run applications.
- **Docker Compose**: A tool for defining and running multi-container Docker applications.

## Features

- **Account Management**:
  - Upload accounts with their balances via a CSV file.
  - Transfer money between accounts.
  - Display account transaction history.
  - Delete accounts.

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for running the frontend without Docker)
- [Python](https://www.python.org/) (for running the backend without Docker)

### Running the Project

#### Using Docker Compose

1. Clone the repository:
    ```bash
    git clone https://github.com/safasad/Account-Transfer-.git
    cd Account-Transfer
    ```

2. Start the application using Docker Compose:
    ```bash
    docker-compose up --build
    ```

3. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`

#### Running Manually

##### Frontend

1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Access the frontend at `http://localhost:3000`

##### Backend

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2. Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4. Run migrate command :
    ```bash
    python manage.py migrate
    ```
5. Run the Django development server:
    ```bash
    python manage.py runserver
    ```

6. Access the backend at `http://localhost:8000`
## User Interface
### Uploading CSV Files

To upload accounts with their balance, navigate to the accounts section in the frontend, and click the upload button to upload your CSV file.

### Transferring Money

To transfer money between accounts, navigate to the transactions section. Click transfer button, Specify sender account and receiver account, and the amount to be transferred.
### Displaying All Transactions

To view the transactions history of all accounts, navigate to the transactions page.


### Displaying Transactions History

To view the transaction history of an account, navigate to the accounts page and click on eye icon of an account to show his history.

### Deleting Accounts

To delete an account, navigate to the account management section, select the account to be deleted ,click trash icon.

