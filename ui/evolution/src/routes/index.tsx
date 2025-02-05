import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../auth';
import { SignIn } from '../pages/SignIn';
import Loan from '../pages/Loan';
import Panel from '../pages/Panel';


const AppRoutes: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path={'/'} element={<SignIn />} />
                    <Route path={'/panel'} element={<Panel/>} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default AppRoutes;
