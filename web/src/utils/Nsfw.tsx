import * as nsfwjs from "nsfwjs";
import React, { Component } from "react";

/*
	Fix later
    https://github.com/infinitered/nsfwjs/blob/master/example/nsfw_demo/src/App.js
*/

interface NsfwProps {
    imageUrl: string;
}

class Nsfw extends Component<NsfwProps> {
    state = {
        model: null,
        loading: true,
    };

    componentDidMount() {
        nsfwjs
            .load("/model/", { size: 299 })
            .then((model) => {
                this.setState({
                    model,
                    loading: false,
                });

                // return model.classify(document.getElementById("imgThing"));
                return null;
            })
            .then(function (predictions) {
                console.log("Predictions: ", predictions);
            });
    }

    render() {
        return (
            <div>
                <img id="imgThing" src={this.props.imageUrl} />
            </div>
        );
    }
}

export default Nsfw;

// export const useNsfw = async (imageUrl: string) => {
//     const [model, setModel] = useState<nsfwjs.NSFWJS>(
//         await nsfwjs.load("/model/", { size: 299 })
//     );
//     var isNsfw = false;

//     useEffect(() => {
//         const img = new Image();
//         img.onload = async (e) => {
//             console.log("loaded image", e);

//             // setModel(await nsfwjs.load("/model/", { size: 299 }));
//             const predictions = await model.classify(img);

//             console.log(predictions);
//         };
//         img.src = imageUrl;
//     }, [model]);

//     return isNsfw;
// };

// export const isNsfw = (imageUrl: string) => {
//     return new Promise(function (resolve, reject) {
//         const img = new Image();
//         img.crossOrigin = "anonymous";

//         img.onload = async (e) => {
//             console.log("loaded image", e);

//             // setModel(await nsfwjs.load("/model/", { size: 299 }));
//             const model = await nsfwjs.load("/model/", { size: 299 });
//             const predictions = await model?.classify(img);

//             console.log(predictions);
//         };
//         img.src = imageUrl;
//     });
// };
