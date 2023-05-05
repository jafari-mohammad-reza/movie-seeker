import cheerio from "cheerio";
import { Context } from "telegraf";
import axios from "axios";
import { primaryMovieSite, secondaryMovieSite } from "../lib/constants";
import * as levenshtein from "fastest-levenshtein";

export default async function seachHandler(ctx: Context) {
  
  const search_text = (ctx.message['text'] as string).split("/search")[1].trim();
  const search_text_with_hyphens = search_text.replaceAll(" ", "-");
  const fallbackUrl = `${secondaryMovieSite}/search/${search_text_with_hyphens}`;
  let baseUrl = primaryMovieSite;
  const response = await axios.get(`${primaryMovieSite}/search/${search_text_with_hyphens}`)
    .catch(async () => await axios.get(fallbackUrl));
  
  if (response.status !== 200) {
    return ctx.reply("Something went wrong");
  }
  baseUrl = response.request.host === "movie4kto.net" ? secondaryMovieSite : baseUrl;
  const $ = cheerio.load(response.data);
  const results = parseResults($, baseUrl);
  const closestMatch = results.reduce((prev, curr) => {
    const prevDistance = levenshtein.distance(search_text, prev.title);
    const currDistance = levenshtein.distance(search_text, curr.title);
    return prevDistance < currDistance ? prev : curr;
  });
  const { url, title } = closestMatch;
  ctx.reply(`${title} - ${url}`);
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

