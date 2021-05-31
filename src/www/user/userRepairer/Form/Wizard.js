import React from 'react'
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import LaddaButton, {EXPAND_LEFT,} from 'react-ladda';
import {repairerMenu} from "../../../../Layout/AppNav/VerticalNavWrapper"; //loading effect

const getNavStates = (indx, length) => {
    let styles = [];
    for (let i = 0; i < length; i++) {
        if (i < indx) {
            styles.push('done')
        } else if (i === indx) {
            styles.push('doing')
        } else {
            styles.push('todo')
        }
    }
    return {current: indx, styles: styles}
};

const checkNavState = (currentStep, stepsLength) => {
    if (currentStep > 0 && currentStep < stepsLength - 1) {
        return {
            showPreviousBtn: true,
            showNextBtn: true
        }
    } else if (currentStep === 0) {
        return {
            showPreviousBtn: false,
            showNextBtn: true
        }
    } else {
        return {
            showPreviousBtn: true,
            showNextBtn: false
        }
    }
};

export default class MultiStep extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            validEmailAPI: false,
            validPhoneAPI: false,
            expLeft: false,
            showPreviousBtn: false,
            showNextBtn: true,
            compState: 0,
            navState: getNavStates(0, this.props.steps.length),
            registerOwner: {},
            complete: false,

        };
        this.child = React.createRef();
    }

    setNavState = next => {

        this.setState({
            navState: getNavStates(next, this.props.steps.length)
        });
        if (next < this.props.steps.length) {
            this.setState({compState: next})
        }
        this.setState(checkNavState(next, this.props.steps.length))
    };

    handleKeyDown = evt => {
        if (evt.which === 13) {
            this.next()
        }
    };


    next = async () => {
        if (this.state.compState < 1) {
            let result = await this.child.current.onSubmit();
            this.setState({complete: result})
            if (result) {
                this.setState({complete: result})
                this.setNavState(this.state.compState + 1);
            }
        } else {
            console.log("somthing wrong")
        }

    };
    onTambahBaru = () => {
        this.setNavState(this.state.compState = 0);
    };

    toggle(name) {
        this.setState({
            [name]: !this.state[name],
            progress: 0.5,
        });
    }


    previous = () => {
        if (this.state.compState > 0) {
            this.setNavState(this.state.compState - 1)
        }
    };

    render() {
        return (

            <div onKeyDown={this.handleKeyDown}>

                {this.state.compState === 0 ? <Step1 ref={this.child} viewData={this.state.registerOwner}
                        // complete={this.state.complete}
                                                     validForm={this.state}/>
                    : this.state.compState === 1 ?
                        <Step2 ref={this.child} allData={this.state.registerOwner} callbackFunc={this.onTambahBaru}/>
                        : null}

                <div className="divider"/>
                <div className="clearfix">
                    <div style={this.props.showNavigation ? {} : {display: 'none'}}>
                        {this.state.compState !== 2 ?
                            <a className="mb-2 mr-2 btn btn-icon btn-shadow btn-outline-2x float-right  btn-outline-info"
                               style={this.state.showPreviousBtn ? {} : {display: 'none'}}
                               href={'#/repairer/list'}
                               onClick={() =>
                                   setTimeout(function () {
                                       repairerMenu.changeActiveLinkTo('#/repairer/list')
                                   }.bind(this), 100)}
                            >
                                <i className="pe-7s-diskette btn-icon-wrapper"> </i>Senarai
                            </a>
                            : null}

                        <LaddaButton
                            className="mb-2 mr-2 btn btn-icon btn-shadow btn-outline-2x float-right btn-outline-primary"
                            style={this.state.showNextBtn ? {width: '140px'} : {display: 'none',width: '140px'}}
                            loading={this.state.expLeft}
                            onClick={() => {
                                this.next();
                                // this.toggle('expLeft')
                            }}
                            data-style={EXPAND_LEFT}
                            // disabled={this.props.steps[this.state.compState].valid}
                        >
                            <i className="pe-7s-diskette btn-icon-wrapper"> </i>Simpan
                        </LaddaButton>
                    </div>
                </div>
            </div>
        )
    }
}

MultiStep.defaultProps = {
    showNavigation: true
};
