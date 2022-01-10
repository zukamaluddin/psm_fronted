import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import PageTitle from "../../../Layout/AppMain/PageTitle";
import {
    Button,
    Card,
    CardBody,
    Col,
    Row
} from "reactstrap";
import ReactTable from "react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt, faFolderOpen} from "@fortawesome/free-solid-svg-icons";
import Loader from 'react-loaders'
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import {Bounce, toast} from "react-toastify";
import API from "../../../utils/apiBranch";
import List from "./component/list";


export default class ListMember extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            set: {
                sorted: [{id: 'date_created', desc: true}],
                page: 0,
                pageSize: 10,
            },
            selected: {},
            selectAll: 0,
            name: '', file: '',
            checkStatusFlag: [],
            validName: false,
            validPhone: false,
            validEmail: false,
            validPhoneAPI: false,
            validEmailAPI: false,
            modalProfile: false,
            modalDeleteAll: false,
            validPekerjaanPendapatan: false, src: ''
        };

        this.option = {
            bidang: []
        };

        this.showModalDelete = this.showModalDelete.bind(this);
        this.hideModalDelete = this.hideModalDelete.bind(this);
        //
        this.toggleModalDeleteAll = this.toggleModalDeleteAll.bind(this);

    }


    showModalDelete(index) {
        this.setState({activeModal: index.index})
    }

    hideModalDelete() {
        this.setState({activeModal: null})
    }

    toggleModalDeleteAll(event) {
        this.setState({modalDeleteAll: !this.state.modalDeleteAll})
    }


    render() {

        const {data} = this.state;


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
                            heading="Senarai Tugasan"
                            // subheading="Memaparkan member member punya hutang."
                            icon="pe-7s-culture icon-gradient bg-tempting-azure"
                        />
                    </div>
                    <Row>
                        <Col md="12">
                            <List history={this.props.history}/>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>


            </Fragment>
        );
    }

}
