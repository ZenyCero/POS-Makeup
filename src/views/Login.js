import { useContext, useState } from "react"
import { UserContext } from "../context/UserProvider"
import Swal from 'sweetalert2'
import './css/login.css'
import { Navigate } from "react-router-dom"
import imgLogo from '../imagen/Logo.jpg';

const Login = () => {

    const [_correo, set_Correo] = useState("")
    const [_clave, set_Clave] = useState("")
    const { user, iniciarSession } = useContext(UserContext)

    if (user != null) {
        return <Navigate to="/home"/>
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        let request = {
            id_empleado: 0,
            sexo: "",
            email: "",
            dni: "",
            full_name: "",
            direccion: "",
            telefono: 0,
            fechNaci: "",
            cargo: "",
            pass: ""
        }

        request.email = _correo;
        request.pass = _clave;

        const api = fetch("http://localhost:8081/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(request)
        })
        .then((response) => {
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then((dataJson) => {
            if (dataJson.id_empleado == 0) {
                Swal.fire(
                    'Opps!',
                    'No se encontro el usuario',
                    'error'
                )
            } else {
                iniciarSession(dataJson)
            }

        }).catch((error) => {
            Swal.fire(
                'Opps!',
                'No se pudo iniciar sessión',
                'error'
            )
        })
    }

    return (
        <div className="container">

            <div className="row justify-content-center">

                <div className="col-xl-10 col-lg-12 col-md-9">

                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-body p-0">

                            <div className="row">
                                <div className="col-lg-6 d-none d-lg-block bg-login-image logo" >
                                <img class="imgLogo" src={imgLogo} alt='imagen03'/>
                                </div>
                                
                                <div className="col-lg-6">
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">Bienvenido</h1>
                                        </div>
                                        <form className="user" onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <input type="email" required className="form-control form-control-user" aria-describedby="emailHelp" placeholder="email"
                                                    value={_correo}
                                                    onChange={(e) => set_Correo(e.target.value)}
                                                />
                                            </div>
                                            <div class="spacer"></div>
                                            <div className="form-group">
                                                <input type="password" required className="form-control form-control-user" placeholder="Contraseña"
                                                    value={_clave}
                                                    onChange={(e) => set_Clave(e.target.value)}
                                                />
                                            </div>
                                            <div class="spacer"></div>
                                            <button type="submit" className="btn btn-primary btn-user btn-block"> Ingresar </button>
                                            
                                        </form>
                                        <hr></hr>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>

                </div>

            </div>

        </div>
        )
}

export default Login