import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { colors, generals, fonts } from '../constants';
import { Welcomecard } from '../components';
import { Display } from '../utils';
import { useNavigation } from '@react-navigation/native';

const Welcomescreen = () => {
  const [welcomelistindex, setwelcomelistindex] = useState(-1);
  const welcomelist = useRef();
  const navigation = useNavigation();

  const handleNextPress = () => {
    if (welcomelistindex < generals.WELCOME_CONTENTS.length - 1) {
      welcomelist.current.scrollToIndex({ index: welcomelistindex + 1 });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={colors.DEFAULT_WHITE}
        barStyle="dark-content"
        
      />
      <View style={styles.welcomelistcontainer}>
        <FlatList
          ref={welcomelist}
          data={generals.WELCOME_CONTENTS}
          keyExtractor={(item) => item.title}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          renderItem={({ item }) => <Welcomecard {...item} />}
          onScroll={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / Display.setwidth(100));
            setwelcomelistindex(index);
          }}
        />
      </View>

      <Pagination totalDots={generals.WELCOME_CONTENTS.length} currentIndex={welcomelistindex} />
      <View style={styles.buttoncontainer}>
        {welcomelistindex === generals.WELCOME_CONTENTS.length - 1 ? (
          
          // Render GET STARTED button on the last page
          <TouchableOpacity
            style={[styles.button, styles.getStartedButton]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Signin')} // Navigate to your main screen
          >
            <Text style={styles.buttontextstyle}>GET STARTED</Text>
          </TouchableOpacity>
        ) : (
          // Render SKIP and NEXT buttons on other pages
          <>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                welcomelist.current.scrollToIndex({ index: generals.WELCOME_CONTENTS.length - 1 });
                }
                }
            >
              <Text style={styles.buttontextstyle}>SKIP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={handleNextPress}
            >
              <Text style={styles.buttontextstyle}>NEXT</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const Pagination = ({ totalDots, currentIndex }) => {
  return (
    <View style={styles.paginationcontainer}>
      {Array.from({ length: totalDots }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationstyle,
            currentIndex === index && styles.activePaginationDot,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.DEFAULT_WHITE,
  },
  welcomelistcontainer: {
    height: Display.setheight(70),
    
  },
  paginationcontainer: {
    flexDirection: 'row',
    marginTop: 10,
    
  },
  paginationstyle: {
    height: 8,
    width: 8,
    backgroundColor: colors.DEFAULT_GREEN,
    marginHorizontal: 5,
    borderRadius: 4,
  },
  activePaginationDot: {
    width: 16,
    backgroundColor: colors.ACTIVE_GREEN,
  },
  buttoncontainer: {
    marginTop: Display.setheight(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Display.setwidth(85),
    alignItems: 'center',
  },
  buttontextstyle: {
    fontFamily: fonts.POPPINS_BOLD,
    fontSize: 16,
    color: colors.DEFAULT_GREEN,
  },
  button: {
    backgroundColor: colors.LIGHT_GREEN,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  getStartedButton: {
    width: Display.setwidth(85),
    alignItems: 'center',
  },
});

export default Welcomescreen;
