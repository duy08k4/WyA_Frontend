// Import library
import { IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";
import type { JSX } from 'react';

// Import components
import AboutProject from "../../components/about__project/About__project";
import AboutTeam from "../../components/about__team/About__team";
import AboutTech from "../../components/about_tech/About__tech";

// Import css
import "./about_page.css"
import "../../main.css"

const AboutPage: React.FC = () => {
    // State
    const [chooseProject,setChooseProject] = useState<boolean>(false)
    const [chooseTeam,setChooseTeam] = useState<boolean>(false)
    const [chooseTech,setChooseTech] = useState<boolean>(false)
    
    // Error
    
    // Data
    const [choice, setChoide] = useState<string>("team")
    const [renderComponent, setRenderComponent] = useState<JSX.Element | null>(null)

    // Handlers
    useEffect(() => {
        setChooseProject(false)
        setChooseTeam(false)
        setChooseTech(false)
        
        switch (choice) {
            case "project":
                setRenderComponent(<AboutProject />)
                setChooseProject(true)
                break;
            case "team":
                setRenderComponent(<AboutTeam />)
                setChooseTeam(true)
                break;
            case "tech":
                setRenderComponent(<AboutTech />)
                setChooseTech(true)
                break;
            default:
                break;
        }
    }, [choice])


    return (
        <IonPage>
            <div className="aboutPage">
                <div className="aboutPage__navigation">
                    <div className="aboutPage__titleContainer">
                        <h2 className="aboutPage__titleContainer--title">about our project</h2>
                    </div>

                    <div className="aboutPage__menuContainer">
                        <div className={`aboutPage__menuContainer__element aboutPage__menuContainer__element--project ${chooseProject ? "chosen" : ""}`} onClick={() => {setChoide("project")}}>
                            <p className="aboutPage__menuContainer__element--content">project</p>
                        </div>

                        <div className={`aboutPage__menuContainer__element aboutPage__menuContainer__element--team ${chooseTeam ? "chosen" : ""}`} onClick={() => {setChoide("team")}}>
                            <p className="aboutPage__menuContainer__element--content">our team</p>
                        </div>

                        <div className={`aboutPage__menuContainer__element aboutPage__menuContainer__element--tech ${chooseTech ? "chosen" : ""}`} onClick={() => {setChoide("tech")}}>
                            <p className="aboutPage__menuContainer__element--content">teach</p>
                        </div>
                    </div>
                </div>

                <div className="aboutPage__showcaseArea">
                    {renderComponent}
                </div>

                <div className="aboutPage__btnContainer">
                    <button className="aboutPage__backBtn">back</button>
                </div>
            </div>
        </IonPage>
    )
}

export default AboutPage