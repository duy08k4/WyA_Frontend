// Import library
import { IonPage, IonContent } from "@ionic/react";
import React, { useState } from "react";

// Import components
import NoteEditor from "../../components/note__notesEditor/Note_editors";

// Import css
import "./notes_page.css"
import "../../main.css"

const NotesPage: React.FC = () => {
  // State
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Data
  
  // Error
  
  // Handlers
  const handleNoteClick = () => {
    setIsEditorOpen(true);
  };

  const handleBackClick = () => {
    setIsEditorOpen(false);
  };
  

//component level state
  if (isEditorOpen) {
    return <NoteEditor onBack={handleBackClick}/>;
  }

  return (
    <IonPage>
      <IonContent>
        {/* Header Container */}
        <div className="notes__container">
          <div className="notes__header">
            <button className="notes__button--back">
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
      </IonContent>
    </IonPage>
  );
};

export default NotesPage;