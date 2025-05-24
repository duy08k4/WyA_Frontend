import React from "react";
import "./About__project.css";

const AboutProject: React.FC = () => {
    return (
        <div className="aboutProject">
            <div className="aboutProject__introduction">
                <h4 className="aboutProject__introduction--title">Introduction</h4>

                <ul>
                    <li>WyA is a real-time location sharing application.</li>
                    <li>This application is developed for GIS MOBILE course and is not for commercial use.</li>
                    <li>This application is developed based on Zenly application.</li>
                </ul>
            </div>

            <div className="aboutProject__features">
                <h4 className="aboutProject__features--title">Features</h4>
                
                <ul>
                    <li>Real-time location sharing.</li>
                    <li>Find Route to Friend.</li>
                    <li>Chatting.</li>
                </ul>
            </div>
        </div>
    );
}

export default AboutProject;