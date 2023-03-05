import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { Card, CardBody, CardHeader, Button, Modal, ModalHeader, ModalBody, Label, Input, FormGroup, ModalFooter, Row, Col } from "reactstrap"
import Swal from 'sweetalert2'


let modeloProducto = {
    id_producto: 0,
    fk_categoria: {
        cate_nombre: "",
        id: 0
    },
    producSku: "",
    producNombre: "",
    producPrecio: 0,
    producMarca: "",
    producStock: 0,
}

let modeloCategoria = {
    cate_nombre: "",
    id: 0
}


const Producto = () => {

    const [producto, setProducto] = useState(modeloProducto);
    const [categoria, setCategoria] = useState(modeloCategoria);
    const [pendiente, setPendiente] = useState(true);
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [verModal, setVerModal] = useState(false);

    const handleChange = (e) => {

        let value = e.target.value;

        if(e.target.name == "fk_categoria"){
            const obtenerCategorias = async () => {
                let response = await fetch("http://localhost:8081/api/categoriaN/"+ value);
                if (response.ok) {
                    let data = await response.json()
                    setCategoria(data)
                }
            }
            obtenerCategorias()
        }

        setProducto({
            ...producto,
            [e.target.name]: value
        })
    }

    const obtenerCategorias = async () => {
        let response = await fetch("http://localhost:8081/api/categorias");
        if (response.ok) {
            let data = await response.json()
            setCategorias(data)
        }
    }

    const obtenerProductos = async () => {
        let response = await fetch("http://localhost:8081/api/productos");

        if (response.ok) {
            let data = await response.json()
            setProductos(data)
            setPendiente(false)
        }
    }

    useEffect(() => {
        obtenerCategorias();
        obtenerProductos();
    }, [])


    const columns = [
        {
            name: 'Codigo',
            selector: row => row.id_producto,
            sortable: true,
        },
        {
            name: 'Marca',
            selector: row => row.producMarca,
            sortable: true,
        },
        {
            name: 'Descripcion',
            selector: row => row.producNombre,
            sortable: true,
        },
        {
            name: 'Precio',
            selector: row => row.producPrecio,
            sortable: true,
        },
        /*{
            name: 'Categoria',
            selector: row => row.fk_categoria,
            sortable: true,
            cell: row => (row.fk_categoria.cate_nombre)
        },*/
        {
            name: '',
            cell: row => (
                <>
                    <Button color="primary" size="sm" className="mr-2"
                        onClick={() => abrirEditarModal(row)}
                    >
                        <i className="fas fa-pen-alt"></i>
                    </Button>
                    
                    { <Button color="danger" size="sm"
                        onClick={() => eliminarProducto(row.id_producto)}
                    >
                        <i className="fas fa-trash-alt"></i>
                    </Button> }
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
        setProducto(data);
        setVerModal(!verModal);
    }

    const cerrarModal = () => {
        setProducto(modeloProducto)
        setVerModal(!verModal);
    }

    const guardarCambios = async () => {

        //delete producto.fk_categoria;
        console.log(categoria)
        producto.fk_categoria = categoria
        console.log(producto);

        let response;
        if (producto.id_producto == 0) {
            response = await fetch("http://localhost:8081/api/producto", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(producto)
            })

        } else {
            response = await fetch("http://localhost:8081/api/producto", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(producto)
            })
        }

        if (response.ok) {
            await obtenerProductos();
            setProducto(modeloProducto)
            setVerModal(!verModal);

        } else {

            Swal.fire(
                'Opp!',
                'No se pudo guardar.',
                'warning'
            )
        }

    }

    const eliminarProducto = async (id) => {
        Swal.fire({
            title: 'Esta seguro?',
            text: "Desea eliminar el producto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, continuar',
            cancelButtonText: 'No, volver'
        }).then((result) => {
            if (result.isConfirmed) {

                const response = fetch("http://localhost:8081/api/producto/"+id, {method: 'Delete'})
                    .then(response => {
                        if (response.ok) {

                            obtenerProductos();

                            Swal.fire(
                                'Eliminado!',
                                'El producto fue eliminado.',
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
                            Lista de Productos
                        </CardHeader>
                        <CardBody>
                            {/* <Button color="success" size="sm" onClick={() => setVerModal(!verModal)}>Nuevo Producto</Button> */}
                            <hr></hr>
                            <DataTable
                                columns={columns}
                                data={productos}
                                progressPending={pendiente}
                                pagination
                                paginationComponentOptions={paginationComponentOptions}
                                customStyles={ customStyles}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Modal isOpen={verModal}>
                <ModalHeader>
                    Detalle Producto
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Codigo</Label>
                                <Input bsSize="sm" name="id_producto" disabled={true} onChange={handleChange} value={producto.id_producto} />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Marca</Label>
                                <Input bsSize="sm" name="producMarca" onChange={handleChange} value={producto.producMarca} />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Descripcion</Label>
                                <Input bsSize="sm" name="producNombre" onChange={handleChange} value={producto.producNombre} />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Categoria</Label>
                                <Input bsSize="sm" type={"select"} name="fk_categoria" onChange={handleChange} value={producto.fk_categoria.id} >
                                    <option value={0}>Seleccionar</option>
                                    {
                                        categorias.map((item) => {
                                            
                                            return (<option key={item.id} value={item.id}>{item.cate_nombre}</option>) 
                                        } )
                                    }
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Stock</Label>
                                <Input bsSize="sm" name="producStock" onChange={handleChange} value={producto.producStock} type="number" />
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup>
                                <Label>Precio</Label>
                                <Input bsSize="sm" name="producPrecio" onChange={handleChange} value={producto.producPrecio} type="number"/>
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

export default Producto;