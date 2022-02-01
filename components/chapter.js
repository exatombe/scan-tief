import React, {useState, useEffect, Component  } from 'react';

import {
  Layout,
  Text,
  Card,
  Button,
} from '@ui-kitten/components';

import { useRoute } from '@react-navigation/native';

import { getChapitre } from '../functions/scrapper-scanfr';

import { WebView } from 'react-native-webview'


export default function ChapterDisplay(props) {
    const { navigation } = props  
    const route = useRoute()
    const [images, setImages] = useState([]);
  const [chapters,setChapters] = useState([])
    useEffect(()=>{
      navigation.setOptions({
          title: route.params.title,
        })  
    },[route,navigation])
     
  if(images.length == 0){
    (async()=>{
    let {pageList,chapterList } = await getChapitre(route.params.url)
    setImages(pageList);
      setChapters(chapterList.reverse());
    })()
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
			padding-right: 15px;
			overflow-y: scroll;
		}
		</style>
        <div id="container">
  ${images.map(e => '<img width="100%" height="auto" src="'+ e.url +'" />').join("")}
  </div>
</body>`}}
    /> : <Card disabled={true} >
            <Text>Loading...</Text>
        </Card>}
        {chapters.length > 0 
     ? 
     chapters.findIndex(e => e.isCurrent) === 0 
     ? <Button onPress={()=> navigation.push("Chapter",{
            url: chapters[chapters.findIndex(e => e.isCurrent)+1].url,
            title: chapters[chapters.findIndex(e => e.isCurrent)+1].name
        })}>Suivant</Button>
         : 
         chapters.findIndex(e => e.isCurrent) === (chapters.length -1) 
         ? <Button onPress={()=> navigation.push("Chapter",{
            url: chapters[chapters.findIndex(e => e.isCurrent)-1].url,
            title: chapters[chapters.findIndex(e => e.isCurrent)-1].name
        })}>Précédent</Button>  : <>
        <Button onPress={()=> navigation.push("Chapter",{
            url: chapters[chapters.findIndex(e => e.isCurrent)-1].url,
            title: chapters[chapters.findIndex(e => e.isCurrent)-1].name
        })}>Précédent</Button>
        <Button onPress={()=> navigation.push("Chapter",{
            url: chapters[chapters.findIndex(e => e.isCurrent)+1].url,
            title: chapters[chapters.findIndex(e => e.isCurrent)+1].name
        })}>Suivant</Button></> : <></>}
      </Layout>
    </>
  );
}
