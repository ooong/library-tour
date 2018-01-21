import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, Button, View, TouchableHighlight, Image, Alert } from 'react-native';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Browse',
  };

  constructor(props) {
    super(props);
    this.state = {
      pictures: [],
      text: '',
      picture: {
        title: 'testing title',
        pk: 3,
        image: {
          full: "//www.loc.gov/pictures/cdn/service/pnp/highsm/35800/35859r.jpg"
        }
      }
    }
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
    return (
      <ScrollView style={styles.container}>


        <View style={styles.getStartedContainer}>

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
          this.state.pictures.map(picture => {
            return (
              <View key={picture.pk}>
                <Text>{picture.title}</Text>
                <TouchableHighlight onPress={() => {
                  this._getRandomPicFromCollections()
                }}>
                  <Image
                    style={{ width: 300, height: 400 }}
                    source={{ uri: 'http:' + `${picture.image.full}` }}
                  />
                  
                </TouchableHighlight>
                <Text>{picture.created_published_date}</Text>
              </View>
            )
          })
        }

      </View>
      </ScrollView>
    );
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
        this.setState({ pictures: randomizedArray })
      })
      .catch((error) => {
        console.error(error);
      });
    Alert.alert('pressed!')
  }

  _getRandomPicFromCollections = (gameResult) => {
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
      this.setState({picture: finalPic})
    })
    .catch((error) => {
      console.error(error);
    })  
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


const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
