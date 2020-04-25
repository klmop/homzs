import React, { Component } from 'react';
import { ImageBackground, YellowBox } from 'react-native';
import Colors from '../constants/Colors';
import THButton from './THButton';
import THConstants from '../constants/THConstants';
import THStyles from '../constants/THStyles';
import Copyright from './Copyright';
import SignInRNPForm from './SignInRNPForm';
  

export default class SignInScreenRNP extends Component {
    constructor(props) {
      super(props);
      
        //Suppress warnings for timer/performance bottleneck
        YellowBox.ignoreWarnings(['Setting a timer']);
        
    }
    HomeScreenImageUri =  require('../assets/tinderhouse/appt-Sandillon-6p.jpg');
    CentraleHomeScreenImageUri =  require('../assets/tinderhouse/pav_Montargis_Sandillon-5p.jpg');
    
    static  navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      let headerTitle = 'Connexion';
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
      let tabBarLabel = 'Back';

      return ({ headerStyle, headerTitleStyle, headerTitle, headerRight, tabBarLabel });
    }
    

    _onConnection() { 
      this.props.navigation.setParams({ connected: true });
      console.log('Connecté1 : ', this.props.navigation.state.params.connected);
     }


    componentDidMount() {
      // this.props.navigation.setParams({ onConnection: this._onConnection.bind(this) });
      // console.log('Connecté2 : ', this.props.navigation);
    }
  

    render() {
      return (
        <ImageBackground style={THStyles.imageBackground} source={this.HomeScreenImageUri} >
            <SignInRNPForm navigation={this.props.navigation} />
            <Copyright />
        </ImageBackground>
        );
    }
};