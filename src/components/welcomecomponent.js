import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { fonts ,colors,images} from '../constants';
import { Display } from '../utils';

const Welcomecard = ({image,title,content}) => {
  return (
    <View style={styles.container}>
      <Image 
      style={styles.imagestyle}
      source={images[image]}
      resizeMode='contain'
      />
      <Text style={styles.titlestyle}>{title}</Text>
      <Text style={styles.contentstyle}>{content}</Text>
    </View>

  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
    width:Display.setwidth(100),
    
    
    
  },
  imagestyle:{
    
    height:Display.setheight(20),
    width:Display.setwidth(70) // Sets the border color (e.g., light gray)

  },
  titlestyle:{
    
    marginTop:Display.setheight(4),
   fontSize:25,
   fontFamily:fonts.POPPINS_BOLD
  },
  contentstyle:{
   fontSize:18,
   fontFamily:fonts.POPPINS_LIGHT,
   marginHorizontal:30
  },
  
});

export default Welcomecard;