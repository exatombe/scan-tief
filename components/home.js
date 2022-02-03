import React from 'react';
import {
  Layout,
  Text,
  Divider,
  Button,
  Icon,
  TopNavigation,
  Spinner,
  List
} from '@ui-kitten/components';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { FlatList, ImageBackground, Pressable} from 'react-native';


import { scrapMainPage } from '../functions/scrapper-scanfr';

const ShowIcon = props => <Icon {...props} name="eye-outline" />;

 const TopNavigationAccessoriesShowcase = () => {
  return (
    <Layout level="1">
      <TopNavigation
        alignment="center"
        appearance="control"
        title={() => <Text category={'h2'}>Scan-Tief</Text>}
      />
      <Divider
        style={{
          height: 2,
          backgroundColor: 'grey',
        }}
      />
    </Layout>
  );
};
const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('mainPage', jsonValue)
  } catch (e) {
    // saving error
  }
}

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('mainPage')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}

export default function HomeScreen({navigation}) {
  const [hotSale, setHotSale] = React.useState([]);
  const [update, setUpdate] = React.useState([])
  if (hotSale.length >= 1) {
  } else {
   (async()=>{
     let data = await getData();        
      if(data){
        setHotSale(data.hotManga)
        setUpdate(data.lastMangaUpdated.slice(0,40)) 
    let {lastMangaUpdated, hotManga } = await scrapMainPage()
        if(data.lastMangaUpdated !== lastMangaUpdated || data.hotManga !== data.hotManga){
      setHotSale(hotManga)
      setUpdate(lastMangaUpdated.slice(0,40))
      storeData({
        lastMangaUpdated, hotManga
      })
     }
    }else{
      let {lastMangaUpdated, hotManga } = await scrapMainPage()
      setHotSale(hotManga)
      setUpdate(lastMangaUpdated.slice(0,40))
      storeData({
        lastMangaUpdated, hotManga
      })
    }
   })();
  }

  function DisplayCard({item}) {
    return (
      <Layout
        style={{
          margin: 4,
        }}
        key={item.name}
      >
        <ImageBackground
          style={{
            width: 164,
            height: 229,
          }}
          source={{
            uri: item.img,
          }}
        ><Text style={{
          color: "white",
          fontSize: 20,
          lineHeight: 20,
          fontWeight: "bold",
          textAlign: "center",
          top:0,
          backgroundColor: "#000000c0"
        }}>Chapitre {item.chapter_name}</Text>
      </ImageBackground>
        <Divider />
        <Button size={'tiny'} status={'basic'} accessoryLeft={ShowIcon} onPress={()=>{
          navigation.push("Chapter",{
            url: item.srcChapter,
            title: "Chapitre " + item.chapter_name,
            srcURL: item.srcURL,
            name: item.name
        })
        }}>
          <Text category={'h5'} status={'primary'}>
            {item.name.length > 20 ? item.name.substr(0, 20) + '..' : item.name}
          </Text>
        </Button>
      </Layout>
    );
  }
  function DisplayManga({item}){
    return (
      <Layout key={item.scanName}>
      <Layout style={{
        alignContent:"center",
        marginBottom:5
      }} >
      <Pressable onPress={() => navigation.push("Fiche",{ title: item.scanName, url: item.url}) }>
        <Text size={"s1"}><Icon name="book" size={26} />
            {item.scanName} | {item.date.trim()}</Text>
      </Pressable>
        </Layout> 
      {item.chapters.map((e) =>(
      <Layout  key={e.name}>
        <Button status={"basic"} size={"tiny"} style={{
          marginLeft: 10,
        }} onPress={()=> navigation.push("Chapter",{
          url: e.url,
          title: e.name,
          srcURL: item.url,
          name: item.scanName
      })}>
           {e.name}
      </Button>
      <Divider
        style={{
          height: 3,
          backgroundColor: null,
        }}
      />
     </Layout>
      ))}
        <Divider
        style={{
          height: 2,
          backgroundColor: 'grey',
        }}
      />
      </Layout>
    )
  }
  const CenterSpinner = () => (
    <Layout style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    }} level='1'>
      <Spinner size='giant' />
    </Layout>
  )

  return (
    <Layout style={{flex: 1}}>
      <TopNavigationAccessoriesShowcase />
        <List
      data={update}
      renderItem={DisplayManga}
      ListHeaderComponent={ hotSale.length >0 ? <Layout>
        <Divider style={{height: 15, backgroundColor: null}} />
        <Text category={'h6'} style={{left: 15, fontWeight: 'bold'}}>
          Mise à jour des manga populaires
        </Text>
        <Divider style={{height: 10, backgroundColor: null}} />
        <FlatList
          data={hotSale}
          renderItem={DisplayCard}
          keyExtractor={item => item.srcURL}
          horizontal={true}
          ListEmptyComponent={CenterSpinner}
        /> 
        <Divider />
      <Divider style={{ height: 15, backgroundColor: null }} />
      <Text category={'h6'} style={{ left: 15, fontWeight: 'bold' }}>
          Dernières mises à jour
        </Text>
        <Divider style={{ height: 10, backgroundColor: null }} />
      </Layout> : <></> }
      ListEmptyComponent={CenterSpinner}
    />
    </Layout>
  );
}
