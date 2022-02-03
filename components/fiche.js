import React, {useState, useEffect} from 'react';
import {
  Layout,
  Button,
  Input,
  Text,
  ListItem,
  Card,
  Icon,
  List,
  Divider
} from '@ui-kitten/components';

import { useRoute } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { scrapMangaFiche } from '../functions/scrapper-scanfr';

const getLastView = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('LastView')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}

const storeDataView = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('LastView', jsonValue)
  } catch (e) {
    // saving error
  }
}

export default function Fiche(props) {
    const { navigation } = props  
    const route = useRoute()
    const [info, setInfo] = useState({});
    const [value,setValue] = useState("");
    const [chapterListToDisplay,setListChapters] = useState([]);
    const [chapters,setChapters] = useState([]);
    let storedLast;

    useEffect(()=>{
      navigation.setOptions({
          title: route.params.title,
        })  
    },[route,navigation])
   if(!info.data){
    (async()=>{
      storedLast = await getLastView();
      let exist;
    let {infoData,chaptersList } = await scrapMangaFiche(route.params.url)
      setInfo(infoData);
      setChapters(chaptersList);
      setListChapters(chaptersList)

      if(!storedLast){
        storedLast = []; 
       }else{
         exist = storedLast.find(e => e.srcURL !== route.params.url);
       }
       if(!exist){
            storedLast.splice(0,0,{
         url: chaptersList[chaptersList.length-1].url,
         title: chaptersList[chaptersList.length-1].name,
         srcURL: route.params.url,
         name: route.params.title
       })
       }
       await storeDataView(storedLast.slice(0,10))
    })()
  }  
  
  function searchManga(current){
    setValue(current)
    if(current == "") return setChapters(chapterListToDisplay)
    setChapters(chapterListToDisplay.filter(e => e.name.toLowerCase().includes(current.toLowerCase())))
  }
  
   function Description({ data, chapter, description }){
    return (<Layout>
        {data.map((e,i) => (<Layout style={{
          marginLeft:7
        }} key={i}><Text><Text style={{
          fontWeight:"bold"
        }} category={"s1"}>{e.key}</Text> : <Text category={"s2"}>{e.value}</Text></Text>
        </Layout>
        ))}
        <Divider style={{
          height:2,
          marginTop:2,
          marginBottom:2,
          backgroundColor:"grey"
        }} />
        <Text style={{
          marginLeft:7
        }}>
           {description}
        </Text>
        {chapter ? <>
        <Button size={"tiny"} onPress={() => navigation.replace("Chapter",{
            url: chapter.url,
            title: chapter.name,
            srcURL: route.params.url,
            name: route.params.title
        })}>Lire le premier chapitre
      </Button></> : <></> }
    </Layout>
    )
}
  const Chapters = ({item}) => (
    <Card disabled={true} >
      <ListItem  accessoryLeft={<Icon name="bookmark" size={26} />} title={item.name} description={item.date} onPress={() => navigation.replace("Chapter",{
            url: item.url,
            title: item.name,
            srcURL: route.params.url,
            name: route.params.title
        })}>
      </ListItem>
    </Card>
  )

  return (
    <>
      <Layout style={{flex: 1}}>
      {chapterListToDisplay.length >= 1 ? <><Input 
        placeholder='Chapitre...'
        value={value}           
        size='large'
        onChangeText={(nextValue ) => searchManga(nextValue)}
        />
      </> : <></> }
          <List 
          data={chapters}
          renderItem={Chapters}
          ListHeaderComponent={info.description ? <Description description={info.description} data={info.data}  chapter={chapterListToDisplay ? chapterListToDisplay[chapterListToDisplay.length-1] : false}/> : <></>}
          ListEmptyComponent={<Card disabled={true} >
            <Text>Loading...</Text>
        </Card>}
          />
      </Layout>
    </>
  );
}
