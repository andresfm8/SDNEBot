/**
 *
 * andresfm8
 * January 4, 2021
 *
 * The following file monitors any changes in the sheridan college news website and retrieve any new article to be shared in the discord server
 */
import * as  Discord from 'discord.js';
import { bot } from "../../bot";
import { Article } from  "../Entities/Article";
import { CronJob } from 'cron';
import axios, { AxiosResponse } from 'axios';
import  parse from 'node-html-parser';
import { getArticleByUrl, addArticle } from '../../database';

const url = "https://www.sheridancollege.ca/news-and-events";
//Define empty string array to store article urls
let currentArticlesArr: any[] = [];

function retrieveData(){
    axios.get(url)
    .then((res: AxiosResponse)=>{
        defineStructure(res);
    }).catch(function (err) {
        console.log(err);
    });
}
//Define the structure of the article based information retrieved
function defineStructure(res : AxiosResponse){
    //Empty currentArticlesArr and assign articles currently in the website
    currentArticlesArr = [];
    let html = parse(res.data);

    let currentData: any[] = html.querySelectorAll(".summary");
    currentData.forEach(data=>{
        let dataURL = data.querySelectorAll("p a")[0];
        let dataTitle = data.querySelectorAll("h3")[0];
        let article: Object = {
            url: dataURL.rawAttributes.href,
            title: dataTitle.rawText
        }
        currentArticlesArr.push(article);
    });
}
//Post article into selected channel
function postArticle(article: Article){// MUST check url to assure it is valid
    let url: string =  article.url;
    let title: string = article.title;
    //Some href tags contain only the path of the url after the domain
    if(!url.startsWith("https") || !url.startsWith("http")){
        url = "https://www.sheridancollege.ca" + url;
    }
    //Find channel to post article in
    let channel = <Discord.TextChannel>bot.guilds.cache.first()?.channels.cache.find(channel=> channel.name === 'general');
    //Set embed structure
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(title)
        .setURL(url)
        // .setAuthor('Sheridan College', 'https://i.imgur.com/wSTFkRM.png', url)
        .setDescription(`There is a new article about Sheridan, check it out here: ${url}`);
        // .setThumbnail('https://i.imgur.com/wSTFkRM.png');
    channel.send(embed);
}
//Compare if articles in the website exist in the database
function compareNews(){
    currentArticlesArr.forEach(async currentArticle=>{
        let tmpArticle:Article = await getArticleByUrl(currentArticle.url);
        //Add article and post in discord channel if it doesn't exist in the db
        if(tmpArticle === undefined){
            addArticle(currentArticle);
            postArticle(currentArticle);
        }
    });
}
//Check sheridan website every x minutes/hours for new articles
export function monitorNews(){
    console.log("Cronjob has started!");
    // let cronJob : CronJob = new CronJob('0 1/3 * * *', ()=>{//Every 3 hours
    let cronJob : CronJob = new CronJob('1/2 * * * *', ()=>{
        try{
            retrieveData();
            compareNews();
        }catch(err){
            console.log(err);
        }
    });
    return cronJob;
}