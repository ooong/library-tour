import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View, Alert, TextInput, TouchableHighlight,
  Modal
} from 'react-native';
import { WebBrowser } from 'expo';
import { Button, Header } from 'react-native-elements'
import { MonoText } from '../components/StyledText';
import * as Animatable from 'react-native-animatable';
import Swiper from 'react-native-swiper'

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      title: 'title',
      total: 0,
      pictures: [],
      text: 'placeholder',
      picturesTest: [],
      mainPicture: {
        title: 'testing title',
        pk: 3,
        image: {
          full: "//www.loc.gov/pictures/cdn/service/pnp/highsm/35800/35859r.jpg"
        }

      },
      score: 0,
      datesArr: [
        'May 10, 1956', '1963 Nov.', '[between 1928 and 1940]', '2001-01-13', '1923', 'Aug 25, 1944', 'July 12, 1978', 'June 20, 1966', '1988 Aug.', '1910 April.', '[between 1930 and 1945]', '[between 1950 and 1960]', '[between 1890 and 1910]', '[between 1800 and 1830]', 'July 3, 1915', 'January 27, 1922', '1993-04-17', 'March 15, 1988', 'April 8, 1993', 'Aug 30, 1988', '[between 1860 and 1870]', 'February 9, 1955'
      ],
      playing: false,
      modalVisable: false
    }
    this._handleCorrectGuess = this._handleCorrectGuess.bind(this)
    this._handleIncorrectGuess = this._handleIncorrectGuess.bind(this)
    this._assignRandomDateButton = this._assignRandomDateButton.bind(this)
    this._handleScorePress = this._handleScorePress.bind(this)
    this._handleSearchPress = this._handleSearchPress.bind(this)
    this._getRandomPicFromCollections = this._getRandomPicFromCollections.bind(this)
  }


  componentDidMount() {
    const pictures = getPicsFromLOCApi()
      .then(res => {
        this.setState({
          pictures: res
        })
      })
  }


  render() {

    let dateButtons = null
    let playingTrue = null

    if (this.state.playing) {
      const wrongDates = []
      while (wrongDates.length < 3) {
        let random = this._assignRandomDateButton()
        if (!wrongDates.includes(this.state.datesArr[random])) {
          wrongDates.push(this.state.datesArr[random])
        }
      }

      const rightButton =

        <View>
          <Button
            borderRadius={25}
            containerViewStyle={{ borderRadius: 25 }}
            margin={30}
            backgroundColor="green"
            onPress={() => { this._handleCorrectGuess() }}
            title={this.state.mainPicture.created_published_date}
          />
        </View>

      dateButtons =
        <View>
          {
            wrongDates.map(wrongButton => {
              return (
               <View style={styles.dateButtonStyle}
               key={wrongButton}
               > 
                <Button
                  borderRadius={25}
                  containerViewStyle={{ borderRadius: 25 }}
                  margin={30}
                  backgroundColor="green"
                  
                  onPress={() => { this._handleIncorrectGuess() }}
                  title={wrongButton}
                />
                </View>
              )
            })



          }
          {
            <View style={styles.dateButtonStyle}>
          <Button
            borderRadius={25}
            containerViewStyle={{ borderRadius: 25 }}
            margin={30}
            backgroundColor="green"
            onPress={() => { this._handleCorrectGuess() }}
            title={this.state.mainPicture.created_published_date}
          />
          </View>
          }
        </View>
    }


    return (
      <View style={styles.container}>
      <Header
      backgroundColor="#408000"
 
            centerComponent={{ text: `score: ${this.state.score}`, style: { color: '#fff' } }}
            rightComponent={{ text: `score: ${this.state.score}`, style: { color: '#fff' } }}
          />
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          {!this.state.playing && 

            <View style={styles.getStartedContainer}>

            <View style={styles.libraryContainer}>
              <Text style={{fontSize: 30}}>LIBRARY TOUR</Text>
            </View>
            
            <View style={{margin: 20, paddingBottom: 18}}>
              <Text style={{textAlign: 'center', fontSize: 16}}>An exploration of the Library of Congress's Prints and Photographs Collection</Text>
            </View>
            
            
            <View style={styles.touchableViewContainer}>
              <TouchableHighlight style={styles.touchableContainer}
              onPress={() => {
                this._getRandomPicFromCollections()
              }}
              >
                  <Text style={styles.touchableText}>PLAY</Text>
              </TouchableHighlight>
            </View>
          
            <View style={styles.touchableViewContainer}>
              <TouchableHighlight style={styles.touchableContainer}>
                  <Text style={styles.touchableText}>TRAIN</Text>
              </TouchableHighlight>
            </View> 
          </View>
          
          }

 
        {this.state.playing && 
        
        <View>
        
          <View style={styles.mainPictureContainer} key={this.state.mainPicture.pk}>
            <Text style={{fontStyle: 'italic'}}>{this.state.mainPicture.title}</Text>
            <TouchableHighlight onPress={() => { Alert.alert('Touchable Highlight!'); }}>
              <Image
                style={{ width: 300, height: 400 }}
                borderRadius={7}
                source={{ uri: 'http:' + `${this.state.mainPicture.image.full}` }}
              />
            </TouchableHighlight>


            <Button
              raised
              backgroundColor="green"
              borderRadius={7}
              containerViewStyle={{ borderRadius: 7 }}
              onPress={() => { this._handleCorrectGuess() }}
              title={this.state.mainPicture.created_published_date}
            />

          </View>

          <View style={styles.getStartedContainer}>

            {dateButtons}
      
          </View>
          </View>
        }
        </ScrollView>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }


  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };

  _handleScorePress = () => {
    this.setState({ score: this.state.score + 1 })
  }

  _handleCorrectGuess = () => {
    Alert.alert('Correct!');
    const gameResult = true
    this._getRandomPicFromCollections(gameResult)
  }

  _handleIncorrectGuess = () => {
    Alert.alert('Sorry, wrong answer!');
    const gameResult = false
    this._getRandomPicFromCollections(gameResult)
  }


  _setViewingPic = (picArray) => {
    const random = Math.floor(Math.random() * (9 - 0)) + 0
    let currentPic = picArray[random]
    return currentPic
  }



  _getRandomPicFromCollections = (gameResult) => {
    const collectionsArr = [
      'bbc', 'wpapos', 'pga', 'pos', 'var', 'civwar', 'yan', 'stereo', 'app', 'det', 'brum', 'wtc', 'spcw', 'wwipos'
    ]
    let collectionIndex = Math.floor(Math.random() * (14 - 0)) + 0
    console.log('COLLECTIONINDEX', collectionIndex)
    fetch('https://loc.gov/pictures/search/?co=' + `${collectionsArr[collectionIndex]}` + '&fo=json')
      .then((response) => {
        return response.json()
      })
      .then(responseJson => {
        let results = responseJson.results
        const tenResults = results.slice(10)
        console.log('TENRESULTS', tenResults)
        let random = Math.floor(Math.random() * (9 - 0)) + 0
        let finalPic = tenResults[random]
        if (!gameResult) {
          this.setState({
            mainPicture: finalPic,
            playing: true
          })
        } else {
          this.setState({
            mainPicture: finalPic,
            playing: true,
            score: this.state.score + 1
          })
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  

  _openModal() {
    this.setState({ modalVisible: true });
  }

  _closeModal() {
    this.setState({ modalVisible: false });
  }


  _getRandomNum = () => {
    return Math.floor(Math.random() * (200 - 0)) + 0
  }

  _assignRandomDateButton = () => {
    return Math.floor(Math.random() * (20 - 0)) + 0
  }

  _handleSearchPress = () => {
    fetch('https://loc.gov/pictures/search/?q=' + `${this.state.text}` + '&fo=json')
      .then((response) => {
        return response.json()
      })
      .then(resResults => {
        const results = resResults.results
        const tenResults = results.slice(10)
        const randomizedArray = [];
        while (randomizedArray.length < 10) {
          let random = Math.floor(Math.random() * 300)
          console.log('RANDOMRESULTS', results[random])
          if (results[random] !== undefined &&
            results[random].created_published_date &&
            !randomizedArray.includes(results[random])) {
            randomizedArray.push(results[random]);
          }
        }
        return randomizedArray
      })
      .then(randomizedArray => {
        this.setState({ picturesTest: randomizedArray })
      })
      .catch((error) => {
        console.error(error);
      });
    Alert.alert('pressed!')
  }
}


function getPicsFromLOCApi() {
  return fetch('http://loc.gov/pictures/search/?q=panda&co=wpapos&fo=json')
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.results
    })
    .catch((error) => {
      console.error(error);
    });
}



//// STYLING

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 20,
  },
  buttonStyle: {
    backgroundColor: "green",
    borderRadius: 25,
  },
  dateButtonStyle: {
    backgroundColor: "green",
    borderRadius: 25,
    marginVertical: 2
  },
  touchableViewContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 10
  },
  touchableContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#336600',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 50
  },
  touchableText: {
    color: 'white',
    fontSize: 20,
    lineHeight: 19,
    textAlign: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  libraryContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    padding: 20
  },
  mainPictureContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  navBar: {
    fontSize: 20,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
    
  
});
