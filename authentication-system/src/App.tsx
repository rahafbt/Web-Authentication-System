import './App.css';
import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Route, Routes } from 'react-router-dom';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/Profile';

function App() {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    return (
        <>
            <div>
                <AuthProvider>
                  <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                    <ToastContainer position='top-center' />
                    <Routes>
                        <Route path='/' element={<Signin isDarkMode={isDarkMode} />} />
                        <Route path='/signup' element={<Signup isDarkMode={isDarkMode} />} />
                        <Route path='/home' element={<Home isDarkMode={isDarkMode} />} />
                        <Route path='/profile' element={<Profile isDarkMode={isDarkMode} />} />
                    </Routes>                   
                </AuthProvider>
            </div>
        </>
    );
}

export default App;
