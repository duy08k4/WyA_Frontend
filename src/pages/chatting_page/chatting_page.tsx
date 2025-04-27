// Import library
import { IonPage } from "@ionic/react";
import React, { useState, useRef, useEffect, use } from "react";
import { useHistory } from "react-router";

// Import components
import Chatbox from "../../components/chatting__chatBox/Chatting_chatbox";

// Import services
import searchUser from "../../services/searchUser.serv";

// Import interface
import { interface__ChattingPage__user } from "../../types/interface__ChattingPage";

// Import css
import "./chatting_page.css"
import "../../main.css"


//Sample data :) 
const ChattingPage: React.FC = () => {
  // State
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchPopupRef = useRef<HTMLDivElement>(null);
  const [selectedFriend, setSelectedFriend] = useState<{
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    lastMessageTime: string;
  } | null>(null);
  const redirect = useHistory()

  // Data
  const [searchInput, setSearchInput] = useState<string>("")
  const [searchResult, setSearchResult] = useState([])

  // Handler Effects
  // Debounce
  useEffect( () => {
    if (searchInput != "") {
      const debounce = setTimeout( async() => {
        await searchUser(searchInput).then((res) => {
          setSearchResult(res)
        }).catch((err) => {
          console.log(err)
        })
      }, 1000)
      
      return () => {
        clearTimeout(debounce)
      }
    }
  }, [searchInput])

  // Click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (searchPopupRef.current && !searchPopupRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
      }
    };

    if (isSearchActive) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };

  }, [isSearchActive]);

  // Handlers
  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSearchActive(true);
  };

  const handleBackFromChat = () => {
    setSelectedFriend(null);
  };

  const handleDirection = () => {
    redirect.push("/")
  }

  return (
    <IonPage>
      {selectedFriend ? (
        <Chatbox
          friend={selectedFriend}
          onBack={handleBackFromChat}
        />
      ) : (
        <div className="chat">
          {/* Header with search and profile */}
          <div className="chat__header">
            <div className="chat__header__container">
              <div className={`chat__search ${!isSearchActive ? "allBorder" : ""}`} ref={searchPopupRef}>
                <button className="chat__button--back" onClick={handleDirection}>
                  <i className="fa-solid fa-caret-left chat__icon--back"></i>
                </button>

                <div className="chat__input--search">
                  <input type="text" placeholder="Find your friend..." onClick={handleSearchClick} onChange={(e) => setSearchInput(e.target.value)} value={searchInput} />
                </div>

                <div className="chat__avatar--profile">
                  <img src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" alt="Avatar User" />
                </div>
              </div>

              {isSearchActive && (
                <div className="chat__search--history">
                  {searchResult.length == 0 ? "" : (
                    searchResult.map((user: interface__ChattingPage__user, index) => {
                      return (
                        <div key={index} className="chat__search--item">
                          <div className="chat__search--user">
                            <div className="chat__search--userAvartar">
                              <img src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" alt="Avatar User" />
                            </div>

                            <p className="chat__name--usersearch">{user.username}</p>
                          </div>

                          <button className="chat__button--request">Request</button>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="chat__content">
            {/* Friend Requests Section */}
            <div className="chat__section">
              <h2 className="chat__title--section">Request (number)</h2>
              <div className="chat__container">
                <div className="chat__item--request">
                  <div className="chat__user">
                    <div className="chat__avatar--user">
                      <img src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" alt="Avatar User" />
                    </div>

                    <p className="chat__name--user">username</p>
                  </div>

                  <div className="chat__actions">

                    <button className="chat__button--decline" >
                      <i className="fa-solid fa-xmark"></i>
                    </button>

                    <button className="chat__button--accept">
                      <i className="fa-solid fa-check"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Friends List Section */}
            <div className="chat__section">
              <h2 className="chat__title--section">Friends (number)</h2>
              <div className="chat__container">
                <div
                  className="chat__item--friend"
                  onClick={() => setSelectedFriend({
                    id: '1',
                    name: 'username',
                    avatar: 'https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223',
                    lastMessage: 'Last message:',
                    lastMessageTime: '22:08'
                  })}
                >
                  <div className="chat__user">
                    <div className="chat__avatar--user">
                      <img src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" alt="User avatar" />
                    </div>

                    <div className="chat__info--user">
                      <p className="chat__name--user">username</p>

                      <div className="chat__message--container">
                        <p className="chat__message--label">Last message: </p>
                        <p className="chat__message--text">Last message:</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </IonPage>
  );
};

export default ChattingPage;