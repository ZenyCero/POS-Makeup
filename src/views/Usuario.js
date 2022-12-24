import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { Card, CardBody, CardHeader, Button, Modal, ModalHeader, ModalBody, Label, Input, FormGroup, ModalFooter, Row, Col } from "reactstrap"
import Swal from 'sweetalert2'


const modeloUsuario = {
    id_empleado: 0,
    full_name :"",
    fechNaci :"",
    email :"",
    telefono :"",
    sexo:"",
    direccion:"",
    dni:"",
    cargo:"",
    pass:""
}

const Usuario = () => {

    const [usuario, setUsuario] = useState(modeloUsuario);
    const [pendiente, setPendiente] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [verModal, setVerModal] = useState(false);

    const handleChange = (e) => {

        console.log(e.target.value )

        let value = e.target.value;

        setUsuario({
            ...usuario,
            [e.target.name]: value
        })
    }


    const obtenerUsuarios = async () => {
        let response = await fetch("http://localhost:8081/api/empleados");

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
            name: 'Nombre',
            selector: row => row.full_name,
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
            name: 'Rol',
            selector: row => row.cargo,
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

                    <Button color="danger" size="sm"
                        onClick={() => eliminarUsuario(row.id_empleado)}
                    >
                        <i className="fas fa-trash-alt"></i>
                    </Button>
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
        setUsuario(modeloUsuario)
        setVerModal(!verModal);
    }

    const guardarCambios = async () => {

        delete usuario.idRolNavigation;

        let response;
        console.log(usuario)
        if (usuario.id_empleado == 0) {
            response = await fetch("http://localhost:8081/api/empleado", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(usuario)
            })

        } else {
            response = await fetch("http://localhost:8081/api/empleado", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(usuario)
            })
        }

        if (response.ok) {
            await obtenerUsuarios();
            setUsuario(modeloUsuario)
            setVerModal(!verModal);

        } else {
            alert("error al guardar")
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

                const response = fetch("http://localhost:8081/api/empleado/" + id, { method: "DELETE" })
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
                            Lista de Usuarios
                        </CardHeader>
                        <CardBody>
                            <Button color="success" size="sm" onClick={() => setVerModal(!verModal)}>Nuevo Usuario</Button>
                            <hr></hr>
                            <DataTable
                                columns={columns}
                                data={usuarios}
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
                    Detalle Usuario
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Nombre</Label>
                                <Input bsSize="sm" name="full_name" onChange={handleChange} value={usuario.full_name} />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Correo</Label>
                                <Input bsSize="sm" name="email" onChange={handleChange} value={usuario.email} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Telefono</Label>
                                <Input bsSize="sm" name="telefono" onChange={handleChange} value={usuario.telefono} />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Rol</Label>
                                <Input bsSize="sm" type={"select"} name="cargo" onChange={handleChange} value={usuario.cargo} >
                                    <option value={0}>Seleccionar</option>
                                    <option value={'Administrador'}>Administrador</option>
                                    <option value={'Vendedor'}>Vendedor</option>
                                    <option value={'Cajero'}>Cajero</option>
                                    <option value={'Recepcionista'}>Recepcionista</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="6" >
                            <FormGroup>
                                <Label>Contraseña</Label>
                                <Input bsSize="sm" name="pass" onChange={handleChange} value={usuario.pass} type="password" />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Sexo</Label>
                                <Input bsSize="sm" type={"select"} name="sexo" onChange={handleChange} value={usuario.sexo} >
                                    <option value={0}>Seleccionar</option>
                                    <option value={'M'}>M</option>
                                    <option value={'H'}>H</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="6" >
                            <FormGroup>
                                <Label>Direccion</Label>
                                <Input bsSize="sm" name="direccion" onChange={handleChange} value={usuario.direccion} />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Dni</Label>
                                <Input bsSize="sm" name="dni" onChange={handleChange} value={usuario.dni} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                    <Col sm={6}>
                            <FormGroup>
                                <Label>Fecha de Nacimiento</Label>
                                <Input id="exampleDatetime" name="fechNaci" placeholder="datetime placeholder"
                                type="date" bsSize="sm" onChange={handleChange} value={usuario.fechNaci} />
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

export default Usuario;