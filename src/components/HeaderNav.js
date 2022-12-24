import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserProvider';
import Swal from 'sweetalert2'
import imgUser from '../imagen/Foto003.JPG';
import './css/headerNav.css'
import Navegacion from './Navegacion'
import {Col, DropdownItem, DropdownMenu, DropdownToggle,Row,UncontrolledDropdown} from 'reactstrap';

const modelo = {
    nombre: "",
    correo: "",
    idRolNavigation: {
        idRol: 0,
        descripcion: ""
    }
}

const HeaderNav = () => {
    const { user, cerrarSession } = useContext(UserContext)

    if (user == null) {
        return <Navigate to="/login" />
    }

    const mostrarModalSalir = () => {

        Swal.fire({
            title: 'Esta por salir',
            text: "Desea cerrar sesion?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, continuar',
            cancelButtonText: 'No, volver'
        }).then((result) => {
            if (result.isConfirmed) {
                cerrarSession()
            }
        })

    }

    return (
        <>
            <Row>
                <Col sm={3}>
                    <Navegacion/>
                </Col>
                <Col sm={9}>
                        
                    <div id="content-wrapper" className="d-flex flex-column ">

                    <div id="content">
                        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                        <div className="d-flex p-3 navbar">
                        <UncontrolledDropdown group>
                            <i >
                                <span className="mr-2 d-none d-lg-inline text-gray-600 small">{ JSON.parse(user).email }</span>
                                <img alt='imagen03' class="imgNav" src={imgUser} />
                            </i>
                            <DropdownToggle caret color="primary"/>
                            <DropdownMenu>
                                <DropdownItem header>
                                    <Link className="dropdown-item" to="home">
                                    <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Perfil
                                    </Link>
                                </DropdownItem>
                                <DropdownItem>
                                    <button className="dropdown-item" onClick={mostrarModalSalir}>
                                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Salir
                                    </button>
                                </DropdownItem>
                            </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    </nav>
                        
                        <div className="container-fluid">

                            <Outlet />

                        </div>
                        </div>
                    </div>
                    

                </Col>
            </Row>
            
               
        </>
        )
}

export default HeaderNav