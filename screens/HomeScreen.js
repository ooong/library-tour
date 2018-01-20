import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View, Alert, TextInput, TouchableHighlight
} from 'react-native';
import { WebBrowser } from 'expo';
import { Button, Header } from 'react-native-elements'
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
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
        'May 10, 1956', '1963 Nov.', '[between 1928 and 1940]', '2001-01-13', '1923', 'Aug 25, 1944', 'July 12, 1978','June 20, 1966', '1988 Aug.', '1910 April.', '[between 1930 and 1945]', '[between 1950 and 1960]'
      ],
      playing: false
    }
    this._handleCorrectGuess = this._handleCorrectGuess.bind(this)
    this._handleIncorrectGuess = this._handleIncorrectGuess.bind(this)
    this._handleGuessPress = this._handleGuessPress.bind(this)
    this._assignRandomDateButton = this._assignRandomDateButton.bind(this)
    this._handleScorePress = this._handleScorePress.bind(this)
    this._handleSearchPress = this._handleSearchPress.bind(this)
    this._getRandomPicFromCollections = this._getRandomPicFromCollections.bind(this)
    this._generateFourButtons = this._generateFourButtons.bind(this)
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
      playingTrue = <Text>PLAYING TRUE</Text>

      const buttonDates = []
      while (buttonDates.length < 4) {
        buttonDates.push(this.state.datesArr[this._assignRandomDateButton()])
      }

      dateButtons = 
      <View>
      {
        buttonDates.map(buttonDate => {
          return (
            <Button 
            key={buttonDate}
            onPress={() => {Alert.alert('incorrect guess!');}}
            title={buttonDate}
          />
          )
        })
      }
      
      
      </View>



    }


    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>

          </View>
          <Header
            leftComponent={{ icon: 'menu', color: '#fff' }}
            centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
            rightComponent={{ icon: 'home', color: '#fff' }}
          />


          <View style={styles.mainPictureContainer} key={this.state.mainPicture.pk}>
            <Text>TITLE: {this.state.mainPicture.title}</Text>
            <TouchableHighlight onPress={() => {Alert.alert('Touchable Highlight!');}}>
              <Image
                style={{ width: 300, height: 400 }}
                source={{ uri: 'http:' + `${this.state.mainPicture.image.full}` }}
              />
            </TouchableHighlight>

            <Button 
              margin={30}
              paddingVertical={50}
              onPress={() => {this._getRandomPicFromCollections()}}
              title="get random pic"

            />
            <Button
              raised
              backgroundColor="green"
              borderRadius={7}
              containerViewStyle={{borderRadius:7}}
              onPress={() => {this._handleCorrectGuess()}}
              title={this.state.mainPicture.created_published_date}
            />

            <Button style={styles.buttonStyle}
              onPress={() => {Alert.alert('incorrect guess!');}}
              title={this.state.datesArr[this._assignRandomDateButton()]}
            />
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.navBar}>SCORE: {this.state.score} </Text>
            <Button
              raised
              backgroundColor="green"
              borderRadius={25}
              containerViewStyle={{borderRadius:25}}
              onPress={() => {this._handleScorePress()}}
              title="SCORE"
            />


            {playingTrue}
            {dateButtons}

            <TextInput
              style={{ height: 80 }}
              placeholder="Put in a search term!"
              onChangeText={(text) => this.setState({ text })}
            />

            <Button
              raised
              color="green"
              onPress={() => {this._handleSearchPress()}}
              title="SEARCH"
            />


            {
              this.state.picturesTest.map(picture => {
                return (
                  <View key={picture.pk}>
                    <Text>{picture.title}</Text>
                    <TouchableHighlight onPress={() => {
                      Alert.alert('Touchable Highlight!');
                    }}>
                      <Image
                        style={{ width: 300, height: 400 }}
                        source={{ uri: 'http:' + `${picture.image.full}` }}
                      />
                    </TouchableHighlight>
                    <Button
                      onPress={() => {Alert.alert('Correct!');}}
                      title={picture.created_published_date}
                    />
                    <Button
                      onPress={() => {Alert.alert('Wrong!');}}
                      title="Wrong"
                    />

                    <Button
                      onPress={() => {Alert.alert('Wrong!');}}
                      title="Wrong"
                    />

                  </View>
                )
              })
            }

            {
              this.state.pictures.map(picture => {
                return (
                  <Image
                    key={picture.pk}
                    style={{ width: 300, height: 400 }}
                    source={{ uri: 'http:' + `${picture.image.full}` }}
                  />
                )
              })
            }

            <Image
              style={{ width: 150, height: 300 }}
              source={{ uri: 'http://cdn.loc.gov/service/pnp/cph/3b40000/3b48000/3b48800/3b48886r.jpg' }}
            />

            <Button
              onPress={() => { Alert.alert('Correct!'); }}
              title="Correct"
            />

            <Button
              onPress={() => { Alert.alert('Wrong!'); }}
              title="Wrong"
            />
          </View>
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

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

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
    this.setState({ score: this.state.score + 1 })
    // need to call another function to re-render
  }

  _handleIncorrectGuess = () => {
    Alert.alert('handleIncorrectGuess!');
    // need to call another function to re-render
  }

  _handleGuessPress = () => {
    Alert.alert('You guessed!');
    fetch('http://loc.gov/pictures/search/?q=cheese&co=wpapos&fo=json')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ mainPicture: responseJson.results[0] })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _generateFourButtons = () => {
    const buttonDates = []


    return buttonDates.map(buttonDate => {
      <Button 
        onPress={() => {Alert.alert('incorrect guess!');}}
        title={this.state.datesArr[this._assignRandomDateButton()]}
      />
    })
  }


  _setViewingPic = (picArray) => {
    const random = Math.floor(Math.random() * (9 - 0)) + 0
    let currentPic = picArray[random]
    return currentPic

  }


_getRandomPicFromCollections = () => {
  const collectionsArr = [
    'bbc', 'wpapos', 'pga', 'pos', 'var', 'civwar', 'yan', 'stereo', 'app'
  ]
  let collectionIndex = Math.floor(Math.random() * (9 - 0)) + 0
  fetch('https://loc.gov/pictures/search/?co=' + `${collectionsArr[collectionIndex]}` + '&fo=json')
  .then((response) => {
    return response.json()
  })
  .then(responseJson => {
    let results = responseJson.results
    let random = Math.floor(Math.random() * (9 - 0)) + 0
    let finalPic = results[random]
    this.setState({
      mainPicture: finalPic,
      playing: true
    })
  })
  .catch((error) => {
    console.error(error);
  })  
}



  _getRandomNum = () => {
    return Math.floor(Math.random() * (200 - 0)) + 0
  }

  _assignRandomDateButton = () => {
    return Math.floor(Math.random() * (10 - 0)) + 0
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
          if (results[random] !== undefined && !randomizedArray.includes(results[random])) {
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
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  buttonStyle: {
    backgroundColor: "green",
    borderRadius: 25,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
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
  mainPictureContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    backgroundColor: 'rgba(0,0,0,0.05)'
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
});
