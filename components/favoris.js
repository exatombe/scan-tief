import React, { useState } from 'react';
import {
  Layout,
  Text,
  ListItem,
  Input,
  Card,
  Icon,
  List,
  Tab,
  TabView, 
  Divider,
  Button
} from '@ui-kitten/components';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';

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


const getFavorites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('favorites')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}

const getLastView = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('LastView')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
    }
  }

  const Heart = (props) => (
    <Icon {...props} name='heart'/>
  );
  
  const Eye = (props) => (
    <Icon {...props} name='eye'/>
  );

export default function Favoris({ navigation }){
    const [sugg,setSugg] = useState([])
    const [anylist,setAnylist] = useState([])
    const [anylistView,setAnylistView] = useState([]);    
    const [suggView,setSuggView] = useState([]);
    const [valueView,setValueView] = useState("");
    const [value, setValue] = useState('');
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [state,setState] = useState(true);
    const ref = React.useRef(false)
    React.useEffect(() => {
      ref.current = true
      return () => {
        ref.current = false
      }
    }, [])
    
    if(!ref.current){
            (async()=>{
                let mangaList = await getFavorites();
                if(mangaList){
                  setAnylist(mangaList);
                  setSugg(mangaList)
                }
                let mangaListView = await getLastView();
                if(mangaListView){
                  setAnylistView(mangaListView);
                  setSuggView(mangaListView)
                }
      })()
    }
    
    function searchManga(current,listName){
        if(listName === "favoris"){
      setValue(current)
      if(current == "") return  setSugg(anylist)
      setSugg(anylist.filter(e => e.name.toLowerCase().includes(current.toLowerCase())))
        }else{
    setValueView(current)
    if(current == "") return  setSuggView(anylistView)
    setSuggView(anylistView.filter(e => e.name.toLowerCase().includes(current.toLowerCase())))
        }
    }

    const DisplayMangaSugg = ({item}) => (
        <Card disabled={true} >
          <ListItem onPress={()=> navigation.push("Chapter",{
                url: item.url,
                title:item.title,
                srcURL: item.srcURL,
                name:item.name
    
            })} accessoryLeft={<Icon name="book-open" size={26} />} accessoryRight={<><Button size="tiny" onPress={()=> navigation.push("Fiche",{ title: item.name, url: item.srcURL})} >Fiche</Button></>} description={<Text category={"s2"}>{item.title} | { item.url.split("/")[2] === "scan-fr.cc" ? "ScanFr" : item.url.split("/")[2] === "www.frscan.cc" ? "FrScan" : "MangaScan"}</Text>} title={item.name}>
          </ListItem>
        </Card>
      )
function setSelector(index){
  setSelectedIndex(index);
  (async()=>{
    if(index === 0){
    let mangaList = await getFavorites();
    if(mangaList){
      setAnylist(mangaList);
      setSugg(mangaList)
    }
    }else{
        let mangaListView = await getLastView();
    if(mangaListView){
      setAnylistView(mangaListView);
      setSuggView(mangaListView)
    }
    }
})()
}

    return (<Layout style={{flex:1}}  >
       <TabView
      selectedIndex={selectedIndex}
      onSelect={index => setSelector(index)}>
      <Tab icon={Heart} title='FAVORIS'>
      <Layout style={{height:Dimensions.get("window").height}}>
        <Input 
          placeholder='Recherche...'
          value={value}           
          size='large'
          onChangeText={(nextValue ) => searchManga(nextValue,"favoris")}
          />
            <List 
            data={sugg}
            renderItem={DisplayMangaSugg}
            ListEmptyComponent={<Card disabled={true} >
              <Text>Nothing to find</Text>
          </Card>}
           ListFooterComponent={<><Divider style={{
            height:3,
            backgroundColor:"grey"
          }}/><Divider style={{
            height:140,
            backgroundColor:null
          }}/></>}
            />
        </Layout>
      </Tab>
      <Tab icon={Eye} title='LAST VIEW'> 
       <Layout style={{height:Dimensions.get("window").height}}>
        <Input 
          placeholder='Recherche...'
          value={valueView}           
          size='large'
          onChangeText={(nextValue ) => searchManga(nextValue,"lastView")}
          />
            <List 
            data={suggView}
            renderItem={DisplayMangaSugg}
            ListEmptyComponent={<Card disabled={true} >
              <Text>Nothing to find</Text>
          </Card>}
          ListFooterComponent={<><Divider style={{
            height:3,
            backgroundColor:"grey"
          }}/><Divider style={{
            height:140,
            backgroundColor:null
          }}/></>}
            />
        </Layout>
      </Tab>
    </TabView>
    </Layout>
    );

}
