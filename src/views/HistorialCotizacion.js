import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Button,Modal,ModalHeader,ModalBody,ModalFooter } from "reactstrap";
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2'

import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";

let modeloDetalle ={
    id_detalle_orden: 0,
    fk_orden: {
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
      fk_producto: [
        {
          id_producto: 0,
          fk_categoria: {
            cate_nombre: "",
            id: 0
          },
          producSku: "",
          producNombre: "",
          producPrecio: 0,
          producMarca: "",
          producStock: 0
        }
      ],
      orden_estado: "",
      orden_fecha: ""
    },
    detalle_precio: 0,
    detalle_cantidad: 0
  }

const HistorialVenta = () => {
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [fechaFin, setFechaFin] = useState(new Date());
    const [nroVenta,setNumeroVenta] = useState("")
    const [buscarPor, setBuscarPor] = useState("fecha")
    const [verModal,setVerModal] = useState(false)

    const [orden, setOrden] = useState([])
    const [detalleOrden, setDetalleOrden] = useState([{modeloDetalle}])
    const [total, setTotal] = useState(0)

    const [coming,setComing] = useState(false)

    const buscarVenta = () => {
        Swal.fire(
            'Opps!',
            'Funcion en mantenimiento',
            'error'
        )
        /* let options = { year: 'numeric', month: '2-digit', day: '2-digit' };

        let _fechaInicio = fechaInicio.toLocaleDateString('es-PE', options)
        let _fechaFin = fechaFin.toLocaleDateString('es-PE', options)

        const api = fetch(`api/venta/Listar?buscarPor=${buscarPor}&numeroVenta=${nroVenta}&fechaInicio=${_fechaInicio}&fechaFin=${_fechaFin}`)
            .then((response) => {
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then((dataJson) => {
                var data = dataJson;
                if (data.length < 1) {
                    Swal.fire(
                        'Opps!',
                        'No se encontraron resultados',
                        'warning'
                    )
                }
                setVentas(data);
            }).catch((error) => {
                setVentas([]);
                Swal.fire(
                    'Opps!',
                    'No se pudo encontrar información',
                    'error'
                )
            }) */
    } 

    const obtenerOrdenes = async () => {
        let response = await fetch("http://localhost:8081/api/ordenesEC");

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

    useEffect(() => {
        obtenerOrdenes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const mostrarModal = (data) => {
        obtenerDetalleOrdenes(data)
        setVerModal(!verModal);
    }

    
    return (
        <>
            <Row>
                <Col sm={12}>
                    <Card>
                        <CardHeader style={{ backgroundColor: '#4e73df', color: "white" }}>
                            Historial de Cotizaciones
                        </CardHeader>
                        <CardBody>
                            { 
                                (coming)&&
                            <Row className="align-items-end">
                                <Col sm={3}>
                                    <FormGroup>
                                        <Label>Buscar por: </Label>
                                        <Input type="select" bsSize="sm" onChange={(e) => setBuscarPor(e.target.value)}
                                            value={buscarPor}
                                        >
                                            <option value="fecha">Fechas</option>
                                            <option value="numero">Numero Venta</option>
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
                                                <Label>Numero venta:</Label>
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
                            </Row>
                            }
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
                                                <th>Aprobar</th>
                                                <th>Editar</th>
                                                <th>Cancelar</th>
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
                                                                <Button size="sm" color="info" outline onClick={() => mostrarModal(item)}>
                                                                    <i className="fa fa-eye" aria-hidden="true"></i> Ver detalle
                                                                </Button>{ }
                                                            </td>
                                                            <td>
                                                                <Button size="sm" color="success" outline>
                                                                    <i class="fa-solid fa-square-check"></i>
                                                                </Button>
                                                            </td>
                                                            <td>
                                                                <Button size="sm" color="warning" outline>
                                                                    <i className="fas fa-pen-alt"></i>
                                                                </Button>
                                                            </td>
                                                            <td>
                                                                <Button size="sm" color="danger" outline>
                                                                    <i className="fas fa-trash-alt"></i>
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

export default HistorialVenta;