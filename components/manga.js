import React from 'react';
import {
  Layout,
  Text,
  ListItem,
  Input,
  Card,
  Icon,
  List
} from '@ui-kitten/components';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { scrapMangaList } from '../functions/scrapper-scanfr';

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('mangaList', jsonValue)
  } catch (e) {
    // saving error
  }
}

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('mangaList')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}

export default function Manga({ navigation }) {
  const [value, setValue] = React.useState('');
  const [sugg,setSugg] = React.useState([])
  const [anylist,setAnylist] = React.useState([])
  if(anylist.length < 1){
    (async()=>{
      let mangaList = await getData();
      if(mangaList){
        setAnylist(mangaList);
      setSugg(shuffle(mangaList).slice(0,30))
      let newList =  await scrapMangaList();
      if(mangaList !==newList){
        setAnylist(newList);
      storeData(newList)
      }
      }else{
        mangaList = await scrapMangaList();
        setAnylist(mangaList);
      setSugg(shuffle(mangaList).slice(0,30))
      storeData(mangaList)
      }
       
      
    })()
  }
  
  function searchManga(current){
    setValue(current)
    if(current == "") return  setSugg(shuffle(anylist).slice(0,30))
    setSugg(anylist.filter(e => e.name.toLowerCase().includes(current.toLowerCase())).slice(0,30))
  }

  const DisplayMangaSugg = ({item}) => (
    <Card disabled={true} >
      <ListItem onPress={()=> navigation.push('Fiche',{ title: item.name, url: item.url})} accessoryLeft={<Icon name="book-open" size={26} />} description={<Text category={"s2"}>From : { item.url.split("/")[2] === "scan-fr.cc" ? "ScanFr" : item.url.split("/")[2] === "www.frscan.cc" ? "FrScan" : "MangaScan"}</Text>} title={item.name}>
      </ListItem>
    </Card>
  )

  return (
    <>
      <Layout style={{flex: 1}}>
      <Input 
        placeholder='Recherche...'
        value={value}           
        size='large'
        onChangeText={(nextValue ) => searchManga(nextValue)}
        />
          <List 
          data={sugg}
          renderItem={DisplayMangaSugg}
          ListEmptyComponent={<Card disabled={true} >
            <Text>Nothing to find</Text>
        </Card>}
          />
      </Layout>
    </>
  );
}
