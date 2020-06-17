import React , {useState, useEffect} from 'react';
import {Container, Navbar, Row, Col, Button, Modal, Form, Card } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Dexie from "dexie";

function Main() {
  //set the database 
  const db = new Dexie("ReactDexie");
  //create the database store
  db.version(1).stores({
      posts: "tipe, jumlah, judul"
  })
  db.open().catch((err) => {
      console.log(err.stack || err)
  })

    //set the state and property
    const [postTipe, setTipe] = useState("");
    const [postJumlah, setJumlah] = useState("");
    const [postJudul, setJudul] = useState("");
    const [posts, setPosts] = useState("");
    const [modalShow, setModalShow] = useState(false);

    //submit 
    const getPostInfo = (e) => {
      e.preventDefault();
      if(postTipe !== "" && postJumlah !== "" & postJudul !== ""){
          let post = {
              tipe: postTipe,
              jumlah: postJumlah,
              judul: postJudul,
          }
         
  
          db.posts.add(post).then(async() => {
              //retrieve all posts inside the database
              let allPosts = await db.posts.toArray();
              //set the posts
              setPosts(allPosts);
          });
          
      }
      
      
  }

  useEffect(() => {

      //get all posts from the database
      const getPosts = async() => {
          let allPosts = await db.posts.toArray();
          setPosts(allPosts);
      }
      getPosts();

  }, [])

    
    return (
     <div>   
    <Navbar className="justify-content-between" bg="dark" variant="dark">
    <Navbar.Brand></Navbar.Brand>   
    <Navbar.Brand>Catatan Keuangan</Navbar.Brand>
    <Navbar.Brand href="#">Keluar</Navbar.Brand>
    </Navbar>

    <Container>
        <div className="dataHariIni bg-light">
            <Row > 
                <Col className="col-8">Hari ini, <span>CurrentDate</span></Col>
                <Col className="col-4 d-flex justify-content-end">Total Pengeluaran</Col>
            </Row>
            <Row>
                <Col className="col-8 border-bottom"></Col>
                <Col className="col-4 d-flex justify-content-end border-bottom">Total Pemasukan</Col>
            </Row>
            <Row>
                <Col className="col-8 border-bottom">Judul</Col>
                <Col className="col-4 d-flex  justify-content-end border-bottom">Rp<span>Nominal</span></Col>
            </Row>
            <div className="d-flex justify-content-center">
            <Button variant="outline-dark" onClick={() => setModalShow(true)}>
            Tambah
            </Button>
            <ModalTambah show={modalShow} onHide={() => setModalShow(false)} />
            </div>
        </div>
        
        <div className="dataRiwayat">
        <Card style={{ width: '70rem' }}>
            <Card.Body>
            <Row > 
                <Col className="col-4">CurrentDate</Col>
                <Col className="col-8">Pengeluaran Rp<span>pengeluaran</span> </Col>
            </Row>
            <Row > 
                <Col className="col-4"></Col>
                <Col className="col-8">Pemasukan Rp<span>pemasukan</span> </Col>
            </Row>
            </Card.Body>
        </Card>
        </div>
    </Container>
    </div>
    )
}

function ModalTambah(props) {
    const [startDate, setStartDate] = useState(new Date());
    return (
      <Modal {...props} aria-labelledby="Tambah">
        <Modal.Header closeButton>
          <Modal.Title id="Tambah">
            Tambah Transaksi
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={getPostInfo}>
        <Modal.Body className="show-grid">
          <Container>
            <Form.Group controlId="formTanggal">
                <Row> 
                <Col className="col-4"><Form.Label>Tanggal</Form.Label></Col>
                <Col className="col-8">
                    <DatePicker selected={startDate} onChange={date => setStartDate(date)}/>
                </Col>
                </Row>
            </Form.Group>
            <Form.Group controlId="formTipe">
                <Row> 
                <Col className="col-4"><Form.Label>Tipe</Form.Label></Col>
                <Col className="col-8">
                <Form.Control as="select" name="tipe"  onChange={e => setTipe(e.target.value)}>
                    <option>Pemasukan</option>
                    <option>Pengeluaran</option>
                </Form.Control>
                </Col>
                </Row>
            </Form.Group>
            <Form.Group controlId="formJumlah">
                <Row> 
                <Col className="col-4"><Form.Label>Jumlah</Form.Label></Col>
                <Col className="col-8"><Form.Control type="number" placeholder="Jumlah" name="jumlah"  onChange={e => setJumlah(e.target.value)}/></Col>
                </Row>
            </Form.Group>
            <Form.Group controlId="formJudul">
                <Row> 
                <Col className="col-4"><Form.Label>Judul</Form.Label></Col>
                <Col className="col-8"><Form.Control type="text" placeholder="Judul" name="judul"  onChange={e => setJudul(e.target.value)}/></Col>
                </Row>
            </Form.Group>
        
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>Batal</Button>
          <Button variant="primary" type="submit">Simpan</Button>
        </Modal.Footer>
        </Form>
      </Modal>
    );
  }
  

export default Main