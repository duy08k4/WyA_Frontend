import React from "react";
import "./About__team.css";

import NTMU from "../../assets/avt_myuyen.png"
import TBTD from "../../assets/avt_tuongduy.png"
import DPT from "../../assets/avt_phutrong.png"
import NAT from "../../assets/avt_anhtuan.jpg"

const AboutTeam: React.FC = () => {

  // Hard Data
  const teamMembers = [
    {
      name: "Tran Ba Tuong Duy",
      role: "Leader & Developer & Designer",
      description: "Managed project progress and collaborated in designing and developing applications to ensure product quality and timely delivery.",
      u_class: "22166013 - DH22HM",
      major: "Information system",
      image: TBTD,
    },
    {
      name: "Do Phu Trong",
      role: "Developer & Designer",
      description: "Focused on backend development and system architecture design. Participated in building API services, database management, and optimizing system performance.",
      u_class: "22166090 - DH22HM",
      major: "Information system",
      image: DPT,
    },
    {
      name: "Nguyen Thi My Uyen",
      role: "Developer & Designer",
      description: "Focused on frontend development and user interface design. Participated in building responsive web interfaces, improving user experience, and implementing interactive features.",
      u_class: "22166101 - DH22HM",
      major: "Information system",
      image: NTMU,
    },
    {
      name: "Nguyen Anh Tuan",
      role: "Developer & Designer",
      description: "Focused on frontend development and user interface design. Participated in building responsive web interfaces, improving user experience, and implementing interactive features.",
      u_class: "22166097 - DH22HM",
      major: "Information system",
      image: NAT,
    }
  ]

  return (
    <div className="aboutTeam">
      {teamMembers.map((member, index) => (
        <div className="aboutTeam__card" key={index}>
          <div className="aboutTeam__card__avatar">
            <img src={member.image} alt="" />
          </div>

          <div className="aboutTeam__card__info">
            <p className="aboutTeam__card--username">{member.name}</p>
            <p className="aboutTeam__card--class">{member.u_class}</p>
            <p className="aboutTeam__card--major">{member.major}</p>
          </div>

          <div className="aboutTeam__card__info--detailClass">
            <p className="aboutTeam__card--role">{member.role}</p>
          </div>

          <div className="aboutTeam__card__slogan">
            <p>{member.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AboutTeam;