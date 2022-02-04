import React, {useState, useEffect  } from 'react';

import {
  Layout,
  Text,
  Card,
  Button,
  Icon,
} from '@ui-kitten/components';

import { useRoute } from '@react-navigation/native';

import { getChapitre } from '../functions/scrapper-scanfr';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { WebView } from 'react-native-webview'
import { slice } from 'cheerio/lib/api/traversing';

const getLastView = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('LastView')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}
const getFavorites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('favorites')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}
const storeDataFavorites = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('favorites', jsonValue)
  } catch (e) {
    // saving error
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


export default function ChapterDisplay(props) {
    const { navigation } = props  
    const route = useRoute()
    const [images, setImages] = useState([]);
  const [chapters,setChapters] = useState([])
  const [favorite,setFavorite] = useState(false);
  const [listFavorites,setListFavorites] = useState([]);
  let storedLast;
    useEffect(()=>{
      navigation.setOptions({
          title: route.params.title,
        })  
    },[route,navigation])
     
  if(images.length == 0){
    (async()=>{
      storedLast = await getLastView();
      let favoritesCurrent = await getFavorites();
      
    let {pageList,chapterList } = await getChapitre(route.params.url)
    setImages(pageList);
      setChapters(chapterList.reverse());
    if(!storedLast){
     storedLast = []; 
    }else{
      storedLast = storedLast.filter(e => e.srcURL !== route.params.srcURL);
    }
    if(favoritesCurrent){  
      setFavorite( favoritesCurrent.find(e => e.srcURL === route.params.srcURL) ? true : false)
      let isFavorite =  favoritesCurrent.find(e => e.srcURL === route.params.srcURL) ? true : false;
      setListFavorites(favoritesCurrent);
      favoritesCurrent = favoritesCurrent.filter(e => e.srcURL !== route.params.srcURL)
      if(isFavorite){
        favoritesCurrent.splice(0,0,{
        url: chapterList[chapterList.findIndex(e => e.isCurrent)].url,
        title: chapterList[chapterList.findIndex(e => e.isCurrent)].name,
        srcURL: route.params.srcURL,
        name: route.params.name
      })
      await storeDataFavorites(favoritesCurrent);
      }
     
    }

    storedLast.splice(0,0,{
      url: chapterList[chapterList.findIndex(e => e.isCurrent)].url,
      title: chapterList[chapterList.findIndex(e => e.isCurrent)].name,
      srcURL: route.params.srcURL,
      name: route.params.name
    })

    await storeDataView(storedLast.slice(0,10))
    })()
   }

async function makeFavorite(status){
     if(!status){
        setFavorite(true);
    let listFav = listFavorites
    listFav.splice(0,0,{
      url: chapters[chapters.findIndex(e => e.isCurrent)].url,
      title: chapters[chapters.findIndex(e => e.isCurrent)].name,
      srcURL: route.params.srcURL,
      name: route.params.name
    })
    await storeDataFavorites(listFav);
     }else{
      setFavorite(false);
      let listFav = listFavorites.filter(e => e.srcURL !== route.params.srcURL)
      await storeDataFavorites(listFav);
     }
    
   }


  return (
    <>
      <Layout style={{flex: 1}}>
        {images.length > 0 ?  <WebView
      style={{
        flex: 1,
      }}
      source={{
        html: `<body style="margin:0; padding:0; overflow:hidden;">
        <style>
		#container {
			position: absolute;
			left: 0;
			top: 0;
			right: -30px;
			bottom: 0;	
			padding-right: 5px;
			overflow-y: scroll;
		}
		</style>
        <div id="container">
  ${images.map(e => '<img width="100%" height="auto" loading="lazy" src="'+ (e.url.startsWith("https") ? e.url : "https:" + e.url) +'" />').join("")}
  </div>
</body>`}}
javaScriptEnabled={true}
    /> : <Card disabled={true} >
            <Text>Loading...</Text>
        </Card>}
        {chapters.length > 0 
     ? 
     chapters.findIndex(e => e.isCurrent) === 0 
     ? <Layout style={{
      flexDirection: 'row',
  }}><Button style={{ flex:1 }} status={ favorite ? "success" : "primary"}  onPress={async() => await makeFavorite(favorite)}>Favoris</Button><Button style={{flex: 1 }} onPress={()=> navigation.replace("Chapter",{
            url: chapters[chapters.findIndex(e => e.isCurrent)+1].url,
            title: chapters[chapters.findIndex(e => e.isCurrent)+1].name,
            srcURL: route.params.srcURL,
            name: route.params.name
        })}>Suivant</Button></Layout>
         : 
         chapters.findIndex(e => e.isCurrent) === (chapters.length -1) 
         ? <Layout style={{
          flexDirection: 'row',
      }}><Button style={{flex: 1 }} onPress={()=> navigation.replace("Chapter",{
            url: chapters[chapters.findIndex(e => e.isCurrent)-1].url,
            title: chapters[chapters.findIndex(e => e.isCurrent)-1].name,
            srcURL: route.params.srcURL,
            name: route.params.name
        })}>Précédent</Button><Button style={{ flex:1 }} status={ favorite ? "success" : "primary"} onPress={async() => await makeFavorite(favorite)}>Favoris</Button></Layout>  :
        <Layout style={{
          flexDirection: 'row',
      }}><Button style={{flex: 1 }} onPress={()=> navigation.replace("Chapter",{
            url: chapters[chapters.findIndex(e => e.isCurrent)-1].url,
            title: chapters[chapters.findIndex(e => e.isCurrent)-1].name,
            srcURL: route.params.srcURL,
            name: route.params.name
        })}>Précédent</Button><Button style={{ flex:1 }} status={ favorite ? "success" : "primary"} onPress={async() => await makeFavorite(favorite)}>Favoris</Button>
        <Button style={{flex: 1 }} onPress={()=> navigation.replace("Chapter",{
            url: chapters[chapters.findIndex(e => e.isCurrent)+1].url,
            title: chapters[chapters.findIndex(e => e.isCurrent)+1].name,
            srcURL: route.params.srcURL,
            name: route.params.name
        })}>Suivant</Button></Layout> : <></>}
      </Layout>
    </>
  );
}
