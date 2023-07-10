/*
Try to parse multiple kinds of pages, include failovers, etc. The point is to parse the pages somewhat well-enough for a human to go in and fix the
page with relative ease.
*/
import { M_SITE_URL, R_SITE_URL } from "@config/constants";

const parseMSite = (url: string) => {
  console.log(url)
}

const parseRSite = (url: string) => {

}

export const parseSite = (url: string) => {
  if (url.includes(R_SITE_URL)) {
    parseRSite(url);
  }
  else if (url.includes(M_SITE_URL)) {
    parseMSite(url);
  }
}
