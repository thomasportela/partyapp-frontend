import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import HomeScreen from '../pages/home';
import MyProfileScreen from '../pages/my-profile';
import ProfileScreen from '../pages/profile';
import PartyDetailsScreen from '../pages/party-details';
import SettingsScreen from '../pages/settings';
import NotificationsScreen from '../pages/notifications';
import SearchScreen from '../pages/search';
import ManagePartyScreen from '../pages/manage-party';
import ModifyPartyScreen from '../pages/modify-party';
import ChangeLocationScreen from '../pages/change-location';
import ChangeOrganizersScreen from '../pages/change-organizers';
import UserInfoScreen from '../pages/user-info';
import ChangePasswordScreen from '../pages/change-password'
import ListPeopleScreen from '../pages/list-people'
import ListPeopleFromPartyScreen from '../pages/list-people-from-party';
import BuyersAndTicketsScreen from '../pages/buyers-and-tickets'
import TicketsScannerScreen from '../pages/tickets-scanner';
import CheckoutScreen from '../pages/checkout';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useCreateParty } from '../contexts/createPartyContext'

import { blackOwned, redOwned, HeaderBack, HeaderSettingsAndNotifications, HeaderTitle } from '../helper/helper';

const AppStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeAndProfile(){
    const {partyCreated} = useCreateParty();
    let initialRouteName = 'Home'
    partyCreated ? initialRouteName = 'MyProfile' : initialRouteName = 'Home';
    return (
      <Tab.Navigator
        initialRouteName={initialRouteName}
        tabBarOptions={{
          activeTintColor: blackOwned,
          inactiveTintColor: redOwned,
          activeBackgroundColor: redOwned,
          inactiveBackgroundColor: blackOwned,
          labelStyle: {fontSize: 12.5, paddingBottom: 3, fontWeight: 'bold'},
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <Icon name="home" color={color} size={30} />
            ),
          }}
        />

        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarLabel: 'Buscar',
            tabBarIcon: ({color, size}) => (
              <Icon name="magnify" color={color} size={30} />
            ),
          }}
        />
  
        <Tab.Screen
          name="MyProfile"
          component={MyProfileScreen}
          options={{
            tabBarLabel: 'Perfil',
            tabBarIcon: ({color, size}) => (
              <Icon name="account" color={color} size={30} />
            ),
          }}
        />
      </Tab.Navigator>
    )
  }

const AppRoutes = () => {
  return (
    <AppStack.Navigator
      initialRouteName='HomeAndProfile'
      screenOptions={{
        headerStyle: { backgroundColor: redOwned},
        headerTitleAlign: 'center',
        headerTitle: () => (<HeaderTitle/>)
      }}
    >
        <AppStack.Screen
          name="HomeAndProfile"
          component={HomeAndProfile}
          options={{
            headerRight: () => (<HeaderSettingsAndNotifications/>)
          }}
        />
        <AppStack.Screen
          name="PartyDetails"
          component={PartyDetailsScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />
        <AppStack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />
        <AppStack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />
        <AppStack.Screen
          name="ManageParty"
          component={ManagePartyScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />
        <AppStack.Screen
          name="ModifyParty"
          component={ModifyPartyScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />
        <AppStack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />
        <AppStack.Screen
          name="ChangeLocation"
          component={ChangeLocationScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />
        <AppStack.Screen
          name="ChangeOrganizers"
          component={ChangeOrganizersScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />

        <AppStack.Screen
          name="UserInfo"
          component={UserInfoScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />
        <AppStack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />
        <AppStack.Screen
          name="ListPeople"
          component={ListPeopleScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />
        <AppStack.Screen
          name="ListPeopleFromParty"
          component={ListPeopleFromPartyScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />
        <AppStack.Screen
          name="BuyersAndTickets"
          component={BuyersAndTicketsScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />
        <AppStack.Screen
          name="TicketsScanner"
          component={TicketsScannerScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />
        <AppStack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />
    </AppStack.Navigator>
  )
}


export default AppRoutes