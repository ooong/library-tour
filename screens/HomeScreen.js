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
      movies: [],
      movie: '',
      total: 0,
      pictures: [],
      text: 'placeholder',
      picturesTest: [],
      mainPicture: {}, 
      score: 0
    }
  }

  // getPicsFromLOCApi() {
  //   return fetch('http://loc.gov/pictures/search/?q=panda&co=wpapos&fo=json')
  //     .then((response) => {
  //       response.json()
  //     .then((results) => {
  //       const finalResults = results.results
  //       this.setState({
  //         pictures: finalResults
  //       })
  //       return results.results
  //     })
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  componentDidMount() {
    const pictures = getPicsFromLOCApi()
      .then(res => {
        this.setState({
          pictures: res
        })
      })
    const movies = getMoviesFromApiAsync()
      .then(res => {
        this.setState({
          movies: res
        })
      })
  }


  render() {

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
          <View style={styles.getStartedContainer}>
            <Text style={styles.navBar}>CATEGORY</Text>
            <Text style={styles.navBar}>SCORE: {this.state.score} </Text>
            <Button
              raised
              color="green"
              onPress={() => {
                this._handleScorePress()
              }}
              title="SCORE"
            />


            <TextInput
              style={{ height: 80 }}
              placeholder="Type here to translate!"
              onChangeText={(text) => this.setState({ text })}
            />

            <Button
              raised
              color="green"
              onPress={() => {
                this._handleSearchPress()
              }}
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
                      onPress={() => {
                        Alert.alert('Correct!');
                      }}
                      title={picture.created_published_date}
                    />
                    <Button
                      onPress={() => {
                        Alert.alert('Wrong!');
                      }}
                      title="Wrong"
                    />
                    
                    <Button
                      onPress={() => {
                        Alert.alert('Wrong!');
                      }}
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


            <Text style={styles.getStartedText}>{this.state.movie}</Text>
            <Text style={styles.getStartedText}>{this.state.title}</Text>



            <Image
              style={{ width: 150, height: 300 }}
              source={{ uri: 'http://cdn.loc.gov/service/pnp/cph/3b40000/3b48000/3b48800/3b48886r.jpg' }}
            />

            <Button
              onPress={() => {
                Alert.alert('Correct!');
              }}
              title="Correct"
            />

            <Button
              onPress={() => {
                Alert.alert('Wrong!');
              }}
              title="Wrong"
            />


          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
            </TouchableOpacity>
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
    this.setState({score: this.state.score + 1})
  }


  _setViewingPic = (picArray) => {
  const random = Math.floor(Math.random() * (9-0)) + 0
  let currentPic = picArray[random]
  console.log('CURRENTPIC', currentPic)
  return currentPic
  
}

_getRandomNum = () => {
  return Math.floor(Math.random() * (200-0)) + 0
}

  _handleSearchPress = () => {
    fetch('https://loc.gov/pictures/search/?q=' + `${this.state.text}` + '&fo=json')
      .then((response) => {
        return response.json()
      })
      .then(resResults => {
        const results = resResults.results
        const randomArr = []
        const getRandomNum = () => {
          return Math.floor(Math.random() * (200-0)) + 0
        }
        while (randomArr.length < 10) {
          randomArr.push(getRandomNum())
        }
        console.log('randoARRAY', randomArr)
        const tenPics = randomArr.map(index => {
          return results[index]
        })

        var newArray = [];
        while (newArray.length < 10) {
          let random = Math.floor( Math.random() * 500 )
          if (results[random] !== undefined) {
            newArray.push(results[random]);
          }
        
        }
        console.log('newArray!!', newArray)

        this.setState({
          picturesTest: newArray,
          text: ''
        })
      })
      .catch((error) => {
        console.error(error);
      });
    Alert.alert('pressed!')
  }
}

function getMoviesFromApiAsync() {
  return fetch('https://facebook.github.io/react-native/movies.json')
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.movies;
    })
    .catch((error) => {
      console.error(error);
    });
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



// function getPicsFromLOCApi() {
//   return fetch('http://loc.gov/pictures/search/?q=panda&co=wpapos&fo=json')
//     .then((response) => {
//       response.json()
//     .then((results) => {
//       console.log('RESULTS.results', results.results)
//       const finalResults = results.results
//       this.setState({
//         pictures: finalResults
//       })
//       return results.results
//     })
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }


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
