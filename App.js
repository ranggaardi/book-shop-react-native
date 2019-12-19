import React, { Component } from 'react';
//1. Impor ini
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
 
import Troli from './components/Troli';
import ListBook from './components/ListBook';
import * as SQLite from 'expo-sqlite';

//2. Buat Navigator
const AppNavigator = createStackNavigator(
 {
 TroliScreen: {
   screen: Troli,
 },
ListScreen: {
    screen: ListBook,
  },
},{
 initialRouteName : 'ListScreen',
 defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }
 
}); 
 
//3.Create App Container
const AppContainer = createAppContainer(AppNavigator);
const db = SQLite.openDatabase("bookshop.db"); 
export default class App extends Component {

  componentDidMount() {
    // title,subtitle,isbn13,price,image,url
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists troli (id INTEGER primary key not null, title TEXT, subtitle TEXT,isbn13 TEXT,price REAL,qty INTEGER,datebuy TEXT,subtotal REAL);"
      );
    });
  }

 render() {
   return (
     <AppContainer />
   );
 }
}
