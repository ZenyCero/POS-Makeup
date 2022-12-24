import React, { useState,useEffect,useContext } from 'react';
import './css/navegacion.css';
import { Link} from 'react-router-dom';
import { Accordion, AccordionItem,AccordionHeader, AccordionBody,Row,Col} from 'reactstrap';
import { UserContext } from "../context/UserProvider";



const Navegacion= () => {
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

  const { user} = useContext(UserContext);

    const [dataUser, setDataUser] = useState(request)

    useEffect(() => {
        let dt = JSON.parse(user)
        setDataUser(dt)

    }, [])

  const [open, setOpen] = useState('1');
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

    return (
      <>
      
      <Row>
        <Col>
          <div class='container-nav'>
            <div>
            <div class='logo'>
              <Row>
                <Col>
                  <Link class='link' to="home"><i class="fa-solid fa-desktop"></i></Link>

                </Col>
                <Col>
                  <h2>MAKEUP</h2>

                </Col>
                
              </Row>   
            </div>
              <hr/>
              
              <Accordion flush open={open} toggle={toggle}>
              { 
                (dataUser.cargo == "Administrador") &&
                <AccordionItem>
                  <AccordionHeader targetId="1">Administracion</AccordionHeader>
                  <AccordionBody accordionId="1">
                    <ul>
                    {
                      (dataUser.cargo == "coming") &&
                      <li>
                        <Link class='link' to="usuario"> Usuario</Link>
                      </li>
                    }
                      <li>
                        <Link class='link' to="cliente"> Cliente</Link>
                      </li>
                    </ul>
                  </AccordionBody>
                </AccordionItem>
              }
                <div class='spacer'/>
                {
                  (dataUser.cargo == "Administrador") &&
                <AccordionItem>
                  <AccordionHeader targetId="2">Inventario</AccordionHeader>
                  <AccordionBody accordionId="2">
                    <ul>
                        <li>
                          <Link class='link' to="producto"> Producto</Link>
                        </li>
                      </ul>
                  </AccordionBody>
                </AccordionItem>
                }
                <div class='spacer'/>
                {
                  (dataUser.cargo == "Administrador" || dataUser.cargo == "Vendedor") &&
                <AccordionItem>
                  <AccordionHeader targetId="3">Pedido</AccordionHeader>
                  <AccordionBody accordionId="3">
                    <ul>
                      <li>
                        <Link class='link' to="pedido"> Nuevo Pedido</Link>
                      </li>
                      <li>
                        <Link class='link' to="historialC"> Historial Cotizacion</Link>
                      </li>
                    </ul>
                  </AccordionBody>
                </AccordionItem>
                }
                <div class='spacer'/>
                {
                  (dataUser.cargo == "Cajero" || dataUser.cargo == "Administrador") &&
                <AccordionItem>
                  <AccordionHeader targetId="4">Venta</AccordionHeader>
                  <AccordionBody accordionId="4">
                    <ul>
                      <li>
                        <Link class='link' to="venta"> Realizar Cobro</Link>
                      </li>
                      {
                        (dataUser.cargo == "coming") &&
                      <li>
                        <Link class='link' to="historialV"> Historial Venta</Link>
                      </li>
                      }
                    </ul>
                  </AccordionBody>
                </AccordionItem>
                }
              </Accordion>
            </div>
          </div>
        </Col>
      </Row>
      </>
    );
}

export default Navegacion;
