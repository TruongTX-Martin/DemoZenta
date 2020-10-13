import React from 'react';
import { Image, Layer } from "react-konva";
import useImage from "use-image";


// const LionImage = () => {
//     // const [image] = useImage(IMAGE_URL, "ImageLocal");
//     const [image] = useImage('https://konvajs.org/assets/lion.png');
//     return <Image x={200} y={200} image={image} />;
// };

// class index extends React.Component {


//     render() {
//         // const [image] = useImage(IMAGE_URL, "Anonymous");
//         return (
//             <Layer >
//                 {/* <Image image={image} /> */}
//                 {/* <LionImage /> */}
//                 <URLImage src={IMAGE_URL} />
//             </Layer>
//         )
//     }
// }

// export default index;


class index extends React.Component {
    state = {
        image: null
    };
    componentDidMount() {
        this.loadImage();
    }
    componentDidUpdate(oldProps) {
        if (oldProps.src !== this.props.src) {
            this.loadImage();
        }
    }
    componentWillUnmount() {
        this.image.removeEventListener('load', this.handleLoad);
    }
    loadImage() {
        // save to "this" to remove "load" handler on unmount
        this.image = new window.Image();
        this.image.src = this.props.src;
        this.image.addEventListener('load', this.handleLoad);
    }
    handleLoad = () => {
        // after setState react-konva will update canvas and redraw the layer
        // because "image" property is changed
        this.setState({
            image: this.image
        });
        // if you keep same image object during source updates
        // you will have to update layer manually:
        // this.imageNode.getLayer().batchDraw();
    };
    render() {
        return (
            <Image
                width={this.props.width}
                height={this.props.height}
                x={this.props.x}
                y={this.props.y}
                image={this.state.image}
                ref={node => {
                    this.imageNode = node;
                }}
            />
        );
    }
}

export default index;