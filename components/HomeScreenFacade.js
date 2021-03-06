import React, { Component } from 'react';
import { Text, View, ImageBackground, Image, StatusBar } from 'react-native';

import Colors from '../constants/Colors';

import THButton from './THButton';

import THConstants from '../constants/THConstants';

import THStyles from '../constants/THStyles';
import Copyright from './Copyright';
import THBaseButtons from './THBaseButtons';

export default class HomeScreenFacade extends Component {
    constructor(props) {
      super(props);
      this.gotoSignIn = this.gotoSignIn.bind(this);
    }
    HomeScreenImageUri =  require('../assets/tinderhouse/appt-Sandillon-6p.jpg');
    CentraleHomeScreenImageUri =  require('../assets/tinderhouse/pav_Montargis_Sandillon-5p.jpg');
    
    static  navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      // let headerTitle = 'Home';
      let headerTitleStyle = {
        color: 'white',
      };
      let headerStyle = {
        backgroundColor: Colors.homeCorporate,
      };
      let headerRight = (<THButton 
                            text={ THConstants.notConnected }
                            theme="homeBottom" outline size="small"
                            onPress={ () => params.onConnection() } />);

      return ({ headerStyle, headerTitleStyle, headerRight });
      
    }


    _onConnection() { 
      console.log('Connecté : ', this.props.navigation.state.params.connected);
     }
  

    componentDidMount() {
      // this.props.navigation.setParams({  onConnection: this._onConnection.bind(this), connected: false });
    }

    connectionParams = {  onConnection: this._onConnection.bind(this), connected: false };

    gotoSignIn() {
      this.props.navigation.navigate('SignIn', this.connectionParams);
    }

    render() {
      return (
          <View style={THStyles.screen}>
          <StatusBar backgroundColor={ Colors.homeCorporate } barStyle={"default"} />
            <ImageBackground style={THStyles.imageBackground} source={this.HomeScreenImageUri} >
            <View style={THStyles.filterComponent}>
              <View style={THStyles.imageContainerHomeScreen} >
                <Image  source={this.CentraleHomeScreenImageUri} style={THStyles.centralImage}></Image>
                <Text style={THStyles.logoTitle}>TinderHouse</Text>
                <Text style={THStyles.middleLeitmotive}>Vente Rapide  -  Achat Rapide</Text>
              </View>
              <View style={THStyles.middleScreen}>
                <View style={THStyles.startActionUserButtonContainer}>
                  <View style={THStyles.startActionUserSignUp}>
                      <THButton text="Inscription" onPress={() => {this.props.navigation.navigate('SignUpChoice', this.connectionParams)}} theme="homeStart" outline size="default"/>
                  </View>
                  <View style={THStyles.startActionUserSignIn}>
                      <THButton text="Connexion" onPress={this.gotoSignIn} theme="homeStart" outline size="small"/>
                  </View>
                </View>
              </View>
              <THBaseButtons style={THStyles.buttonContainer} fromTop='35' navigation={this.props.navigation} />
              <Copyright />
            </View>
            </ImageBackground>
          </View>
        );
    }
}