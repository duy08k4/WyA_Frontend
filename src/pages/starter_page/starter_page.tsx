// Import library
import { IonPage } from "@ionic/react";
import React from "react";

// Import component
import SyncLoader from "react-spinners/ClipLoader"

// Import images
import logoApp  from "../../assets/logo.png"

// Import css
import "./starter_page.css"
import "../../main.css"

const StarterPage:React.FC = () => (
    <IonPage>
        <div className="starterpage">
            <div className="starterpage__element starterpage__element--logoShowcase">
                <img className="starterpage__element__logo" src={logoApp} alt="no image" />
                <h4 className="starterpage__element__slogan">let find your friends</h4>
            </div>

            <div className="starterpage__element starterpage__element--loadingAssets">
                {/* <p className="starterpage__element--loading">Loading assets...</p> */}
                <SyncLoader color="white" size={50} />
            </div>

        </div>
    </IonPage>
)

export default StarterPage