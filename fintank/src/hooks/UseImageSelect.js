import React, {useEffect, useState} from 'react'
import bannerImages from "@data/banner.json"
import econImages from "@data/econ.json"
import energyImages from "@data/energy.json"
import hcImages from "@data/health-care.json"
import marketImages from "@data/markets.json"
import materialImages from "@data/material.json"
import techImages from "@data/technology.json"
import commodityImages from "@data/commodities.json"
import consumerImages from "@data/consumer.json"
import conflictImages from "@data/conflict.json"
import industrialsImages from "@data/industrials.json"
import financeImages from "@data/finance.json"
import extraImages from "@data/home-images.json";
import politicImages from "@data/politic.json";
import usImages from "@data/us.json";
import russiaImages from "@data/russia.json";
import midEastImages from "@data/mideast.json";
import japanImages from "@data/japan.json";
import cnImages from "@data/china.json";
import communicationImages from "@data/communications.json";
import alemanImages from "@data/aleman.json";
import africaImages from "@data/africa.json";
import latamImages from "@data/latam.json";
import commodImages from "@data/commodities.json";


const imagesForConsumers = consumerImages.consumerImages.concat(econImages.econImages[2]);
const imagesForMaterials = materialImages.materialImages.concat(commodityImages.commodityImages[7], commodityImages.commodityImages[4])
const imagesForTechnology = techImages.techImages;
const imagesForFinance = financeImages.financeImages.concat(consumerImages.consumerImages[1], marketImages.marketImages[6], marketImages.marketImages[7]);
const imagesForEconomy = econImages.econImages.concat(extraImages.homeImages);
const imagesforMarkets = marketImages.marketImages.concat(extraImages.homeImages);
const imagesForPolitics = politicImages.politicImages;
const imagesForWar = conflictImages.conflictImages;
const imagesForHealthCare = hcImages.hcImages;
const imagesForUS = usImages.usImages;
const imagesForChina = cnImages.chinaImages;
const imagesForCommunications = communicationImages.communicationsImages;
const imagesForMiddleEast = midEastImages.mideastImages;
const imagesForAfrica = africaImages.africaImages;
const imagesForLatam = latamImages.latamImages;
const imagesForRussia = russiaImages.russiaImages;
const imagesForAleman = alemanImages.alemanImages;
const imagesForIndus = industrialsImages.industrialsImages;
const imagesForJapan = japanImages.japonImages;
const imagesForEnergy = energyImages.energyImages;
const imagesForComodities = commodImages.commodityImages;



export const useImagesSelector= (newsType) => {

    //first param is passed into the funtion i.e. URL
    //econd param is function that calls the param
    const [images, setImages] = useState()

    useEffect(() => {
        switch(newsType){
            case "markets":
                setImages(imagesforMarkets)
            case "economy":
                setImages(imagesForEconomy)
            case "politics":
                setImages(imagesForPolitics)
            case "inflation":
                setImages(imagesForEconomy)
            case "war":
                setImages(imagesForWar)
            case "etaunido":
                setImages(imagesForUS)
            case "china":
                setImages(imagesForChina)
            case "russia":
                setImages(imagesForRussia)
            case "mediooeste":
                setImages(imagesForMiddleEast)
            case "aleman":
                setImages(imagesForAleman)
            case "japon":
                setImages(imagesForJapan)
            case "africa":
                setImages(imagesForAfrica)
            case "suram":
                setImages(imagesForLatam)
            case "tech":
                setImages(imagesForTechnology)
            case "energy":
                setImages(imagesForEnergy)
            case "health":
                setImages(imagesForHealthCare)
            case "finance":
                setImages(imagesForFinance)
            case "cons":
                setImages(imagesForConsumers)
            case "materials":
                setImages(imagesForMaterials)
            case "comm":
                setImages(imagesForCommunications)
            case "indus":
                setImages(imagesForIndus)
            case "oil":
                setImages(imagesForComodities)
    }
    }, [newsType])

    return images

}