import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createRoutesFromElements, RouterProvider, Route, createBrowserRouter, } from 'react-router-dom'
import Home from './components/Home.js'
import Create from './components/Create.js';
import MyProfile from './components/MyProfile.js';
import MyVlog from './components/MyVlog.js';
import Saved from './components/Saved.js';
import Signin from './components/Signin.js';
import EditVlog from './components/EditVlog.js';
import Signup from './components/signup.js';
import SingleVlog from './components/SingleVlog.js';
import { store } from './Redux/store.js';
import { Provider } from 'react-redux';
import Edit from './components/Edit.js'
import ChangePassword from './components/ChangePassword.js'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route path='' element={<Home />} />
            <Route path='create' element={<Create />} />
            <Route path='myprofile' element={<MyProfile />} />
            <Route path='myvlog' element={<MyVlog />} />
            <Route path='saved' element={<Saved />} />
            <Route path='signin' element={<Signin />} />
            <Route path='signup' element={<Signup />} />
            <Route path='singleVlog' element={<SingleVlog />} />
            <Route path='edit' element={<Edit />} />
            <Route path='changePassword' element={<ChangePassword />} />
            <Route path='editvlog' element={<EditVlog />} />
            


        </Route>
    )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}>

            </RouterProvider>
        </Provider>
    </React.StrictMode>
);
