/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, AsyncStorage, StyleSheet, Text, View, TextInput, Dimensions, FlatList, Alert } from 'react-native';
import { MyButton, Item, Header, Title, Description } from './src/components/main';
// import Icon from 'react-native-vector-icons/FontAwesome';

const { height, width } = Dimensions.get('window');

export default class App extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    title: '',
    description: '',
    items: []
  }

  componentWillMount = () => {
    this.loadItems();
  };

  //Read TodoList from LocalStorage
  loadItems = async () => {
    try {
      let toDoList = await AsyncStorage.getItem('toDoList');
      if (toDoList !== null) {
        toDoList = JSON.parse(toDoList);
        this.setState({ items: toDoList })
      }
    } catch (error) {
      console.warn(error);
    }
  }

  // Store TodoList to LocalStorage
  saveList = async (itemList) => {
    try {
      await AsyncStorage.setItem('toDoList', JSON.stringify(itemList));
    } catch (error) {
      console.warn(error)
    }
  }

  //Add Todo to array
  addItem = async () => {
    if (this.state.title !== '' && this.state.description !== '' && Array.isArray(this.state.items)) {
      toDo = {
        title: this.state.title,
        description: this.state.description
      };

      items = [...this.state.items, toDo];
      this.setState({ title: '', description: '', items });
      this.saveList(items);
    } else {
      Alert.alert('Warning', 'You must fill in the blanks.', [{ text: 'OK' }])
    }
  }

  //Delete All TodoList's Items
  deleteAllItem = () => {
    Alert.alert(
      'Warning',
      'Do you really want to delete all todos?',
      [
        {
          text: 'OK', onPress: () => {
            AsyncStorage.clear();
            this.setState({ title: '', description: '', items: [] });
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ],
      { cancelable: false }
    );
  }

  //Delete Todo
  deleteItem = () => {

  }

  //Update Todo
  editItem = () => {

  }

  renderItem = ({ item }) => (
    <Item title={item.title} description={item.description} onClickDelete={this.deleteItem} onClickEdit={this.editItem} />
  );


  render() {
    let { title, description } = this.state;
    return (
      <View style={styles.container}>

        <Header/>

        <Title value={title} onChangeText={(title) => this.setState({ title })} maxLength={34} placeholder='Başlık giriniz'/>

        <Description value={description} onChangeText={(description) => this.setState({ description })} placeholder='Açıklama giriniz' maxLength={76} multiline={true} numberOfLines={5} />

        <View style={{ height: height * 0.17, backgroundColor: '#34495e', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          <MyButton onClick={this.addItem} text={'ADD'}></MyButton>
          <MyButton onClick={this.deleteAllItem} text={'DELETE ALL'}></MyButton>
        </View>

        <View style={{ borderBottomColor: '#e74c3c', borderBottomWidth: 1 }}></View>

        <View style={{ flex: 1, backgroundColor: '#34495e' }}>
          <FlatList
            data={this.state.items}
            keyExtractor={(item, index) => item.description + index.toString()}
            renderItem={this.renderItem}
          />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center'
  }

});