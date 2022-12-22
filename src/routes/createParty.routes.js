import React, { useEffect } from 'react';
import CreatePartyScreen from '../pages/create-party';
import SelectLocationScreen from '../pages/select-location';
import SelectOrganizersScreen from '../pages/select-organizers';

import { createStackNavigator } from '@react-navigation/stack';

import { blackOwned, redOwned, HeaderBack, HeaderCancel, HeaderTitle } from '../helper/helper';

const CreatePartyStack = createStackNavigator();

const CreatePartyRoutes = () => {
  return (
    <CreatePartyStack.Navigator
      initialRouteName='CreateParty'
      screenOptions={{
        headerStyle: { backgroundColor: redOwned},
        headerTitleAlign: 'center',
        headerTitle: () => (<HeaderTitle/>)
      }}
    >
        <CreatePartyStack.Screen
          name="CreateParty"
          component={CreatePartyScreen}
          options={{
            headerLeft: () => (<HeaderCancel />)
          }}
        />
        <CreatePartyStack.Screen
          name="SelectLocation"
          component={SelectLocationScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />
        <CreatePartyStack.Screen
          name="SelectOrganizers"
          component={SelectOrganizersScreen}
          options={{
            headerLeft: () => (<HeaderBack/>)
          }}
        />
    </CreatePartyStack.Navigator>
  )
}


export default CreatePartyRoutes;