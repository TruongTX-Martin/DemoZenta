
import React from 'react';
import { Stage, Layer, Circle, RegularPolygon, Shape, Line, Rect } from "react-konva";
import ImageView from './imageview';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Row,
    Col
} from "reactstrap";
const IMAGE_URL = require('./img_input.jpg');

const polygonDefault = {
    isFinish: false,
    points: [],
    flattenedPoints: [],
    isMouseOverStartPoint: false,
}

class index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            points: [],
            curMousePos: [0, 0],
            isMouseOverStartPoint: false,
            isFinished: false,
            listPolygon: [],
            showModalLabel: false,
            labelValue: '',
            currentPolygon: null,
        }
        this.escFunction = this.escFunction.bind(this);

    }


    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }

    escFunction(event) {
        if (event.keyCode === 27) {
            const { listPolygon } = this.state;
            const index = listPolygon.find(e => !e.isFinish);
            if (index != -1) {
                listPolygon.splice(index, 1);
                this.setState({ listPolygon });
            }

        }
    }

    getMousePos = stage => {
        return [stage.getPointerPosition().x, stage.getPointerPosition().y];
    };


    handleClick = event => {
        const {
            state: { points, isMouseOverStartPoint, isFinished, listPolygon },
            getMousePos
        } = this;
        const stage = event.target.getStage();
        const mousePos = getMousePos(stage);

        if (listPolygon.length == 0) {
            const polygon = {
                isFinish: false,
                points: [],
                flattenedPoints: [],
                isMouseOverStartPoint: false,
                isShow: true,
            };
            polygon.points.push(mousePos);
            listPolygon.push(polygon);
        } else {
            const currentPolygon = listPolygon.find(e => !e.isFinish);
            if (currentPolygon) {
                const currentIndex = listPolygon.indexOf(currentPolygon);
                const currentPolygonPoints = currentPolygon.points;
                currentPolygonPoints.push(mousePos);
                currentPolygon.points = currentPolygonPoints;
                if (currentPolygon.isMouseOverStartPoint) {
                    currentPolygon.isFinish = true;
                }
                listPolygon[currentIndex] = currentPolygon;
                if (currentPolygon.isFinish) {
                    this.showModalLabel(currentPolygon);
                }
            } else {
                const polygon = {
                    isFinish: false,
                    points: [],
                    flattenedPoints: [],
                    isMouseOverStartPoint: false,
                    isShow: true,
                };
                polygon.points.push(mousePos);
                listPolygon.push(polygon);
            }
        }

        this.setState({
            listPolygon
        });


        if (isFinished) {
            return;
        }
        if (isMouseOverStartPoint && points.length >= 3) {
            this.setState({
                isFinished: true
            });
        } else {
            this.setState({
                points: [...points, mousePos]
            });
        }
    };

    showModalLabel(currentPolygon) {
        this.setState({ currentPolygon, showModalLabel: true });
    }
    handleMouseMove = event => {
        const { getMousePos } = this;
        const { listPolygon } = this.state;
        const stage = event.target.getStage();
        const mousePos = getMousePos(stage);
        this.setState({
            curMousePos: mousePos
        });
        const currentPolygon = listPolygon.find(e => !e.isFinish);
        if (currentPolygon) {
            const currentIndex = listPolygon.indexOf(currentPolygon);
            const flattenedPoints = currentPolygon.points
                .concat(mousePos)
                .reduce((a, b) => a.concat(b), []);
            currentPolygon.flattenedPoints = flattenedPoints;
            listPolygon[currentIndex] = currentPolygon;
            this.setState({ listPolygon });
        }
    };
    handleMouseOverStartPoint = event => {
        event.target.scale({ x: 2, y: 2 });
        const { listPolygon } = this.state;
        const currentPolygon = listPolygon.find(e => !e.isFinish);
        if (currentPolygon) {
            const currentIndex = listPolygon.indexOf(currentPolygon);
            const newPolygon = {
                id: currentPolygon.id,
                flattenedPoints: currentPolygon.flattenedPoints,
                isFinish: currentPolygon.isFinish,
                points: currentPolygon.points,
                isMouseOverStartPoint: true,
                isShow: currentPolygon.isShow
            };
            listPolygon[currentIndex] = newPolygon;
            this.setState({ listPolygon });
        }
    };

    getCurrentPolygon() {
        const { listPolygon } = this.state;
        return listPolygon.find(e => !e.isFinish);
    }

    handleMouseOutStartPoint = event => {
        event.target.scale({ x: 1, y: 1 });
        this.setState({
            isMouseOverStartPoint: false
        });
        const { listPolygon } = this.state;
        const currentPolygon = this.getCurrentPolygon();
        if (currentPolygon) {
            const currentIndex = listPolygon.indexOf(currentPolygon);
            const newPolygon = {
                flattenedPoints: currentPolygon.flattenedPoints,
                isFinish: currentPolygon.isFinish,
                points: currentPolygon.points,
                isMouseOverStartPoint: false,
                isShow: currentPolygon.isShow,
            };
            listPolygon[currentIndex] = newPolygon;
            this.setState({ listPolygon });
        }
    };
    handleDragStartPoint = event => {
        // console.log("start", event);
    };
    handleDragMovePoint = event => {
        // const points = this.state.points;
        // const index = event.target.index - 1;
        // console.log(event.target);
        // const pos = [event.target.attrs.x, event.target.attrs.y];
        // this.setState({
        //     points: [...points.slice(0, index), pos, ...points.slice(index + 1)]
        // });
    };
    handleDragOutPoint = event => {
        // console.log("end", event);
    };

    toggle = () =>
        this.setState(prevState => ({
            showModalLabel: !prevState.showModalLabel
        }));

    handleAddLabel() {
        const { listPolygon, currentPolygon, labelValue } = this.state;
        const index = listPolygon.indexOf(currentPolygon);
        const newPolygon = {
            ...currentPolygon,
            id: new Date().getTime(),
            label: labelValue,
            isShow: true,
        }
        listPolygon[index] = newPolygon;
        this.setState({ listPolygon, showModalLabel: false, labelValue: '' });
    }

    onChangeCheckLabel(index, check) {
        const { listPolygon } = this.state;
        listPolygon[index].isShow = check;
        this.setState({ listPolygon });
    }

    render() {
        const {
            state: { points, isFinished, curMousePos, listPolygon, showModalLabel, labelValue },
            handleClick,
            handleMouseMove,
            handleMouseOverStartPoint,
            handleMouseOutStartPoint,
            handleDragStartPoint,
            handleDragMovePoint,
            handleDragEndPoint
        } = this;
        const currentPolygon = listPolygon.find(e => !e.isFinish);
        const widthImage = window.innerWidth * 0.6;
        const heightImage = window.innerWidth * 0.6 * 10 / 14;
        return <div style={{ width: window.innerWidth, height: window.innerHeight, display: 'flex', flexDirection: 'row', margin: 100 }} className="main_border">
            <div style={{ width: '20%', height: window.innerHeight }} className="sidebar_border">
                {
                    listPolygon.map((e, index) => {
                        if (e?.label?.length > 0) {
                            return <Row>
                                <Col lg={3}>
                                    <Input type="checkbox" checked={e.isShow} onChange={e => this.onChangeCheckLabel(index, e.target.checked)} />
                                </Col>
                                <Col lg={9}>
                                    <p style={{ textAlign: 'left', marginBottom: 0 }}>{e.label}</p>
                                </Col>
                            </Row>
                        }
                    })
                }
            </div>
            <div style={{ width: '70%', height: heightImage }} >
                <Stage
                    width={widthImage}
                    height={heightImage}
                    onMouseDown={handleClick}
                    onMouseMove={handleMouseMove}
                >
                    <Layer>
                        <ImageView
                            src={IMAGE_URL}
                            width={widthImage}
                            height={heightImage}
                        />
                        {
                            listPolygon.map(e => {
                                if (e.isShow) {
                                    return <Line
                                        points={e.flattenedPoints}
                                        stroke="black"
                                        strokeWidth={3}
                                        closed={isFinished}
                                    />
                                }
                            })
                        }
                        {currentPolygon && currentPolygon.points.map((point, index) => {
                            const width = 4;
                            const x = point[0] - width / 2;
                            const y = point[1] - width / 2;
                            const startPointAttr =
                                index === 0
                                    ? {
                                        hitStrokeWidth: 12,
                                        onMouseOver: handleMouseOverStartPoint,
                                        onMouseOut: handleMouseOutStartPoint
                                    }
                                    : null;
                            return (
                                <Rect
                                    key={index}
                                    x={x}
                                    y={y}
                                    width={width}
                                    height={width}
                                    fill="white"
                                    stroke="black"
                                    strokeWidth={2}
                                    // onDragStart={handleDragStartPoint}
                                    // onDragMove={handleDragMovePoint}
                                    // onDragEnd={handleDragEndPoint}
                                    // draggable
                                    {...startPointAttr}
                                />
                            );
                        })}
                    </Layer>

                </Stage>
            </div>
            <div style={{ width: '10%' }} >
                <div className="button_show_data" onClick={() => console.log('Data will send to server:', listPolygon)}>Show Data</div>
            </div>
            <Modal isOpen={showModalLabel} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>Add Label for Polygon</ModalHeader>
                <ModalBody>
                    <Input
                        type="text"
                        placeholder="Add label"
                        value={labelValue}
                        onChange={(event) => this.setState({ labelValue: event.target.value })}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        className="button_agree_logout"
                        onClick={() => this.handleAddLabel()}
                    >
                        Add
            </Button>
                </ModalFooter>
            </Modal>
        </div>
    }

}

export default index;
