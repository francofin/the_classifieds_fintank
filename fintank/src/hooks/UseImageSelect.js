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



const imagesForConsumers = consumerImages.consumerImages.concat(econImages.econImages[2]);
const imagesForMaterials = materialImages.materialImages.concat(commodityImages.commodityImages[7], commodityImages.commodityImages[4])
const imagesForTechnology = techImages.techImages;
const imagesForFinance = financeImages.financeImages.concat(consumerImages.consumerImages[1], marketImages.marketImages[6], marketImages.marketImages[7]);
const imagesForEconomy = econImages.econImages.concat(extraImages.homeImages);
const imagesforMarkets = marketImages.marketImages.concat(extraImages.homeImages);
const imagesForPolitics = politicImages.politicImages;
const imagesForWar = conflictImages.conflictImages;
const imagesForHealthCare = hcImages.hcImages;