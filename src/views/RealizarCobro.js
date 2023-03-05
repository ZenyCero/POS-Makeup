import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Button,Modal,ModalHeader,ModalBody,ModalFooter } from "reactstrap";
import Autosuggest from 'react-autosuggest';
import Swal from 'sweetalert2'
import "./css/realizarCobro.css"
import imgLogo from '../imagen/Logo.jpg';

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
    const [verBoleta,setVerBoleta] = useState(false)

    const [orden, setOrden] = useState([])
    const [detalleOrden, setDetalleOrden] = useState([])
    const [total, setTotal] = useState(0)
    const [horaAct, setHoraAct] = useState()

    const [habilitar, setHabilitar] = useState(true)
    const [a_Productos, setA_Productos] = useState([])
    const [a_Busqueda, setA_Busqueda] = useState("")



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

    const mostrarModal = (data,e) => {
        setHabilitar(e);
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
            const tiempoTranscurrido = Date.now();
            const hoy = new Date(tiempoTranscurrido);
            const sHoy = hoy.toISOString();
            setHoraAct(sHoy)
            obtenerDetalleOrdenes(response)
            setVerBoleta(!verBoleta)
            obtenerOrdenes();
           /*  Swal.fire(
                'Finalizado!',
                'Se actualizo el estado.',
                'success'
            )
            return <Navigate to="historialV"/> */

        }).catch((error) => {
            Swal.fire(
                'Opps!',
                'No se pudo encontrar información',
                'error'
            )
            console.log("No se pudo enviar el pedido ", error)
        })   
    }

    const sugerenciaSeleccionada = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {

        Swal.fire({
            title: suggestion.producMarca +" - " + suggestion.producNombre,
            text:"Ingrese la cantidad",
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Volver',
            showLoaderOnConfirm: true,
            preConfirm: (inputValue) => {
                
                if (isNaN(parseFloat(inputValue))) {
                    setA_Busqueda("")
                    Swal.showValidationMessage(
                        "Debe ingresar un valor númerico"
                    )
                } else {

                    let producto = {
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
                              id_producto: suggestion.id_producto,
                              fk_categoria: {
                                cate_nombre: suggestion.fk_categoria.cate_nombre,
                                id: suggestion.fk_categoria.id
                              },
                              producSku: suggestion.producSku,
                              producNombre: suggestion.producNombre,
                              producPrecio: suggestion.producPrecio,
                              producMarca: suggestion.producMarca,
                              producStock: suggestion.producStock
                            }
                          ],
                          orden_estado: "",
                          orden_fecha: ""
                        },
                        detalle_precio: suggestion.producPrecio,
                        detalle_cantidad: parseInt(inputValue)
                    }

                    let arrayProductosR = []
                    arrayProductosR.push(...detalleOrden)
                    arrayProductosR.push(producto)
                    setDetalleOrden((anterior) => [...anterior, producto])

                    let _total = 0;
                    for(let i=0;i<arrayProductosR.length;i++){
                        console.log(_total)
                        _total = (arrayProductosR[i].detalle_precio * arrayProductosR[i].detalle_cantidad) + _total
                    }
                    
                    setTotal(_total)
                }
                
            },
            allowOutsideClick: () => !Swal.isLoading()

        }).then((result) => {
            if (result.isConfirmed) {
                setA_Busqueda("")
            } else {
                setA_Busqueda("")
            }
        })
    }

    const onSuggestionsFetchRequested = ({ value }) => {
        
        const api = fetch("http://localhost:8081/api/productoN/" + value)
            .then((response) => {
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then((dataJson) => {
                setA_Productos(dataJson)
            }).catch((error) => {
                console.log("No se pudo obtener datos, mayor detalle: ", error)
            })
        
    }

    const onSuggestionsClearRequested = () => {
        setA_Productos([])
    }

    const getSuggestionValue = (sugerencia) => {
        return sugerencia.id_producto + " - " + sugerencia.producNombre + " - " + sugerencia.producMarca
    }

    //como se debe mostrar las sugerencias - codigo htmlf
    const renderSuggestion = (sugerencia) => (
        <span>
            {sugerencia.id_producto + " - " + sugerencia.producNombre + " - " + sugerencia.producMarca}
        </span>
     )

    //evento cuando cambie el valor del texto de busqueda
    const onChange = (e, {newValue}) => {
        setA_Busqueda(newValue)
    }

    const inputProps = {
        placeholder : "Buscar producto",
        value: a_Busqueda,
        onChange 
    }

    const guardarCambios =()=>{
        
        
        if (detalleOrden.length < 1 ) {
            Swal.fire(
                'Opps!',
                'No existen productos',
                'error'
            )
            return
        }
        

        const tiempoTranscurrido = Date.now();
        const hoy = new Date(tiempoTranscurrido);
        const sHoy = hoy.toISOString();

        let orden ={
            id_orden: 0,
            fk_cliente: {},
            fk_empleado: {},
            fk_producto: null,
            orden_estado: "",
            orden_fecha: sHoy
        }

        orden.orden_estado = "P";
        orden.fk_cliente = detalleOrden[0].fk_orden.fk_cliente;
        orden.fk_empleado = detalleOrden[0].fk_orden.fk_empleado;

        let detalle_orden ={
            id_detalle_orden: 0,
            fk_orden: {
              id_orden: 0,
              fk_cliente: {},
              fk_empleado: {},
              fk_producto: [],
              orden_estado: "",
              orden_fecha: ""
            },
            detalle_precio: 0,
            detalle_cantidad: 0,
          }
        
        console.log(orden)
        const api = fetch("http://localhost:8081/api/orden", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(orden)
        })
        .then((response) => {
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then((dataJson) => {
            console.log(detalleOrden)
            for (var i = 0; i < detalleOrden.length; i++) { 

            
            detalle_orden.fk_orden.id_orden = dataJson.id_orden;
            detalle_orden.fk_orden.fk_cliente = dataJson.fk_cliente;
            detalle_orden.fk_orden.fk_empleado = dataJson.fk_empleado;
            detalle_orden.fk_orden.fk_producto = [detalleOrden[i].fk_orden.fk_producto[0]];
            detalle_orden.fk_orden.orden_estado = dataJson.orden_estado;
            detalle_orden.fk_orden.orden_fecha = dataJson.orden_fecha;
            detalle_orden.detalle_cantidad = detalleOrden[i].detalle_cantidad;
            detalle_orden.detalle_precio = detalleOrden[i].detalle_precio

            console.log(detalle_orden)
            
            const api = fetch("http://localhost:8081/api/detalle_ordenN", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(detalle_orden)
            })
            .then((response) => {
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then( (dataJson) =>  {
                
                var data = dataJson;
                Swal.fire(
                    'Pedido Creado!',
                    'Numero de Pedido : ' + data.id_detalle_orden,
                    'success'
                )
                let idOrden = detalleOrden[0].fk_orden.id_orden
                for(let i=0;i<detalleOrden.length;i++){
                    console.log(detalleOrden[i].id_detalle_orden)
                    const response = fetch("http://localhost:8081/api/detalle_ordenD/" + detalleOrden[i].id_detalle_orden, { method: "DELETE" })
                    
                }
            
                const response = fetch("http://localhost:8081/api/ordenN/" + idOrden, { method: "DELETE" })
                obtenerOrdenes();
            }).catch((error) => {
                Swal.fire(
                    'Opps!',
                    'No se pudo crear el pedido',
                    'error'
                )
                console.log("No se pudo enviar el pedido ", error)
            })

        };
        }).catch((error) => {
            Swal.fire(
                'Opps!',
                'No se pudo crear el pedido',
                'error'
            )
            console.log("No se pudo enviar el pedido ", error)
        })
    }

    
    const eliminarProducto = (id) => {
        console.log(id)
        let _total = 0;
        let listaproductos = detalleOrden.filter(p => p.id_detalle_orden != id)

        for(let i=0;i<listaproductos.length;i++){
            _total = (listaproductos[i].detalle_precio * listaproductos[i].detalle_cantidad) + _total
        }

        setTotal(_total)
        setDetalleOrden(listaproductos)
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
                            
                            <hr></hr>
                            <Row>
                                <Col sm="12">
                                    <Table striped responsive size="sm">
                                        <thead>
                                            <tr>
                                                
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
                                                            
                                                            <td>{item.fk_cliente.fullName}</td>
                                                            <td>{item.fk_cliente.dni}</td>
                                                            <td>{item.orden_estado}</td>
                                                            <td>{item.orden_fecha}</td>
                                                            <td>
                                                                <Button size="sm" color="info" outline
                                                                    
                                                                    onClick={() => mostrarModal(item,false)}
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
                                                                <Button size="sm" color="warning" outline onClick={() => mostrarModal(item,true)}>
                                                                    <i className="fa-solid fa-square-check"></i> Modificar Pedido
                                                                </Button>{ }
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
                    {
                    (habilitar == true)?(
                    <Row className="mb-2">
                        <Col sm={12}>
                        <FormGroup>
                            <Autosuggest
                                suggestions={a_Productos}
                                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                onSuggestionsClearRequested={onSuggestionsClearRequested}
                                getSuggestionValue={getSuggestionValue}
                                renderSuggestion={renderSuggestion}
                                inputProps={inputProps}
                                onSuggestionSelected={sugerenciaSeleccionada}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    ):(<></>)
                    }
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
                                        (detalleOrden == undefined || detalleOrden.length <= 0) ? (
                                            <tr><td colSpan={4}>Sin productos</td></tr>
                                        ) : (
                                            (habilitar == true)?(
                                                detalleOrden.map((item) => (
                                                <tr key={item.id_detalle_orden}>
                                                    <td>{item?.fk_orden?.fk_producto[0]?.producNombre}</td>
                                                    <td>{item.detalle_cantidad}</td>
                                                    <td>{item.detalle_precio}</td>
                                                    <td>{item.detalle_cantidad * item.detalle_precio}</td>
                                                    <td><Button size="sm" color="danger" outline onClick={()=> eliminarProducto(item.id_detalle_orden)}>
                                                        <i className="fas fa-trash-alt"/></Button></td>
                                                </tr>
                                            ))
                                            ):(
                                                detalleOrden.map((item) => (
                                                <tr key={item?.id_detalle_orden}>
                                                    <td>{item?.fk_orden?.fk_producto[0]?.producNombre}</td>
                                                    <td>{item?.detalle_cantidad}</td>
                                                    <td>{item?.detalle_precio}</td>
                                                    <td>{item?.detalle_cantidad * item?.detalle_precio}</td>
                                                </tr>
                                            ))
                                            )
                                        )
                                    }

                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    {
                        (habilitar == true)?(
                            <Button size="sm" color="primary" onClick={guardarCambios}>Guardar</Button>
                        ):(
                            <></>
                        )
                    }
                    
                    <Button size="sm" color="danger" onClick={() => setVerModal(!verModal)}>Cerrar</Button>
                </ModalFooter>
            </Modal>

            <Modal size="lg" isOpen={verBoleta}>
                <ModalBody>
                    <Row>
                        <Col sm={4}></Col>
                        <Col sm={6}>
                            <h3><b>Distribuidora MakeUp</b></h3>
                        </Col>
                        <Col sm={2}></Col>
                    </Row>
                    <Row>
                        <Col class="logo" sm={4}>
                            <img width="200px" src={imgLogo} alt="logo"/>
                        </Col>

                        <Col class="empresa" sm={3}>
                            <h5>R.U.C N20103452105</h5>
                            <h5><b>Boleta de Venta Electronica</b></h5>
                            <h5>B03-{detalleOrden[0]?.fk_orden?.id_orden}</h5>
                        </Col>
                        <Col sm={3}>
                            
                            <h5>Domicilio fiscal: Av San felipe NRO 618 - Callao</h5>
                            <h5>Telefono: (01) 115-8000</h5>
                        </Col>  
                    </Row>
                    <Row>
                        <Col>
                            <h5>Cliente: {detalleOrden[0]?.fk_orden?.fk_empleado?.full_name}</h5>
                            <h5>DNI: {detalleOrden[0]?.fk_orden?.fk_empleado?.dni}</h5>
                        </Col>
                        <Col><h5>Fecha de Emision: {horaAct}</h5></Col>
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
                                        (detalleOrden == undefined || detalleOrden.length <= 0) ? (
                                            <tr><td colSpan={4}>Sin productos</td></tr>
                                        ) : (
                                            detalleOrden.map((item) => (
                                                <tr key={item?.id_detalle_orden}>
                                                    <td>{item?.fk_orden?.fk_producto[0]?.producNombre}</td>
                                                    <td>{item?.detalle_cantidad}</td>
                                                    <td>{item?.detalle_precio}</td>
                                                    <td>{item?.detalle_cantidad * item?.detalle_precio}</td>
                                                </tr>
                                        )))
                                    }

                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" color="danger" onClick={() => setVerBoleta(!verBoleta)}>Cerrar</Button>
                </ModalFooter>
            </Modal>
        </>
        


    )
}

export default RealizarCobro;