import cheerio from "cheerio";
import { Context } from "telegraf";
import axios from "axios";
import { primaryMovieSite, secondaryMovieSite } from "../lib/constants";
import * as levenshtein from "fastest-levenshtein";

const getSearchText = (text: string) => {
  const searchText = text.split("/search")[1].trim();
  return searchText.replaceAll(" ", "-");
};

const fetchResults = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return null;
  }
};

export default async function seachHandler(ctx: Context) {
  const searchTextWithHyphens = getSearchText(ctx.message['text'] as string);
  const fallbackUrl = `${secondaryMovieSite}/search/${searchTextWithHyphens}`;
  const primaryUrl = `${primaryMovieSite}/search/${searchTextWithHyphens}`;

  const response = await fetchResults(primaryUrl) || await fetchResults(fallbackUrl);

  if (!response || response.status !== 200) {
    return ctx.reply("Something went wrong");
  }

  const baseUrl = response.request.host === "movie4kto.net" ? secondaryMovieSite : primaryMovieSite;
  const $ = cheerio.load(response.data);
  const results = parseResults($, baseUrl);
  const closestMatch = results.reduce((prev, curr) => {
    const prevDistance = levenshtein.distance(searchTextWithHyphens, prev.title);
    const currDistance = levenshtein.distance(searchTextWithHyphens, curr.title);
    return prevDistance < currDistance ? prev : curr;
  });

  ctx.reply(`${closestMatch.title} - ${closestMatch.url}`);
}

const parseResults = ($, baseUrl) => {
  return Array.from($(".flw-item"), (element) => {
    const titleContainer = $(element).find(".film-detail");
    const foundTitle = $(titleContainer).find('h2').text().trim();
    const posterContainer = $(element).find(".film-poster");
    const url = baseUrl + $(posterContainer).find("a.film-poster-ahref").attr('href');
    return { title: foundTitle, url };
  });
};

