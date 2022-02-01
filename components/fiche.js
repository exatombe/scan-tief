import React, {useState, useEffect} from 'react';
import {
  Layout,
  Button,
  Text,
  ListItem,
  Card,
  Icon,
  List,
  Divider
} from '@ui-kitten/components';

import { useRoute } from '@react-navigation/native';

import { scrapMangaFiche } from '../functions/scrapper-scanfr';



export default function Fiche(props) {
    const { navigation } = props  
    const route = useRoute()
    const [info, setInfo] = useState({});
  const [chapters,setChapters] = useState([])
    useEffect(()=>{
      navigation.setOptions({
          title: route.params.title,
        })  
    },[route,navigation])
   if(!info.data){
    (async()=>{
    let {infoData,chaptersList } = await scrapMangaFiche(route.params.url)
      setInfo(infoData);
      setChapters(chaptersList);
    })()
  }  
 
  
   function Description({ data, chapter, description }){
    return (<Layout>
        {data.map(e => (<>
        <Text><Text style={{
          fontWeight:"bold"
        }} category={"s1"}>{e.key}</Text> : <Text category={"s2"}>{e.value}</Text></Text>
        </>))}
        <Divider style={{
          height:2,
          marginTop:2,
          marginBottom:2,
          backgroundColor:"grey"
        }} />
        <Text>
           {description}
        </Text>
        {chapter ? <Button size={"tiny"} onPress={() => navigation.push("Chapter",{
            url: chapter.url,
            title: chapter.name
        })}>Lire le premier chapitre
      </Button> : <></> }
    </Layout>
    )
}
  const Chapters = ({item}) => (
    <Card disabled={true} >
      <ListItem  accessoryLeft={<Icon name="bookmark" size={26} />} title={item.name} description={item.date} onPress={() => navigation.push("Chapter",{
            url: item.url,
            title: item.name
        })}>
      </ListItem>
    </Card>
  )

  return (
    <>
      <Layout style={{flex: 1}}>
          <List 
          data={chapters}
          renderItem={Chapters}
          ListHeaderComponent={info.description ? <Description description={info.description} data={info.data}  chapter={chapters ? chapters[chapters.length-1] : false}/> : <></>}
          ListEmptyComponent={<Card disabled={true} >
            <Text>Loading...</Text>
        </Card>}
          />
      </Layout>
    </>
  );
}
