// Import libraries
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { useEffect, useState } from 'react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// Import custom css
import './main.css';

// Import components
import AboutPage from './pages/about_page/about_page';
import ContactPage from './pages/contact_page/contact_page';
import FriendPage from './pages/friend_page/friend_page';
import ProfilePage from './pages/profile_page/profile_page';
import ChatPage from './pages/chat_page/chat_page';
import DashboardPage from './pages/dashboard_page/dashboard_page';
import MapPage from './pages/map_page/map_page';
import LoginPage from './pages/login_page/login_page';
import RegisterPage from './pages/register_page/register_page';

// Import services
import checkAccess from './services/checkAccess.serv';

// Import redux
import { useSelector } from 'react-redux';
import { cacheSetDefaultUserInformation, cacheSetFriendRequest, cacheSetFullUserInformation, cacheSetGmail } from './redux/reducers/user.reducer';
import { RootState } from './redux/store';

// Import custom hook
import { useCache } from './hooks/cache/cache';
import { useSocket } from './hooks/socket/socket';


setupIonicReact();

const AppPage: React.FC = () => {
  const [userData, setUserData] = useState<object>()
  const pageLocation = useLocation()
  const redirect = useHistory()
  const { cacheSetData, enableListener_userInformation } = useCache()

  // Redux
  const listFriends = useSelector((state: RootState) => state.userInformation.friends)
  const gmail = useSelector((state: RootState) => state.userInformation.gmail)

  // Custom hook
  const { sendListFriendToSck } = useSocket()


  // Status bar custom (GPT Rec)
  useEffect(() => {
    const init = async () => {
      try {
        await StatusBar.setOverlaysWebView({ overlay: false });

        await StatusBar.setBackgroundColor({ color: '#000000' });

        await StatusBar.setStyle({ style: Style.Dark });
      } catch (err) {
        console.error('StatusBar config failed', err);
      }
    };

    init();
  }, []);

  // 
  useEffect(() => {
    const backButtonListener = App.addListener('backButton', () => {
      // Nếu đang ở trang home, thoát ứng dụng
      if (redirect.location.pathname === '/') {
        App.exitApp();
      } else {
        // Nếu không, quay lại trang trước
        redirect.goBack();
      }
    });

    // Cleanup listener khi component bị hủy
    return () => {
      backButtonListener.then((listener) => listener.remove());
    };
  }, [redirect]);

  // Check Login
  useEffect(() => {
    (async () => {
      await checkAccess().then(async (data) => {
        if (data.status == 200) {
          const gmail = data.data.user.gmail

          if (pageLocation.pathname === "/login" || pageLocation.pathname === "/register") {
            redirect.push("/")
          }

          enableListener_userInformation(gmail)
        } else {
          if (pageLocation.pathname === "/login" || pageLocation.pathname === "/register") {
            cacheSetData(cacheSetDefaultUserInformation())
          } else {
            cacheSetData(cacheSetDefaultUserInformation())
            redirect.push("/login")
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    })()
  }, [pageLocation])

  // Set client status
  useEffect(() => {
    if (listFriends && listFriends.length != 0 && gmail && gmail != "") {
      sendListFriendToSck({
        gmail,
        listFriends
      })
    }
  }, [listFriends.length, gmail])

  return (
    <IonApp>
      <IonRouterOutlet>
        <Route exact path="/" component={DashboardPage} />
        <Route exact path="/contact" component={ContactPage} />
        <Route exact path="/friend" component={FriendPage} />
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/chat" component={ChatPage} />
        <Route exact path="/about" component={AboutPage} />
        <Route exact path="/map" component={MapPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
      </IonRouterOutlet>
    </IonApp>
  )
};

export default AppPage;
