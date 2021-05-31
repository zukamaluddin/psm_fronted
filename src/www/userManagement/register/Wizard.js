import React from 'react'
import {

    Button

} from 'reactstrap';
import RegisterForm from "./components/registerForm";
import {toast} from "react-toastify";
import {umMenu} from "../../../Layout/AppNav/VerticalNavWrapper";
import LaddaButton, {EXPAND_LEFT} from "react-ladda"; //loading effect


export default class MultiStep extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        registerData: {
            role: '', position: '', branch: '',
        },
        validForm: {},
    };

    handleKeyDown = evt => {
        if (evt.which === 13) {
            this.submit()
        }
    };


    submit = () => {
        let copy = this.state.validForm;

        (this.state.registerData.email === '' || this.state.registerData.email === undefined) ? copy.email = true : copy.email = false;
        // (this.state.registerData.role === '' || this.state.registerData.role === undefined) ? copy.role = true : copy.role = false;
        (this.state.registerData.status === '' || this.state.registerData.status === undefined) ? copy.status = true : copy.status = false;
        (this.state.registerData.staffId === '' || this.state.registerData.staffId === undefined) ? copy.staffId = true : copy.staffId = false;
        (this.state.registerData.name === '' || this.state.registerData.name === undefined) ? copy.name = true : copy.name = false;
        (this.state.registerData.position === '' || this.state.registerData.position === undefined) ? copy.position = true : copy.position = false;
        (this.state.registerData.phone === '' || this.state.registerData.phone === undefined) ? copy.phone = true : copy.phone = false;

        this.setState({validForm: copy}, function () {
            if (Object.keys(this.state.validForm).every(k => !this.state.validForm[k])) {

                let data = this.state.registerData;

                const formData = new FormData();
                formData.append('data', JSON.stringify(data));
                // formData.append('frontendUrl', window.location.protocol + "//" + window.location.hostname);
                // formData.append("picture", this.state.registerData.picture);

                return new Promise((resolve, reject) => {


                    fetch(global.ipServer + 'user/create/' + global.global_id, {
                        method: 'POST',
                        headers: {
                            'x-access-token': global.token
                        },
                        body: formData,
                    })
                        .then((response) => response.json())
                        .then((data) => {

                            setTimeout(
                                function () {
                                    if (data['status'] === 'OK') {
                                        toast.success("Data berjaya disimpan");
                                        this.props.history.push(`/user/list`);
                                        umMenu.changeActiveLinkTo('#/user/list')
                                        resolve('Ok');
                                    } else {
                                        toast.error("Ralat");
                                        resolve('Failed');
                                    }
                                }
                                    .bind(this),
                                1000
                            );


                        })
                        .catch((error) => {
                            toast.error("Ralat");
                            resolve('Failed');
                        });
                });
            } else {
                toast.warn("Sila isi ruang yang wajib dengan betul");
            }

        });
    };


    render() {
        return (
            <div onKeyDown={this.handleKeyDown}>

                <RegisterForm registerData={this.state.registerData} validForm={this.state.validForm} history={this.props.history}/>

                <div className="divider"/>
                <div className="clearfix">
                    <div>

                        <LaddaButton
                            className="mb-2 mr-2 btn btn-icon btn-shadow btn-outline-2x float-right btn-outline-primary"
                            // loading={this.state.expLeft}
                            style={{width: '140px'}}
                            onClick={this.submit}
                            data-style={EXPAND_LEFT}
                        >
                            <i className="pe-7s-diskette btn-icon-wrapper"> </i>Simpan
                        </LaddaButton>
                    </div>
                </div>
            </div>
        )
    }
}

MultiStep.defaultProps = {};
