# Finance Tracker – Mobile Application

## About the Project
Finance Tracker is a personal finance management mobile application developed using React Native and Expo.

It helps users track their income and expenses, manage transactions and view their financial summary directly from their mobile devices.

The mobile application connects to the same backend used by the web application.

## Technologies Used
- React Native
- Expo
- JavaScript
- Expo Router
- Axios
- Context API
- AsyncStorage
- Expo Notifications

## Features
- User Registration and Login
- Add Income and Expense Transactions
- View All Transactions
- Update and Delete Transactions
- Search Transactions
- Filter Transactions
- Dashboard with Income, Expense and Balance
- Category-Wise Summary
- CSV Export
- Local Data Storage
- Scheduled Local Notifications

## Project Structure
- `app/` – Application screens and navigation
- `components/` – Reusable UI components
- `contexts/` – Shared application state
- `services/` – API and authentication services

## Application Flow
1. User registers or logs in.
2. The application communicates with the backend using Axios.
3. The authentication token is stored locally.
4. Axios attaches the token to protected API requests.
5. Users can add, view, update and delete transactions.
6. The dashboard displays income, expenses and balance.
7. Users can receive scheduled local reminders.

## Backend Connection
The mobile application connects to the shared Finance Tracker backend:

`https://finance-tracker-backend-ng8p.onrender.com`

## Installation and Setup

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Configure the backend API URL if required.
4. Start the Expo development server:

```bash
npx expo start
```

5. Run the application using an emulator or a supported device.

## Purpose
The mobile application makes personal finance management convenient by allowing users to manage transactions from their mobile devices.
