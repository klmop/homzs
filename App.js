import React, { Component } from 'react';
import { AppRegistry, AsyncStorage  } from 'react-native';
import { AppLoading, Asset, font } from 'expo';
import MainAppNavigation from './constants/THNavigation';
import { createStore } from 'redux';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import reducers from './reducers/reducers';
import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';
// import AsyncStorage from '@react-native-community/async-storage';
// import SyncStorage from 'sync-storage';
import { firebaseConfig } from './components/sessionManagement/ApiKeys';
import HomeScreenUser from './components/HomeScreenUser';

//Workaround for Firebase >= 7.9.0 bug.
import {decode, encode} from 'base-64'
import { authLocal, logoutUpdateUserDocument } from './components/sessionManagement/firebase';

// console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
console.disableYellowBox = true; 
// YellowBox.ignoreWarnings;

if (!global.btoa) {  global.btoa = encode };
if (!global.atob) { global.atob = decode };


const store = createStore(reducers);
// let localSession = '';
export default class Main extends Component {
    constructor(props) {
        super(props);

        //Suppress warnings for timer/performance bottleneck
        // YellowBox.ignoreWarnings(['Setting a timer']);
        
        this.state = {
            loadingComplete: true,
            authenticationReady:  true,
            authenticated:  true,
            userContext: null,
            userCredentials: null,
            userAuth: null,
        };
        //initialse firebase
        if(!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('App : constructor : initializeApp done at ' + new Date().toUTCString());
        }

       this.theme = {
            ...DefaultTheme,
            roundness: 2,
            colors: {
                ...DefaultTheme.colors,
                primary: '#3498db',
                accent: 'red',
                surface: 'red',
            },
        }
        authLocal.onAuthStateChanged(this.onAuthStateChangedLocal);
    }

    
    onAuthStateChangedLocal = async (userAuth) => {
       
        this.setState({authenticated: !!userAuth});
        this.setState({userAuth: userAuth});
        localSession = await this.retrieveData("session");
        console.log('App : onAuthStateChangedLocal : LocalSession = ', localSession?.substring(29,39));
        if(userAuth) {
            let remoteStored = 0;
            let token =  userAuth.getIdToken();
            let sessionParam = null;
            if(!localSession) {
                localSession = userAuth.uid + '!' + token + '!' + remoteStored;
                await this.storeData('session', localSession);

                // console.log('App : onAuthStateChangedLocal : localSession 1 : ' + token?.substring(0,10));
                sessionParam = localSession.split('!');
            } else {
                sessionParam = localSession.split('!');
                if(!this.sameSession(sessionParam[1], token)) {
                    localSession = userAuth.uid + '!' + token + '!' + remoteStored;
                    await this.storeData('session', localSession);
                    console.log('App : onAuthStateChangedLocal : New user local session created : ' + localSession.substring(29, 39));
                }
            }
            
            console.log('App : onAuthStateChangedLocal 1: ' + sessionParam[1].substring(0, 10));
            // this.manageUserData(userAuth, sessionParam);
            // this.manageUserProfile();
        } else {
            if(localSession) {
                console.log('App : onAuthStateChangedLocal : localSession 2 : ', localSession.substring(29, 39));
                const sessionParam = localSession.split('!');
                await logoutUpdateUserDocument(sessionParam[0], sessionParam[1]);
                await this.removeData('session');
            } else {
                console.log('App : onAuthStateChangedLocal : no localSession.');
            }
            console.log('App : onAuthStateChangedLocal : No user connected : ');
            this.setState({ userContext: { user: null, sessionToken: '' } });
            this.setState({ userCredentials: null });
        }
        this.setState({authenticationReady: true, authenticated: !!userAuth, userAuth: userAuth});
    };

    sameSession = (token1, token2) => {
        if(token1 === token2) return true;
        console.log('App : SameSession false : A new session will be created.');
        // console.log('UserProvider : SameSession false : token1 :   ' + token1);
        // console.log('UserProvider : SameSession false : token2 :   ' + token2);
        return false;
    }

    async manageUserData(userAuth, sessionParam) {
        const user = await updateUserDocument(userAuth, sessionParam[1]);
        console.log('App : manageUserData 1: ' + user);
        if(user){
            console.log('App : manageUserData : User : ' + user.displayName + ' : ');
            this.setState({ userContext: { user: user, sessionToken: localSession }});
            this.setState({userCredentials: user});
        }
    }
    manageUserProfile() {
        const user = getUserProfile();
        console.log('App : manageUserProfile 1: ', user);
        if(user){
            console.log('App : manageUserProfile : User : ' + user.displayName + ' : ');
            this.setState({ userContext: { user: user, sessionToken: localSession }});
            this.setState({userCredentials: user});
        }
    }

    storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
            console.log('App : storeData saved : ' + value.substring(0,40));
        } catch (error) {
            console.error('App : storeData : error while saving on local storage : ' + error);
        }
    }

    retrieveData = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                console.log('App : retrieveData retrieved session : ' + value.substring(29,39));
                return value;
            }
        } catch (error) {
            console.error('App : retrieveData : error while retrieving data on local storage : ' + error);
        }
        return null;
    }

    removeData = async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            console.log('App : removeData : key=' + key);
        } catch (error) {
            console.error('App : removeData : error while removing data on local storage : ' + error);
        }
    }

    // componentDidMount() {
        // loads the local.db file and opens it with SQLite
        // await Expo.FileSystem.downloadAsync(
        //     Expo.Asset.fromModule(require("./assets/db/local.db")).uri,
        //     `${Expo.FileSystem.documentDirectory}SQLite/local.db`
        //   );
        
        //   SQLite.openDatabase("local.db");

        
    // }
    

    render() {
        if(!this.state.loadingComplete && !this.state.authenticationReady && !this.props.skipLoadingScreen) {
            console.log('App : render : Not LoadingCompleted.');
            return ( 
                <AppLoading 
                        startAsync={this._loadResourcesAsync}
                        onError={this._handleLoadingError}
                        onFinish={this._handleFinishLoading} 
                />);
        } else {
            if(this.state.userAuth) {
                const userAuth = this.state.userAuth;
                console.log('App : render : this.state.userCredentials uid : ', userAuth['stsTokenManager']);
                return (
                    <StoreProvider store={store} >
                        <PaperProvider>
                            <HomeScreenUser userAuth={this.state.userAuth} navigation={this.props.navigation}/>
                        </PaperProvider>
                    </StoreProvider>);
            } else {
                console.log('App : render : this.state.userCredentials null : ');
                return (
                    <StoreProvider store={store} >
                        <PaperProvider theme={this.theme}>
                            <MainAppNavigation />
                        </PaperProvider>
                    </StoreProvider>
                    )
            }
        }
    }
};

AppRegistry.registerComponent('TinderHouzze', () => Main);