import { Card, CardBody, CardHeader, Col, FormGroup, Input, InputGroup, InputGroupText, Row, Table, Button, Form } from "reactstrap";
import Swal from 'sweetalert2'
import Autosuggest from 'react-autosuggest';
import { useContext, useState, useEffect } from "react";
import "./css/venta.css"
import { UserContext } from "../context/UserProvider";


let fk_cliente = {
    id_cliente: 0,
    sexo: "",
    email: "",
    dni: "",
    fullName: "",
    direccion: "",
    telefono: "",
    fechNaci: ""
}

let fk_empleado = {
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

const Pedido = () => {
    const { user} = useContext(UserContext);
    const [dataUser, setDataUser] = useState(fk_empleado)

    
    const [a_Productos, setA_Productos] = useState([])
    const [a_Busqueda, setA_Busqueda] = useState("")

    const [b_Clientes, setB_Clientes] = useState([])
    const [b_Busqueda, setB_Busqueda] = useState("")

    const [productosR, setProductosR] = useState([])

    const [tipoDocumento,setTipoDocumento] = useState("Boleta")
    const [productos, setProductos] = useState([])
    
    const [total, setTotal] = useState(0)
    const [subTotal, setSubTotal] = useState(0)
    const [igv, setIgv] = useState(0)

    const reestablecer = () => {
        setB_Busqueda("") 
        setTipoDocumento("Boleta")
        setProductos([])
        setTotal(0)
        setSubTotal(0)
        setIgv(0)
    }

    useEffect(() => {
        let dt = JSON.parse(user)
        setDataUser(dt)

    }, [])

    //para obtener la lista de sugerencias
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

    const onSuggestionsFetchRequestedC = ({ value }) => {

        const api = fetch("http://localhost:8081/api/clienteN/" + value)
            .then((response) => {
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then((dataJson) => {
                setB_Clientes(dataJson)
            }).catch((error) => {
                console.log("No se pudo obtener datos, mayor detalle: ", error)
            })
        
    }

    //funcion que nos permite borrar las sugerencias
    const onSuggestionsClearRequested = () => {
        setA_Productos([])
    }

    const onSuggestionsClearRequestedC = () => {
        setB_Clientes([])
    }

    //devuelve el texto que se mostrara en la caja de texto del autocomplete cuando seleccionas una sugerencia (item)
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

    //devuelve el texto que se mostrara en la caja de texto del autocomplete cuando seleccionas una sugerencia (item)
    const getSuggestionValueC = (sugerencia) => {
        return sugerencia.fullName + " - " + sugerencia.dni
    }

    //como se debe mostrar las sugerencias - codigo htmlf
    const renderSuggestionC = (sugerencia) => (
        <span>
            {sugerencia.fullName + " - " + sugerencia.dni}
        </span>
     )

    const inputPropsC = {
        placeholder : "Buscar Cliente",
        value: b_Busqueda,
        onChange : (y, {newValue}) => {
            setB_Busqueda(newValue)
        }
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
                        idProducto: suggestion.id_producto,
                        descripcion: suggestion.producNombre,
                        cantidad: parseInt(inputValue),
                        precio: suggestion.producPrecio,
                        total: suggestion.producPrecio * parseFloat(inputValue)
                    }

                    let productoR = {
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

                    let arrayProductosR = []
                    arrayProductosR.push(...productosR)
                    arrayProductosR.push(productoR)
                    setProductosR((anterior) => [...anterior, productoR])

                    let arrayProductos = []
                    arrayProductos.push(...productos)
                    arrayProductos.push(producto)

                    setProductos((anterior) => [...anterior, producto])
                    calcularTotal(arrayProductos)
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

    const sugerenciaSeleccionadaC = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {

        
        fk_cliente = {
            id_cliente: suggestion.id_cliente,
            sexo: suggestion.sexo,
            email: suggestion.email,
            dni: suggestion.dni,
            fullName: suggestion.fullName,
            direccion: suggestion.direccion,
            telefono: suggestion.telefono,
            fechNaci: suggestion.fechNaci
        }
        setB_Busqueda(suggestion.fullName);

    }

    const eliminarProducto = (id) => {
        console.log(id)
        let listaproductos = productos.filter(p => p.idProducto != id)
        let listaproductosR = productosR.filter(p => p.id_producto != id)

        setProductosR(listaproductosR)
        setProductos(listaproductos)
        calcularTotal(listaproductos)
    }

    const calcularTotal = (arrayProductos) => {
        let t = 0;
        let st = 0;
        let imp = 0;

        if (arrayProductos.length > 0) {

            arrayProductos.forEach((p) => {
                t = p.total + t
            })

            st = t / (1.18)
            imp = t - st
        }

        //Monto Base = (Monto con IGV) / (1.18)

        //IGV = (Monto con IGV) – (Monto Base)

        setSubTotal(st.toFixed(2))
        setIgv(imp.toFixed(2))
        setTotal(t.toFixed(2))
    }


    const terminarVenta = (e) => {
        let estado =e.target.value
        console.log(estado)
        if (productos.length < 1 ) {
            Swal.fire(
                'Opps!',
                'No existen productos',
                'error'
            )
            return
        }
        if (fk_cliente.id_cliente === 0) {
            Swal.fire(
                'Opps!',
                'Selecciona un Cliente',
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

        orden.orden_estado = estado;
        orden.fk_cliente = fk_cliente;
        orden.fk_empleado = dataUser;

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
            for (var i = 0; i < productosR.length; i++) { 

            
            detalle_orden.fk_orden.id_orden = dataJson.id_orden;
            detalle_orden.fk_orden.fk_cliente = dataJson.fk_cliente;
            detalle_orden.fk_orden.fk_empleado = dataJson.fk_empleado;
            detalle_orden.fk_orden.fk_producto = [productosR[i]];
            detalle_orden.fk_orden.orden_estado = dataJson.orden_estado;
            detalle_orden.fk_orden.orden_fecha = dataJson.orden_fecha;
            detalle_orden.detalle_cantidad = productos[i].cantidad;
            detalle_orden.detalle_precio = productos[i].precio
            
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
                reestablecer();
                var data = dataJson;
                if(estado == 'P'){
                    Swal.fire(
                        'Pedido Creado!',
                        'Numero de Pedido : ' + data.id_detalle_orden,
                        'success'
                    )
                }else{
                    Swal.fire(
                        'Cotizacion Creado!',
                        'Numero de Cotizacion : ' + data.id_detalle_orden,
                        'success'
                    )
                }
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


    return (
        
        <Row>
            <Col sm={8}>

                <Row className="mb-2">
                    <Col />
                    <Col sm={12}>
                        <Card>
                            <CardHeader style={{ backgroundColor: '#4e73df', color: "white" }}>
                                Cliente
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col sm={6}>
                                        <FormGroup>
                                            <Autosuggest
                                                suggestions={b_Clientes}
                                                onSuggestionsFetchRequested={onSuggestionsFetchRequestedC}
                                                onSuggestionsClearRequested={onSuggestionsClearRequestedC}
                                                getSuggestionValue={getSuggestionValueC}
                                                renderSuggestion={renderSuggestionC}
                                                inputProps={inputPropsC}
                                                onSuggestionSelected={sugerenciaSeleccionadaC}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col />
                    <Col sm={12}>
                        <Card>
                            <CardHeader style={{ backgroundColor: '#4e73df', color: "white" }}>
                                Productos
                            </CardHeader>
                            <CardBody>
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
                                <Row>
                                    <Col sm={12}>
                                        <Table striped size="sm">
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Producto</th>
                                                    <th>Cantidad</th>
                                                    <th>Precio</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    (productos.length < 1) ? (
                                                        <tr>
                                                            <td colSpan="5">Sin productos</td>
                                                        </tr>
                                                    ) :
                                                    (
                                                        productos.map((item) => (
                                                            <tr key={item.idProducto}>
                                                                <td>
                                                                    <Button color="danger" size="sm"
                                                                        onClick={() => eliminarProducto(item.idProducto)}
                                                                    >
                                                                        <i className="fas fa-trash-alt"></i>
                                                                    </Button>
                                                                </td>
                                                                <td>{item.descripcion}</td>
                                                                <td>{item.cantidad}</td>
                                                                <td>{item.precio}</td>
                                                                <td>{item.total}</td>
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
            </Col>

            <Col sm={4}>
                <Row className="mb-2">
                    <Col sm={12}>
                        <Card>
                            <CardHeader style={{ backgroundColor: '#4e73df', color: "white" }}>
                                Detalle
                            </CardHeader>
                            <CardBody>
                                <Row className="mb-2">
                                    {/* <Col sm={12}>
                                        <InputGroup size="sm" >
                                            <InputGroupText>Tipo:</InputGroupText>
                                            <Input type="select" value={tipoDocumento} onChange={ (e) => setTipoDocumento(e.target.value)}>
                                                <option value="Boleta">Boleta</option>
                                                <option value="Factura">Factura</option>
                                            </Input>
                                        </InputGroup>
                                    </Col> */}
                                </Row>
                                <Row className="mb-2">
                                    <Col sm={12}>
                                        <InputGroup size="sm" >
                                            <InputGroupText>Sub Total:</InputGroupText>
                                            <Input name="Sub Total" disabled value={subTotal} />
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col sm={12}>
                                        <InputGroup size="sm" >
                                            <InputGroupText>IGV (18%):</InputGroupText>
                                            <Input name="IGV" disabled value={igv} />
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <InputGroup size="sm" >
                                            <InputGroupText>Total:</InputGroupText>
                                            <Input name="Total" disabled value={total} />
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                <Button color="success" block value="P" onClick={terminarVenta} >
                                <i class="fa-solid fa-money-check-dollar"></i> Terminar Pedido</Button>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm={12}>
                        <Card>
                            <CardBody>
                                 
                                <Button color="warning" block value="C" onClick={terminarVenta}>
                                    <i className="fas fa-money-check"></i> Registrar Cotizacion
                                </Button>
                                
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
        
    )
}

export default Pedido;