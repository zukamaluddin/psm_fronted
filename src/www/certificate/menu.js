import React, {Fragment} from "react";
import {
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    FormGroup,
    Label,
    Form,
    Button,
} from "reactstrap";

import {Multiselect} from "react-widgets";
import {withRouter} from 'react-router-dom'
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import PageTitle from "../../Layout/AppMain/PageTitle";
import CertComponent from "./layoutCert";
import InvoiceComponent from "./layoutInvoice";


const fontFamily = 'Times New Roman'
const headerBold = {fontSize: "12pt", fontFamily: fontFamily, fontWeight: 'bold'}
const headerNormal = {fontSize: "12pt", fontFamily: fontFamily}
const headerSmall = {fontSize: "10pt", fontFamily: fontFamily}

class MainPrintComponent extends React.Component {
    constructor(props) {
        super(props);
        this.certRef = React.createRef();
        this.invoiceRef = React.createRef();
        this.state = {}

    };

    // printCert = () => {
    //
    //     // let save = []
    //     let printContents = document.getElementById("certLayout").innerHTML;
    //     let originalContents = document.body.innerHTML;
    //
    //
    //     // document.body.innerHTML = printContents;
    //     window.print();
    //     // document.body.innerHTML = originalContents;
    //
    //
    //     // var divElements = document.getElementById('certLayout').innerHTML;
    //     // var printWindow = window.open("", "_blank", "");
    //     // //open the window
    //     // printWindow.document.open();
    //     // printWindow.document.write(divElements);
    //     // printWindow.document.close();
    //     // printWindow.focus();
    //     // setTimeout(function () {
    //     //     printWindow.print();
    //     //     // printWindow.close();
    //     // }, 100);
    //
    // }

    // var winPrint = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
    //
    // winPrint.document.write(printContents);
    // winPrint.document.close();
    // winPrint.focus();
    // winPrint.print();
    // // winPrint.close();


    printCert=()=> {
        this.certRef.current.printCert()
    }


    printInvoice=()=> {
        this.invoiceRef.current.printInvoice()
    }

    //
    // printInvoice = () => {
    //     let printContents = document.getElementById("certLayout").innerHTML;
    //     let originalContents = document.body.innerHTML;
    //     document.body.innerHTML = printContents;
    //     window.print();
    //     document.body.innerHTML = originalContents;
    //
    //
    // }


    render() {

        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"

                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <div>
                        <PageTitle
                            heading="Pengeluaran Sijil"
                            // subheading="Memaparkan member member punya hutang."
                            icon="pe-7s-id icon-gradient bg-tempting-azure"
                        />
                    </div>
                    <Row>
                        <Col md="12">
                            <Card className="main-card mb-3 no-print">
                                <CardBody>
                                    <CardTitle>Pencarian</CardTitle>
                                    <Form>
                                        <FormGroup row>
                                            <Col sm={6}>
                                                <Button style={{width: '140px'}}
                                                        onClick={() => {
                                                            // this.props.history.push('/owner/register');
                                                            // setTimeout(function () {
                                                            //     ownerMenu.changeActiveLinkTo('#/owner/register');
                                                            //
                                                            // }.bind(this),);
                                                            // myMenu.changeActiveLinkLabel('Register');
                                                        }}

                                                        className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline
                                                        color="success">
                                                    <i className="lnr-eye btn-icon-wrapper"> </i>
                                                    Papar
                                                </Button>
                                                <Button style={{width: '140px'}}
                                                        onClick={ this.printCert}
                                                        className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline
                                                        color="info">
                                                    <i className="lnr-printer btn-icon-wrapper"> </i>
                                                    Cetak Cert
                                                </Button>
                                                <Button style={{width: '140px'}}
                                                        onClick={ this.printInvoice}
                                                        className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline
                                                        color="info">
                                                    <i className="lnr-printer btn-icon-wrapper"> </i>
                                                    Cetak Invoice
                                                </Button>
                                            </Col>
                                        </FormGroup>
                                    </Form>
                                </CardBody>

                            </Card>
                            <CertComponent ref={this.certRef}/>
                            {/*<InvoiceComponent ref={this.invoiceRef}/>*/}

                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>


        );
    }
}

export default withRouter(MainPrintComponent);