import React,{useContext,useEffect,useState} from 'react';
import './css/home.css';
import { Input, Form, FormGroup, Label } from 'reactstrap';
import imgUser from '../imagen/Foto003.JPG';
import { UserContext } from "../context/UserProvider";

const Home = () => {

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

    const { user } = useContext(UserContext)
    const [ dataUser, setDataUser ] = useState(request)

    useEffect(() => {
        let dt = JSON.parse(user)
        setDataUser(dt)
        console.log(dt)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div class='container-home'>
            <div class='welcome'>
                Bienvenido al Sistema
            </div>
            <div class='dataUser'>
                <div class='img'>
                    <img src={imgUser} alt='imagen03'/>
                </div>
                <div class='text'> 
                    <Form>
                        <FormGroup>
                            <Label for="name">
                                Nombres
                            </Label>
                            <Input disabled size={50} value={dataUser.full_name}/>
                            <Label for="email">
                                Email
                            </Label>
                            <Input disabled value={dataUser.email}/>
                            <Label for="cargo">
                                Cargo
                            </Label>
                            <Input disabled value={dataUser.cargo}/>
                                    
                        </FormGroup>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Home;
