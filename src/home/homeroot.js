
import React from 'react';
import { Stage, Layer, Circle, RegularPolygon, Shape, Line, Rect } from "react-konva";
import ImageView from './imageview';
const IMAGE_URL = require('./img_input.jpg');

class index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            points: [],
            curMousePos: [0, 0],
            isMouseOverStartPoint: false,
            isFinished: false
        }
    }

    getMousePos = stage => {
        return [stage.getPointerPosition().x, stage.getPointerPosition().y];
    };
    handleClick = event => {
        const {
            state: { points, isMouseOverStartPoint, isFinished },
            getMousePos
        } = this;
        const stage = event.target.getStage();
        const mousePos = getMousePos(stage);
        console.log('handleClick:', mousePos);

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
    handleMouseMove = event => {
        const { getMousePos } = this;
        const stage = event.target.getStage();
        const mousePos = getMousePos(stage);
        this.setState({
            curMousePos: mousePos
        });
    };
    handleMouseOverStartPoint = event => {
        if (this.state.isFinished || this.state.points.length < 3) return;
        event.target.scale({ x: 2, y: 2 });
        console.log('handleMouseOverStartPoint=====');
        this.setState({
            isMouseOverStartPoint: true
        });
    };
    handleMouseOutStartPoint = event => {
        console.log('handleMouseOutStartPoint=====');
        event.target.scale({ x: 1, y: 1 });
        this.setState({
            isMouseOverStartPoint: false
        });
    };
    handleDragStartPoint = event => {
        console.log("start", event);
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
        console.log("end", event);
    };

    render() {
        const {
            state: { points, isFinished, curMousePos },
            handleClick,
            handleMouseMove,
            handleMouseOverStartPoint,
            handleMouseOutStartPoint,
            handleDragStartPoint,
            handleDragMovePoint,
            handleDragEndPoint
        } = this;
        console.log('Render points :', points);
        // console.log('Render isFinished :', isFinished);
        // console.log('Render curMousePos :', curMousePos);
        const flattenedPoints = points
            .concat(isFinished ? [] : curMousePos)
            .reduce((a, b) => a.concat(b), []);
        console.log('Render flattenedPoints :', flattenedPoints);
        const widthImage = window.innerWidth * 0.6;
        const heightImage = window.innerWidth * 0.6 * 10 / 14;
        return <div style={{ width: window.innerWidth, height: window.innerHeight, display: 'flex', flexDirection: 'row', margin: 100 }} className="main_border">
            <div style={{ width: '20%', height: window.innerHeight }} className="sidebar_border">
                Sidebar
            </div>
            <div style={{ width: '60%', height: heightImage }} >
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
                        <Line
                            points={flattenedPoints}
                            stroke="black"
                            strokeWidth={5}
                            closed={isFinished}
                        />
                        {points.map((point, index) => {
                            const width = 6;
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
                                    strokeWidth={3}
                                    onDragStart={handleDragStartPoint}
                                    onDragMove={handleDragMovePoint}
                                    onDragEnd={handleDragEndPoint}
                                    draggable
                                    {...startPointAttr}
                                />
                            );
                        })}
                    </Layer>

                </Stage>
            </div>
            <div style={{ width: '20%' }} />
        </div>
    }

}

export default index;
