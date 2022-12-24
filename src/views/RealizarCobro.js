import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Button,Modal,ModalHeader,ModalBody,ModalFooter } from "reactstrap";
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2'

import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

let ordenO = {
    id_orden: 0,
    fk_cliente: {
      id_cliente: 0,
      sexo: "",
      email: "",
      dni: "",
      fullName: "",
      direccion: "",
      telefono: "",
      fechNaci: ""
    },
    fk_empleado: {
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
    },
    fk_producto: [],
    orden_estado: "",
    orden_fecha: ""
  }


const RealizarCobro = () => {

    const [verModal,setVerModal] = useState(false)
    const [orden, setOrden] = useState([])
    const [detalleOrden, setDetalleOrden] = useState([])
    const [total, setTotal] = useState(0)

    const obtenerOrdenes = async () => {
        let response = await fetch("http://localhost:8081/api/ordenesEP");

        if (response.ok) {
            let data = await response.json()
            setOrden(data)
        }
    }

    const obtenerDetalleOrdenes = async (id) => {
        let response = await fetch("http://localhost:8081/api/detalle_ordenL/"+id.id_orden);

        if (response.ok) {
            let dato = await response.json()
            let _total = 0;
            setDetalleOrden(dato);
            console.log(dato)
            for(let i=0;i<dato.length;i++){
                _total = (dato[i].detalle_precio * dato[i].detalle_cantidad) + _total
            }
            setTotal(_total)
        }
    }

    const obtenerDetalleOrdenesC = async (id) => {
        let response = await fetch("http://localhost:8081/api/detalle_ordenL/"+id);
        if (response.ok) {
            let dato = await response.json()
            setDetalleOrden(dato);
            console.log(dato)
        }
    }

    useEffect(() => {
        obtenerOrdenes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const mostrarModal = (data) => {
        obtenerDetalleOrdenes(data)
        setVerModal(!verModal);
    }

    const cancelarPedido = async (id) =>{
        obtenerDetalleOrdenesC(id)
        console.log(detalleOrden)
        Swal.fire({
            title: 'Esta seguro?',
            text: "Desea eliminar el pedido",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, continuar',
            cancelButtonText: 'No, volver'
        }).then((result) => {
            if (result.isConfirmed) {
                for(let i=0;i<detalleOrden.length;i++){
                    console.log(detalleOrden[i].id_detalle_orden)
                    const response = fetch("http://localhost:8081/api/detalle_orden/" + detalleOrden[i].id_detalle_orden, { method: "DELETE" })
                    
                }
                    
            const response = fetch("http://localhost:8081/api/ordenN/" + id, { method: "DELETE" })
                .then(response => {
                if (response.ok) {

                    obtenerOrdenes();

                    Swal.fire(
                        'Eliminado!',
                        'El pedido fue eliminado.',
                        'success'
                    )
                }
            })
        }
        })  
    }


    const cambiarStatus = async (data) =>{
        data.orden_estado = "A"
        let response = await fetch("http://localhost:8081/api/orden", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(data)
        })
        .then(response => {
            Swal.fire(
                'Finalizado!',
                'Se actualizo el estado.',
                'success'
            )
            return <Navigate to="historialV"/>

        }).catch((error) => {
            Swal.fire(
                'Opps!',
                'No se pudo encontrar información',
                'error'
            )
            console.log("No se pudo enviar el pedido ", error)
        })   
    }

    
    return (
        <>
            <Row>
                <Col sm={12}>
                    <Card>
                        <CardHeader style={{ backgroundColor: '#4e73df', color: "white" }}>
                            Realizar Cobro
                        </CardHeader>
                        <CardBody>
                            {/* <Row className="align-items-end">
                                <Col sm={3}>
                                    <FormGroup>
                                        <Label>Buscar por: </Label>
                                        <Input type="select" bsSize="sm" onChange={(e) => setBuscarPor(e.target.value)}
                                            value={buscarPor}
                                        >
                                            <option value="fecha">Fechas</option>
                                            <option value="numero">Numero de Pedido</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                {
                                    (buscarPor == "fecha") ? (
                                        <>
                                            <Col sm={3}>
                                                <FormGroup>
                                                    <Label>Fecha Inicio:</Label>
                                                    <DatePicker
                                                        className="form-control form-control-sm"
                                                        selected={fechaInicio}
                                                        onChange={(date) => setFechaInicio(date)}
                                                        dateFormat='dd/MM/yyyy'
                                                    />
                                                </FormGroup>
                                            </Col>

                                            <Col sm={3}>
                                                <FormGroup>
                                                    <Label>Fecha Fin:</Label>
                                                    <DatePicker
                                                        className="form-control form-control-sm"
                                                        selected={fechaFin}
                                                        onChange={(date) => setFechaFin(date)}
                                                        dateFormat='dd/MM/yyyy'
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </>
                                    ) : (
                                        <Col sm={3}>
                                            <FormGroup>
                                                <Label>Numero de Pedido:</Label>
                                                <Input bsSize="sm" value={nroVenta} onChange={(e) => setNumeroVenta(e.target.value)} />
                                            </FormGroup>
                                        </Col>
                                    )
                                }
                                <Col sm={3}>
                                    <FormGroup>
                                        <Button color="success" size="sm" block onClick={buscarVenta}>
                                            <i className="fa fa-search" aria-hidden="true"></i> Buscar
                                        </Button>
                                    </FormGroup>
                                </Col>
                            </Row> */}
                            <hr></hr>
                            <Row>
                                <Col sm="12">
                                    <Table striped responsive size="sm">
                                        <thead>
                                            <tr>
                                                <th>#Pedido</th>
                                                <th>Nombres Cliente</th>
                                                <th>Documento Cliente</th>
                                                <th>Estado</th>
                                                <th>Fecha de Pedido</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (orden.length < 1) ? (
                                                    <tr>
                                                        <td colSpan="7" style={{ textAlign: "center" }}>
                                                            Sin resultados
                                                        </td>
                                                    </tr>
                                                ) : (

                                                    orden.map((item) => (
                                                        <tr key={item.id_orden}>
                                                            <td>{item.id_orden}</td>
                                                            <td>{item.fk_cliente.fullName}</td>
                                                            <td>{item.fk_cliente.dni}</td>
                                                            <td>{item.orden_estado}</td>
                                                            <td>{item.orden_fecha}</td>
                                                            <td>
                                                                <Button size="sm" color="info" outline
                                                                    
                                                                    onClick={() => mostrarModal(item)}
                                                                >
                                                                    <i className="fa fa-eye" aria-hidden="true"></i> Ver detalle
                                                                </Button>
                                                            </td>
                                                            <td>
                                                                <Button color="success" size="sm" block onClick={() => cambiarStatus(item)}>
                                                                    <i class="fa-regular fa-square-check"></i> Pago Realizado
                                                                </Button>
                                                            </td>
                                                            <td>
                                                                <Button color="danger" size="sm" block onClick={() => cancelarPedido(item.id_orden)}>
                                                                    <i className="fas fa-trash-alt"></i> Cancelar Pedido
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )
                                            }
                                        </tbody>
                                    </Table>

                                </Col>

                            </Row>

                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Modal size="lg" isOpen={verModal}>
                <ModalHeader>
                    Detalle Venta
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col sm={4}>
                            <FormGroup>
                                <Label>Fecha Registro:</Label>
                                <Input bsSize="sm" disabled value={detalleOrden[0]?.fk_orden?.orden_fecha}/>
                            </FormGroup>
                        </Col>
                        <Col sm={4}>
                            <FormGroup>
                                <Label>Numero Venta:</Label>
                                <Input bsSize="sm" disabled value={detalleOrden[0]?.fk_orden?.id_orden}/>
                            </FormGroup>
                        </Col>
                        <Col sm={4}>
                            <FormGroup>
                                <Label>Tipo Documento:</Label>
                                <Input bsSize="sm" disabled value={"Dni"} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            <FormGroup>
                                <Label>Usuario Registro:</Label>
                                <Input bsSize="sm" disabled value={detalleOrden[0]?.fk_orden?.fk_empleado?.full_name}/>
                            </FormGroup>
                        </Col>
                        <Col sm={4}>
                            <FormGroup>
                                <Label>Documento Cliente:</Label>
                                <Input bsSize="sm" disabled value={detalleOrden[0]?.fk_orden?.fk_cliente?.dni} />
                            </FormGroup>
                        </Col>
                        <Col sm={4}>
                            <FormGroup>
                                <Label>Nombre Cliente:</Label>
                                <Input bsSize="sm" disabled value={detalleOrden[0]?.fk_orden?.fk_cliente?.fullName}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            <FormGroup>
                                <Label>Sub Total:</Label>
                                <Input bsSize="sm" disabled value={total-total*0.18} />
                            </FormGroup>
                        </Col>
                        <Col sm={4}>
                            <FormGroup>
                                <Label>IGV (18%):</Label>
                                <Input bsSize="sm" disabled value={total*0.18}/>
                            </FormGroup>
                        </Col>
                        <Col sm={4}>
                            <FormGroup>
                                <Label>Total:</Label>
                                <Input bsSize="sm" disabled value={total} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <Table size="sm">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        (detalleOrden == undefined) ? (
                                            <tr><td colSpan={4}>Sin productos</td></tr>
                                        ) : (
                                            detalleOrden.map((item) => (
                                                <tr key={item.id_detalle_orden}>
                                                    <td>{item?.fk_orden?.fk_producto[0]?.producNombre}</td>
                                                    <td>{item.detalle_cantidad}</td>
                                                    <td>{item.detalle_precio}</td>
                                                    <td>{item.detalle_cantidad * item.detalle_precio}</td>
                                                </tr>
                                            ))
                                        )
                                    }

                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" color="danger" onClick={() => setVerModal(!verModal)}>Cerrar</Button>
                </ModalFooter>
            </Modal>
        </>
        


    )
}

export default RealizarCobro;