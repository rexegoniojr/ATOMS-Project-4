import * as React from 'react'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_URL
axios.defaults.withCredentials = true
import '@assets/style.css'
import './App.css'

import { AuthenticateRoute, VerifyToken } from '@middleware/NavAuth';

import Login from '@pages/Login';
import Page401 from '@pages/Error/Page401';
import Page403 from '@pages/Error/Page403';
import Page404 from '@pages/Error/Page404'
import Underdevelopment from '@pages/Error/Underdevelopment';

import Home from '@layouts/PagePanel';
import DataList from '@pages/DataList';
import Register from '@pages/Register';
import PreAlert from '@pages/PreAlert';
import AssignPermit from '@pages/AssignPermit';
import PermitAssigned from '@pages/PermitAssigned';
import AssignDeclarant from '@pages/AssignDeclarant';
import CDT from '@pages/CDT';
import PRESAD from '@pages/PRESAD';
import PeerChecker from '@pages/PeerChecker';
import Lodgement from '@pages/Lodgement';
import Portal from '@pages/Portal';
import FundRequest from '@pages/FundRequest';
import DORO from '@pages/DORO';
import ReEntry from '@pages/ReEntry';

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <VerifyToken>
        <Login />
      </VerifyToken>
    },
    {
      path: '*',
      element: <Page404 />
    },
    {
      path: '/unauthorized',
      element: <Page403 />
    },
    {
      path: '/token-expired',
      element: <Page401 />
    },
    {
      path: '/Atoms',
      element: <Home />,
      children: [
        {
          path: '/Atoms/Complete-List',
          element: <AuthenticateRoute>
            <DataList />
          </AuthenticateRoute>
        }, ,
        {
          path: '/Atoms/Assign-Declarant',
          element: <AuthenticateRoute>
            <AssignDeclarant />
          </AuthenticateRoute>
        },
        {
          path: '/Atoms/Assign-Permit',
          element: <AuthenticateRoute>
            <AssignPermit />
          </AuthenticateRoute>
        },
        {
          path: '/Atoms/CDT',
          element: <AuthenticateRoute>
            <CDT />
          </AuthenticateRoute>
        },
        {
          path: '/Atoms/DO-RO',
          element: <AuthenticateRoute>
            <DORO />
          </AuthenticateRoute>
        },
        {
          path: '/Atoms/Fund-Request',
          element: <AuthenticateRoute>
            <FundRequest />
          </AuthenticateRoute>
        },
        {
          path: '/Atoms/Lodgement',
          element: <AuthenticateRoute>
            <Lodgement />
          </AuthenticateRoute>
        },
        {
          path: '/Atoms/PRESAD',
          element: <AuthenticateRoute>
            <PRESAD />
          </AuthenticateRoute>
        },
        {
          path: '/Atoms/Peer-Checker',
          element: <AuthenticateRoute>
            <PeerChecker />
          </AuthenticateRoute>
        },
        {
          path: '/Atoms/Permit',
          element: <AuthenticateRoute>
            <PermitAssigned />
          </AuthenticateRoute>
        },
        {
          path: '/Atoms/Portal',
          element: <AuthenticateRoute>
            <Portal />
          </AuthenticateRoute>
        },
        {
          path: '/Atoms/Pre-Alert',
          element: <AuthenticateRoute>
            <PreAlert />
          </AuthenticateRoute>
        },
        {
          path: '/Atoms/Re-Entry',
          element: <AuthenticateRoute>
            <ReEntry />
          </AuthenticateRoute>
        },
        {
          path: '/Atoms/Account-List',
          element: <AuthenticateRoute>
            <Register />
          </AuthenticateRoute>
        }
      ]
    },
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
