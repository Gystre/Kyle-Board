import * as nsfwjs from "nsfwjs";
import { Component } from "react";

/*
	Fix later
    https://github.com/infinitered/nsfwjs/blob/master/example/nsfw_demo/src/App.js
*/
// class ModelManager {
//     private static myInstance: ModelManager | null = null;
//     _model: nsfwjs.NSFWJS | null = null;

//     constructor() {
//         nsfwjs.load("/model/", { size: 299 }).then((model) => {
//             this._model = model;
//             console.log(model);
//         });
//     }

//     static getInstance() {
//         if (ModelManager.myInstance == null) {
//             ModelManager.myInstance = new ModelManager();
//         }

//         return this.myInstance;
//     }

//     getModel() {
//         return this._model;
//     }
// }

interface NsfwProps {
    imageUrl: string;
}

class Nsfw extends Component<NsfwProps> {
    static model: nsfwjs.NSFWJS | null = null;
    state = {
        loading: true,
    };

    async componentDidMount() {
        if (!Nsfw.model) {
            Nsfw.model = await nsfwjs.load("/model/", { size: 299 });
            console.log("loaded");
        }

        // nsfwjs
        //     .load("/model/", { size: 299 })
        //     .then((model) => {
        //         this.setState({
        //             model,
        //             loading: false,
        //         });

        //         // return model.classify(document.getElementById("imgThing"));
        //         return null;
        //     })
        //     .then(function (predictions) {
        //         console.log("Predictions: ", predictions);
        //     });
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
