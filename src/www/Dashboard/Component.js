import React from "react";
import {Card, CardHeader, CardBody, Col, Row} from "reactstrap";
import {
    AreaChart,
    Area,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Brush,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
    BarChart,
    Bar,
    Cell,
    ComposedChart,
} from "recharts";

let data = [
    {name: "Jan", total: 0,},
    {name: "Feb", total: 0,},
    {name: "Mar", total: 0,},
    {name: "Apr", total: 0,},
    {name: "May", total: 0,},
    {name: "Jun", total: 0,},
    {name: "Jul", total: 0,},
    {name: "Aug", total: 0,},
    {name: "Sep", total: 0,},
    {name: "Oct", total: 0,},
    {name: "Nov", total: 0,},
    {name: "Dec", total: 0,},
];

export default class HomeComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            barChart: {},
            baru: 0,
            progres: 0,
            selesai: 0,
            batal: 0,
            lebih: 0,
        };
    }

    componentDidMount() {
        fetch(global.ipServer + `tugasan/dashboard/` + global.global_id, {
            method: 'GET',
            headers: {
                'x-access-token': global.token
            },
        })
            .then((response) => response.json())
            .then((result) => {
                data.map((value, index) => {

                    value.total = parseInt(result.data.byBulan[value.name])


                })
                console.log(result.data)
                let res = result.data
                this.setState({
                    barChart: data,
                    baru: res["Baru"],
                    progres: res["Dalam Progres"],
                    selesai: res["Selesai"],
                    batal: res["Batal"],
                    lebih: res["Lebih Masa"]
                },)

            })
    }

    render() {

        return (
            // <Card className="mb-3">
            //     <CardHeader className="tabs-lg-alternate">
            //         <div>sda</div>
            //     </CardHeader>
            // </Card>
            <div>
                <Row>
                    <Col>
                        <Card className="card-shadow-primary mb-3 widget-chart widget-chart2 text-left">
                            <div className="widget-chat-wrapper-outer">
                                <div className="widget-chart-content">
                                    <h6 className="widget-subheading">Baru</h6>
                                    <div className="widget-chart-flex">
                                        <div className="widget-numbers mb-0 w-100">
                                            <div className="widget-chart-flex">
                                                <div className="fsize-6">{this.state.baru}</div>
                                                <div className="ml-auto">
                                                    <i className="pe-7s-note icon-gradient bg-warm-flame"> </i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="card-shadow-primary mb-3 widget-chart widget-chart2 text-left">
                            <div className="widget-chat-wrapper-outer">
                                <div className="widget-chart-content">
                                    <h6 className="widget-subheading">Dalam Progres</h6>
                                    <div className="widget-chart-flex">
                                        <div className="widget-numbers mb-0 w-100">
                                            <div className="widget-chart-flex">
                                                <div className="fsize-6">{this.state.progres}</div>
                                                <div className="ml-auto">
                                                    <i className="pe-7s-timer icon-gradient bg-deep-blue"> </i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="card-shadow-primary mb-3 widget-chart widget-chart2 text-left">
                            <div className="widget-chat-wrapper-outer">
                                <div className="widget-chart-content">
                                    <h6 className="widget-subheading">Selesai</h6>
                                    <div className="widget-chart-flex">
                                        <div className="widget-numbers mb-0 w-100">
                                            <div className="widget-chart-flex">
                                                <div className="fsize-6">{this.state.selesai}</div>
                                                <div className="ml-auto">
                                                    <i className="pe-7s-notebook icon-gradient bg-deep-blue"> </i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>

                </Row>

                <Row>

                    <Col>

                    </Col>
                    <Col>
                        <Card className="card-shadow-primary mb-3 widget-chart widget-chart2 text-left">
                            <div className="widget-chat-wrapper-outer">
                                <div className="widget-chart-content">
                                    <h6 className="widget-subheading">Batal</h6>
                                    <div className="widget-chart-flex">
                                        <div className="widget-numbers mb-0 w-100">
                                            <div className="widget-chart-flex">
                                                <div className="fsize-6">{this.state.batal}</div>
                                                <div className="ml-auto">
                                                    <i className="pe-7s-close-circle icon-gradient bg-danger"> </i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="card-shadow-primary mb-3 widget-chart widget-chart2 text-left">
                            <div className="widget-chat-wrapper-outer">
                                <div className="widget-chart-content">
                                    <h6 className="widget-subheading">Lebih Masa</h6>
                                    <div className="widget-chart-flex">
                                        <div className="widget-numbers mb-0 w-100">
                                            <div className="widget-chart-flex">
                                                <div className="fsize-6">{this.state.lebih}</div>
                                                <div className="ml-auto">
                                                    <i className="pe-7s-stopwatch icon-gradient bg-sunny-morning"> </i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col>

                    </Col>
                </Row>
                <Row>
                    <Col lg="12">
                        <Card className="main-card mb-3">
                            <CardHeader id="headingOne">
                                <div block color="link" className="text-left m-0 p-0"
                                     aria-controls="collapseOne">
                                    <h3 className="form-heading">
                                        Tugasan Selesai Bagi Tahun Terkini
                                    </h3>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <ResponsiveContainer width="100%" aspect={30 / 10}>
                                    <BarChart data={this.state.barChart}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="name"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        {/*<Legend />*/}
                                        <Bar dataKey="total" fill="blue"/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardBody>


                        </Card>
                    </Col>
                </Row>
            </div>
        )

    }
}