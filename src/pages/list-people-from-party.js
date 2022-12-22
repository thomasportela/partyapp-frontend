import React, {useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {blackOwned, redOwned, greenOwned} from '../helper/helper';
import showProfilePicture from '../helper/helperDefaults';
import {
  getBuyers,
  acceptUserInParty,
  removeUserFromParty,
} from '../services/purchases';
import {useAuth} from '../contexts/authContext';

export default function ListPeopleFromPartyScreen({route, navigation}) {
  const {pid, inside} = route.params;
  const {user, doService} = useAuth();
  const [people, setPeople] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false)
  const [userAlreadyInOrOut, setUserAlreadyInOrOut] = useState('')

  async function refreshBuyers(){
    try{
      const response = await doService(() => getBuyers(pid, inside));
      setPeople(response.data.people);
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    refreshBuyers();
  }, []);

  async function handleAction(uid, name){
    try{
      const response = inside ? await doService(() => removeUserFromParty(pid, uid)) : await doService(() => acceptUserInParty(pid, uid))
      console.log(response)
      if(response.status === 201){
        Toast.show({
          type: `${inside ? 'error' : 'success'}`,
          position: 'bottom',
          text1: `${inside ? 'Saída' : 'Entrada'}`,
          text2: `${name} ${inside ? 'saiu da' : 'entrou na'} festa`
        });
        refreshBuyers()
      }
      if(response.status === 400){
        setUserAlreadyInOrOut(name)
        setModalVisible(true)
        refreshBuyers()
      }
    }catch(err){
      console.log(err)
    }

  }

  const ActionButton = (props) => {
    if (inside) {
      return (
        <TouchableOpacity
          onPress={() => handleAction(props.uid, props.name)}
          style={{...styles.actionButton, backgroundColor: redOwned}}>
          <Icon name="door-closed" color={'black'} size={30} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => handleAction(props.uid, props.name)}
          style={{...styles.actionButton, backgroundColor: greenOwned}}>
          <Icon name="door-open" color={'black'} size={30} />
        </TouchableOpacity>
      );
    }
  };

  var filteredPeople = people.filter(function (user) {
    return user.name.toLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1;
  });

  const renderPeople = ({item}) => (
    <View style={styles.peopleContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile', {_user: item})}
        style={styles.profilePictureContainer}>
        {showProfilePicture(item, styles.profilePicture)}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile', {_user: item})}
        style={styles.nameContainer}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.cpfText}>{item.cpf}</Text>
      </TouchableOpacity>
      <View style={styles.actionContainer}>
        <ActionButton uid={item.uid} name={item.name} />
      </View>
    </View>
  );

  const PeoplesList = () => {
    if (people.length === 0) {
      return <Text style={styles.noPeopleText}>Ninguém aqui ainda</Text>;
    } else {
      return (
        <FlatList
          contentContainerStyle={styles.list}
          data={filteredPeople}
          keyExtractor={(item) => item.uid.toString()}
          renderItem={renderPeople}
        />
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalCenterContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.modalTextContainer}>
              <Text style={styles.modalText}>{userAlreadyInOrOut} já está {inside ? 'fora' : 'dentro'} da festa</Text>
            </View>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={{...styles.modalButton, borderRightWidth: 1}}
              >
                <Text style={styles.modalTextButton}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Filtre os compradores aqui"
          placeholderTextColor="grey"
          onChangeText={(text) => setSearchText(text)}
          defaultValue={searchText}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="magnify" color={redOwned} size={25} />
        </TouchableOpacity>
      </View>
      <PeoplesList />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: blackOwned,
  },
  searchContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: redOwned
  },
  searchInput: {
    paddingLeft: 10,
    width: '85%',
    height: 40,
    color: 'white',
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
    width: '15%',
    height: 40,
  },
  list: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  peopleContainer: {
    width: '97%',
    height: 60,
    flexDirection: 'row',
  },
  profilePictureContainer: {
    width: 60,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    borderRadius: 50,
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    color: 'white',
    marginLeft: 10,
  },
  cpfText: {
    color: 'grey',
    marginLeft: 10,
    fontSize: 13,
  },
  noPeopleText: {
    color: 'grey',
    marginTop: 20,
    alignSelf: 'center',
  },
  actionContainer: {
    width: '20%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    width: '80%',
    height: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(62, 157, 77)',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 4,
  },
  modalCenterContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'black',
    width: 300,
    height: 120,
    borderWidth: 1,
    borderColor: redOwned,
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: redOwned,
    width: '100%',
    height: 80,
  },
  modalText: {
    padding: 10,
    textAlign: 'center',
    color: 'white',
    fontSize: 17,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    height: 38,
  },
  modalButton: {
    height: '100%',
    width: '100%',
    borderColor: redOwned,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTextButton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
