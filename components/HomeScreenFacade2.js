import React, { Component } from 'react';
import { Text, View, ImageBackground, Image } from 'react-native';

import Colors from '../constants/Colors';

import THButton from './THButton';

import THConstants from '../constants/THConstants';

import THStyles from '../constants/THStyles';

export default class HomeScreenFacade2 extends Component {
    HomeScreenImageUri =  require('../assets/tinderhouse/appt-Sandillon-6p.jpg');
    CentraleHomeScreenImageUri =  require('../assets/tinderhouse/pav_Montargis_Sandillon-5p.jpg');
    
    static  navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      let headerTitle = 'Home';
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

      return ({ headerStyle, headerTitleStyle, headerTitle, headerRight });
    }


    _onConnection() { 
      console.log('Connecté : ', this.props.navigation.state.params.connected);
     }
  

    componentDidMount() {
      this.props.navigation.setParams({  onConnection: this._onConnection.bind(this), connected: false });
    }

    connectionParams = {  onConnection: this._onConnection.bind(this), connected: false };

    render() {
      return (
          <View style={THStyles.screen}>
            <ImageBackground style={THStyles.imageBackground} source={this.HomeScreenImageUri} >
            <View style={THStyles.filterComponent}>
              <View style={THStyles.topScreen}>
                <View style={THStyles.imageContainer} >
                  <Image  source={this.CentraleHomeScreenImageUri} style={THStyles.centralImage}></Image>
                  <Text style={THStyles.logoTitle}>TinderHouse</Text>
                  <Text style={THStyles.middleLeitmotive}>Vente Rapide  -  Achat Rapide</Text>
                </View>
              </View>
              <View style={THStyles.middleScreen}>
                <View style={THStyles.startActionUserButtonContainer}>
                  <View style={THStyles.startActionUserSignUp}>
                      <THButton text="Inscription" onPress={() => {this.props.navigation.navigate('SignUp', this.connectionParams)}} theme="homeStart" outline size="default"/>
                  </View>
                  <View style={THStyles.startActionUserSignIn}>
                      <THButton text="Connexion" onPress={() => {this.props.navigation.navigate('SignIn', this.connectionParams)}} theme="homeStart" outline size="small"/>
                      <THButton text="ConnexionNDB" onPress={() => {this.props.navigation.navigate('SignInNDB', this.connectionParams)}} theme="homeStart" outline size="small"/>
                  </View>
                </View>
              </View>
              <View style={THStyles.bottomScreen}>
                <View>
                  <View style={THStyles.buttonContainer}>
                      <THButton text="Recherche" onPress={() => {this.props.navigation.navigate('LocateUser')}} theme="homeBottom" outline size="small"/>
                      <THButton text="Selection" onPress={() => {this.props.navigation.navigate('TinderHouses')}} theme="homeBottom" outline size="small"/>
                      <THButton text='Transactions' onPress={() => this.props.navigation.navigate('TestFlex')} theme="homeBottom" outline size="small"/>
                  </View>
                </View>
                <View>
                  <Text style={THStyles.copyrightText}>{THConstants.copyrightText}</Text>
                </View>
              </View>
            </View>
            </ImageBackground>
          </View>
        );
    }
}