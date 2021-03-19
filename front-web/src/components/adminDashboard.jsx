import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useGlobalState, useGlobalStateUpdate } from "./../context/globalContext";
import {
    useHistory
} from "react-router-dom";
import { Container, Form, Col, Button } from 'react-bootstrap'
// import './admin.css';






let url = 'http://localhost:5000'

function AdminDashboard() {

    const globalState = useGlobalState();
    // const setGlobalState = useGlobalStateUpdate();
    const productname = useRef();
    const price = useRef();
    // const fileInput = useRef();
    var fileInput =  document.getElementById('raised-button-file')
    const activeStatus = useRef();
    const stock = useRef();
    const description = useRef();







    function handlsubmit(event) {
        event.preventDefault();

        // console.log(productname.current.value)
        // console.log(price.current.value)
        // console.log(activeStatus.current.value)
        // console.log(stock.current.value)
        // console.log(description.current.value)


        // console.log(price)
        // console.log(title)
        // console.log(description)
        // console.log(Availablty)

        let formData = new FormData();
        formData.append("myFile", fileInput.file[0]);
        formData.append("title", productname.current.value);
        formData.append("price", price.current.value);
        formData.append("description", description.current.value);
        formData.append("avalablity", activeStatus.current.value);
        formData.append("stock", stock.current.value);



        axios({
            method: 'post',
            url: url + '/admindashboard',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        }).then((response) => {
            if (response.data.status === 200) {
                alert(response.data.message)
            } else {
                alert(response.data.message);
            }
        }).catch((error) => {
            console.log(error);
        });


    }

    return (

        <div>
            <h1>Admin Dashboard</h1>
            <Container fluid="md">
                <div className="row justify-content-md-center">
                    <div className="col-md-6 form">
                        <Form onSubmit={handlsubmit} >
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control type="name" placeholder="Enter Name" ref={productname} required />
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type="text" placeholder="Price" ref={price} required />
                                </Form.Group>
                            </Form.Row>

                            <Form.Group controlId="formGridAddress1">
                                <Form.Label>Product Image</Form.Label>
                                {/* <Form.Control type="file" placeholder="Image Url" ref={fileInput} required /> */}
                                <input accept="image/*" id="raised-button-file" multiple type="file" />
                                <label  htmlFor="raised-button-file" >
                                    Upload Image
                                {/* <Button variant="raised" component="span" className={classes.button}>  Upload image </Button> */}
                                </label>
                            </Form.Group>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Active Status</Form.Label>
                                    <Form.Control type="name" placeholder="Active Status" ref={activeStatus} required />
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>Stock</Form.Label>
                                    <Form.Control type="text" placeholder="Stock" ref={stock} required />
                                </Form.Group>
                            </Form.Row>

                            <Form.Group controlId="formGridAddress2">
                                <Form.Label>Description</Form.Label>
                                <Form.Control placeholder="Description" ref={description} required />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Add
                            </Button>
                        </Form>
                    </div>
                </div>
            </Container>
        </div>








    )
}

export default AdminDashboard;