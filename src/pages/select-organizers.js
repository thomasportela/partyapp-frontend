import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { useCreateParty } from '../contexts/createPartyContext';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight,
    FlatList,
    TouchableOpacity,
    Dimensions,
    TextInput
} from 'react-native';
import { blackOwned, redOwned, highlightOwned } from '../helper/helper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { searchPeople } from '../services/searches'
import { getFriends } from '../services/friendship'
import createParty, { insertOrganizers, uploadPartyBanner } from '../services/createParty'
import showProfilePicture from '../helper/helperDefaults' 
  
const initialLayout = { width: Dimensions.get('window').width };


export default function SelectOrganizersScreen({route, navigation}) {
    const {party} = route.params;
    const {doService, user} = useAuth();
    const {doneCreatingParty} = useCreateParty();
    const [people, setPeople] = useState([]);
    const [friends, setFriends] = useState([]);
    const [organizers, setOrganizers] = useState([]);
    const [notFoundPeople, setNotFoundPeople] = useState(false);
    const [searchText, setSearchText] = useState('')
    const [index, setIndex] = useState(0);

    const [routes] = useState([
      { key: 'friends', title: 'Amigos' },
      { key: 'all', title: 'Todos' },
    ]);

    useEffect(() => {
        async function componentDidMount(){
            const response = await doService(getFriends)
            setFriends(response.friends)
        }
        componentDidMount()
        console.log(party)
    }, [])

    var filteredFriends = friends.filter(function(friend){
        return friend.name.toLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1;
    })

    const addOrganizer = (item) => {
        const organizersUids = organizers.map(function(organizer){
            return organizer.uid
        })
        if(organizersUids.indexOf(item.uid) === -1){
            setOrganizers([...organizers, item])
        }
    }

    const removeOrganizer = (item) => {
        const organizersList = [...organizers]
        organizersList.splice(organizersList.indexOf(item), 1)
        setOrganizers(organizersList)
    }

    const FriendsRoute = () => (
        <View style={{flex: 1, backgroundColor: blackOwned }} >
            <FlatList
                contentContainerStyle={styles.list}
                data={filteredFriends}
                keyExtractor={(item) => item.uid.toString()}
                renderItem={renderFriends}
            />
        </View>
    );

    const AllRoute = () => (
        <View style={{flex: 1, backgroundColor: blackOwned }} >
            <NotFoundPeople />
            <PressTheButton />
            <FlatList
                data={people}
                keyExtractor={(item) => item.uid.toString()}
                renderItem={renderFriends}
            />
        </View>
    );

    const renderOrganizers = ({item}) => (
        <TouchableOpacity style={styles.organizerContainer} onPress={() => removeOrganizer(item)}>
            <View style={styles.bigProfilePictureContainer}>
              {showProfilePicture(item, styles.bigProfilePicture)}
            </View>
            <Text style={styles.nameOrgnizersText}>{item.name.split(' ')[0]}</Text>
        </TouchableOpacity>
    )

    const renderFriends = ({item}) => (
        <TouchableOpacity style={styles.friendsContainer} onPress={() => addOrganizer(item)}>
            <View style={styles.profilePictureContainer}>
              {showProfilePicture(item, styles.profilePicture)}
            </View>
            <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    )

    const renderTabBar = props => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: redOwned }}
          style={styles.tabBar}
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', height: 40}}
        />
      );

    const renderScene = SceneMap({
      friends: FriendsRoute,
      all: AllRoute,
    });

    async function handleSearch() {
        if(index === 0) {
            console.log(organizers)
        }
        if(index === 1){
            if(searchText.length === 0){
                setPeople([]);
                setNotFoundPeople(true);
            }else{
                const response = await doService(() => searchPeople(searchText))
                if(response === 404){
                    setPeople([]);
                    setNotFoundPeople(true);
                }else{
                    setNotFoundPeople(false);
                    setPeople(response.users);
                }
            }
        }
    }

    const PressTheButton = () => {
        if(people.length === 0){
            return <Text style={styles.notFoundPeople}>Aperte no botão de busca para procurar uma pessoa</Text>
        }else{return null}
    }

    const NotFoundPeople = () => {
        if(notFoundPeople){
            return <Text style={styles.notFoundPeople}>Não encontramos ninguém com essa busca</Text>
        }else{return null}
    }

    const OrganizersList = () => {
        if(organizers.length === 0){
            return null;
        }else{
            return (
                <View style={styles.organizersContainer}>
                    <FlatList
                        horizontal={true}
                        data={organizers}
                        keyExtractor={(item) => item.uid.toString()}
                        renderItem={renderOrganizers}
                    />
                </View>
            )
        }
    }

    async function handleCreateParty(){
        const response = await doService(() => createParty(party));
        if(party.banner){
            const data = new FormData();
            data.append("file", party.banner)
            data.append("pid", response.data.pid)
            await doService(() => uploadPartyBanner(data))
        }
        if(organizers.length !== 0){
            await doService(() => insertOrganizers(response.data.pid, organizers.map(organizer => organizer.uid)))
        }
        doneCreatingParty()
    }

    const SubmitButton = () => {
        if(organizers.length === 0){
            return (
                <TouchableHighlight style={styles.submitButton} onPress={() => {handleCreateParty()}} underlayColor={highlightOwned}>
                    <Text style={styles.submitText}>SOU SÓ EU MESMO</Text>
                </TouchableHighlight>
            )
        }else{
            return (
                <TouchableHighlight style={styles.submitButton} onPress={() => {handleCreateParty()}} underlayColor={highlightOwned}>
                    <Text style={styles.submitText}>SÃO ESSES</Text>
                </TouchableHighlight>
            )
        }
    }

    return(
        <View style={styles.mainContainer}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Escolha os organizadores da sua festa"
                    placeholderTextColor="grey"
                    onSubmitEditing={handleSearch}
                    onChangeText={(text) => setSearchText(text)}
                    defaultValue={searchText}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch} >
                    <Icon name="magnify" color={redOwned} size={25} />
                </TouchableOpacity>
            </View>
            <OrganizersList />
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
            />
            <SubmitButton />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    searchContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: blackOwned
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
    resultsContainer: {
        borderTopWidth: 1,
        borderColor: redOwned
    },
    scene: {
        flex: 1,
    },
    tabBar: {
        backgroundColor: blackOwned,
        borderTopWidth: 1,
        borderColor: redOwned,
    },
    friendsContainer: {
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
    notFoundPeople: {
        color: 'grey',
        width: '100%',
        textAlign: 'center',
        marginTop: 20,
    },
    organizersContainer: {
        height: 100,
        backgroundColor: blackOwned,
        borderTopWidth: 1,
        borderColor: redOwned
    },
    organizerContainer: {
        height: '100%',
    },
    bigProfilePictureContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 77,
    },
    bigProfilePicture: {
        height: 70,
        width: 70,
        resizeMode: 'cover',
        borderRadius: 70,
    },
    nameOrgnizersText: {
        color: 'white',
        width: '100%',
        textAlign: 'center',
    },
    submitButton: {
        height: 40,
        width: '85%',
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: redOwned,
        borderRadius: 5,
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    submitText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    }
})