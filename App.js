/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, AsyncStorage, StyleSheet, Text, View, TextInput, Dimensions, FlatList, Alert } from 'react-native';
import { MyButton, Item, Header, Title, Description, TodoList, AddTodo } from './src/components/main';
import { Router, Scene } from 'react-native-router-flux';
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
  saveList = async (items) => {
    try {
      await AsyncStorage.setItem('toDoList', JSON.stringify(items));
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
  deleteItem = async (index) => {
    try {
      let array = [...this.state.items]; // Copy of the array
      array.splice(index, 1);
      this.saveList(array);
      this.setState({ items: array });
    } catch (error) {
      console.log(error);
    }
  }

  //Update Todo

  editItem = (index) => {
    this.setState({
      title: this.state.items[index].title,
      description: this.state.items[index].description
    })
  }

  saveItem = async (index) => {
    let array = [...this.state.items];
    array[index] = { title: this.state.title, description: this.state.description };
    this.saveList(array);
    this.setState({ items: array });

  }

  onChangeText = (text) => this.setState({ text })}
  // deleteUserId = async () => {
  //   try {
  //     await AsyncStorage.removeItem('userId');
  //   } catch (error) {
  //     // Error retrieving data
  //     console.log(error.message);
  //   }
  // }

  renderItem = ({ item }) => (
    <Item index={this.state.items.indexOf(item)} title={item.title} description={item.description} onClickDelete={this.deleteItem} onClickEdit={this.editItem} onClickSave={this.saveItem} />
  );

  render() {
    let { title, description } = this.state;
    return (
      <Router style={styles.container}>
        <Stack key="root">
          <Scene key="home" title="TodoList" component={TodoList} />

          <Scene key="add" title="AddTodo" component={AddTodo} />

          {/* <Header /> */}
          {/* <View style={{ borderBottomColor: '#e74c3c', borderBottomWidth: 1 }}></View> */}
        </Stack>
      </Router>
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
