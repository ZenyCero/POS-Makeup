import React from 'react';
import './App.css';
import { Routes, Route} from 'react-router-dom';
import Home from './views/Home';
import Pedido from './views/Pedido';
import Cliente from './views/Cliente';
import Usuario from './views/Usuario';
import UserProvider from './context/UserProvider';
import Producto from './views/Producto';
import HistorialVenta from './views/HistorialVenta';
import HistorialCotizacion from './views/HistorialCotizacion';
import Login from './views/Login';
import NotFound from './views/NotFound';
import VerificarUsuario from './components/VerificarUsuario';
import HeaderNav from './components/HeaderNav';
import RealizarCobro from './views/RealizarCobro';


const App = () => {

    return (
      <>
        <UserProvider>
            <Routes>
                  
              <Route index path='/login' element={<Login />} />

              <Route path='/' element={<HeaderNav/>}>
                  <Route path='/home' element={<Home />} />
                  <Route path='cliente' element={<VerificarUsuario><Cliente/></VerificarUsuario>}/>
                  <Route path='usuario' element={<VerificarUsuario><Usuario/></VerificarUsuario>}/>
                  <Route path='producto' element={<VerificarUsuario><Producto/></VerificarUsuario>}/>
                  <Route path='historialV' element={<VerificarUsuario><HistorialVenta/></VerificarUsuario>}/>
                  <Route path='historialC' element={<VerificarUsuario><HistorialCotizacion/></VerificarUsuario>}/>
                  <Route path='pedido' element={<VerificarUsuario><Pedido/></VerificarUsuario>}/> 
                  <Route path='venta' element={<VerificarUsuario><RealizarCobro/></VerificarUsuario>}/> 
                  <Route path='*' element={<NotFound />} />
              </Route>

            </Routes>
        </UserProvider>
      </>
    );
}

export default App;
