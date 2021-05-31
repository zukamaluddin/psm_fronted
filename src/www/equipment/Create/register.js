import React, {Fragment} from 'react';
import { Component } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import {Multiselect} from "react-widgets";
// import MultiSelect from "react-multi-select-component";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row,
    InputGroupAddon, UncontrolledTooltip,
    InputGroup, ModalHeader, ModalBody, CardHeader, FormFeedback, ModalFooter, Modal,
} from 'reactstrap';
import {equipmentMenu} from "../../../Layout/AppNav/VerticalNavWrapper"; //loading effect
import ReactTable from "react-table";
import {faCalendarAlt, faFolderOpen, faPen} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";

import PageTitle from "../../../Layout/AppMain/PageTitle";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCertificate, faEye} from "@fortawesome/free-solid-svg-icons";
import {faTrashAlt} from "@fortawesome/fontawesome-free-solid";
import {toast} from "react-toastify";
import PrintCertGui from "../../certificate/layoutCert";
import {redirectLogout} from "../../../index";
import {userOwnerAccess, userRepairerAccess} from "../../../Layout/AppNav/acessLevel";
import {DropdownList} from "react-widgets";
import TextareaAutosize from "react-textarea-autosize";
import {Redirect} from "../../../Layout/AppMain";
// import React, { Component } from 'react';

// const data = [{id: 1, file: 'gambar.png', description: 'Gambar kejadian'}, {
//     id: 2,
//     file: 'doc.pdf',
//     description: 'Testing file'
// }, {id: 3, file: 'newsip.png', description: 'Gambar kejadian baru'}];

const initialValid = {
    tempatValid: false,
    // resitValid: false,
    jenistempatValid: false,
};

const initialValid2 = {
    hadValid: false,
    jenamaValid: false,
    siriValid: false,
    nombordaftarValid: false,
    nomborsijilValid: false,
    stikerbaruValid: false,
    pemilikValid: false,
    jenisValid: false,
    lainValid: false,
    kategoriValid: false,
    jenishadValid: false,
    tentusahValid: false,
    jenisstikerbaruValid: false,
};
let virtualListRepairer = []
let virtualListOwner = []
export let groupedOptions = [
    {
        label: 'Pembaik',
        options: virtualListRepairer,
    },
    {
        label: 'Pemilik',
        options: virtualListOwner,
    },
];
const groupStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}

const groupBadgeStyles = {
    backgroundColor: '#EBECF0',
    borderRadius: '2em',
    color: '#172B4D',
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: '1',
    minWidth: 1,
    padding: '0.16666666666667em 0.5em',
    textAlign: 'center',
};

export default class CreateNew extends React.Component {
    update = async () => {
        if (this.validate()) {
            // let lastresit = this.state.resit;
            // if (this.state.jenisresit === 'Auto') {
            //     lastresit = this.state.resit_no;
            // }
            // ;

            let data = {
                valueId: this.state.id,
                valueKawasan: this.state.kawasan,
                valueTempat: this.state.tempat,
                valueTarikh: this.state.tarikh,
                valueJenisTempat: this.state.jenistempat,
                valuePegawaiId: this.state.pegawai_id,
                valueResit: '',
                valueJenisResit: '',
                valueDetail: this.state.attachment,
                valueDelete: this.state.deletedetail,
                valueOwner: this.state.pemilik_id,
            };

            if (this.state.pembaik_id !== ''){
                data.valueRepairer = this.state.pembaik_id;
            }

            const formData = new FormData();
            // const formData2 = new FormData();
            formData.append('data', JSON.stringify(data));
            // for (let x in this.state.all_attach) {
            //     formData2.append('file', this.state.all_attach[x]);
            // }

            // formData.append("picture", this.state.new_attach);


            return new Promise((resolve, reject) => {


                fetch(global.ipServer + 'alatan/updatealatan/' + global.global_id, {
                    method: 'POST',
                    headers: {
                        'x-access-token': global.token
                    },
                    body: formData,
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            redirectLogout(response.status, this.props);
                            return [];

                        }
                    })
                    .then((data) => {

                        setTimeout(
                            function () {
                                if (data['status'] !== 'OK')
                                    toast.error("Ralat");
                                else {
                                    toast.success("Rekod berjaya dikemaskini");
                                    this.props.history.push("/equipment/list");
                                    setTimeout(function () {
                                        equipmentMenu.changeActiveLinkTo('#/equipment/list');

                                    }.bind(this),);
                                }
                            }
                                .bind(this),
                            1000
                        );


                    })
                    .catch((error) => {
                        resolve('Failed');
                    });
            });
        }

    };

    componentDidMount() {
        this.loadElement();
    }

    dateStartChange(date) {
        this.setState({
            dateStart: date
        });
    }

    descChange(event) {
        this.setState({new_desc: event.target.value});
    }

    // fileChange(value) {
    //     this.setState({
    //         new_attach: value,
    //     });
    //
    // }
    updatefull = () => {
        fetch(global.ipServer + "alatan/get_alatan/" + this.state.id + '/' + global.global_id, {
                headers: {
                    'x-access-token': global.token
                }
            })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                redirectLogout(response.status, this.props);
                return [];

            }
        })
        .then((result) => {
            // fetch(global.ipServer + "alatan/get_lain/All/" + global.global_id, {
            //     headers: {
            //         'x-access-token': global.token
            //     }
            // })
            //     .then((response) => {
            //         if (response.status === 200) {
            //             return response.json();
            //         } else {
            //             redirectLogout(response.status, this.props);
            //             return [];
            //
            //         }
            //     })
            //     .then((result) => {
            //         if (result.status === 'OK') {
            //             this.setState({
            //                 datalain: result.data,
            //             })
            //         }
            //
            //     });
            //
            // fetch(global.ipServer + "alatan/get_kategori/All/" + global.global_id, {
            //     headers: {
            //         'x-access-token': global.token
            //     }
            // })
            //     .then((response) => {
            //         if (response.status === 200) {
            //             return response.json();
            //         } else {
            //             redirectLogout(response.status, this.props);
            //             return [];
            //
            //         }
            //     })
            //     .then((result) => {
            //         // console.log(result);
            //         if (result.status === 'OK') {
            //             this.setState({
            //                 datakategori: result.data,
            //             })
            //         }
            //
            //     });
            //sini bosku
            if (result.status === 'OK') {
                this.setState({
                    deletedetail: [],
                    idalatan: result.id,
                    kawasan: result.data.kawasan,
                    hantar: result.data.hantar,
                    kawasan_id: result.data.kawasan_id,
                    tempat: result.data.tempat,
                    jenistempat: result.data.jenistempat,
                    pegawai: result.data.pegawai,
                    tarikh: new Date(result.data.tarikh),
                    tarikhalatan: new Date(result.data.tarikh),
                    pegawai_id: result.data.pegawai_id,
                    kawasan_code: result.data.kawasan_code,
                    codeCawangan: result.data.codeCawangan,
                    pembaik: result.data.pembaik,
                    pembaik_alamat: result.data.pembaik_alamat,
                    pembaik_id: result.data.pembaik_id,
                    borang: result.data.borang,
                    resit: result.data.resit,
                    rujukan: result.data.rujukan,
                    jenisresit: result.data.jenisresit,
                    kegunaan: result.data.kegunaan,
                    attachment: result.data.detail,
                    buttonUpdate: true,
                    buttonSave: false,
                    barang_baru: 1,
                });

                if (result.data.resit !== ''){
                    this.setState({
                        adaresit: true,
                    });
                }

                // console.log(result.data.adaresit);
                // console.log(result.data.hantar);

                if (result.data.resit !== '' && result.data.hantar === true){
                    this.setState({
                        bolehupdate: true,
                    });
                }
                else{
                    this.setState({
                        bolehupdate: false,
                    });
                }


                // console.log(result.data.bolehupdate);

                if (result.data.pembaik_id !== ''){
                    virtualListRepairer = [{
                       label: result.data.pembaik,
                       value: 'pembaik'
                    }]
                    virtualListOwner = this.state.datapemilik

                    groupedOptions = [
                       {
                           label: 'Pembaik',
                           options: virtualListRepairer,
                       },
                       {
                           label: 'Pemilik',
                           options: virtualListOwner,
                       },
                    ];
                }


                if (result.data.jenisresit === 'Auto') {
                    this.setState({
                        resit: 'DMSB/' + result.data.codeCawangan + '/' + result.data.tahun + '/' + result.data.resit
                    })
                }

            }
        });
    }


    tukar() {
        if (this.state.barang_baru === 1){
            this.setState({
                // id:data['id'],
                tambahdetail: !this.state.tambahdetail,
                jenis: '',
                kategori: '',
                lain: '',
                had: '',
                hadpenuh: '',
                kategori_id: '',
                lain_id: '',
                jenis_id: '',
                jenishad: '',
                pemilik: '',
                pemilik_id: '',
                jenama: '',
                siri: '',
                caj: '',
                cajasal:'',
                tentusan: '',
                nombordaftar: '',
                nomborsijil: '',
                alamatalatan: '',
                stikerbaru: '',
                jenisstikerbaru: '',
                listOwnerRepairerSelected:'',
                stikerlama: '',
                jenisstikerlama: '',
                kegunaan: 'Untuk Kegunaan Perdagangan',
                rowUpdate: '',
                idUpdate: '',
                lamaUpdate: '',
                newDetail: true,
            });
        }
        else{
            if (this.validatenew()) {
            // if (this.state.attachment.length === 0) {
            //     toast.error("Sila masukkan alatan");
            // } else {
                let lastresit = this.state.resit;
                if (this.state.jenisresit === 'Auto') {
                    lastresit = this.state.resit_no;
                };

                let data = {
                    valueKawasan: this.state.kawasan,
                    valueTempat: this.state.tempat,
                    valueTarikh: this.state.tarikh,
                    valueJenisTempat: this.state.jenistempat,
                    valuePegawaiId: this.state.pegawai_id,
                    valueResit: lastresit,
                    valueJenisResit: this.state.jenisresit,
                    valueDetail: this.state.attachment,
                    valueRepairer: this.state.pembaik_id,
                };
                const formData = new FormData();
                // const formData2 = new FormData();
                formData.append('data', JSON.stringify(data));
                // for (let x in this.state.all_attach) {
                //     formData2.append('file', this.state.all_attach[x]);
                // }

                // formData.append("picture", this.state.new_attach);

                return new Promise((resolve, reject) => {


                    fetch(global.ipServer + 'alatan/create/' + global.global_id, {
                        method: 'POST',
                        headers: {
                            'x-access-token': global.token
                        },
                        body: formData,
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                return response.json();
                            } else {
                                redirectLogout(response.status, this.props);
                                return [];

                            }
                        })
                        .then((data) => {

                            setTimeout(
                                function () {
                                    if (data['status'] !== 'OK')
                                        toast.error("Ralat");
                                    else{
                                        this.setState({
                                            id:data['id'],
                                            barang_baru: 1,
                                            tambahdetail: !this.state.tambahdetail,
                                            jenis: '',
                                            kategori: '',
                                            lain: '',
                                            had: '',
                                            jenishad: '',
                                            hadpenuh: '',
                                            jenama: '',
                                            siri: '',
                                            caj: '',
                                            cajasal: '',
                                            tentusan: '',
                                            nombordaftar: '',
                                            nomborsijil: '',
                                            stikerbaru: '',
                                            jenisstikerbaru: '',
                                            stikerlama: '',
                                            jenisstikerlama: '',
                                            rowUpdate: '',
                                            idUpdate: '',
                                            lamaUpdate: '',
                                            newDetail: true,
                                        });
                                    }
                                }
                                    .bind(this),
                                1000
                            );


                        })
                        .catch((error) => {
                            resolve('Failed');
                        });
                });
            // }

            }
        }


        //
        // this.setState({new_desc: ''});
        // this.setState({new_attach: ''});

    }


    tutup() {
        this.setState({
            tambahdetail: !this.state.tambahdetail,
            jenis: '',
            kategori: '',
            lain: '',
            had: '',
            hadpenuh: '',
            jenishad: '',
            jenama: '',
            siri: '',
            caj: '',
            cajasal: '',
            tentusan: '',
            nombordaftar: '',
            nomborsijil: '',
            stikerbaru: '',
            jenisstikerbaru: '',
            stikerlama: '',
            jenisstikerlama: '',
            rowUpdate: '',
            idUpdate: '',
            lamaUpdate: '',
            newDetail: true,
        });
        //
        // this.setState({new_desc: ''});
        // this.setState({new_attach: ''});

    }

    submit = async () => {
        if (this.validate()) {
            //if (this.state.pembaik_id !== ''){
            if (this.state.attachment.length === 0 && this.state.pembaik_id === '') {
                toast.error("Sila pilih pembaik");
            } else {
                let lastresit = this.state.resit;
                if (this.state.jenisresit === 'Auto') {
                    lastresit = this.state.resit_no;
                };

                let data = {
                    valueId: this.state.id,
                    valueKawasan: this.state.kawasan,
                    valueTempat: this.state.tempat,
                    valueTarikh: this.state.tarikh,
                    valueJenisTempat: this.state.jenistempat,
                    valuePegawaiId: this.state.pegawai_id,
                    valueResit: '',
                    valueJenisResit: '',
                    valueDetail: this.state.attachment,
                    valueDelete: this.state.deletedetail,
                };
                if (this.state.pembaik_id !== ''){
                    data.valueRepairer = this.state.pembaik_id;
                }
                const formData = new FormData();
                // const formData2 = new FormData();
                formData.append('data', JSON.stringify(data));
                // for (let x in this.state.all_attach) {
                //     formData2.append('file', this.state.all_attach[x]);
                // }

                // formData.append("picture", this.state.new_attach);

                return new Promise((resolve, reject) => {

                    if (this.state.id === '000'){
                        fetch(global.ipServer + 'alatan/createalatan/' + global.global_id, {
                            method: 'POST',
                            headers: {
                                'x-access-token': global.token
                            },
                            body: formData,
                        })
                            .then((response) => {
                                if (response.status === 200) {
                                    return response.json();
                                } else {
                                    redirectLogout(response.status, this.props);
                                    return [];

                                }
                            })
                            .then((data) => {

                                setTimeout(
                                    function () {
                                        if (data['status'] !== 'OK')
                                            toast.error("Ralat");
                                        else {
                                            if (this.state.attachment === []) {
                                                toast.success("Rekod berjaya ditambah");
                                                this.props.history.push("/equipment/list");
                                                setTimeout(function () {
                                                    equipmentMenu.changeActiveLinkTo('#/equipment/list');

                                                }.bind(this),);
                                            } else {
                                                toast.success("Rekod berjaya ditambah");
                                                this.props.history.push("/equipment/list");
                                                setTimeout(function () {
                                                    equipmentMenu.changeActiveLinkTo('#/equipment/list');

                                                }.bind(this),);

                                            }
                                        }
                                    }
                                        .bind(this),
                                    1000
                                );


                            })
                            .catch((error) => {
                                resolve('Failed');
                            });
                    }
                    else{
                        fetch(global.ipServer + 'alatan/updatealatan/' + global.global_id, {
                            method: 'POST',
                            headers: {
                                'x-access-token': global.token
                            },
                            body: formData,
                        })
                            .then((response) => {
                                if (response.status === 200) {
                                    return response.json();
                                } else {
                                    redirectLogout(response.status, this.props);
                                    return [];

                                }
                            })
                            .then((data) => {

                                setTimeout(
                                    function () {
                                        if (data['status'] !== 'OK')
                                            toast.error("Ralat");
                                        else {
                                            toast.success("Rekod berjaya dikemaskini");
                                            this.props.history.push("/equipment/list");
                                            setTimeout(function () {
                                                equipmentMenu.changeActiveLinkTo('#/equipment/list');

                                            }.bind(this),);
                                        }
                                    }
                                        .bind(this),
                                    1000
                                );


                            })
                            .catch((error) => {
                                resolve('Failed');
                            });
                    }



                });
            }

            // }

        }
    };
    loadElement = () => {
        fetch(global.ipUM + "task/list_elements", {
            headers: {
                'x-access-token': global.token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((result) => {
                this.setState({sendOptions: result.data})
            })
    };
    printView = () => {
        this.setState({printCert: !this.state.printCert, alatanId: undefined})
    };
    printCert = (e) => {
        this.setState({printCert: true, alatanId: e.original.id});

        fetch(global.ipServer + 'alatan/update_printsijil/' + global.global_id, {
            method: 'POST', body: JSON.stringify({'ids': e.original.id}),
            headers: {
                'Content-Type': 'application/json', 'x-access-token': global.token
            },
        })
            .then((response) => {
               if(response.status === 200){
                    return response.json();
                }else{
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((data) => {

                setTimeout(
                    function () {
                        if (data['status'] !== 'OK')
                            toast.error("Ralat");
                        else {
                            this.updatefull();
                        }
                    }
                        .bind(this),
                    1000
                );


            })

        // fetch(global.ipServer + "alatan/update_printsijil/" + e.original.id + '/' + global.global_id, {
        //     headers: {
        //         'x-access-token': global.token
        //     }
        // })
        //     .then((response) => {
        //         if (response.status === 200) {
        //             return response.json();
        //         } else {
        //             redirectLogout(response.status, this.props);
        //             return [];
        //
        //         }
        //     })
        //     .then((result) => {
        //         if (result.status === 'OK') {
        //             this.updatefull();
        //         }
        //
        //     });

    };

    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            // data: data,
            deleteProcessing: false,
            isToggleOn: true,
            sendOptions: [],
            // freq: data.freq,
            kawasan: '',
            kawasan_id: '',
            jenis: '',
            idalatan: '',
            hantar: false,
            datajenis: [],
            datakegunaan: [],
            datatentusah: [{name:'Permulaan'},{name:'Semula'},{name:'Gagal'}],
            datakawasan: [],
            datapegawai: [],
            datapemilik: [],
            datapembaik: [],
            listpemilik: [],
            datalain: [],
            datakategori: [],
            kategori: '',
            deletedetail: [],
            kategori_id: '',
            barang_baru: 0,
            lain_id: '',
            jenis_id: '',
            tarikh: new Date(),
            tarikhalatan: new Date(),
            lain: '',
            pegawaitentusah:'',
            pegawaitentusah_id:'',
            had: '',
            hadpenuh: '',
            jenishad: '',
            jenama: '',
            siri: '',
            caj: '',
            cajasal: '',
            tentusan: '',
            nombordaftar: '',
            nomborsijil: '',
            stikerbaru: '',
            jenisstikerbaru: '',
            stikerlama: '',
            jenisstikerlama: '',
            tempat: '',
            jenistempat: '',
            pegawai: '',
            pegawai_id: '',
            pemilik: '',
            pemilik_id: '',
            kawasan_code: '',
            kawasan_tempat: '',
            pemilik_alamat: '',
            alamat_premis: '',
            pemilik_agensi:'',
            pembaik: '',
            pembaik_id: '',
            alamatalatan: '',
            pembaik_alamat: '',
            resit: '',
            namacarian:'',
            codecarian:'',
            roccarian:'',
            alamatcarian: '',
            resit_no: '',
            jenisresit: 'Manual',
            kegunaan: 'Untuk Kegunaan Perdagangan',
            rowUpdate: '',
            idUpdate: '',
            lamaUpdate: '',
            modal: false,
            buttonUpdate: false,
            buttonSave: true,
            tambahdetail: false,
            adaresit:false,
            bolehupdate:false,
            borang:false,
            attachment: [],
            all_attach: [],
            newDetail: true,
            modalPemilik:false,
            openTagSelect: false,
            tag:[],
            datatag:[],
            printCert: false,
        };
        // console.log(JSON.parse(localStorage.getItem('ownerDetail')))
        fetch(global.ipServer + "alatan/get_jenama/" + global.global_id, {
            headers: {
                'x-access-token': global.token
            }
        })

            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    if(response.status === 401){
                        redirectLogout(response.status);
                        return [];
                    }
                }
            })
            .then((result) => {
                if (result.status === 'OK') {
                    this.setState({
                        datatag: result.data,
                    })


                    // let.repairerList = ''

                }

            });

        fetch(global.ipServer + "user/getUserDetail/" + global.global_id + "/" + global.global_id, {
            headers: {
                'x-access-token': global.token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((result) => {
                if (result){
                    this.setState({
                        pegawai: result.data.userName,
                        pegawai_id: result.data.userId,
                        pegawaitentusah: result.data.userName,
                        pegawaitentusah_id: result.data.userId,
                        kawasan: result.data.regionalBranch,
                        kawasan_id: result.data.idBranch,
                        kawasan_code: result.data.codeBranch,
                        kawasan_tempat: result.data.alamatBranch,
                        // kawasan: result.data.regionalBranch,
                    })
                }


            });

        // fetch(global.ipServer + "user/getUserBranch/" + global.global_id + "/" + global.global_id, {
        //     headers: {
        //         'x-access-token': global.token
        //     }
        // })
        //     .then((response) => {
        //         if (response.status === 200) {
        //             return response.json();
        //         } else {
        //             redirectLogout(response.status, this.props);
        //             return [];
        //
        //         }
        //     })
        //     .then((result) => {
        //         this.setState({
        //             datapegawai: result.data,
        //         })
        //
        //
        //     });


        fetch(global.ipServer + "alatan/get_pemilik/" + global.global_id, {
            headers: {
                'x-access-token': global.token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((result) => {
                // console.log(result);
                if (result.status === 'OK') {

                    virtualListOwner = result.data

                    groupedOptions = [
                        {
                            label: 'Pembaik',
                            options: virtualListRepairer,
                        },
                        {
                            label: 'Pemilik',
                            options: virtualListOwner,
                        },
                    ];

                    this.setState({
                        datapemilik: result.data,
                        listOwnerRepairer: groupedOptions,
                    })


                    // let.repairerList = ''

                }

            });

        fetch(global.ipServer + "alatan/get_pembaik/" + global.global_id, {
            headers: {
                'x-access-token': global.token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((result) => {
                if (result.status === 'OK') {
                    this.setState({
                        datapembaik: result.data,
                    })
                }

            });

        fetch(global.ipServer + "alatan/get_pegawai_cawangan/" + global.global_id, {
            headers: {
                'x-access-token': global.token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((result) => {
                if (result.status === 'OK') {
                    this.setState({
                        datapegawai: result.data,
                    })
                }

            });

        fetch(global.ipServer + "alatan/get_jenis/A/" + global.global_id, {
            headers: {
                'x-access-token': global.token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((result) => {
                if (result.status === 'OK') {
                    this.setState({
                        datajenis: result.data,
                    })
                }

            });

        fetch(global.ipServer + "user/senaraiCawagan", {
            headers: {
                'x-access-token': global.token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((result) => {
                this.setState({
                    datakawasan: result.data,
                })

            });


        if (this.state.id !== '000') {
            this.updatefull();
        } else {

            this.setState({
                barang_baru: 1,
                // attachment: aaa,
                // pemilik_id: global.ownerDetail[0].id,
            })
        }


        let test = [];
        this.renderEditable = this.renderEditable.bind(this);
        this.dateStartChange = this.dateStartChange.bind(this);
        this.dateEndChange = this.dateEndChange.bind(this);
        this.addAttachBorang = this.addAttachBorang.bind(this);
        this.addAttach = this.addAttach.bind(this);
        this.updateAttach = this.updateAttach.bind(this);
        this.tukar = this.tukar.bind(this);
        this.updatefull = this.updatefull.bind(this);
        this.tutup = this.tutup.bind(this);
        this.submit = this.submit.bind(this);
        this.update = this.update.bind(this);
        this.detailview = this.detailview.bind(this);
        this.reset = this.reset.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        // this.loadUsers = this.loadUsers.bind(this);
        this.fileChange = this.fileChange.bind(this);
        this.descChange = this.descChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.dateChange2 = this.dateChange2.bind(this);
        this.getlain = this.getlain.bind(this);
        this.getkategori = this.getkategori.bind(this);
        this.setharga = this.setharga.bind(this);
        this.setTentusah = this.setTentusah.bind(this);
        this.setTempat = this.setTempat.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.validate = this.validate.bind(this);
        this.validatenew = this.validatenew.bind(this);
        this.checkno = this.checkno.bind(this);
        this.validateAlatan = this.validateAlatan.bind(this);
        this.validateBorang = this.validateBorang.bind(this);
        this.openModal = this.openModal.bind(this);
        this.togglePemilik = this.togglePemilik.bind(this);
        this.caripemilik = this.caripemilik.bind(this);
        this.toggle = this.toggle.bind(this);
        this.cari = this.cari.bind(this);
        this.tagSelectToggle = this.tagSelectToggle.bind(this);
        this.tagCreate = this.tagCreate.bind(this);
        this.tagDelete = this.tagDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }



    //testfaiz1234
    tagSelectToggle() {
        setTimeout(() => {
            if(this.state.deleteProcessing){
                this.setState({openTagSelect: !this.state.openTagSelect});
            }else{
                this.setState({openTagSelect: !this.state.openTagSelect,showMenu:false});
            }
        },200)
    }

    tagCreate(name) {
        console.log(this.state.datatag)
        this.setState({loading: true});

        let fd = new FormData;

        let data = {
            name: name,
        };

        fd.append('data', JSON.stringify(data));

        let config = {
            body: fd,
            method: 'POST',
            headers: {
                'x-access-token': global.token
            }
        };

        fetch(global.ipServer + "alatan/add_tag", config).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                if(response.status === 401){
                    redirectLogout(response.status);
                    return [];
                }
            }
        }).then(result => {
            this.setState({loading: false});
            if (result.status === 'success') {
                let copy = this.state.datatag;

                copy.push(result.data);

                this.setState({datatag: copy});
            }
        }).catch(err => {
            console.log(err);
        });


    }

    tagDelete() {
        this.setState({deleteProcessing: true, loading: true});

        let config = {
            method: 'DELETE',
            headers: {
                'x-access-token': global.token
            }
        };

        fetch(global.ipServer + "assignment/delete_tag/" + this.state.selectedID, config).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                if(response.status === 401){
                    redirectLogout(response.status);
                    return [];
                }
            }
        }).then(result => {
            this.setState({loading: false});
            if (result.status === 'success') {
                let copy = this.state.datatag;

                let tagIndex = copy.findIndex(item => item.id === this.state.selectedID);

                if (tagIndex !== -1)
                    copy.splice(tagIndex, 1);

                this.setState({datatag: copy,showMenu:false,deleteProcessing:false});
            }
        }).catch(err => {
            console.log(err);
        });

    }

    openModal = () => {
        this.togglePemilik();
    };

    togglePemilik = () => {
        this.setState({
            modalPemilik: !this.state.modalPemilik
        });

    }

    setResitAuto(xxx) {
        if (xxx === 'Auto') {
            fetch(global.ipServer + "alatan/get_resitauto/" + this.state.pegawai_id + '/' + global.global_id, {
                headers: {
                    'x-access-token': global.token
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        redirectLogout(response.status, this.props);
                        return [];

                    }
                })
                .then((result) => {
                    this.setState({
                        resit_no: result.data,
                        resit: 'DMSB/' + this.state.codeCawangan + '/' + result.data
                    })

                });
        } else {
            this.setState({
                resit: '',
                resit_no: ''
            })
        }

    }

    // getpagawai(id) {
    //     fetch(global.ipServer + "user/getUserBranch/" + id, {
    //         headers: {
    //             'x-access-token': global.token
    //         }
    //     })
    //         .then((response) => {
    //             if (response.status === 200) {
    //                 return response.json();
    //             } else {
    //                 redirectLogout(response.status, this.props);
    //                 return [];
    //
    //             }
    //         })
    //         .then((result) => {
    //             this.setState({
    //                 datapegawai: result.data,
    //                 pegawai_id: '',
    //             })
    //
    //         });
    // }

    validate = () => {
        this.setState(initialValid);

        let checkValid = true;
        if (this.state.tempat === '') {
            checkValid = this.toggle('tempat')
        }

        // if (this.state.resit === '') {
        //     checkValid = this.toggle('resit')
        // }

        if (this.state.jenistempat === '') {
            checkValid = this.toggle('jenistempat')
        }

        return checkValid;
    };

    validatenew = () => {
        this.setState(initialValid);

        let checkValid = true;
        // if (this.state.tempat === '') {
        //     checkValid = this.toggle('tempat')
        //     // console.log(this.toggle('name'))
        // }

        // if (this.state.resit === '') {
        //     checkValid = this.toggle('resit')
        // }

        if (this.state.jenistempat === '') {
            checkValid = this.toggle('jenistempat')
        }

        return checkValid;
    };

    checkno= async () => {
        let xxs = this.state.idUpdate;
        if (xxs === ''){
            xxs = '0';
        }
        let pakts = true;
        fetch(global.ipServer + "alatan/check_sticker_no/" + this.state.stikerbaru + '/' + xxs + '/' + this.state.jenisstikerbaru, {
            headers: {
                'x-access-token': global.token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    redirectLogout(response.status, this.props);
                }
            })
            .then((result) => {
                if (result.data !== 'OK') {
                    toast.error("No Stiker telah digunakan.");
                    return false;
                }
                else{
                    return true;
                }
            });

    };

    validateAlatan = () => {
        // console.log(this.state.stateSelected)
        this.setState(initialValid2);

        let checkValid = true;
        if (this.state.had === '') {
            checkValid = this.toggle('had');
        }

        if (this.state.jenama === '') {
            checkValid = this.toggle('jenama');
        }

        // if (this.state.siri === '') {
        //     checkValid = this.toggle('siri');
        // }

        if (this.state.nombordaftar === '') {
            checkValid = this.toggle('nombordaftar');
        }

        // if (this.state.nomborsijil === '') {
        //     checkValid = this.toggle('nomborsijil');
        // }

        if (this.state.stikerbaru === '') {
            checkValid = this.toggle('stikerbaru');
        }

        if (this.state.pemilik === '') {
            checkValid = this.toggle('pemilik');
        }
        if (this.state.jenis === '') {
            checkValid = this.toggle('jenis');
        }

        if (this.state.lain === '') {
            checkValid = this.toggle('lain');
        }
        if (this.state.kategori === '') {
            checkValid = this.toggle('kategori');
        }

        if (this.state.tentusan === '') {
            checkValid = this.toggle('tentusah');
        }
        if (this.state.jenisstikerbaru === '') {
            checkValid = this.toggle('jenisstikerbaru');
        }


        return checkValid;
    };

    validateBorang = () => {
        // console.log(this.state.stateSelected)
        this.setState(initialValid2);

        let checkValid = true;

        if (this.state.pemilik === '') {
            checkValid = this.toggle('pemilik');
        }

        return checkValid;
    };

    toggle = name => {
        this.setState({
            [`${name}Valid`]: true
        });
        return false;
    }

    caripemilik(data) {
        if (data==='pembaik'){
            this.setTempatPemilik('pembaik');
            this.setState({
                pemilik: this.state.pembaik,
                pemilik_id: 'pembaik',
                pemilikValid: false,
                modalPemilik: !this.state.modalPemilik
            });
        }
        else{
            this.setTempatPemilik(data.id);
            this.setState({
                pemilik: data.name,
                pemilik_id: data.id,
                pemilikValid: false,
                modalPemilik: !this.state.modalPemilik
            });
        }

    }

    cari() {
        let namacari = 'XXX';
        if (this.state.namacarian !== ''){
            namacari = this.state.namacarian;
        }
        let codecari = 'XXX';
        if (this.state.codecarian !== ''){
            codecari = this.state.codecarian;
        }

        let roccari = 'XXX';
        if (this.state.roccarian !== ''){
            roccari = this.state.roccarian;
        }

        let alamatcari = 'XXX';
        if (this.state.alamatcarian !== ''){
            alamatcari = this.state.alamatcarian;
        }

        fetch(global.ipServer + "alatan/cari_pemilik/" + namacari + '/'+ codecari + '/'+ roccari + '/'+ alamatcari + '/' + global.global_id, {
            method: 'GET', body: JSON.stringify(this.state.set),
            headers: {
                'Content-Type': 'application/json', 'x-access-token': global.token
            },
        })
            .then((response) => {
               if(response.status === 200){
                    return response.json();
                }else{
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((result) => {
                this.setState({
                    listpemilik: result.data,
                    // loading: false,
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    getlain(id) {
        fetch(global.ipServer + "alatan/get_lain/" + id + '/' + global.global_id, {
            headers: {
                'x-access-token': global.token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((result) => {
                if (result.status === 'OK') {
                    this.setState({
                        datalain: result.data,
                        lain_id: '',
                    })
                }

            });
    }


    detailview(id) {

        if( this.state.pembaik_id){
            virtualListRepairer = [{
                label: this.state.pembaik,
                value:  this.state.pembaik_id
            }]
        }


        groupedOptions = [
            {
                label: 'Pembaik',
                options: virtualListRepairer,
            },
            {
                label: 'Pemilik',
                options: virtualListOwner,
            },
        ];

        this.setState({
            listOwnerRepairer: groupedOptions,
            virtualListRepairer: virtualListRepairer,
            listOwnerRepairerSelected: {
                label: this.state.attachment[id].pemilik,
                value: this.state.attachment[id].pemilik_id
            },
            tambahdetail: !this.state.tambahdetail,
            jenis: this.state.attachment[id].jenis,
            kategori: this.state.attachment[id].kategori,
            kategori_id: this.state.attachment[id].kategori_id,
            lain: this.state.attachment[id].lain,
            lain_id: this.state.attachment[id].lain_id,
            had: this.state.attachment[id].had,
            hadpenuh: this.state.attachment[id].hadpenuh,
            pemilik: this.state.attachment[id].pemilik,
            pemilik_id: this.state.attachment[id].pemilik_id,
            jenis_id: this.state.attachment[id].jenis_id,
            pegawaitentusah_id: this.state.attachment[id].pegawaitentusah_id,
            pegawaitentusah: this.state.attachment[id].pegawaitentusah,
            jenishad: this.state.attachment[id].jenishad,
            jenama: this.state.attachment[id].jenama,
            siri: this.state.attachment[id].siri,
            caj: this.state.attachment[id].caj,
            cajasal: this.state.attachment[id].caj,
            alamatalatan: this.state.attachment[id].alamatalatan,
            tentusan: this.state.attachment[id].tentusan,
            kegunaan: this.state.attachment[id].kegunaan,
            nombordaftar: this.state.attachment[id].nombordaftar,
            nomborsijil: this.state.attachment[id].nomborsijil,
            stikerbaru: this.state.attachment[id].stikerbaru,
            jenisstikerbaru: this.state.attachment[id].jenisstikerbaru,
            stikerlama: this.state.attachment[id].stikerlama,
            jenisstikerlama: this.state.attachment[id].jenisstikerlama,
            rowUpdate: id,
            idUpdate: this.state.attachment[id].id,
            lamaUpdate: this.state.attachment[id].lama,
            newDetail: false,
        });

        if (this.state.attachment[id].tarikhalatan !== ''){
            this.setState({
                tarikhalatan: new Date(this.state.attachment[id].tarikhalatan),
            });
        }

    }

    fileChange = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.setState({src: reader.result})
            });
            reader.readAsDataURL(e.target.files[0]);
            this.state.new_attach = e.target.files[0];
            this.state.test = e.target.files[0]['name'];
        }

    };

    setkegunaan(id) {
        let ahb = 'B'
        if (id === 'Untuk Kegunaan Perdagangan'){
            ahb = 'A'
        }
        fetch(global.ipServer + "alatan/get_jenis/" + ahb + '/' + global.global_id, {
            headers: {
                'x-access-token': global.token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((result) => {
                if (result.status === 'OK') {
                    this.setState({
                        datajenis: result.data,
                        jenis_id: '',
                    })
                }

            });
    }

    getkategori(id) {
        fetch(global.ipServer + "alatan/get_kategori/" + id + '/' + global.global_id, {
            headers: {
                'x-access-token': global.token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((result) => {
                if (result.status === 'OK') {
                    this.setState({
                        datakategori: result.data,
                        kategori_id: '',
                    })
                }

            });
    }

    setharga(id) {
        // console.log(id)
        fetch(global.ipServer + "alatan/get_harga/" + id + '/' + global.global_id, {
            headers: {
                'x-access-token': global.token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((result) => {
                if (result.status === 'OK') {
                    //if gagal caj kena separuh sahaja
                    if (this.state.pemilik_agensi === 'Kerajaan') {
                        var kira = ((parseFloat(result.data).toFixed(2) - 1) / 2) + 1;
                        kira = parseFloat(kira).toFixed(2);
                        this.setState({
                            caj: kira.toString(), cajasal: result.data
                        })
                    }
                    else{
                        if (this.state.tentusan === 'Gagal') {
                            var kira = (parseFloat(result.data).toFixed(2) - 1) / 2;
                            kira = parseFloat(kira).toFixed(2);
                            this.setState({
                                caj: kira.toString(), cajasal: result.data
                            })
                        } else {
                            this.setState({
                                caj: result.data, cajasal: result.data
                            })
                        }
                    }

                }

            });
    }

    deleteRow(xxx, iddelete) {
        this.state.attachment.splice(xxx, 1);
        this.setState({
            deletedetail: this.state.deletedetail.concat(iddelete)
        });
        let newjoin = this.state.attachment;
        this.setState({attachment: newjoin});
    }

    reset() {
        this.setState({
            // kawasan: '',
            jenis_id: '',
            lain_id: '',
            kategori_id: '',
            jenis: '',
            kategori: '',
            lain: '',
            had: '',
            jenishad: '',
            jenama: '',
            siri: '',
            caj: '',
            tentusan: '',
            nombordaftar: '',
            nomborsijil: '',
            stikerbaru: '',
            jenisstikerbaru: '',
            stikerlama: '',
            jenisstikerlama: '',
            tempat: '',
            jenistempat: '',
            // pegawai: '',
            // pegawai_id: '',
            pemilik: '',
            pemilik_id: '',
            resit: '',
            resit_no: '',
            jenisresit: 'Manual',
            kegunaan: 'Untuk Kegunaan Perdagangan',
            description: '',
            priority: 'Low',
            sent_to: [],
            attachment: [],
            modal: false,
            new_attach: '',
            new_desc: '',
            scr: '',
            test: '',
            all_attach: [],
            newDetail: true,
        })
    }

    setTentusah(xxx) {
        // console.log(xxx)
        if (this.state.caj != '' && this.state.caj != '0') {
            if (xxx === 'Gagal') {
                var kira = (parseFloat(this.state.caj) - 1) / 2;
                kira = parseFloat(kira).toFixed(2);
                this.setState({
                    caj: kira.toString(),
                })

            } else {
                fetch(global.ipServer + "alatan/get_harga/" + this.state.kategori_id + '/' + global.global_id, {
                    headers: {
                        'x-access-token': global.token
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            redirectLogout(response.status, this.props);
                            return [];

                        }
                    })
                    .then((result) => {
                        if (result.status === 'OK') {
                            if (this.state.pemilik_agensi === 'Kerajaan') {
                                var kira = ((parseFloat(result.data).toFixed(2) - 1) / 2) + 1;
                                kira = parseFloat(kira).toFixed(2);
                                this.setState({
                                    caj: kira.toString(), cajasal: result.data
                                })
                            }
                            else {
                                this.setState({
                                    caj: result.data,
                                })
                            }

                        }

                    });
            }
        }

    }

    setTempatPembaik(xxx) {
        fetch(global.ipServer + "alatan/get_tempatpembaik/" + xxx + '/' + global.global_id, {
            headers: {
                'x-access-token': global.token
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((result) => {
                if (result.status === 'OK') {
                    this.setState({
                        pembaik_alamat: result.data,
                    });
                    // if (this.state.jenistempat === 'Premis Pelanggan') {
                    //     this.setState({
                    //         tempat: result.data,
                    //     })
                    // }
                }

            });

    }

    setTempatPemilik(xxx) {
		// console.log(this.state.pembaik_alamat,'-------------------')
		// console.log(this.state.jenistempat)
    	if (xxx === 'pembaik'){
    		// console.log('xxsaaf')
            this.setState({
                alamatalatan: this.state.pembaik_alamat,
            });
            if (this.state.jenistempat === 'Premis Pelanggan') {
                this.setState({
                    tempat: this.state.pembaik_alamat,
                    alamat_premis: this.state.pembaik_alamat,
                });
            }
    		// this.setState({
			// 	tempat: this.state.pembaik_alamat,
			// 	alamat_premis: this.state.pembaik_alamat,
			// })
		}
		else if (xxx !== 'pembaik'){
			fetch(global.ipServer + "alatan/get_tempatpemilik/" + xxx + '/' + global.global_id, {
				headers: {
					'x-access-token': global.token
				}
			})
				.then((response) => {
					if (response.status === 200) {
						return response.json();
					} else {
						redirectLogout(response.status, this.props);
						return [];

					}
				})
				.then((result) => {
					if (result.status === 'OK') {
						this.setState({
							pemilik_alamat: result.data.data,
							alamat_premis: result.data.data,
							pemilik_agensi: result.data.agensi,
							alamatalatan: result.data.data,
						});
						if (this.state.jenistempat === 'Premis Pelanggan') {
							// if (this.state.pembaik_alamat === '') {
								this.setState({
									tempat: result.data.data,
								})
							// }
						}
						if (result.data.agensi === 'Kerajaan') {
							// console.log(this.state.cajasal)
							if (this.state.cajasal === ''){
								this.setState({
									datatentusah: [{name:'Permulaan'},{name:'Semula'}],tentusan:'',
								})
							}
							else{
								var kira = ((parseFloat(this.state.cajasal).toFixed(2) - 1) / 2) + 1;
								kira = parseFloat(kira).toFixed(2);
								this.setState({
									caj: kira.toString(),datatentusah: [{name:'Permulaan'},{name:'Semula'}],tentusan:'',
								})
							}


						}
						else{
							if (this.state.cajasal === ''){
								this.setState({
									datatentusah: [{name:'Permulaan'},{name:'Semula'},{name:'Gagal'}],tentusan:'',
								})
							}
							else{
								this.setState({
									caj: this.state.cajasal, datatentusah: [{name:'Permulaan'},{name:'Semula'},{name:'Gagal'}],tentusan:'',
								})
							}
						}
					}

				});

		}

        // console.log(this.state.pemilik_agensi)

    }

    dateEndChange(date) {
        this.setState({
            dateEnd: date
        });
    }

    priorityChange(value) {
        this.setState({priority: value})
        // console.log(this.state.priority)
    }

    allChange(x, y) {
        this.setState({y: x})
    }

    sentChange(value) {
        this.setState({sent_to: value});
    }

    renderEditable(cellInfo) {
        return (
            <div
                style={{backgroundColor: "#fafafa"}}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.data];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({data});
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.data[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }

    // loadUsers() {
    //     fetch(global.ipUM + "task/list_users/" + global.global_id)
    //         .then((response) => response.json())
    //         .then((result) => {
    //             this.setState({users: result.data})
    //         })
    // }

    setTempat(xxx) {
        // console.log(this.state.pemilik_alamat);
        if (xxx === 'Premis Pelanggan') {
            // if (this.state.pembaik_alamat === '') {
            //     if (this.state.pemilik_alamat === '') {
            //         this.setState({
            //             tempat: '',
            //         })
            //     } else {
            //         this.setState({
            //             tempat: this.state.pemilik_alamat,
            //             tempatValid: false
            //         })
            //     }
            // } else {
			if (this.state.alamat_premis === ''){
				this.setState({
                    tempat: '',
                })
			}
			else if (this.state.alamat_premis !== ''){
				this.setState({
                    tempat: this.state.alamat_premis,
                    tempatValid: false
                })
			}

            // }
        } else if (xxx === 'Pejabat Cawangan') {
            this.setState({
                tempat: this.state.kawasan_tempat,
                tempatValid: false
            })
        } else if (xxx === 'Stamping Station') {
            this.setState({
                tempat: ''
            })
        }

    }

    handleClick() {
        this.setState(function (prevState) {
            return {isToggleOn: !prevState.isToggleOn};
        });
    }

    addAttach = async () => {
        let index = this.state.attachment.findIndex(el => el.stikerbaru === this.state.stikerbaru && el.jenisstikerbaru === this.state.jenisstikerbaru);

        if (index == -1){
            let xxs = this.state.idUpdate;
            if (xxs === ''){
                xxs = '0';
            }
            let pakts = true;
            fetch(global.ipServer + "alatan/check_sticker_no/" + this.state.stikerbaru + '/' + xxs + '/' + this.state.jenisstikerbaru, {
                headers: {
                    'x-access-token': global.token
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    redirectLogout(response.status, this.props);
                }
            })
            .then((result) => {
                console.log(result);
                if (!result) {
                    toast.error("Stiker tidak dipilih.");

                }
                else if (result.data !== 'OK') {
                    toast.error("No Stiker telah digunakan.");

                }
                else{
                    if (this.validateAlatan()) {
                        let allnew = {
                            'stikerbarufull': this.state.jenisstikerbaru + ' ' + this.state.stikerbaru,
                            'jenis': this.state.jenis,
                            'kategori': this.state.kategori,
                            'kategori_id': this.state.kategori_id,
                            'pegawaitentusah_id': this.state.pegawaitentusah_id,
                            'pegawaitentusah': this.state.pegawaitentusah,
                            'lain': this.state.lain,
                            'lain_id': this.state.lain_id,
                            'had': this.state.had,
                            'hadpenuh': this.state.hadpenuh,
                            'jenis_id': this.state.jenis_id,
                            'pemilik': this.state.pemilik,
                            'pemilik_id': this.state.pemilik_id,
                            'jenishad': this.state.jenishad,
                            'jenama': this.state.jenama,
                            'siri': this.state.siri,
                            'caj': this.state.caj,
                            'kegunaan': this.state.kegunaan,
                            'tentusan': this.state.tentusan,
                            'nombordaftar': this.state.nombordaftar,
                            'nomborsijil': this.state.nomborsijil,
                            'tarikhalatan': this.state.tarikhalatan,
                            'stikerbaru': this.state.stikerbaru,
                            'jenisstikerbaru': this.state.jenisstikerbaru,
                            'stikerlama': this.state.stikerlama,
                            'alamatalatan': this.state.alamatalatan,
                            'lama': '0',
                            'id': '',
                            'update': '1',
                            'jenisstikerlama': this.state.jenisstikerlama
                        };

                        console.log(allnew)

                        let satubaris = [allnew];
                        // satubaris.concat(allnew);
                        this.setState({
                            attachment: this.state.attachment.concat(allnew)
                        });
                        this.setState({
                            all_attach: this.state.all_attach.concat(this.state.new_attach)
                        });

                        if (this.validate()) {
                            let lastresit = this.state.resit;
                            if (this.state.jenisresit === 'Auto') {
                                lastresit = this.state.resit_no;
                            }

                            let data = {
                                valueId: this.state.id,
                                valueKawasan: this.state.kawasan,
                                valueTempat: this.state.tempat,
                                valueTarikh: this.state.tarikh,
                                valueJenisTempat: this.state.jenistempat,
                                valuePegawaiId: this.state.pegawai_id,
                                valueResit: this.state.resit,
                                valueJenisResit: lastresit,
                                valueDetail: satubaris,
                                valueDelete: this.state.deletedetail,
                                valueOwner: this.state.pemilik_id,
                            };

                            const formData = new FormData();
                            // const formData2 = new FormData();
                            formData.append('data', JSON.stringify(data));
                            // for (let x in this.state.all_attach) {
                            //     formData2.append('file', this.state.all_attach[x]);
                            // }

                            // formData.append("picture", this.state.new_attach);


                            return new Promise((resolve, reject) => {


                                fetch(global.ipServer + 'alatan/update/' + global.global_id, {
                                    method: 'POST',
                                    headers: {
                                        'x-access-token': global.token
                                    },
                                    body: formData,
                                })
                                    .then((response) => {
                                        if (response.status === 200) {
                                            return response.json();
                                        } else {
                                            redirectLogout(response.status, this.props);
                                            return [];

                                        }
                                    })
                                    .then((data) => {

                                        setTimeout(
                                            function () {
                                                if (data['status'] !== 'OK')
                                                    toast.error("Ralat");
                                                else {
                                                    this.updatefull();
                                                    this.setState({
                                                        jenis: '',
                                                        kategori: '',
                                                        lain: '',
                                                        had: '',
                                                        hadpenuh: '',
                                                        kategori_id: '',
                                                        lain_id: '',
                                                        jenis_id: '',
                                                        jenishad: '',
                                                        pemilik: '',
                                                        pemilik_id: '',
                                                        jenama: '',
                                                        siri: '',
                                                        caj: '',
                                                        cajasal:'',
                                                        tentusan: '',
                                                        nombordaftar: '',
                                                        nomborsijil: '',
                                                        alamatalatan: '',
                                                        stikerbaru: '',
                                                        jenisstikerbaru: '',
                                                        listOwnerRepairerSelected:'',
                                                        stikerlama: '',
                                                        jenisstikerlama: '',
                                                        kegunaan: 'Untuk Kegunaan Perdagangan',
                                                        rowUpdate: '',
                                                        idUpdate: '',
                                                        lamaUpdate: '',
                                                        newDetail: true,
                                                    });
                                                    // this.setState({new_desc: ''});
                                                    // this.setState({new_attach: ''});
                                                    this.setState({
                                                        tambahdetail: !this.state.tambahdetail,
                                                    });
                                                }
                                            }
                                                .bind(this),
                                            1000
                                        );


                                    })
                                    .catch((error) => {
                                        resolve('Failed');
                                    });
                            });
                        }


                    };
                }
            });
        }
        else{
            toast.error("No Stiker telah digunakan.");
        }



    };

    addAttachBorang = async () => {

    if (this.validateBorang()) {
        let allnew = {
            'pemilik': this.state.pemilik,
            'pemilik_id': this.state.pemilik_id,
            'pegawaitentusah_id': this.state.pegawaitentusah_id,
            'pegawaitentusah': this.state.pegawaitentusah,
        };

        let satubaris = [allnew];
        // satubaris.concat(allnew);
        this.setState({
            attachment: this.state.attachment.concat(allnew)
        });
        this.setState({
            all_attach: this.state.all_attach.concat(this.state.new_attach)
        });

        if (this.validate()) {
            let lastresit = this.state.resit;
            if (this.state.jenisresit === 'Auto') {
                lastresit = this.state.resit_no;
            }

            let data = {
                valueId: this.state.id,
                valueKawasan: this.state.kawasan,
                valueTempat: this.state.tempat,
                valueTarikh: this.state.tarikh,
                valueJenisTempat: this.state.jenistempat,
                valuePegawaiId: this.state.pegawai_id,
                valueResit: this.state.resit,
                valueJenisResit: lastresit,
                valueDetail: satubaris,
                valueDelete: this.state.deletedetail,
                valueOwner: this.state.pemilik_id,
            };

            const formData = new FormData();
            // const formData2 = new FormData();
            formData.append('data', JSON.stringify(data));
            // for (let x in this.state.all_attach) {
            //     formData2.append('file', this.state.all_attach[x]);
            // }

            // formData.append("picture", this.state.new_attach);


            return new Promise((resolve, reject) => {


                fetch(global.ipServer + 'alatan/updateborang/' + global.global_id, {
                    method: 'POST',
                    headers: {
                        'x-access-token': global.token
                    },
                    body: formData,
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            redirectLogout(response.status, this.props);
                            return [];

                        }
                    })
                    .then((data) => {

                        setTimeout(
                            function () {
                                if (data['status'] !== 'OK')
                                    toast.error("Ralat");
                                else {
                                    this.updatefull();
                                    this.setState({
                                        jenis: '',
                                        kategori: '',
                                        lain: '',
                                        had: '',
                                        hadpenuh: '',
                                        kategori_id: '',
                                        lain_id: '',
                                        jenis_id: '',
                                        jenishad: '',
                                        pemilik: '',
                                        pemilik_id: '',
                                        jenama: '',
                                        siri: '',
                                        caj: '',
                                        cajasal:'',
                                        tentusan: '',
                                        nombordaftar: '',
                                        nomborsijil: '',
                                        alamatalatan: '',
                                        stikerbaru: '',
                                        jenisstikerbaru: '',
                                        listOwnerRepairerSelected:'',
                                        stikerlama: '',
                                        jenisstikerlama: '',
                                        kegunaan: 'Untuk Kegunaan Perdagangan',
                                        rowUpdate: '',
                                        idUpdate: '',
                                        lamaUpdate: '',
                                        newDetail: true,
                                    });
                                    // this.setState({new_desc: ''});
                                    // this.setState({new_attach: ''});
                                    this.setState({
                                        tambahdetail: !this.state.tambahdetail,
                                    });
                                }
                            }
                                .bind(this),
                            1000
                        );


                    })
                    .catch((error) => {
                        resolve('Failed');
                    });
            });
        }


    };
    };

    dateChange(date){
        // let copyValidation = this.state.validForm;
        // copyValidation.validDateStart = false;

        // copyValidation.validStartEnd = date > this.state.dateEnd;

        this.setState({
            tarikh: date
        });
    }

    dateChange2(date){
        // let copyValidation = this.state.validForm;
        // copyValidation.validDateStart = false;

        // copyValidation.validStartEnd = date > this.state.dateEnd;

        this.setState({
            tarikhalatan: date
        });
    }

    handleChange(e, field) {
        console.log(e)
        console.log(field)
        let copy = this.state;

        if (field === 'tag') {
            copy['tag'] = e.map(item => {
                return item.name || item
            })
        } else if (field === 'category') {
            copy[field] = e;
        } else if (field === 'need_resource') {
            copy[field] = e;
        } else
            copy[field] = e.target.value;
        this.setState({ copy})
    }

    updateAttach() {
        let xxs = this.state.idUpdate;
        if (xxs === ''){
            xxs = '0';
        }
        let pakts = true;
        fetch(global.ipServer + "alatan/check_sticker_no/" + this.state.stikerbaru + '/' + xxs + '/' + this.state.jenisstikerbaru, {
            headers: {
                'x-access-token': global.token
            }
        })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                redirectLogout(response.status, this.props);
            }
        })
        .then((result) => {
            if (result.data !== 'OK') {
                toast.error("No Stiker telah digunakan.");

            }
            else{
                if (this.validateAlatan()) {
                    let allnew = {
                        'stikerbarufull': this.state.jenisstikerbaru + ' ' + this.state.stikerbaru,
                        'jenis': this.state.jenis,
                        'kategori': this.state.kategori,
                        'lain': this.state.lain,
                        'had': this.state.had,
                        'hadpenuh': this.state.hadpenuh,
                        'jenis_id': this.state.jenis_id,
                        'kategori_id': this.state.kategori_id,
                        'lain_id': this.state.lain_id,
                        'jenishad': this.state.jenishad,
                        'jenama': this.state.jenama,
                        'siri': this.state.siri,
                        'caj': this.state.caj,
                        'alamatalatan': this.state.alamatalatan,
                        'tentusan': this.state.tentusan,
                        'pemilik': this.state.pemilik,
                        'pemilik_id': this.state.pemilik_id,
                        'nombordaftar': this.state.nombordaftar,
                        'nomborsijil': this.state.nomborsijil,
                        'kegunaan': this.state.kegunaan,
                        'stikerbaru': this.state.stikerbaru,
                        'jenisstikerbaru': this.state.jenisstikerbaru,
                        'pegawaitentusah_id': this.state.pegawaitentusah_id,
                        'pegawaitentusah': this.state.pegawaitentusah,
                        'tarikhalatan': this.state.tarikhalatan,
                        'stikerlama': this.state.stikerlama,
                        'lama':'1',
                        'id': this.state.idUpdate,
                        'jenisstikerlama': this.state.jenisstikerlama,
                        'update': '1'
                    };

                    var abc = this.state.rowUpdate;
                    let xxx = this.state.attachment;

                    console.log(allnew)
                    xxx[abc] = allnew;
                    this.setState({attachment: xxx});
                    let satubaris = [allnew];

                    // this.setState({
                    //     attachment: this.state.attachment.concat(allnew)
                    // });
                    // this.setState({
                    //     all_attach: this.state.all_attach.concat(this.state.new_attach)
                    // });

                    if (this.validate()) {
                        let lastresit = this.state.resit;
                        if (this.state.jenisresit === 'Auto') {
                            lastresit = this.state.resit_no;
                        }

                        let data = {
                            valueId: this.state.id,
                            valueKawasan: this.state.kawasan,
                            valueTempat: this.state.tempat,
                            valueTarikh: this.state.tarikh,
                            valueJenisTempat: this.state.jenistempat,
                            valuePegawaiId: this.state.pegawai_id,
                            valueResit: this.state.resit,
                            valueJenisResit: lastresit,
                            valueDetail: satubaris,
                            valueDelete: this.state.deletedetail,
                            valueOwner: this.state.pemilik_id,
                        };

                        const formData = new FormData();
                        // const formData2 = new FormData();
                        formData.append('data', JSON.stringify(data));
                        // for (let x in this.state.all_attach) {
                        //     formData2.append('file', this.state.all_attach[x]);
                        // }

                        // formData.append("picture", this.state.new_attach);


                        return new Promise((resolve, reject) => {


                            fetch(global.ipServer + 'alatan/update/' + global.global_id, {
                                method: 'POST',
                                headers: {
                                    'x-access-token': global.token
                                },
                                body: formData,
                            })
                                .then((response) => {
                                    if (response.status === 200) {
                                        return response.json();
                                    } else {
                                        redirectLogout(response.status, this.props);
                                        return [];

                                    }
                                })
                                .then((data) => {

                                    setTimeout(
                                        function () {
                                            if (data['status'] !== 'OK')
                                                toast.error("Ralat");
                                            else {
                                                this.updatefull();
                                                this.setState({
                                                    jenis: '',
                                                    kategori: '',
                                                    jenis_id: '',
                                                    lain_id: '',
                                                    kategori_id: '',
                                                    lain: '',
                                                    pemilik: '',
                                                    pemilik_id: '',
                                                    deletedetail: [],
                                                    had: '',
                                                    hadpenuh: '',
                                                    jenishad: '',
                                                    alamatalatan: '',
                                                    jenama: '',
                                                    siri: '',
                                                    caj: '',
                                                    tentusan: '',
                                                    kegunaan: 'Untuk Kegunaan Perdagangan',
                                                    nombordaftar: '',
                                                    nomborsijil: '',
                                                    stikerbaru: '',
                                                    jenisstikerbaru: '',
                                                    stikerlama: '',
                                                    listOwnerRepairerSelected:'',
                                                    jenisstikerlama: '',
                                                    rowUpdate: '',
                                                    idUpdate: '',
                                                    lamaUpdate: '',
                                                    newDetail: true,
                                                });

                                                // this.setState({new_desc: ''});
                                                // this.setState({new_attach: ''});
                                                this.setState({
                                                    tambahdetail: !this.state.tambahdetail,
                                                });
                                            }
                                        }
                                            .bind(this),
                                        1000
                                    );


                                })
                                .catch((error) => {
                                    resolve('Failed');
                                });
                        });
                    }


                    // console.log(this.state.all_attach);

                    // this.setState({new_desc: ''});
                    // this.setState({new_attach: ''});

                };
            };
        });


    };

    formatGroupLabel = data => (
        <div style={groupStyles}>
            <span>{data.label}</span>
            <span style={groupBadgeStyles}>{data.options.length}</span>
        </div>
    );

    render() {
        const {attachment} = this.state;
        const {listpemilik} = this.state;

        const closeBtnProfile = <button className="close" onClick={this.togglePemilik}>&times;</button>;
        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <Container fluid>
                        <PageTitle
                            heading="Daftar Alatan"
                            icon="pe-7s-news-paper"
                        />
                        <Row>
                            <Col md="12">
                                <Card className="main-card mb-3">
                                    <CardBody>
                                        {/*<CardTitle>Intel Report</CardTitle>*/}

                                        <Form>
                                            <FormGroup>
                                                <div style={{margin: '20px'}}>
                                                    <Row form>
                                                        <Col md={1}>
                                                            <Label for="name">Pembaik</Label>
                                                        </Col>
                                                        <Col md={10}>
                                                            {/*{*/}
                                                                {/*this.state.resit !== '' ?*/}
                                                                    {/*<Input readOnly type="text"*/}
                                                                   {/*name="pembaik2" value={this.state.pembaik}/>*/}
                                                                    {/*:*/}
                                                                    <Input name="pembaik" type="select" id='pembaik'
                                                                           value={this.state.pembaik_id}
                                                                           onChange={(dataEl) => {
                                                                               let index = dataEl.nativeEvent.target.selectedIndex;
                                                                               let label = dataEl.nativeEvent.target[index].text;
                                                                               this.setTempatPembaik(dataEl.target.value);

                                                                               virtualListRepairer = [{
                                                                                   label: label,
                                                                                   value: 'pembaik'
                                                                               }]
                                                                               virtualListOwner = this.state.datapemilik

                                                                               groupedOptions = [
                                                                                   {
                                                                                       label: 'Pembaik',
                                                                                       options: virtualListRepairer,
                                                                                   },
                                                                                   {
                                                                                       label: 'Pemilik',
                                                                                       options: virtualListOwner,
                                                                                   },
                                                                               ];

                                                                               this.setState({
                                                                                   pembaik: label,
                                                                                   pembaik_id: dataEl.target.value,
                                                                                   listOwnerRepairer: groupedOptions,
                                                                                   virtualListRepairer: virtualListRepairer,
                                                                                   listOwnerRepairerSelected: null,
                                                                                   // pemilikValid: false
                                                                               });
                                                                           }}
                                                                    >
                                                                        <option key={''} value={''} disabled>Sila pilih
                                                                        </option>
                                                                        {this.state.datapembaik.map(option => (
                                                                            <option key={option.id} value={option.id}>
                                                                                {option.name}
                                                                            </option>
                                                                        ))}

                                                                    </Input>

                                                        </Col>
                                                        <Col md={1}></Col>
                                                    </Row>
                                                </div>
                                                <div style={{margin: '20px'}}>
                                                    <Row form>
                                                        <Col md={1}>
                                                            <Label for="name">Kawasan</Label>
                                                        </Col>
                                                        <Col md={4}>
                                                            <Input readOnly type="text"
                                                                   name="kawasan" value={this.state.kawasan}
                                                                   invalid={this.state.nameValid}/>
                                                        </Col>
                                                        <Col md={1}></Col>
                                                        <Col md={1}>
                                                            <Label for="name">Tarikh Tentusah</Label>
                                                        </Col>
                                                        <Col md={4}>
                                                            {
                                                                this.state.resit !== '' ?
                                                                    <InputGroup>
                                                                        <InputGroupAddon addonType="prepend">
                                                                            <div className="input-group-text">
                                                                                <FontAwesomeIcon icon={faCalendarAlt}/>
                                                                            </div>
                                                                        </InputGroupAddon>
                                                                        <DatePicker
                                                                            readOnly
                                                                            className="form-control"
                                                                            value={this.state.tarikh}
                                                                            selected={this.state.tarikh}
                                                                            // onChange={this.dateChange}
                                                                            dateFormat="d/M/yyyy"
                                                                            // onKeyDown={(e) => this.handleKeyPress(e)}
                                                                        />
                                                                    </InputGroup>
                                                                    :
                                                                    <InputGroup>
                                                                        <InputGroupAddon addonType="prepend">
                                                                            <div className="input-group-text">
                                                                                <FontAwesomeIcon icon={faCalendarAlt}/>
                                                                            </div>
                                                                        </InputGroupAddon>
                                                                        <DatePicker
                                                                            className="form-control"
                                                                            value={this.state.tarikh}
                                                                            selected={this.state.tarikh}
                                                                            onChange={this.dateChange}
                                                                            dateFormat="d/M/yyyy"
                                                                            // showTimeSelect
                                                                            // timeFormat="HH:mm"
                                                                            // timeIntervals={15}
                                                                            // timeCaption="Time"
                                                                            // calendarClassName="custom-datetimepicker"
                                                                            onKeyDown={(e) => this.handleKeyPress(e)}
                                                                        />
                                                                        {/*{(this.state.validForm.validDateStart) ?*/}
                                                                        {/*<div className="invalid-feedback"*/}
                                                                        {/*style={{display: 'block'}}>Required</div> : null}*/}
                                                                        {/*{(this.state.validForm.validStartEnd) ?*/}
                                                                        {/*<div className="invalid-feedback"*/}
                                                                        {/*style={{display: 'block'}}>Cannot later than Date End</div> : null}*/}
                                                                    </InputGroup>
                                                            }
                                                        </Col>
                                                        <Col md={1}></Col>

                                                    </Row>
                                                </div>
                                                <div style={{margin: '20px'}}>
                                                    <Row form>
                                                        <Col md={1}>
                                                            <Label for="name">Tempat</Label>
                                                        </Col>
                                                        <Col md={4}>
                                                            {
                                                                this.state.resit !== '' ?
                                                                    <Input readOnly type="text"
                                                                           name="jenistempat2" value={this.state.jenistempat}/>
                                                                    :
                                                                    <select className="form-control"
                                                                            value={this.state.jenistempat}
                                                                            onChange={event => {
                                                                                this.setTempat(event.target.value);
                                                                                this.setState({
                                                                                    jenistempat: event.target.value,
                                                                                    jenistempatValid: false
                                                                                })
                                                                            }}>
                                                                        <option key={''} value={''} disabled>Sila
                                                                            pilih
                                                                        </option>
                                                                        <option>Pejabat Cawangan</option>
                                                                        <option>Premis Pelanggan</option>
                                                                        <option>Stamping Station</option>
                                                                    </select>
                                                            }
                                                            {(this.state.jenistempatValid) ?
                                                                <div className="invalid-feedback"
                                                                     style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                        </Col>
                                                        <Col md={6}>
                                                            {
                                                                this.state.resit !== '' ?
                                                                    <Input readOnly type="text"
                                                                           name="tempat2"
                                                                           value={this.state.tempat}/>
                                                                    :
                                                                    <Input type="text" value={this.state.tempat}
                                                                           name="name"
                                                                           value={this.state.tempat}
                                                                           onChange={event => {
                                                                               this.setState({
                                                                                   tempat: event.target.value,
                                                                                   tempatValid: false
                                                                               })
                                                                           }} placeholder={'Taip disini'}
                                                                           invalid={this.state.tempatValid}/>
                                                            }
                                                            {(this.state.tempatValid) ?
                                                                <div className="invalid-feedback"
                                                                     style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div style={{margin: '20px'}}>
                                                    <Row form>
                                                        <Col md={1}>
                                                            <Label for="name">Pegawai</Label>
                                                        </Col>
                                                        <Col md={4}>
                                                            <Input readOnly type="text"
                                                                   name="pegawai" value={this.state.pegawai}
                                                                   invalid={this.state.nameValid}/>
                                                        </Col>
                                                        <Col md={7}></Col>
                                                    </Row>
                                                </div>
                                                {this.state.adaresit &&
                                                <div style={{margin: '20px'}}>
                                                    <Row form>

                                                        <Col md={1}>
                                                            <Label for="name">Resit</Label>
                                                        </Col>
                                                        {/*{this.state.adaresit &&*/}
                                                        {/*<Col md={2}>*/}
                                                            {/*/!*<select className="form-control"*!/*/}
                                                            {/*/!*value={this.state.jenisresit}*!/*/}
                                                            {/*/!*onChange={event => {*!/*/}
                                                            {/*/!*this.setResitAuto(event.target.value);*!/*/}
                                                            {/*/!*this.setState({jenisresit: event.target.value})*!/*/}
                                                            {/*/!*}}>*!/*/}
                                                            {/*/!*<option key={''} value={''} disabled>Sila pilih</option>*!/*/}
                                                            {/*/!*<option>Auto</option>*!/*/}
                                                            {/*/!*<option>Manual</option>*!/*/}
                                                            {/*/!*</select>*!/*/}
                                                            {/*<Input readOnly type="text" name="name"*/}
                                                                   {/*value={this.state.jenisresit}/>*/}
                                                        {/*</Col>*/}
                                                        {/*}*/}
                                                        <Col md={4}>
                                                            <Input readOnly type="text" name="name"
                                                                   value={this.state.resit}/>
                                                        </Col>

                                                        <Col md={1}></Col>
                                                        <Col md={1}>
                                                            <Label for="name">No Rujukan</Label>
                                                        </Col>
                                                        <Col md={4}>
                                                            <Input readOnly type="text" name="name"
                                                                   value={this.state.rujukan}/>
                                                        </Col>
                                                        <Col md={1}></Col>
                                                    </Row>
                                                </div>
                                                        }
                                                {this.state.tambahdetail &&
                                                <div style={{backgroundColor: 'lightgrey', padding: '20px'}}>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                            <Label for="name">Tarikh Tentusah</Label>
                                                        </Col>
                                                        <Col md={4}>
                                                            {
                                                                this.state.resit !== '' ?
                                                                    <InputGroup>
                                                                        <InputGroupAddon addonType="prepend">
                                                                            <div className="input-group-text">
                                                                                <FontAwesomeIcon icon={faCalendarAlt}/>
                                                                            </div>
                                                                        </InputGroupAddon>
                                                                        <DatePicker
                                                                            readOnly
                                                                            className="form-control"
                                                                            value={this.state.tarikhalatan}
                                                                            selected={this.state.tarikhalatan}
                                                                            // onChange={this.dateChange}
                                                                            dateFormat="d/M/yyyy"
                                                                            // onKeyDown={(e) => this.handleKeyPress(e)}
                                                                        />
                                                                    </InputGroup>
                                                                    :
                                                                    <InputGroup>
                                                                        <InputGroupAddon addonType="prepend">
                                                                            <div className="input-group-text">
                                                                                <FontAwesomeIcon icon={faCalendarAlt}/>
                                                                            </div>
                                                                        </InputGroupAddon>
                                                                        <DatePicker
                                                                            className="form-control"
                                                                            value={this.state.tarikhalatan}
                                                                            selected={this.state.tarikhalatan}
                                                                            onChange={this.dateChange2}
                                                                            dateFormat="d/M/yyyy"
                                                                            onKeyDown={(e) => this.handleKeyPress(e)}
                                                                        />
                                                                    </InputGroup>
                                                            }
                                                        </Col>
                                                        <Col md={7}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Pegawai Tentusah</Label>
                                                            </Col>
                                                            <Col md={10}>
                                                                {
                                                                    this.state.resit !== '' ?
                                                                        <Input readOnly type="text"
                                                                               name="pegawaitentusah2"
                                                                               value={this.state.pegawaitentusah}/>
                                                                        :
                                                                        <Input name="pegawaitentusah" type="select"
                                                                               id='pegawaitentusah'
                                                                               value={this.state.pegawaitentusah_id}
                                                                               onChange={(dataEl) => {
                                                                                   let index = dataEl.nativeEvent.target.selectedIndex;
                                                                                   let label = dataEl.nativeEvent.target[index].text;
                                                                                   this.setState({
                                                                                       pegawaitentusah: label,
                                                                                       pegawaitentusah_id: dataEl.target.value,
                                                                                   });
                                                                               }}
                                                                        >
                                                                            <option key={''} value={''} disabled>Sila
                                                                                pilih
                                                                            </option>
                                                                            {this.state.datapegawai.map(option => (
                                                                                <option key={option.id}
                                                                                        value={option.id}>
                                                                                    {option.name}
                                                                                </option>
                                                                            ))}

                                                                        </Input>
                                                                }
                                                            </Col>
                                                            <Col md={1}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Pemilik</Label>
                                                            </Col>
                                                            <Col md={8}>
                                                                <Input type="text" readOnly value={this.state.pemilik} name="name"
                                                                       value={this.state.pemilik}
                                                                       placeholder={'Klik Carian'}
                                                                       invalid={this.state.pemilikValid}/>
                                                                {(this.state.pemilikValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                            </Col>
                                                            <Col md={2}>
                                                                {/*{*/}
                                                                    {/*this.state.resit !== '' ?*/}
                                                                        {/*''*/}
                                                                        {/*:*/}
                                                                        <Button style={{width: '250px'}} color="primary"
                                                                                className='mr-1 btn-icon btn-shadow btn-outline'
                                                                                outline
                                                                                onClick={this.openModal}>
                                                                            Carian Pemilik
                                                                        </Button>
                                                                {/*}*/}
                                                                {/*<Button className="border-0 btn-transition"*/}
                                                                        {/*onClick={() => this.openModal()} outline*/}
                                                                        {/*color="success">*/}
                                                                    {/*<FontAwesomeIcon icon={faEye}/>*/}
                                                                {/*</Button>*/}
                                                            </Col>

                                                            {/*<Col md={10}>*/}
                                                            {/*    <FormGroup>*/}
                                                            {/*        <Select*/}
                                                            {/*            defaultValue={virtualListRepairer[0]}*/}
                                                            {/*            options={this.state.listOwnerRepairer}*/}
                                                            {/*            formatGroupLabel={this.formatGroupLabel}*/}
                                                            {/*            onChange={e=>console.log(e)}*/}
                                                            {/*        />*/}
                                                            {/*    </FormGroup>*/}
                                                            {/*</Col>*/}
                                                            <Col md={1}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Alamat Alatan</Label>
                                                            </Col>
                                                            <Col md={10}>
                                                                <Input type="text" value={this.state.alamatalatan} name="name"
                                                                       value={this.state.alamatalatan}
                                                                       placeholder={'Taip disini'}
                                                                       invalid={this.state.alamatalatanValid}/>
                                                                {(this.state.alamatalatanValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                            </Col>
                                                            <Col md={1}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Kegunaan</Label>
                                                            </Col>
                                                            <Col md={10}>
                                                                {
                                                                    this.state.resit !== '' ?
                                                                        <Input readOnly type="text"
                                                                               name="kegunaan2"
                                                                               value={this.state.kegunaan}/>
                                                                        :
                                                                        <select className="form-control"
                                                                                value={this.state.kegunaan}
                                                                                onChange={event => {
                                                                                    this.setkegunaan(event.target.value);
                                                                                    this.setState({kegunaan: event.target.value})
                                                                                }}>
                                                                            <option key={''} value={''} disabled>Sila
                                                                                pilih
                                                                            </option>
                                                                            <option>Untuk Kegunaan Perdagangan</option>
                                                                            <option>Bukan Untuk Kegunaan Perdagangan
                                                                            </option>
                                                                        </select>
                                                                }
                                                            </Col>
                                                            <Col md={1}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Jenis</Label>
                                                            </Col>
                                                            <Col md={4}>
                                                                {
                                                                    this.state.resit !== '' ?
                                                                        <Input readOnly type="text"
                                                                               name="jenis2"
                                                                               value={this.state.jenis}/>
                                                                        :
                                                                        <Input name="jenis" type="select" id='jenis'
                                                                               value={this.state.jenis_id}
                                                                               onChange={(dataEl) => {
                                                                                   let index = dataEl.nativeEvent.target.selectedIndex;
                                                                                   let label = dataEl.nativeEvent.target[index].text;
                                                                                   this.getlain(dataEl.target.value);
                                                                                   this.setState({
                                                                                       jenis: label,
                                                                                       jenis_id: dataEl.target.value,
                                                                                       jenisValid: false
                                                                                   });
                                                                               }}
                                                                        >
                                                                            <option key={''} value={''} disabled>Sila
                                                                                pilih
                                                                            </option>
                                                                            {this.state.datajenis.map(option => (
                                                                                <option key={option.id}
                                                                                        value={option.id}>
                                                                                    {option.name}
                                                                                </option>
                                                                            ))}

                                                                        </Input>
                                                                }
                                                                {(this.state.jenisValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                            </Col>
                                                            <Col md={1}></Col>
                                                            <Col md={1}>
                                                                <Label for="name">Lain</Label>
                                                            </Col>
                                                            <Col md={4}>
                                                                {
                                                                    this.state.resit !== '' ?
                                                                        <Input readOnly type="text"
                                                                               name="lain2"
                                                                               value={this.state.lain}/>
                                                                        :
                                                                        <Input name="lain" type="select" id='lain'
                                                                               value={this.state.lain_id}
                                                                               onChange={(dataEl) => {
                                                                                   let index = dataEl.nativeEvent.target.selectedIndex;
                                                                                   let label = dataEl.nativeEvent.target[index].text;
                                                                                   this.getkategori(dataEl.target.value);
                                                                                   this.setState({
                                                                                       lain: label,
                                                                                       lain_id: dataEl.target.value,
                                                                                       lainValid: false
                                                                                   });
                                                                               }}
                                                                        >
                                                                            <option key={''} value={''} disabled>Sila
                                                                                pilih
                                                                            </option>
                                                                            {this.state.datalain.map(option => (
                                                                                <option key={option.id}
                                                                                        value={option.id}>
                                                                                    {option.name}
                                                                                </option>
                                                                            ))}

                                                                        </Input>
                                                                }
                                                                {(this.state.lainValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                            </Col>
                                                            <Col md={1}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Kategori</Label>
                                                            </Col>
                                                            <Col md={4}>
                                                                {
                                                                    this.state.resit !== '' ?
                                                                        <Input readOnly type="text"
                                                                               name="kategori2"
                                                                               value={this.state.kategori}/>
                                                                        :
                                                                        <Input name="kategori" type="select"
                                                                               id='kategori'
                                                                               value={this.state.kategori_id}
                                                                               onChange={(dataEl) => {
                                                                                   let index = dataEl.nativeEvent.target.selectedIndex;
                                                                                   let label = dataEl.nativeEvent.target[index].text;
                                                                                   this.setharga(dataEl.target.value);
                                                                                   this.setState({
                                                                                       kategori: label,
                                                                                       kategori_id: dataEl.target.value,
                                                                                       kategoriValid: false
                                                                                   });
                                                                               }}
                                                                        >
                                                                            <option key={''} value={''} disabled>Sila
                                                                                pilih
                                                                            </option>
                                                                            {this.state.datakategori.map(option => (
                                                                                <option key={option.id}
                                                                                        value={option.id}>
                                                                                    {option.name}
                                                                                </option>
                                                                            ))}

                                                                        </Input>
                                                                }
                                                                {(this.state.kategoriValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                            </Col>
                                                            <Col md={1}></Col>
                                                            <Col md={1}>
                                                                <Label for="name">Had</Label>
                                                            </Col>
                                                            <Col md={2}>
                                                                {
                                                                    this.state.resit !== '' ?
                                                                        <Input readOnly type="text"
                                                                               name="had2"
                                                                               value={this.state.had}/>
                                                                        :
                                                                        <Input type="number" value={this.state.had}
                                                                               name="name"
                                                                               value={this.state.had}
                                                                               onChange={event => {
                                                                                   this.setState({
                                                                                       had: event.target.value,
                                                                                       hadValid: false
                                                                                   })
                                                                               }} placeholder={'Taip disini'}
                                                                               invalid={this.state.hadValid}/>
                                                                }
                                                                {(this.state.hadValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                            </Col>
                                                            <Col md={2}>
                                                                {
                                                                    this.state.resit !== '' ?
                                                                        <Input readOnly type="text"
                                                                               name="jenishad2"
                                                                               value={this.state.jenishad}/>
                                                                        :
                                                                        <select className="form-control"
                                                                                value={this.state.jenishad}
                                                                                onChange={event => {
                                                                                    this.setState({
                                                                                        jenishad: event.target.value,
                                                                                        jenishadValid: false
                                                                                    })
                                                                                }}>
                                                                            <option key={''} value={''} disabled>Sila
                                                                                pilih
                                                                            </option>
                                                                            <option>kg</option>
                                                                            <option>g</option>
                                                                            <option>mg</option>
                                                                            <option>l</option>
                                                                            <option>ml</option>
                                                                            <option>m</option>
                                                                            <option>jam</option>
                                                                            <option>l/min</option>
                                                                        </select>
                                                                }
                                                                {(this.state.jenishadValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                            </Col>
                                                            <Col md={1}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Jenama</Label>
                                                            </Col>
                                                            <Col md={4}>
                                                                {/*{*/}
                                                                    {/*this.state.resit !== '' ?*/}
                                                                        {/*<Input readOnly type="text"*/}
                                                                               {/*name="jenama2"*/}
                                                                               {/*value={this.state.jenama}/>*/}
                                                                        {/*:*/}
                                                                        <Input type="text" value={this.state.jenama}
                                                                               name="name"
                                                                               value={this.state.jenama}
                                                                               onChange={event => {
                                                                                   this.setState({
                                                                                       jenama: event.target.value,
                                                                                       jenamaValid: false
                                                                                   })
                                                                               }} placeholder={'Taip disini'}
                                                                               invalid={this.state.jenamaValid}/>
                                                                {/*}*/}
                                                                {(this.state.jenamaValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                            </Col>
                                                            <Col md={1}></Col>
                                                            <Col md={1}>
                                                                <Label for="name">No. Siri</Label>
                                                            </Col>
                                                            <Col md={4}>
                                                                {/*{*/}
                                                                    {/*this.state.resit !== '' ?*/}
                                                                        {/*<Input readOnly type="text"*/}
                                                                               {/*name="siri2"*/}
                                                                               {/*value={this.state.siri}/>*/}
                                                                        {/*:*/}
                                                                        <Input type="text" value={this.state.siri}
                                                                               name="name"
                                                                               value={this.state.siri}
                                                                               onChange={event => {
                                                                                   this.setState({
                                                                                       siri: event.target.value,
                                                                                       siriValid: false
                                                                                   })
                                                                               }} placeholder={'Taip disini'}
                                                                               invalid={this.state.siriValid}/>
                                                                {/*}*/}
                                                                {(this.state.siriValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                            </Col>
                                                            <Col md={1}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Caj Fi</Label>
                                                            </Col>
                                                            <Col md={2}>
                                                                <Input readOnly type="text"
                                                                       value={this.state.caj}
                                                                       name="name"
                                                                       value={this.state.caj}
                                                                       onChange={event => {
                                                                           this.setState({caj: event.target.value})
                                                                       }} placeholder={'Taip disini'}
                                                                       invalid={this.state.nameValid}/>
                                                            </Col>
                                                            <Col md={3}></Col>
                                                            <Col md={1}>
                                                                <Label for="name">Tentusah</Label>
                                                            </Col>
                                                            <Col md={4}>
                                                                {
                                                                    this.state.resit !== '' ?
                                                                        <Input readOnly type="text"
                                                                               name="tentusan2"
                                                                               value={this.state.tentusan}/>
                                                                        :
                                                                        <Input name="tentusan" type="select"
                                                                               id='tentusan'
                                                                               value={this.state.tentusan}
                                                                               onChange={(dataEl) => {
                                                                                   let index = dataEl.nativeEvent.target.selectedIndex;
                                                                                   let label = dataEl.nativeEvent.target[index].text;
                                                                                   this.setTentusah(dataEl.target.value);
                                                                                   this.setState({
                                                                                       tentusan: label,
                                                                                       tentusahValid: false
                                                                                   });
                                                                               }}
                                                                        >
                                                                            <option key={''} value={''} disabled>Sila
                                                                                pilih
                                                                            </option>
                                                                            {this.state.datatentusah.map(option => (
                                                                                <option key={option.name}
                                                                                        value={option.name}>
                                                                                    {option.name}
                                                                                </option>
                                                                            ))}

                                                                        </Input>
                                                                }
                                                                {/*<select className="form-control"*/}
                                                                        {/*value={this.state.tentusan}*/}
                                                                        {/*onChange={event => {*/}
                                                                            {/*this.setTentusah(event.target.value);*/}
                                                                            {/*this.setState({*/}
                                                                                {/*tentusan: event.target.value,*/}
                                                                                {/*tentusahValid: false*/}
                                                                            {/*})*/}
                                                                        {/*}}>*/}
                                                                    {/*<option key={''} value={''} disabled>Sila pilih*/}
                                                                    {/*</option>*/}
                                                                    {/*<option>Permulaan</option>*/}
                                                                    {/*<option>Semula</option>*/}
                                                                    {/*<option>Gagal</option>*/}
                                                                {/*</select>*/}
                                                                {(this.state.tentusahValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                            </Col>
                                                            <Col md={1}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Nombor Daftar</Label>
                                                            </Col>
                                                            <Col md={2}>
                                                                <Input type="text"
                                                                       value={this.state.nombordaftar}
                                                                       maxLength={6}
                                                                       name="name"
                                                                       value={this.state.nombordaftar}
                                                                       onChange={event => {
                                                                           this.setState({
                                                                               nombordaftar: event.target.value,
                                                                               nombordaftarValid: false
                                                                           })
                                                                       }} placeholder={'Taip disini'}
                                                                       invalid={this.state.nombordaftarValid}/>
                                                                {(this.state.nombordaftarValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                            </Col>
                                                            <Col md={3}></Col>
                                                            <Col md={1}>
                                                                <Label for="name">No. Borang D</Label>
                                                            </Col>
                                                            <Col md={4}>

                                                                <Input type="text"
                                                                       value={this.state.nomborsijil}
                                                                       name="name"
                                                                       value={this.state.nomborsijil}
                                                                       onChange={event => {
                                                                           this.setState({
                                                                               nomborsijil: event.target.value,
                                                                               nomborsijilValid: false
                                                                           })
                                                                       }} placeholder={'Taip disini'}
                                                                       invalid={this.state.nomborsijilValid}/>
                                                                {(this.state.nomborsijilValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                            </Col>
                                                            <Col md={1}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Stiker</Label>
                                                            </Col>
                                                            <Col md={2}>
                                                                <select className="form-control"
                                                                        value={this.state.jenisstikerbaru}
                                                                        onChange={event => {
                                                                            this.setState({
                                                                                jenisstikerbaru: event.target.value,
                                                                                jenisstikerbaruValid: false
                                                                            })
                                                                        }}>
                                                                    <option key={''} value={''} disabled>Sila pilih
                                                                    </option>
                                                                    <option>DE 01</option>
                                                                    <option>DE 02</option>
                                                                    <option>DE 03</option>
                                                                    <option>DE 04</option>
                                                                    <option>DE 05</option>
                                                                    <option>DE 06</option>
                                                                    <option>DE 07</option>
                                                                    <option>DE 08</option>
                                                                    <option>DE 09</option>
                                                                    <option>DE 10</option>
                                                                    <option>DE 11</option>
                                                                    <option>DE 12</option>
                                                                    <option>DE 13</option>
                                                                    <option>DE 14</option>
                                                                    <option>DE 15</option>
                                                                    <option>DE 16</option>
                                                                    <option>DE 17</option>
                                                                    <option>DE 18</option>
                                                                    <option>DE 19</option>
                                                                    <option>DE 20</option>
                                                                    <option>DE 21</option>
                                                                    <option>DE 22</option>
                                                                    <option>DE 23</option>
                                                                    <option>DE 24</option>
                                                                </select>
                                                                {(this.state.jenisstikerbaruValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                            </Col>
                                                            <Col md={2}>
                                                                <Input type="text" value={this.state.stikerbaru} maxLength={6}
                                                                       name="name" value={this.state.stikerbaru}
                                                                       onChange={event => {
                                                                           this.setState({
                                                                               stikerbaru: event.target.value,
                                                                               stikerbaruValid: false
                                                                           })
                                                                       }} placeholder={'Taip disini'}
                                                                       invalid={this.state.stikerbaruValid}/>
                                                                {(this.state.stikerbaruValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                            </Col>
                                                            <Col md={6}>
                                                                {/*{this.state.adaresit === false &&*/}
                                                                {/*<div>*/}
                                                                {this.state.newDetail === true ?
                                                                    <Button style={{width: '140px',float:'right'}} color="primary"
                                                                            className='mr-1 btn-icon btn-shadow btn-outline'
                                                                            outline
                                                                            onClick={this.addAttach}>
                                                                        <i className="pe-7s-diskette btn-icon-wrapper"> </i>Tambah
                                                                    </Button> :
                                                                    <Button style={{width: '140px',float:'right'}} color="primary"
                                                                            className='mr-1 btn-icon btn-shadow btn-outline'
                                                                            outline
                                                                            onClick={this.updateAttach}>
                                                                        <i className="pe-7s-diskette btn-icon-wrapper"> </i>Kemaskini
                                                                    </Button>
                                                                }
                                                                {this.state.newDetail === true ?
                                                                    <Button style={{width: '200px',float:'right'}} color="primary"
                                                                            className='mr-1 btn-icon btn-shadow btn-outline'
                                                                            outline
                                                                            onClick={this.addAttachBorang}>
                                                                        <i className="pe-7s-diskette btn-icon-wrapper"> </i>Bayaran Borang
                                                                    </Button> :''
                                                                }
                                                                {/*</div>}*/}

                                                                <Button style={{width: '140px',float:'right'}} color="danger"
                                                                        className='mr-1 btn-icon btn-shadow btn-outline'
                                                                        outline
                                                                        onClick={this.tutup}>
                                                                    <i className="lnr-cross btn-icon-wrapper"> </i>Tutup
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                                }

                                                <div style={{margin: '20px'}}>
                                                    <Row form>
                                                        <Col md={12}>
                                                            <Label for="name">Alatan</Label>
                                                        </Col>
                                                        <Col md={12}>
                                                            <ReactTable
                                                                data={attachment}
                                                                columns={[
                                                                    {
                                                                        Header: 'No',
                                                                        accessor: "",
                                                                        Cell: ({original, index}) => {
                                                                            let page = 1
                                                                            let totalPerPage = page
                                                                            return (
                                                                                <div style={{
                                                                                    textAlign: 'center',
                                                                                    width: '100%'
                                                                                }}>{`${index +  totalPerPage }`}</div>
                                                                            );
                                                                        },
                                                                        sortable: false,
                                                                        filterable: false,
                                                                        width: 50
                                                                    },
                                                                    {
                                                                        Header: "Pemilik",
                                                                        accessor: "pemilik",
                                                                    },

                                                                    {
                                                                        Header: "Jenis",
                                                                        accessor: "jenis",
                                                                    },
                                                                    {
                                                                        Header: "Had Terima",
                                                                        accessor: "hadpenuh",
                                                                    },
                                                                    {
                                                                        Header: "Caj (RM)",
                                                                        accessor: "caj",
                                                                    },
                                                                    {
                                                                        Header: "No.Daftar",
                                                                        accessor: "nombordaftar",
                                                                    },
                                                                    {
                                                                        Header: "No.Stiker",
                                                                        accessor: "stikerbarufull",
                                                                    },
                                                                    {
                                                                        Header: () => {
                                                                            return (
                                                                                <div>
                                                                                    <span
                                                                                        style={{display: 'block'}}>Tindakan
                                                                                        {this.state.borang === false && <div>
                                                                                            {this.state.adaresit === false &&
                                                                                                <div><Button style={{width: '140px'}} color="primary"
                                                                                                        className='mr-1 btn-icon btn-shadow btn-outline'
                                                                                                        outline id='test1234'
                                                                                                        onClick={this.tukar}>
                                                                                                    <i className="pe-7s-plus btn-icon-wrapper"> </i>Tambah
                                                                                                </Button>
                                                                                                {/*<UncontrolledTooltip placement="bottom" target={'test1234'}>*/}
                                                                                                    {/*Tambah*/}
                                                                                                {/*</UncontrolledTooltip>*/}
                                                                                                </div>
                                                                                            }
                                                                                        </div>}
                                                                                        </span>
                                                                                    {/*<i className={'pe-7s-plus'} onClick={this.tukar}> </i>*/}
                                                                                    {/*<a style={{*/}
                                                                                        {/*cursor: 'pointer',*/}
                                                                                        {/*textDecoration: 'underline'*/}
                                                                                    {/*}} onClick={this.tukar}>Tambah</a>*/}
                                                                                </div>
                                                                            )
                                                                        },
                                                                        Cell: row => (


                                                                            <div
                                                                                className="widget-content-right widget-content-actions"
                                                                                style={{
                                                                                    textAlign: "center",
                                                                                    width: "100%"
                                                                                }}>
                                                                                <div>
                                                                                    {this.state.borang === false && <div>
                                                                                        <Button
                                                                                            className="border-0 btn-transition"
                                                                                            outline
                                                                                            color="info"
                                                                                            onClick={e => this.detailview(row.index)}
                                                                                        ><FontAwesomeIcon icon={faEye}/>
                                                                                        </Button>
                                                                                        {/*{this.state.newDetail === true ?*/}
                                                                                        {row.original.sijil === false &&
                                                                                        <Button
                                                                                            className="border-0 btn-transition"
                                                                                            outline
                                                                                            color="info"
                                                                                            onClick={() => this.printCert(row)}
                                                                                        ><FontAwesomeIcon
                                                                                            icon={faCertificate}/>
                                                                                        </Button>}
                                                                                        {row.original.sijil &&
                                                                                        <Button
                                                                                            className="border-0 btn-transition"
                                                                                            outline
                                                                                            color="success"
                                                                                            onClick={() => this.printCert(row)}
                                                                                        ><FontAwesomeIcon
                                                                                            icon={faCertificate}/>
                                                                                        </Button>}
                                                                                        {this.state.resit === '' &&
                                                                                        <Button
                                                                                            className="border-0 btn-transition"
                                                                                            onClick={e => this.deleteRow(row.index, row.original.id)}
                                                                                            outline
                                                                                            color="danger">

                                                                                            <FontAwesomeIcon
                                                                                                icon={faTrashAlt}/>
                                                                                        </Button>}
                                                                                    </div>}

                                                                                </div>
                                                                            </div>
                                                                        ),
                                                                        filterable: false,
                                                                        sortable: false,
                                                                        width: 200
                                                                    }

                                                                ]}
                                                                minRows={2}
                                                                defaultPageSize={10}
                                                                // defaultPageSize={5}
                                                                className="-striped -highlight"
                                                            />
                                                        </Col>
                                                    </Row>
                                                </div>


                                            </FormGroup>

                                        </Form>

                                        <div className="mt-2" style={{float: 'right'}}>
                                            {this.state.resit === '' &&
                                            <div>
                                                {this.state.hantar === false &&
                                                <Button style={{width: '140px'}} color="primary"
                                                        className='mr-1 btn-icon btn-shadow btn-outline'
                                                        outline
                                                        onClick={this.submit}>
                                                    <i className="pe-7s-diskette btn-icon-wrapper"> </i>Hantar
                                                </Button>
                                                }
                                                {this.state.buttonSave &&
                                                <Button style={{width: '140px'}} color="info"
                                                        className='mr-1 btn-icon btn-shadow btn-outline'
                                                        outline
                                                        onClick={this.reset}>
                                                    <i className="pe-7s-refresh-2 btn-icon-wrapper"> </i>Set Semula
                                                </Button>
                                                }
                                                {this.state.hantar &&
                                                <Button style={{width: '140px'}} color="primary"
                                                        className='mr-1 btn-icon btn-shadow btn-outline'
                                                        outline
                                                        onClick={this.update}>
                                                    <i className="pe-7s-diskette btn-icon-wrapper"> </i>Kemaskini
                                                </Button>
                                                }
                                                <Button style={{width: '140px'}} color="danger"
                                                    className='mr-1 btn-icon btn-shadow btn-outline' outline
                                                    onClick={() => {
                                                        this.props.history.push('/equipment/list');
                                                        setTimeout(function () {
                                                            equipmentMenu.changeActiveLinkTo('#/equipment/list');

                                                        }.bind(this),);
                                                        // myMenu.changeActiveLinkLabel('Register');
                                                    }}><i
                                                className="lnr-cross btn-icon-wrapper"> </i>Tutup</Button>
                                            </div>}
                                            {this.state.resit !== '' &&
                                            <Button style={{width: '140px'}} color="danger"
                                                className='mr-1 btn-icon btn-shadow btn-outline' outline
                                                onClick={() => {
                                                    this.props.history.push('/equipment/list');
                                                    setTimeout(function () {
                                                        equipmentMenu.changeActiveLinkTo('#/equipment/list');

                                                    }.bind(this),);
                                                    // myMenu.changeActiveLinkLabel('Register');
                                                }}><i
                                            className="lnr-cross btn-icon-wrapper"> </i>Tutup</Button>
                                            }

                                        </div>


                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        {this.state.printCert && this.state.alatanId ?
                            <PrintCertGui closeFunc={this.printView}
                                          alatanId={this.state.alatanId}/> : null}
                    </Container>
                </ReactCSSTransitionGroup>

                <Modal size='xl' isOpen={this.state.modalPemilik} toggle={this.togglePemilik}
                       className={this.props.className}>
                    <ModalHeader toggle={this.togglePemilik} close={closeBtnProfile}>Carian Pemilik
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Nama Pemilik</Label>

                                    <Input value={this.state.namacarian}
                                           type="text"
                                           name='namacarian'
                                           onChange={event => {
                                               this.setState({
                                                   namacarian: event.target.value,
                                               })
                                           }}
                                           placeholder="Taip disini"/>
                                    <FormFeedback>Dikehendaki.</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>No. R.O.C/R.O.B</Label>

                                    <Input value={this.state.roccarian}
                                           type="text"
                                           onChange={event => {
                                               this.setState({
                                                   roccarian: event.target.value,
                                               })
                                           }}
                                           name='roccarian'
                                           placeholder="Taip disini"/>
                                    <FormFeedback>Dikehendaki.</FormFeedback>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>

                            <Col md={6}>
                                <FormGroup>
                                    <Label>Alamat</Label>

                                    <Input value={this.state.alamatcarian}
                                           type="text"
                                           onChange={event => {
                                               this.setState({
                                                   alamatcarian: event.target.value,
                                               })
                                           }}
                                           name='alamatcarian'
                                           placeholder="Taip disini"/>
                                    <FormFeedback>Dikehendaki.</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Code Pemilik</Label>

                                    <Input value={this.state.codecarian}
                                           type="text"
                                           onChange={event => {
                                               this.setState({
                                                   codecarian: event.target.value,
                                               })
                                           }}
                                           name='codecarian'
                                           placeholder="Taip disini"/>
                                    <FormFeedback>Dikehendaki.</FormFeedback>
                                </FormGroup>
                            </Col>
                            {/*<Col md={6}>*/}
                                {/*<FormGroup>*/}
                                    {/*<Label>No. R.O.C/R.O.B</Label>*/}

                                    {/*<Input value={this.state.roccarian}*/}
                                           {/*type="text"*/}

                                           {/*name='name'*/}
                                           {/*onChange={this.handleChange}*/}
                                           {/*placeholder="Taip disini" invalid={this.state.nameValid}/>*/}
                                    {/*<FormFeedback>Dikehendaki.</FormFeedback>*/}
                                {/*</FormGroup>*/}
                            {/*</Col>*/}
                        </Row>
                        <Button style={{width: '140px'}} color="success"
                                className="mb-2 mr-2 btn-icon btn-shadow btn-outline" outline
                                onClick={() => {
                                    this.cari()
                                }}>
                            Cari
                        </Button>

                        <div style={{margin: '20px'}}>
                            <Row form>
                                <Col md={12}>
                                    <Label for="name">Senarai Pemilik</Label>
                                </Col>
                                <Col md={12}>
                                    <ReactTable
                                        showPagination={false}
                                        data={listpemilik}
                                        columns={[

                                            {
                                                width: 350,
                                                Header: "Nama",
                                                accessor: "name",
                                            },
                                            {
                                                width: 150,
                                                Header: "No. R.O.C/R.O.B",
                                                accessor: "noRocRob",
                                            },

                                            {
                                                width: 150,
                                                Header: "Code",
                                                accessor: "code",
                                            },

                                            {
                                                width: 250,
                                                Header: "Alamat",
                                                accessor: "address",
                                            },{
                                                Header: 'Tindakan',
                                                width: 140,
                                                Cell: row => (
                                                    <div
                                                        className="widget-content-right widget-content-actions"
                                                        style={{textAlign: 'center', width: '100%'}}>
                                                        <div>
                                                            <Button style={{width: '140px'}} color="primary"
                                                                    className='mr-1 btn-icon btn-shadow btn-outline'
                                                                    outline id='test1234'
                                                                    onClick={() => {
                                                                        this.caripemilik(row.original)
                                                                    }}>Pilih
                                                            </Button>
                                                        </div>


                                                    </div>
                                                )
                                            }
                                        ]}
                                        minRows={1}
                                        // defaultPageSize={5}
                                        className="-striped -highlight"
                                    />
                                </Col>
                            </Row>
                        </div>
                    </ModalBody>
                    <ModalFooter>

                        <Button style={{width: '140px'}} color="primary"
                                className="mb-2 mr-2 btn-icon btn-shadow btn-outline" outline
                                onClick={() => {
                                    this.caripemilik('pembaik')
                                }}>
                            Pilih Pembaik
                        </Button>
                        <Button style={{width: '140px'}} color="danger"
                                className='mb-2 mr-2 btn-icon btn-shadow btn-outline' outline
                                onClick={() => {
                                    this.togglePemilik()
                                }}><i
                            className="lnr-cross btn-icon-wrapper"> </i>Tutup</Button>
                    </ModalFooter>
                </Modal>
            </Fragment>
        );
    }
}
