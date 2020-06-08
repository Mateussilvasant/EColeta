import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import CriarColeta from './pages/CriarColeta';
import Home from './pages/Home';

const Routes = () =>{
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact/>
            <Route component={CriarColeta} path="/criar-ponto-coleta"/>
        </BrowserRouter>
    );
}

export default Routes;