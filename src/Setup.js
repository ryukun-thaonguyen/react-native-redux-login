import React from 'react'
import { View, Text } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { registerScreens } from './navigation'
import configureStore from './redux/store';

export default function Setup() {
    const loadInit=()=>{
        return Promise.all([loadStore()])
        .then(response=>{
            store=response[0]
            
        })
        .catch(err=>{})
    }

    const loadStore=async ()=>{
        console.log("load store");
        return new Promise(reslove=>{
        configureStore((tempStore) => {
            // configI18n(get(tempStore.getState(), 'app.language'));
            registerScreens(tempStore, persistor);
            resolve(tempStore, persistor);
        });
        })
    }

    Navigation.events().registerAppLaunchedListener(async ()=>{
        try{
            console.log("start");
            await loadInit()
            Navigation.setDefaultOptions({
                layout: {
                    backgroundColor: 'white',
                    orientation: ['portrait'],
                  },
            })
        }
        catch(error){
            console.log(error);
        }
    } )


}
