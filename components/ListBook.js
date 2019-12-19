import React from 'react';
import { FlatList, ActivityIndicator, Text, View,StyleSheet,Image,TextInput,Button,TouchableWithoutFeedback } from 'react-native';
import ActionButton from 'react-native-action-button';
import * as SQLite from 'expo-sqlite';
import Icon from 'react-native-vector-icons/Ionicons';
const db = SQLite.openDatabase("bookshop.db"); 
export default class ListBook extends React.Component {
  state = {
    qty : '',
    title : '',
    subtitle : '',
    isbn13 : '',
    price : '',
    datebuy : ''

  } 

  static navigationOptions = {
    title: 'List Books'
  };

  constructor(props) {
    super(props);
    this.state = { isLoading: true }
  }

  //yyyy-mm-dd
  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

  buy = (item) => {
    var qty =  parseFloat(this.state.qty);
    //alert(qty);
    var price = 1000;
    //alert(price);
    var subtotal = qty * price;
    //alert(subtotal); //?? TODO berapa?
    
    db.transaction(
      tx => { 
        tx.executeSql("insert into troli (title, subtitle,isbn13,price,qty,datebuy,subtotal) values (?,?,?,?,?,?,?)",
         [item.title,item.subtitle,item.isbn13,price,qty,this.formatDate(new Date())],subtotal);
      },
      error => {
        alert(error);  
      },
      () => {  
        this.setState({
          qty : '',
          title : '',
          subtitle : '',
          isbn13 : '',
          price : '',
          datebuy : ''
        });  
        alert('berhasil dimasukkan ke troli');
      }
    );
  }

  componentDidMount() {
    return fetch('https://api.itbook.store/1.0/new')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.books,
        }, function () {

        });

      })
      .catch((error) => {
        console.error(error);
      });
  }

  flatListItemSeparator = () => {
    return (
      <View
        style={{
          height: .5,
          width: "100%",
          backgroundColor: "#000",
        }}
      />
    );
  }

  render() {

    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      )
    }

    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <FlatList
          ItemSeparatorComponent = {this.flatListItemSeparator}
          data={this.state.dataSource}
          renderItem={({item, index}) =>{
            return (
              <View style={{flex:1, flexDirection: 'row'}}>
              <Image source = {{ uri: item.image }} style={styles.imageView} />
              <View style={{flex:1,marginRight:20}}>
              <Text style={{fontWeight:'bold'}}>{item.title}</Text>
              <Text>{item.subtitle}</Text>
              <View style={styles.containerButtonGroup}>
              <View style={styles.buttonContainer}>
                <TextInput 
                  onChangeText={(qty) => this.setState({ qty })}
                keyboardType='number-pad' placeholder='qty' style={styles.inputStyle}/>
              </View>
              <View style={styles.buttonContainer}>
                {/* () => means callback */}
                  <Button  
                  onPress={() => this.buy(item,index)}
                  title="buy"/>
              </View>
            </View>
              </View>
            </View>
            );
          }} 
          keyExtractor={({ isbn13 }, index) => isbn13}
        />
          <ActionButton 
          renderIcon={active => active ? (<Icon name="ios-basket" style={styles.actionButtonIcon} /> ) : (<Icon name="ios-basket" style={styles.actionButtonIcon} />)}
    buttonColor="rgba(231,76,60,1)"
    onPress={() => this.props.navigation.navigate('TroliScreen')
}/>
        
      </View>
    );
  }
}
const styles = StyleSheet.create({
 
  MainContainer :{
   
      justifyContent: 'center',
      flex:1,
      margin: 5,
      marginTop: (Platform.OS === 'ios') ? 20 : 0,
   
  },
   
  imageView: {
   
      width: '50%',
      height: 100 ,
      margin: 7,
      borderRadius : 7
   
  },
   
  textView: {
   
      width:'50%', 
      textAlignVertical:'center',
      padding:10,
      color: '#000'
   
  },
  containerButtonGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
},
  buttonContainer: {
    flex: 1,
},
inputStyle : {
  height:30,
  borderColor:'blue',
  borderWidth:1,
  marginRight:6,
  textAlign:'center'
}
   
  });