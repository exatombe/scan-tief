import cheerio from "cheerio";

import {parse} from 'himalaya';

import { Image } from 'react-native'
export async function scrapMainPage(){
   let body = await fetch(`https://scan-fr.cc?t=${Date.now()}`)
   let html = await body.text();
    const $ =  cheerio.load(html);
    return {
            lastMangaUpdated: $(".mangalist .manga-item").map(function(i,el){
                return {
                  chapters: $(this).find(".manga-chapter").map(function(x,ele){
                    return {
                      url: $(ele).find("a").attr("href"),
                      name: $(ele).find("a").text()
                    }
                  }).get(),
                  scanName: $(this).find("h3").find("a").text(),
                  url: $(this).find("h3").find("a").attr("href"),
                  date: $(this).find(".pull-right").text()
                }
              }).get(),
            hotManga: $("div .hot-thumbnails .span3").map(function(i,el){
                return parse($(this).html())
              }).get().filter(e => e.tagName === "div")
               .map((scan, index) => {
                 return {
                   index: index,
                   srcURL: scan.children[1].children[1].attributes[1].value,
                   srcChapter: scan.children[3].attributes[2].value,
                   img: scan.children[3].children[1].attributes[0].value,
                   name: scan.children[1].children[1].children[0].content,
                   chapter_name:
                   scan.children[5]?.children[1]?.children[0]?.children[0]?.children[0]?.content.trim().replace(/[^\d]/g, ""),
                 };
               })
        }
}
export async function scrapMangaListByUrl(url){
  let body = await fetch(`${url}/changeMangaList?type=text`)
   let html = await body.text();
    const $ =  cheerio.load(html);
    let mangaList = $("li").map(function(i,el){
      return {
        name: $(this).find("h6").text(),
        url: $(this).find("a").attr("href")
      }
    }).get()
    return mangaList
}
export async function scrapMangaList(){
    const mangaList = await (await scrapMangaListByUrl("https://scan-fr.cc")).concat(await scrapMangaListByUrl("https://www.frscan.cc")).concat(await scrapMangaListByUrl("https://mangascan.cc"));
    return mangaList
}

export async function scrapMangaFiche(url)
{
  let body = await fetch(`${url}?t=${Date.now()}`)
 let html = await body.text();
  const $ =  cheerio.load(html);
  let dd =  $(".dl-horizontal dd").map(function(i,el){
      return $(this).text().trim().split("\n").join(" ").trim().replace(/(\r\n|\r|\n)/g, '')
  }).get(),
  dt=  $(".dl-horizontal dt").map(function(i,el){
      return $(this).text().trim().split("\n").join(" ").trim().replace(/(\r\n|\r|\n)/g, '')
  }).get();
  let data = dd.map((e,i) => {
      return {
          key: dt[i],
          value: e
      }
  }).filter(e => !e.key.includes("Note"))

let values = {
  infoData: {
      data: data,
      description: $(".row .col-lg-12 .well").find("p").text()
  },
  chaptersList:$("li").filter(function(i,el){
      if($(this).attr("class")){
          return $(this).attr("class").includes("volume-");
      }
  }).map(function(i,el){
      return {
          chapterNum: $(this).find("h5").find("a").attr("href").split("/")[5].trim(),
          name: $(this).find("h5").find("em").text() ? $(this).find("h5").find("a").text().trim() + " : " + $(this).find("h5").find("em").text().trim() : $(this).find("h5").find("a").text().trim(),
          url: $(this).find("h5").find("a").attr("href").trim(),
          date: $(this).find(".action").find("div").text().trim()
      }        
  }).get()
}
  return values;
}

export async function getChapitre(url){
  let body = await fetch(`${url}?t=${Date.now()}`)
   let html = await body.text();
    const $ =  cheerio.load(html);
    let data = {
      chapterList: $("#chapter-list").find(".dropdown-menu li").map(function(i,el){
        return {
          url:$(this).find("a").attr("href"),
          name:$(this).find("a").text(),
          isCurrent:$(this).attr("class") ? true : false
        }
      }).get(),
      pageList:$("#all").find("img").map(function(i,el){
        return {
          url: $(this).attr("data-src").trim()
        } 
      }).get()
    }
    return data;
}