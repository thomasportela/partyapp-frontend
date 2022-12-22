import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {redOwned, blackOwned} from '../helper/helper';
import {useAuth} from '../contexts/authContext';
import { FlatList } from 'react-native-gesture-handler';
import { acceptFriendRequest, unfriend } from '../services/friendship'
import showProfilePicture from '../helper/helperDefaults' 

export default function NotificationsScreen() {
  const {user, notifications, doService, refreshNotifications} = useAuth();

  const renderItem = ({item}) => (
    <View style={styles.friendRequestContainer}>
        <View style={styles.friendProfilePictureContainer}>
          {showProfilePicture(item, styles.friendProfilePicture)}
        </View>
        <View style={styles.friendRequestContainerInfoContainer}>
          <View style={styles.friendRequestTextContainer}>
            <Text style={styles.friendRequestText}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>{item.name} </Text>
                <Text style={{color: 'white'}}>quer te adicionar aos amigos!</Text>
            </Text>
          </View>
          <View style={styles.friendRequestButtonsContainer}>
            <View style={styles.friendRequestButtonContainer}>
              <TouchableOpacity
              style={styles.friendRequestAcceptButton}
              onPress={async () => {
                await doService(() => acceptFriendRequest(item.uid))
                refreshNotifications();
              }}>
                <Text style={styles.friendRequestAcceptButtonText}>
                  ACEITAR
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.friendRequestButtonContainer}>
              <TouchableOpacity
                style={{
                  ...styles.friendRequestAcceptButton,
                  backgroundColor: blackOwned,
                  borderColor: redOwned,
                }}
                onPress={async () => {
                  await doService(() => unfriend(item.uid))
                  refreshNotifications()
                }}>
                <Text style={styles.friendRequestRejectButtonText}>
                  REJEITAR
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
  )

  const FriendsNotifications = () => {
    if(notifications.length > 0) {
      return (
        <FlatList
          data={notifications}
          contentContainerStyle={styles.mainContainerContent}
          keyExtractor={(item) => item.uid.toString()}
          renderItem={renderItem}
        />
      )
    }else{
      return <Text style={styles.noneNotificationsText}>Nenhuma notificação</Text>
    }
  }

  return (
    <View
      style={styles.mainContainer}>
      <FriendsNotifications />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: blackOwned,
  },
  mainContainerContent: {
    alignItems: 'center',
    paddingBottom: 5,
  },
  friendRequestContainer: {
    marginTop: 8,
    width: '97%',
    height: 120,
    borderRadius: 5,
    borderColor: redOwned,
    borderWidth: 1,
    flexDirection: 'row',
  },
  friendProfilePictureContainer: {
    width: 120,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendProfilePicture: {
    height: 100,
    width: 100,
    resizeMode: 'cover',
    borderRadius: 100,
  },
  friendRequestContainerInfoContainer: {
    flex: 1,
  },
  friendRequestTextContainer: {
    width: '100%',
    height: '62%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendRequestText: {
    marginHorizontal: 5,
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  friendRequestButtonsContainer: {
    width: '100%',
    height: '38%',
    flexDirection: 'row',
  },
  friendRequestButtonContainer: {
    width: '50%',
    height: '100%',
  },
  friendRequestAcceptButton: {
    width: '90%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: redOwned,
    borderRadius: 5,
  },
  friendRequestAcceptButtonText: {
    color: blackOwned,
    fontWeight: 'bold',
    fontSize: 16,
  },
  friendRequestRejectButtonText: {
    color: redOwned,
    fontWeight: 'bold',
    fontSize: 16,
  },
  noneNotificationsText: {
    marginTop: 30,
    alignSelf: 'center',
    color: 'grey',
  }
});
