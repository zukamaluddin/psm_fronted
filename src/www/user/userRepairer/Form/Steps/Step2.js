import React, {Fragment} from 'react';
import {Button} from 'reactstrap';

import BlockUi from 'react-block-ui';
import {Loader} from 'react-loaders';
import {redirectLogout} from "../../../../../index";


export default class WizardStep4 extends React.Component {
    constructor(props) {
        super(props);
        this.onLoad();
        this.state = {
            redirect: false,
            blocking: true,
            loaderType: 'pacman',
            statusAPI: false,
            statusDesc: ''
        }
    }


    async onLoad() {
        let data = await this.onSubmit();
        if (data) {
            this.setState({blocking: false});
            this.setState({statusDesc: 'Pendaftaran Pembaik telah disimpan.'});
        } else {
            this.setState({blocking: false});
            this.setState({statusAPI: true});
            this.setState({statusDesc: 'Pendaftaran Pembaik tidak berjaya.'});
        }
    }

    onSubmit = async () => {
        let finalizeData = this.props.allData.registerOwner
        let data = {
            registerOwner: {
                name: finalizeData.name,
                noRocRob: finalizeData.noRocRob,
                address: finalizeData.address,
                agency: finalizeData.agencySelected,
                telNo: finalizeData.telNo,
                lesenNo: finalizeData.lesenNo,
                statusBayaran: finalizeData.statusBayaran,
                codeid: finalizeData.codeid,
            },
        };
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        return new Promise((resolve, reject) => {
            fetch(`${global.ipServer}repairer/create/${global.global_id}?token=${global.token}`, {
                method: 'POST',
                body: formData,
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
                    // return response.json()
                })
                .then((data) => {
                    setTimeout(
                        function () {
                            if (data['status'] === 'OK') {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }
                            .bind(this),
                        1000
                    );
                })
                .catch((error) => {
                    resolve(false);
                });
        });
    };

    handleSubmit = () => {
        this.props.callbackFunc();
    };

    render() {

        return (
            <Fragment>
                <BlockUi tag="div" blocking={this.state.blocking}
                         loader={<Loader active type={this.state.loaderType}/>}>
                    {(!this.state.blocking) ? <div className="form-wizard-content">
                        <div className="no-results">
                            {(!this.state.statusAPI) ?
                                <div className="sa-icon sa-success animate">
                                    <span className="sa-line sa-tip animateSuccessTip"/>
                                    <span className="sa-line sa-long animateSuccessLong"/>

                                    <div className="sa-placeholder"/>
                                    <div className="sa-fix"/>
                                </div>
                                :
                                <div className="sa-icon sa-error animateErrorIcon">
                                <span className="sa-x-mark animateXMark">
                                    <span className="sa-line sa-left"/>
                                    <span className="sa-line sa-right"/>
                                </span>

                                    <div className="sa-error-container"/>
                                    <div className="sa-fix"/>
                                </div>}
                            <div className="results-title">{this.state.statusDesc}</div>
                            <div className="mt-3 mb-3"/>
                            {(!this.state.statusAPI) ?
                                <div className="text-center">
                                    <Button style={{width: '140px'}} onClick={this.handleSubmit} color="success" size="lg"
                                            className="btn-shadow btn-wide">
                                        Tambah
                                    </Button>
                                </div> : null}
                        </div>
                    </div> : null}
                </BlockUi>
            </Fragment>
        );
    }
}
