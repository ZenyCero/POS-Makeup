import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { Card, CardBody, CardHeader, Button, Modal, ModalHeader, ModalBody, Label, Input, FormGroup, ModalFooter, Row, Col } from "reactstrap"
import Swal from 'sweetalert2'
import './css/venta.css';

const modeloCliente = {
    id_cliente: 0,
    fullName :"",
    fechNaci :"",
    email :"",
    telefono :"",
    sexo :'',
    direccion :"",
    dni :""
}

const campos = {
    fullName :false,
    fechNaci :false,
    email :false,
    telefono :false,
    sexo :false,
    direccion :false,
    dni :false
}

const Cliente = () => {

    const [cliente, setUsuario] = useState(modeloCliente);
    const [pendiente, setPendiente] = useState(false);
    const [clientes, setUsuarios] = useState([]);
    const [verModal, setVerModal] = useState(false);
    const [validacion, setValidacion] = useState(campos);

    const handleChange = (e) => {

        let value = e.target.value;
        let valido;

        console.log(e.target.name)
        console.log(value)
        if(value == null || value != ""){
            valido = false
        }else if(value != null || value != ""){
            valido = true
        }
        
        setValidacion({
            ...validacion,
            [e.target.name]: valido
        }) 

        if(e.target.name == "dni"){
            const validarDni = async (dni) => {
                let response = await fetch("http://localhost:8082/api/validacion/"+dni)
                .then((response) => {
                    return response.ok ? response.json() : Promise.reject(response);
                }).then((dataJson) =>{

                    console.log(dataJson)
                    let cliente = {
                        id_cliente: 0,
                        fullName : dataJson.name,
                        fechNaci : dataJson.birth.substr(0,10),
                        email :"",
                        telefono :"",
                        sexo : dataJson.gender.substr(0,1),
                        direccion :dataJson.origen,
                        dni : dni
                    }

                    setValidacion({
                        ...validacion,
                        [e.target.name]: false
                    })
                    setUsuario(cliente)
                })                
            }
            validarDni(value)     
        }
        
        
        setUsuario({
            ...cliente,
            [e.target.name]: value
        })
    }

    

    const obtenerUsuarios = async () => {
        let response = await fetch("http://localhost:8081/api/clientes");

        if (response.ok) {
            let data = await response.json()
            setUsuarios(data)
            setPendiente(false)
        }
    }

    useEffect(() => {
        obtenerUsuarios();
    }, [])

    const columns = [
        {
            name: 'Nombres',
            selector: row => row.fullName,
            sortable: true,
        },
        {
            name: 'Correo',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Telefono',
            selector: row => row.telefono,
            sortable: true,
        },
        
        {
            name: '',
            cell: row => (
                <>
                    <Button color="primary" size="sm" className="mr-2"
                        onClick={() => abrirEditarModal(row)}
                    >
                        <i className="fas fa-pen-alt"></i>
                    </Button>
                    
                    {/* <Button color="danger" size="sm"
                        onClick={() => eliminarUsuario(row.id_cliente)}
                    >
                        <i className="fas fa-trash-alt"></i>
                    </Button> */}
                </>
            ),
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                fontSize: '13px',
                fontWeight: 800,
            },
        },
        headRow: {
            style: {
                backgroundColor: "#eee",
            }
        }
    };

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };

    const abrirEditarModal = (data) => {
        setUsuario(data);
        setVerModal(!verModal);
    }

    const cerrarModal = () => {
        setUsuario(modeloCliente)
        setVerModal(!verModal);
    }

    const guardarCambios = async () => {

        let response;
        if (cliente.id_cliente == 0) {
            response = await fetch("http://localhost:8081/api/cliente", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(cliente)
            })

        } else {
            response = await fetch("http://localhost:8081/api/cliente", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(cliente)
            })
        }

        if (response.ok) {
            await obtenerUsuarios();
            setUsuario(modeloCliente)
            setVerModal(!verModal);
            Swal.fire(
                'Cliente creado!',
                'Se ha ingresado correctamente',
                'success'
            )

        } else {
            Swal.fire(
                'Error!',
                'Se ha ingresado información incompleta',
                'error'
            )
            /* alert("error al guardar") */
        }

    }

    const eliminarUsuario = async (id) => {

        Swal.fire({
            title: 'Esta seguro?',
            text: "Desea eliminar el usuario",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, continuar',
            cancelButtonText: 'No, volver'
        }).then((result) => {
            if (result.isConfirmed) {

                const response = fetch("http://localhost:8081/api/cliente/" + id, { method: "DELETE" })
                    .then(response => {
                        if (response.ok) {

                            obtenerUsuarios();

                            Swal.fire(
                                'Eliminado!',
                                'El usuario fue eliminado.',
                                'success'
                            )
                        }
                    })
            }
        })
    }


    return (
        <>

            <Row>
                
                <Col sm={12}>
                    <Card>
                        <CardHeader style={{ backgroundColor: '#4e73df', color: "white" }}>
                            Lista de Clientes
                        </CardHeader>
                        <CardBody>
                            <Button color="success" size="sm" onClick={() => setVerModal(!verModal)}>Nuevo Cliente</Button>
                            <hr></hr>
                            <DataTable
                                columns={columns}
                                data={clientes}
                                progressPending={pendiente}
                                pagination
                                paginationComponentOptions={paginationComponentOptions}
                                customStyles={customStyles}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Modal isOpen={verModal}>
                <ModalHeader>
                    Detalle Cliente
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Nombres</Label>
                                <Input bsSize="sm" invalid={validacion.fullName} name="fullName"  onChange={handleChange} value={cliente.fullName} />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Correo</Label>
                                <Input bsSize="sm" invalid={validacion.email} name="email" onChange={handleChange} value={cliente.email} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Dni</Label>
                                <Input bsSize="sm"  invalid={validacion.dni} name="dni" onChange={handleChange} value={cliente.dni} />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Sexo</Label>
                                <Input bsSize="sm" invalid={validacion.sexo} type={"select"} name="sexo" onChange={handleChange} value={cliente.sexo} >
                                    <option value={0}>Seleccionar</option>
                                    <option value={'M'}>M</option>
                                    <option value={''}>F</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Fecha de Nacimiento</Label>
                                <Input id="exampleDatetime" name="fechNaci" placeholder="datetime placeholder"
                                type="date" bsSize="sm" invalid={validacion.fechNaci} onChange={handleChange} value={cliente.fechNaci.substr(0,10)} />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Direccion</Label>
                                <Input bsSize="sm" invalid={validacion.direccion} name="direccion" onChange={handleChange} value={cliente.direccion} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                        <FormGroup>
                                <Label>Telefono</Label>
                                <Input bsSize="sm" invalid={validacion.telefono} name="telefono" onChange={handleChange} value={cliente.telefono} />
                            </FormGroup>
                        </Col>
                    </Row>
                    
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" color="primary" onClick={guardarCambios}>Guardar</Button>
                    <Button size="sm" color="danger" onClick={cerrarModal}>Cerrar</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default Cliente;