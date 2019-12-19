import React, { Component } from 'react';
import { View, Text,Button,StyleSheet,SafeAreaView,FlatList,TouchableOpacity } from 'react-native';
import ActionButton from 'react-native-action-button';
import Constants from "expo-constants";
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("bookshop.db");

export class Troli extends Component {
  
    state = {
        todo : [] 
    }  
    static navigationOptions = {
        title: 'Troli',
      };

      constructor(){
          super();
        db.transaction(tx => {
            tx.executeSql(
              'select * from troli',
              null,
              (_, { rows: { _array } }) => {
                //alert(JSON.stringify(_array));
                this.setState({ todo: _array })
              }
            );
          },
          error => {
            //ada error
            alert(error);
          },
          () => {  
            //sukses (tidak ada error)
          });
    }

 
 render() {
    const { navigation } = this.props; 
    var total=0;
   return (
     
    <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
        <SafeAreaView style={styles.container}>
        <FlatList
             data={this.state.todo}
             renderItem={({item}) =>{
               let subtotal = item.price * item.qty;
               total += subtotal;
               return (
                 <View>
             <Text style={{fontSize:20}}>Title = {item.title}</Text>
             <Text style={{fontSize:20}}>Price = {item.price}</Text>
             <Text style={{fontSize:20}}>Qty = {item.qty}</Text>
             <Text style={{fontSize:20}}>Subtotal = {subtotal}</Text>
             <Text>---------------------------------------------------------------------------</Text>
             </View>
               );
             }} 
             keyExtractor={item => item.done}
             ListFooterComponent = {() => {
               return(
               <Text style={{fontSize:30,textAlign:'right'}}>Total = {total}</Text>
               );
             }}/>

    </SafeAreaView>
  </View>
   )
 }
}
 
export default Troli
const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: Constants.statusBarHeight,
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
  });