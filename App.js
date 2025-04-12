import React from "react";
import Navigators from "./src/navigators";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '1010563649090-fhfgeshinaet2ajl2ouc3dcnenrmhqb4.apps.googleusercontent.com', // ← Replace with your Firebase Web Client ID
});


const App = () => {
  return <Navigators />;
};

export default App;
