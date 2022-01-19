import React from "react";
import {Card, CardHeader, Col, Row} from "reactstrap";
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
const data = [
    { name: "A1", total: 1, },
    { name: "A2", total: 3, },
    { name: "A3", total: 4, },
    { name: "A4", total: 2, },
    { name: "A5", total: 11,  },
    { name: "A6", total: 2, },
    { name: "A7", total: 1,  },
    { name: "A8", total: 17,  },
];

export default class HomeComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
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
                                    <h6 className="widget-subheading">New Task</h6>
                                    <div className="widget-chart-flex">
                                        <div className="widget-numbers mb-0 w-100">
                                            <div className="widget-chart-flex">
                                                <div className="fsize-6">0</div>
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
                                    <h6 className="widget-subheading">Task In Progress</h6>
                                    <div className="widget-chart-flex">
                                        <div className="widget-numbers mb-0 w-100">
                                            <div className="widget-chart-flex">
                                                <div className="fsize-6">0</div>
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
                                    <h6 className="widget-subheading">Task Completed</h6>
                                    <div className="widget-chart-flex">
                                        <div className="widget-numbers mb-0 w-100">
                                            <div className="widget-chart-flex">
                                                <div className="fsize-6">0</div>
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
                                    <h6 className="widget-subheading">Task Canceled</h6>
                                    <div className="widget-chart-flex">
                                        <div className="widget-numbers mb-0 w-100">
                                            <div className="widget-chart-flex">
                                                <div className="fsize-6">0</div>
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
                                    <h6 className="widget-subheading">Task Overdue</h6>
                                    <div className="widget-chart-flex">
                                        <div className="widget-numbers mb-0 w-100">
                                            <div className="widget-chart-flex">
                                                <div className="fsize-6">0</div>
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

                                <ResponsiveContainer width="100%" aspect={4.0 / 3.0}>
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        {/*<Legend />*/}
                                        <Bar dataKey="total" fill="blue" />
                                    </BarChart>
                                </ResponsiveContainer>
                        </Card>
                    </Col>
                </Row>
            </div>
        )

    }
}