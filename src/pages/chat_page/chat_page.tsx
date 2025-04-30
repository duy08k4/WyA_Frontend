// Import library
import { IonPage, IonContent } from "@ionic/react";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

// Import components

// Import css
import "./chat_page.css"
import "../../main.css"

const NotesPage: React.FC = () => {
  // State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const redirect = useHistory()

  // Data
  
  // Error

  // Effect
  useEffect(() => {
    setIsEditorOpen(false);
  }, []);
  
  // Handlers
  const handleNoteClick = () => {
    setIsEditorOpen(true);
  }

  const handleDirection = () => {
    redirect.push("/")
  }

  return (
    <IonPage>
        {/* Header Container */}
        <div className="notes__container">
          <div className="notes__header">
            <button className="notes__button--back" onClick={handleDirection}>
              <i className="fa-solid fa-caret-left"></i>
            </button>
            
            <h1 className="notes__header--title">Notes</h1>
          </div>

          {/* Notes Grid */}
          <div className="notes__list">
            <div className="notes__item" onClick={handleNoteClick}>
              <img src="src/assets/note_icon.png" className="notes__item--icon" alt="Note" />
              <p className="notes__item--label">Note Name</p>
            </div>

            <div className="notes__item" onClick={handleNoteClick}>
              <img src="src/assets/note_icon.png" className="notes__item--icon" alt="Note" />
              <p className="notes__item--label">Note Name</p>
            </div>

            <div className="notes__item" onClick={handleNoteClick}>
              <img src="src/assets/note_icon.png" className="notes__item--icon" alt="Note" />
              <p className="notes__item--label">Note Name</p>
            </div>
          </div>

          {/* Add Note Button */}
          <button className="notes__button--add">
            <i className="fa-solid fa-plus notes__fab--button"></i>
          </button>
        </div>
    </IonPage>
  );
};

export default NotesPage;