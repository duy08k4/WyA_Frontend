import React from "react";
import "./About__tech.css";

const AboutTech: React.FC = () => {

  // Hard Data
  const technology = [
    {
      title: "Frontend",
      listTech: ["Ionic framework", "ReactJS", "Typescript", "Leaflet"]
    },
    {
      title: "Backend",
      listTech: ["NodeJS", "ExpressJS", "Firebase - Firestore", "MongoDB", "Websocket"]
    },
    {
      title: "Deployment",
      listTech: ["Vercel", "Render"]
    }
  ]

  return (
    <div className="aboutTech">
      {technology.map((document, index) => (
        <div key={index} className="aboutTech__introduction">
          <h4 className="aboutTech__introduction--title">{document.title}</h4>

          <ul>
            {document.listTech.map((tech, techIndex) => (
              <li key={techIndex}>{tech}</li>
            ))}
          </ul>
        </div>

      ))}
    </div>
  );
}

export default AboutTech;