import { useState } from 'react'
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import Dashboard from './pages/dashboard'
import Auth from './pages/auth'
import Link from './pages/link'
import RedirectLink from './pages/redirectLink'
import Landing from './pages/landing'
import UrlProvider from './UrlContext'
import RequireAuth from './components/require-auth'

const router = createBrowserRouter([
  {
    element:<AppLayout/>,
    children:[
      {
        path:"/",
        element:<Landing/>
      },
      {
        path:"/auth",
        element:<Auth/>
      },
      {
        path:"/link/:id",
        element:
        <RequireAuth>
          <Link/>
        </RequireAuth>
      },
      {
        path:"/:id",
        element:<RedirectLink/>
      },
      {
        path:"/dashboard",
        element:
        <RequireAuth>
          <Dashboard/>
        </RequireAuth>
      }
    ]
  }
])
function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router}></RouterProvider>
    </UrlProvider>
  )
}

export default App
