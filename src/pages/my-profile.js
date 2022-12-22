import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  LogBox,
  Linking,
} from 'react-native';
import {useAuth} from '../contexts/authContext';
import {useCreateParty} from '../contexts/createPartyContext';
import ImagePicker from 'react-native-image-crop-picker';
import {redOwned, blackOwned} from '../helper/helper';
import {
  uploadProfilePicture,
  updateUserInfo,
  getUserTickets,
} from '../services/userServices';
import {getUserParties} from '../services/getPartiesData';
import AsyncStorage from '@react-native-community/async-storage';
import {showPartyBanner} from '../helper/helperDefaults';
import QRCode from 'react-native-qrcode-svg';

export default function MyProfileScreen({navigation, route}) {
  const {user, updateProfilePicture, doService} = useAuth();
  const {startCreatingParty, setPartyCreated} = useCreateParty();
  const [modalPPVisible, setModalPPVisible] = useState(false);
  const [modalSocialVisible, setModalSocialVisible] = useState(false);
  const [modalTicketVisible, setModalTicketVisible] = useState(false);
  const [localProfilePicture, setLocalProfilePicture] = useState('');
  const [userParties, setUserParties] = useState([]);
  const [instagram, setInstagram] = useState(user.instagram ? user.instagram : '');
  const [twitter, setTwitter] = useState(user.twitter ? user.twitter : '');
  const [tiktok, setTiktok] = useState(user.tiktok ? user.tiktok : '');
  const [youtube, setYoutube] = useState(user.youtube ? user.youtube : '');
  const [socialToChange, setSocialToChange] = useState('');
  const [modalSocialMessage, setModalSocialMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [partyTicket, setPartyTicket] = useState({})

  async function componentDidMount() {
    const response = await doService(() => getUserParties(user.uid));
    const response2 = await doService(() => getUserTickets());
    setUserParties(response);
    setTickets(response2.data);
  }

  useEffect(() => {
    LogBox.ignoreLogs([
      'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
    ]);
    setPartyCreated(false);
    componentDidMount();
  }, []);

  function refreshParties() {
    componentDidMount();
  }

  function changeInstagram(text) {
    if (text === '' && text !== instagram) {
      setModalSocialMessage(`Deseja remover seu Instagram?`);
      setSocialToChange(`instagram ${text}`);
      setModalSocialVisible(true);
    } else if (text !== instagram) {
      setModalSocialMessage(`Deseja alterar seu Instagram para ${text}?`);
      setSocialToChange(`instagram ${text}`);
      setModalSocialVisible(true);
    }
  }

  function changeTwitter(text) {
    if (text === '' && text !== twitter) {
      setModalSocialMessage(`Deseja remover seu Twitter?`);
      setSocialToChange(`twitter ${text}`);
      setModalSocialVisible(true);
    } else if (text !== twitter) {
      setModalSocialMessage(`Deseja alterar seu Twitter para ${text}?`);
      setSocialToChange(`twitter ${text}`);
      setModalSocialVisible(true);
    }
  }

  function changeTiktok(text) {
    if (text === '' && text !== youtube) {
      setModalSocialMessage(`Deseja remover seu Tiktok?`);
      setSocialToChange(`tiktok ${text}`);
      setModalSocialVisible(true);
    } else if (text !== tiktok) {
      setModalSocialMessage(`Deseja alterar seu Tiktok para ${text}?`);
      setSocialToChange(`tiktok ${text}`);
      setModalSocialVisible(true);
    }
  }

  function changeYoutube(text) {
    if (text === '' && text !== youtube) {
      setModalSocialMessage(`Deseja remover seu Youtube?`);
      setSocialToChange(`youtube ${text}`);
      setModalSocialVisible(true);
    } else if (text !== youtube) {
      setModalSocialMessage(`Deseja alterar seu Youtube para ${text}?`);
      setSocialToChange(`youtube ${text}`);
      setModalSocialVisible(true);
    }
  }

  async function changeSocials() {
    var changes = {};
    socialToChange.split(' ')[0] === 'instagram'
      ? (changes = {instagram: socialToChange.split(' ')[1]})
      : null;
    socialToChange.split(' ')[0] === 'twitter'
      ? (changes = {twitter: socialToChange.split(' ')[1]})
      : null;
    socialToChange.split(' ')[0] === 'tiktok'
      ? (changes = {tiktok: socialToChange.split(' ')[1]})
      : null;
    socialToChange.split(' ')[0] === 'youtube'
      ? (changes = {youtube: socialToChange.split(' ')[1]})
      : null;
    const response = await doService(() => updateUserInfo(changes));
    if (response === 201) {
      socialToChange.split(' ')[0] === 'instagram'
        ? (setInstagram(changes.instagram),
          await AsyncStorage.setItem(
            '@PartyApp:user',
            JSON.stringify({
              ...user,
              instagram: changes.instagram,
              twitter,
              tiktok,
              youtube,
            }),
          ))
        : null;
      socialToChange.split(' ')[0] === 'twitter'
        ? (setTwitter(changes.twitter),
          await AsyncStorage.setItem(
            '@PartyApp:user',
            JSON.stringify({
              ...user,
              twitter: changes.twitter,
              instagram,
              tiktok,
              youtube,
            }),
          ))
        : null;
      socialToChange.split(' ')[0] === 'tiktok'
        ? (setTiktok(changes.tiktok),
          await AsyncStorage.setItem(
            '@PartyApp:user',
            JSON.stringify({
              ...user,
              tiktok: changes.tiktok,
              instagram,
              twitter,
              youtube,
            }),
          ))
        : null;
      socialToChange.split(' ')[0] === 'youtube'
        ? (setYoutube(changes.youtube),
          await AsyncStorage.setItem(
            '@PartyApp:user',
            JSON.stringify({
              ...user,
              youtube: changes.youtube,
              instagram,
              tiktok,
              twitter,
            }),
          ))
        : null;
    }
  }

  const ProfilePicture = () => {
    if (user.url === null || user.url === undefined) {
      if (localProfilePicture.length === 0) {
        return (
          <Image
            style={styles.profilePicture}
            source={require('../Images/Defaults/defaultProfilePicture.png')}
          />
        );
      } else {
        return (
          <Image
            style={styles.profilePicture}
            source={{uri: localProfilePicture}}
          />
        );
      }
    } else {
      return <Image style={styles.profilePicture} source={{uri: user.url}} />;
    }
  };

  const openCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 140,
        height: 140,
        cropping: true,
      });
      const data = new FormData();
      const profileImage = {
        height: image.height,
        width: image.width,
        size: image.size,
        type: image.mime,
        uri: image.path,
        name: `user${user.uid}profilepicture.${image.mime.split('/')[1]}`,
      };
      data.append('file', profileImage);
      const response = await doService(() => uploadProfilePicture(data));
      if(response.status === 201){
        setLocalProfilePicture(image.path);
        setModalPPVisible(false);
        updateProfilePicture();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const openGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 140,
        height: 140,
        cropping: true,
      });
      const data = new FormData();
      const profileImage = {
        height: image.height,
        width: image.width,
        size: image.size,
        type: image.mime,
        uri: image.path,
        name: `user${user.uid}profilepicture.${image.mime.split('/')[1]}`,
      };
      console.log(image);
      data.append('file', profileImage);
      await doService(() => uploadProfilePicture(data));
      if(response.status === 201){
        setLocalProfilePicture(image.path);
        setModalPPVisible(false);
        updateProfilePicture();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const Socials = () => {
    return (
      <View style={styles.socialContainer}>
        <View style={styles.socialHalf}>
          <View style={styles.socialButton}>
            <Image source={require('../Images/Icons/instagram.png')} />
            <TextInput
              autoCapitalize="none"
              defaultValue={instagram}
              placeholder="instagram"
              placeholderTextColor="grey"
              onEndEditing={(e) => changeInstagram(e.nativeEvent.text)}
              style={styles.socialText}
              maxLength={20}
            />
          </View>
          <View style={styles.socialButton}>
            <Image source={require('../Images/Icons/tiktok.png')} />
            <TextInput
              autoCapitalize="none"
              defaultValue={tiktok}
              placeholder="tiktok"
              placeholderTextColor="grey"
              onEndEditing={(e) => changeTiktok(e.nativeEvent.text)}
              style={styles.socialText}
              maxLength={20}
            />
          </View>
        </View>
        <View style={styles.socialHalf}>
          <View style={styles.socialButton}>
            <Image source={require('../Images/Icons/twitter.png')} />
            <TextInput
              autoCapitalize="none"
              defaultValue={twitter}
              placeholder="twitter"
              placeholderTextColor="grey"
              onEndEditing={(e) => changeTwitter(e.nativeEvent.text)}
              style={styles.socialText}
              maxLength={20}
            />
          </View>
          <View style={styles.socialButton}>
            <Image source={require('../Images/Icons/youtube.png')} />
            <TextInput
              autoCapitalize="none"
              defaultValue={youtube}
              placeholder="youtube"
              placeholderTextColor="grey"
              onEndEditing={(e) => changeYoutube(e.nativeEvent.text)}
              style={styles.socialText}
              maxLength={20}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({item}) => (
    <View style={styles.partyContainer}>
      <TouchableOpacity
        onPress={
          () =>
            navigation.navigate('ManageParty', {party: item, refreshParties})
          // navigation.navigate('ManageParty', {party: item})
        }
        style={styles.partyButtonImg}>
        {showPartyBanner(item, styles.partyBanner)}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            'ManageParty',
            {party: item, refreshParties},
            // navigation.navigate('ManageParty', {party: item}
          )
        }
        style={styles.partyButtonTitle}>
        <Text style={styles.partyTitleText}>{item.name.toUpperCase()}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTickets = ({item}) => (
    <View style={styles.partyContainer}>
      <TouchableOpacity
        onPress={() => {
          setPartyTicket(item)
          setModalTicketVisible(true)
          console.log(item)
        }}
        style={styles.ticketButton}>
        <Text style={styles.ticketText}>{item.name.toUpperCase()}</Text>
      </TouchableOpacity>
    </View>
  );

  const Tickets = () => {
    if (tickets.length === 0) {
      return (
        <Text style={styles.nonePurchasesText}>
          Você não tem ingressos no momento
        </Text>
      );
    } else {
      return (
        <FlatList
          contentContainerStyle={styles.partiesList}
          numColumns={1}
          data={tickets}
          keyExtractor={(item) => item.pid.toString()}
          renderItem={renderTickets}
          scrollEnabled={false}
        />
      );
    }
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPPVisible}
        onRequestClose={() => {
          setModalPPVisible(false);
        }}>
        <View style={styles.modalCenterContainer}>
          <View style={styles.modalPPContainer}>
            <View style={styles.modalPPButtonsContainer}>
              <TouchableOpacity
                onPress={openCamera}
                style={styles.modalPPButton}>
                <Text style={styles.modalPPButtonText}>CÂMERA</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalPPButtonsContainer}>
              <TouchableOpacity
                onPress={openGallery}
                style={styles.modalPPButton}>
                <Text style={styles.modalPPButtonText}>GALERIA</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalPPButtonsContainer}>
              <TouchableOpacity
                onPress={() => setModalPPVisible(false)}
                style={styles.modalPPButton}>
                <Text style={styles.modalPPButtonText}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalSocialVisible}
        onRequestClose={() => setModalSocialVisible(false)}>
        <View
          style={{...styles.modalCenterContainer, justifyContent: 'center'}}>
          <View style={styles.modalSocialContainer}>
            <View style={styles.modalSocialTextContainer}>
              <Text style={styles.modalSocialText}>{modalSocialMessage}</Text>
            </View>
            <View style={styles.modalSocialButtonsContainer}>
              <TouchableOpacity
                onPress={() => setModalSocialVisible(false)}
                style={{...styles.modalSocialButton, borderRightWidth: 1}}>
                <Text style={styles.modalSocialTextButton}>NÃO</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  changeSocials();
                  setModalSocialVisible(false);
                }}
                style={styles.modalSocialButton}>
                <Text style={styles.modalSocialTextButton}>SIM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalTicketVisible}
        onRequestClose={() => setModalTicketVisible(false)}>
        <View
          style={{...styles.modalCenterContainer, justifyContent: 'center'}}>
          <View style={styles.modalTicketContainer}>
            <View style={styles.modalTicketPartyTitleContainer}>
              <Text style={styles.modalTicketPartyTitle}>{partyTicket.name ? partyTicket.name.toUpperCase() : null}</Text>
            </View>
            <View style={styles.modalTicketQRCodeContainer}>
              <View style={styles.modalTicketQRCode}>
                <QRCode
                  size= {Dimensions.get('window').width*0.9*0.6}
                  value= {partyTicket.ticket}
                  // logo= {require('../Images/Icons/partyappblack.png')}
                />
              </View>
            </View>
            <View style={styles.modalTicketButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setModalTicketVisible(false);
                }}
                style={styles.modalTicketButton}>
                <Text style={styles.modalTicketTextButton}>FECHAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.profilePictureContainer}>
        <TouchableOpacity
          onPress={() => setModalPPVisible(true)}
          style={styles.borderButton}>
          <ProfilePicture />
        </TouchableOpacity>
        <Text style={styles.profileNameText}>{user.name}</Text>
      </View>

      <Socials />

      <View style={styles.generalContainer}>
        <Text style={styles.generalTitleText}>Suas Festas:</Text>
        <FlatList
          contentContainerStyle={styles.partiesList}
          numColumns={1}
          data={userParties}
          keyExtractor={(item) => item.pid.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
        />
        <TouchableOpacity
          style={styles.createPartyButton}
          onPress={() => startCreatingParty()}>
          <Text style={styles.createPartyText}>CRIAR FESTA</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.generalContainer}>
        <Text style={styles.generalTitleText}>Ingressos comprados:</Text>
        <Tickets />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: blackOwned,
  },
  modalCenterContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modalPPContainer: {
    backgroundColor: 'black',
    width: '97%',
    height: 250,
    borderWidth: 1,
    borderColor: redOwned,
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 10,
  },
  modalPPTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: redOwned,
    width: '100%',
    height: 80,
  },
  modalPPText: {
    padding: 10,
    textAlign: 'center',
    color: 'white',
    fontSize: 17,
  },
  modalPPButtonsContainer: {
    height: '33.3%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPPButton: {
    height: 50,
    width: 300,
    borderWidth: 1,
    borderColor: redOwned,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPPButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 19,
  },
  modalSocialContainer: {
    backgroundColor: 'black',
    width: 300,
    height: 120,
    borderWidth: 1,
    borderColor: redOwned,
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalSocialTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: redOwned,
    width: '100%',
    height: 80,
  },
  modalSocialText: {
    padding: 10,
    textAlign: 'center',
    color: 'white',
    fontSize: 17,
  },
  modalSocialButtonsContainer: {
    flexDirection: 'row',
    height: 38,
  },
  modalSocialButton: {
    height: '100%',
    width: '50%',
    borderColor: redOwned,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSocialTextButton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalTicketContainer: {
    backgroundColor: blackOwned,
    width: '90%',
    height: '80%',
    borderColor: redOwned,
    borderWidth: 1,
    borderRadius: 2,
    alignItems: 'center'
  },
  modalTicketPartyTitleContainer:{
    width: '100%',
    height: '20%',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTicketPartyTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalTicketQRCodeContainer: {
    width: '100%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTicketQRCode: {
    width: '80%',
    backgroundColor: 'white',
    aspectRatio: 1/1,
    borderColor: redOwned,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTicketButtonContainer: {
    width: '100%',
    height: '20%',
    borderWidth: 1,
    // borderColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTicketButton: {
    width: '80%',
    height: '40%',
    borderColor: redOwned,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTicketTextButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  profilePictureContainer: {
    alignItems: 'center',
    height: 240,
  },
  profilePictureText: {
    color: 'white',
    padding: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  borderButton: {
    marginTop: 25,
    borderWidth: 2,
    borderColor: redOwned,
    width: 155,
    height: 155,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 155,
  },
  profilePicture: {
    height: 140,
    width: 140,
    resizeMode: 'stretch',
    borderRadius: 140,
  },
  profileNameText: {
    marginTop: 12,
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  socialContainer: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderColor: redOwned,
    paddingBottom: 9,
    paddingTop: 5,
  },
  socialHalf: {
    width: '50%',
    paddingLeft: '3%',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },
  socialText: {
    color: 'white',
    marginLeft: 6,
    width: '100%',
    padding: 0,
  },
  generalContainer: {
    borderTopWidth: 1,
    borderColor: redOwned,
    paddingBottom: 10,
  },
  generalTitleText: {
    color: 'white',
    fontSize: 17,
    paddingLeft: 10,
    paddingTop: 5,
  },
  partiesList: {
    paddingTop: 6,
  },
  partyContainer: {
    width: '97%',
    alignSelf: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  partyButtonImg: {
    overflow: 'hidden',
    width: '100%',
    height: (0.97 * Dimensions.get('window').width) / (90 / 41),
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  partyBanner: {
    width: '100%',
    height: undefined,
    aspectRatio: 90 / 41,
  },
  partyButtonTitle: {
    backgroundColor: redOwned,
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderWidth: 1,
  },
  partyTitleText: {
    color: blackOwned,
    fontSize: 18,
    fontWeight: 'bold',
  },
  createPartyButton: {
    backgroundColor: redOwned,
    justifyContent: 'center',
    alignItems: 'center',
    width: '97%',
    height: 40,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    alignSelf: 'center',
  },
  createPartyText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ticketButton: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: redOwned,
    borderRadius: 7,
    borderWidth: 1,
  },
  ticketText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nonePurchasesText: {
    width: '100%',
    textAlign: 'center',
    paddingTop: 15,
    color: 'grey',
    height: 50,
    fontSize: 14.5,
  },
});
