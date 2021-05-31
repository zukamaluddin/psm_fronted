import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    Button, Card, CardBody, CardHeader,Tooltip,
    Col, Collapse,
    DropdownMenu,
    DropdownToggle,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Nav,
    NavItem,
    NavLink,
    Row,
    UncontrolledButtonDropdown,
} from 'reactstrap';

import {Bounce, toast} from 'react-toastify';


import {faAngleDown,} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import city3 from '../../../assets/utils/images/dropdown-header/city3.jpg';
import {fakeAuth} from '../../../Layout/AppMain'

import API from "../../../utils/apiUser";


const defaultPic = require('../../../assets/images/profile.png');

class UserBox extends React.Component {
    constructor(props) {

        super(props);
        this.state = {
            // src: localStorage.getItem('picture'),
            active: false,
            modal: false,
            modalProfile: false,
            newPassword: '',
            reEnterPassword: '',
            validPassword: false,
            inValidPassword: false,
            validPasswordNew: false,
            profile_name: localStorage.getItem('name'),
            file: '',
            croppedFile: '',
            position: localStorage.getItem('position'),
            role: localStorage.getItem('role'),
            validNama: false,

            showCrop: false,
            cropResult: null,
            toolTip:false

        };

        this.toggle = this.toggle.bind(this);
        this.toggleProfile = this.toggleProfile.bind(this);
        this.openModalAPI = this.openModalAPI.bind(this);
        this.cropImage = this.cropImage.bind(this);
        this.dataURItoBlob = this.dataURItoBlob.bind(this);
    }

//--------------------------------------------------------------
    openUpload = e => {
        document.getElementById('picturehtml').click()
    };
    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.setState({srcTemp: reader.result, showCrop: true})
            });
            reader.readAsDataURL(e.target.files[0]);
            this.setState({file: e.target.files[0], croppedFile: e.target.files[0]})
        }
    };

    dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {type: mimeString});
    }

    cropImage() {
        if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
            return;
        }
        this.setState({
            cropResult: this.cropper.getCroppedCanvas().toDataURL("image/jpeg", 0.9),
            srcTemp: this.cropper.getCroppedCanvas().toDataURL("image/jpeg", 0.9),
            showCrop: false,
        });

        this.setState({croppedFile: this.dataURItoBlob(this.cropper.getCroppedCanvas().toDataURL("image/jpeg", 0.9))})
    }

//------------------------------------------------------------

    LogOut() {
        global.global_id = '';
        global.branch_id = '';
        global.token = '';
        global.repairerId = '';
        global.repairerName = '';
        global.repairerSSM = '';
        global.repairerTempat = '';
        fakeAuth.signout()
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });

        this.onSetDefault();
    }
    toggleTooltip(){
        this.setState({toolTip:!this.state.toolTip});
    }

    onSetDefault() {
        this.state.newPassword = '';
        this.state.reEnterPassword = '';
        this.state.validPassword = false;
        this.state.inValidPassword = false;
        this.state.validPasswordNew = false;
    }

    onRestPassword = () => {
        if (this.state.validPassword && this.state.validPasswordNew) {
            let data = {
                password: this.state.reEnterPassword
            };

            fetch(global.ipServer + 'user/change_password/' + global.global_id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': global.token
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((data) => {
                    this.notify2();
                    this.toggle();
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    };

    toggleProfile() {
        this.setState({
            modalProfile: !this.state.modalProfile,
            showCrop: false,
        });
        this.onResetState();
    }

    openModalAPI() {
        this.onResetState();
        fetch(global.ipServer + 'user/view/' + global.global_id + '/' + global.global_id, {
            headers: {
                'x-access-token': global.token
            }
        })
            .then((response) => response.json())
            .then((result) => {
                this.setState({
                        id: result.id,
                        name: result.name,
                        staffId: result.staffId,
                        position: result.position,
                        role: result.role,
                        phone: result.phone,
                        defaultPhone: result.phone,
                        email: result.email,
                        status: result.status,
                        branch: result.branch.code,
                        srcTemp: localStorage.getItem('picture'),
                    }
                )
                this.setState({modalProfile: true});
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    onResetState() {
        this.state.name = '';
        this.state.telepon = '';

        this.state.validNama = false;
        this.state.validPhone = false;
        this.state.validPhoneAPI = false;
    }

    onChangePassword(data) {

        this.setState({inValidPassword: false});
        this.setState({validPassword: false});
        this.setState({validPasswordNew: false});
        this.setState({reEnterPassword: data});
        if (data !== this.state.newPassword) {
            this.setState({inValidPassword: true});
            this.setState({validPassword: false});
        } else {
            this.setState({inValidPassword: false});
            this.setState({validPassword: true});
            this.setState({validPasswordNew: true});
        }

    }

    onChangeNewPassword(data) {
        this.setState({inValidPassword: false});
        this.setState({validPassword: false});
        this.setState({validPasswordNew: false});
        this.setState({newPassword: data});

        if (data !== this.state.reEnterPassword) {
            if (this.state.reEnterPassword.length > 0) {
                this.setState({inValidPassword: true});
                this.setState({validPassword: false});
            }
        } else {
            this.setState({inValidPassword: false});
            this.setState({validPassword: true});
            this.setState({validPasswordNew: true});
        }

    }

    updateProfile = async () => {

        let validF = '';
        if (this.state.name === '') {
            this.setState({validNama: true});
            validF = 'v';
        } else {
            this.setState({validNama: false});
        }

        if (this.state.telepon === '') {
            this.setState({validPhone: true});
            validF = 'V';
        } else {
            this.setState({validPhone: false});
        }

        if (validF !== 'v') {
            this.updateAPI();
        }
    };

    updateAPI = () => {
        let data = {
            name: this.state.name,
            phone: this.state.phone,
            picture: this.state.file.name
        };
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        formData.append("picture", this.state.croppedFile);

        fetch(global.ipServer + 'user/update/' + global.global_id + '/' + global.global_id, {
            method: 'POST',
            body: formData,
            headers: {
                'x-access-token': global.token
            }
        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    // src: global.ipServer + 'file/' + global.global_id + '/' + data.picture,
                    profile_name: this.state.name,
                });
                localStorage.setItem('name', this.state.name)
                // localStorage.setItem('picture', this.state.src)
                this.notify2();
                this.toggleProfile();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    notify2 = () => this.toastId = toast("Berjaya dikemaskini.", {
        transition: Bounce,
        closeButton: true,
        autoClose: 5000,
        position: 'top-right',
        type: 'success'
    });

    render() {
        const {src, srcTemp} = this.state;
        const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>;
        const closeBtnProfile = <button className="close" onClick={this.toggleProfile}>&times;</button>;
        return (
            <Fragment>
                <div className="header-btn-lg pr-0">
                    <div className="widget-content p-0">
                        <div className="widget-content-wrapper">
                            <div className="widget-content-left">
                                <UncontrolledButtonDropdown>
                                    <DropdownToggle color="link" className="p-0">
                                        <img width={42} className="rounded-circle"
                                             src={defaultPic}
                                             onError={(e) => {
                                                 e.target.onerror = null;
                                                 e.target.src = defaultPic
                                             }}
                                             alt=""/>
                                        <FontAwesomeIcon className="ml-2 opacity-8" icon={faAngleDown}/>
                                    </DropdownToggle>
                                    <DropdownMenu right className="rm-pointers dropdown-menu-lg">
                                        <div className="dropdown-menu-header">
                                            <div className="dropdown-menu-header-inner bg-info">
                                                <div className="menu-header-image opacity-2"
                                                     style={{
                                                         backgroundImage: 'url(' + city3 + ')'
                                                     }}
                                                />
                                                <div className="menu-header-content text-left">
                                                    <div className="widget-content p-0">
                                                        <div className="widget-content-wrapper">
                                                            <div className="widget-content-left mr-3">
                                                                <img width={42} className="rounded-circle"
                                                                     src={defaultPic}
                                                                     onError={(e) => {
                                                                         e.target.onerror = null;
                                                                         e.target.src = defaultPic
                                                                     }}
                                                                     alt=""/>
                                                            </div>
                                                            <div className="widget-content-left"
                                                                 style={{maxWidth: '170px'}}>
                                                                <div className="widget-heading"
                                                                     style={{
                                                                         whiteSpace: 'nowrap',
                                                                         width: '100%',
                                                                         overflow: 'hidden',
                                                                         textOverflow: 'ellipsis'
                                                                     }}>
                                                                    <span id={'profile_name'}>{this.state.profile_name}</span>
                                                                </div>
                                                                <div className="widget-subheading opacity-8">
                                                                    {this.state.position}
                                                                </div>
                                                                <Tooltip placement="right" isOpen={this.state.toolTip} target="profile_name" toggle={this.toggleTooltip.bind(this)}>
                                                                    {this.state.profile_name}
                                                                </Tooltip>
                                                            </div>
                                                            <div className="widget-content-right mr-2">
                                                                <Link
                                                                    className="btn-pill btn-shadow btn-shine btn btn-focus"
                                                                    to={{
                                                                        pathname: '/login',
                                                                        state: {noti_msg: 'Anda telah berjaya log keluar.'}
                                                                    }}
                                                                    onClick={this.LogOut}> Log Keluar
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="scroll-area-xs" style={{
                                            height: '80px'
                                        }}>
                                            <PerfectScrollbar>
                                                <Nav vertical>
                                                    <NavItem>
                                                        <NavLink onClick={this.openModalAPI}>Profil</NavLink>
                                                    </NavItem>

                                                    <NavItem>
                                                        <NavLink onClick={this.toggle}>
                                                            Tukar Kata Laluan</NavLink>
                                                    </NavItem>
                                                </Nav>
                                            </PerfectScrollbar>
                                        </div>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown>
                            </div>
                            <div className="widget-content-left  ml-3 header-user-info" style={{maxWidth: '170px'}}>
                                <div className="widget-heading"
                                     style={{
                                         whiteSpace: 'nowrap',
                                         width: '100%',
                                         overflow: 'hidden',
                                         textOverflow: 'ellipsis'
                                     }}>
                                   {this.state.profile_name}
                                </div>
                                <div className="widget-subheading">
                                    {this.state.position}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <span className="d-inline-block mb-2 mr-2">
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle} close={closeBtn}>Tukar Kata Laluan</ModalHeader>
                        <ModalBody>
                            <Row form>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Kata Laluan Baru</Label>
                                        <Input type='password'
                                               onChange={dataEl => this.onChangeNewPassword(dataEl.target.value)}
                                            // onChange={dataEl => this.setState({newPassword: dataEl.target.value})}
                                               placeholder="Taip di sini" valid={this.state.validPasswordNew}/>
                                    </FormGroup>
                                </Col>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Sahkan Kata Laluan Baru</Label>
                                        <Input type='password' placeholder="Taip di sini"
                                               onChange={(dataEl) => this.onChangePassword(dataEl.target.value)}
                                               valid={this.state.validPassword} invalid={this.state.inValidPassword}/>
                                        <FormFeedback valid>Kata laluan padan.</FormFeedback>
                                        <FormFeedback>Kata laluan tidak padan.</FormFeedback>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>

                        <Button color="primary" className='mb-2 mr-2 btn-icon btn-shadow btn-outline' outline
                                style={{width: '140px'}} onClick={this.onRestPassword}>
                            <i className="pe-7s-diskette btn-icon-wrapper"> </i>Hantar
                        </Button>
                            <Button color="danger" onClick={this.toggle} style={{width: '140px'}}
                                    className='mb-2 mr-2 btn-icon btn-shadow btn-outline' outline><i
                                className="lnr-cross btn-icon-wrapper"> </i>Batal</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.modalProfile} size='xl'>
                        <ModalHeader toggle={this.hideModalEdit}>Profil Saya </ModalHeader>
                        <ModalBody>

                            <div id="accordion" className="accordion-wrapper mb-3">
                                <Card>
                                    <CardHeader id="headingOne">
                                        <div block color="link" className="text-left m-0 p-0"
                                             aria-controls="collapseOne">
                                            <h3 className="form-heading">
                                                Maklumat Akaun
                                            </h3>
                                        </div>
                                    </CardHeader>
                                    <Collapse data-parent="#accordion"
                                        // isOpen={this.state.accordion[0]}
                                              isOpen={true}
                                              id="collapseOne" aria-labelledby="headingOne">
                                        <CardBody>
                                            <Row form>
                                                 <Col md={3}>
                                                    {
                                                        this.state.showCrop ?
                                                            <div style={{minWidth: '200px'}}>
                                                                <Cropper
                                                                    style={{
                                                                        maxHeight: '200px',
                                                                        maxWidth: '100%',
                                                                        minWidth: '200px',
                                                                        minHeight: '200px',
                                                                    }}
                                                                    aspectRatio={1 / 1}
                                                                    preview=".img-preview"
                                                                    guides={false}
                                                                    src={this.state.srcTemp}
                                                                    ref={cropper => {
                                                                        this.cropper = cropper;
                                                                    }}
                                                                />
                                                                <Button style={{
                                                                    width: '100%',
                                                                    borderRadius: 'unset',
                                                                }}
                                                                        onClick={this.cropImage}>Crop</Button>
                                                            </div> :
                                                            <div
                                                                style={{
                                                                    border: 'solid 2px',
                                                                    display: 'inline-block',
                                                                    minWidth: '200px',
                                                                    marginBottom: '10px'
                                                                }}>

                                                                <div style={{height: '200px',width:'200px'}}>
                                                                    <img alt="Crop" src={defaultPic}
                                                                         onError={(e) => {
                                                                             e.target.onerror = null;
                                                                             e.target.src = defaultPic
                                                                         }}
                                                                         style={{
                                                                             maxHeight: '100%',
                                                                             width: '100%',
                                                                             position: 'relative',
                                                                             transform: 'translate(-50%, -50%)',
                                                                             left: '50%',
                                                                             top: '50%'
                                                                         }}/>
                                                                </div>
                                                                <Button style={{
                                                                    width: '100%',
                                                                    borderRadius: 'unset',
                                                                }}
                                                                        onClick={this.openUpload}>Pilih
                                                                    Gambar</Button>
                                                                <input id='picturehtml' type="file"
                                                                       accept="image/*" onChange={(dataEl) => {
                                                                    this.onSelectFile(dataEl);
                                                                }} hidden/>
                                                            </div>
                                                    }


                                                </Col>
                                                <Col md={9}>
                                                    <Row>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <Label for="email">E-mel</Label>
                                                                <Input type="email" name="email" id="email"
                                                                       defaultValue={this.state.email} disabled
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <Label for="position">Jawatan</Label>
                                                                <Input name="position" type="text" id='position'
                                                                       defaultValue={this.state.position} disabled
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col sm={6}>
                                                            <FormGroup>
                                                                <Label for="branch">Cawangan</Label>
                                                                <Input name="branch" type="text" id='branch'
                                                                       defaultValue={this.state.branch} disabled
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <FormGroup>
                                                                <Label for="status">Status</Label>

                                                                <Input name="status" type="text" id='status'
                                                                       defaultValue={this.state.status === 1 ? 'Aktif' : this.state.status === 0 ? 'Tidak Aktif' : 'Baru'}
                                                                       disabled
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col sm={6}>

                                                        </Col>
                                                    </Row>

                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Collapse>
                                </Card>
                                <Card>
                                    <CardHeader className="b-radius-0" id="headingTwo">
                                        <div block color="link" className="text-left m-0 p-0"
                                             aria-controls="collapseTwo">
                                            <h3 className="form-heading">
                                                Butiran Peribadi
                                            </h3>
                                        </div>
                                    </CardHeader>
                                    <Collapse data-parent="#accordion"
                                              isOpen={true}
                                              id="collapseTwo">
                                        <CardBody>


                                            <FormGroup>
                                                <Label for="name">Nama</Label>
                                                <Input name="name" type="text" id='name'
                                                       defaultValue={this.state.name}
                                                       onChange={(dataEl) => this.setState({name: dataEl.target.value})}
                                                       invalid={this.state.validNama}/>
                                            </FormGroup>
                                            <Row>
                                                <Col sm={6}>
                                                    <FormGroup>
                                                        <Label for="staffId">ID Staf</Label>
                                                        <Input name="staffId" type="text" id='staffId'
                                                               defaultValue={this.state.staffId} disabled
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col sm={6}>
                                                    <FormGroup>
                                                        <Label for="phone">No. Telefon</Label>
                                                        <Input name="phone" type="text" id='phone'
                                                               defaultValue={this.state.defaultPhone}
                                                               onChange={(dataEl) => this.setState({phone: dataEl.target.value})}
                                                               invalid={this.state.validPhone}/>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Collapse>
                                </Card>
                            </div>
                        </ModalBody>
                        <ModalFooter>

                            <Button color="success" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x' outline
                                    style={{width: '140px'}} onClick={this.updateProfile}
                            >
                                <i className="lnr-checkmark-circle btn-icon-wrapper"> </i>Kemaskini</Button>

                            <Button color="danger" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x'
                                    outline onClick={this.toggleProfile} style={{width: '140px'}}> <i
                                className="lnr-cross-circle btn-icon-wrapper"> </i> Tutup</Button>

                        </ModalFooter>
                    </Modal>

                </span>
            </Fragment>
        )
    }
}

export default UserBox;
