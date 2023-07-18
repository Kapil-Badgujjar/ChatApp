import React, { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import Chats from './pages/Chats'
import SearchFriends from './pages/SearchFriends'
import SettingsPage from './pages/SettingsPage'
import { createBrowserRouter,RouterProvider,Route, Router, Outlet} from 'react-router-dom'
import { AppContext } from './utils/context'
function App() {
  const routes = createBrowserRouter([
    {
      path: '/',
      element: <Navbar />,
      children: [
        {
          path: '/',
          element: <HomePage />
        },
        {
          path: 'login',
          element: <LoginPage />
        },
        {
          path: 'signup',
          element: <SignupPage />
        },
        {
          path: 'forgotpassword',
          element: <ForgotPasswordPage />
        },
        {
          path: 'reset-password/:token',
          element: <ResetPasswordPage />
        },
        {
          path: 'chats',
          element: <Chats />
        },
        {
          path: 'search-freinds',
          element: <SearchFriends />
        },
        {
          path: 'settings',
          element: <SettingsPage />
        }
      ]
    }    
  ]);

  return (
    <AppContext>
      <RouterProvider router={routes} />
    </AppContext>
  )
}

export default App
