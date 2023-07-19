import axios from 'axios';
import { parse } from 'node-html-parser';
import { Request, Response } from "express";

import { parseSite } from './parse';

interface SiteData {
  name: string;
  content: string;
}

export const getParsedUrlRoute = async (req: Request, res: Response) => {
  if (!req.query.url) {
    return res.status(404).json({success: false, msg: 'Must supply a valid URL!'});
  }

  let visitedUrls: string[] = [];
  let pTags: string[] = [];

  let url: string = req.query.url as string;
  console.log(url.split('/'));

  let data: SiteData[] = [];

  let hasNextAnchor = true;
  while (hasNextAnchor) {
    visitedUrls.push(url);
    
    const html = (await axios.get(url)).data;
    const root = parse(html);
    
    const pagePTags = root.getElementsByTagName('p');
    let currentPTags: string[] = [];
    for (let pTag of pagePTags) {
      for (let pTagChild of pTag.childNodes) {
        if (pTagChild.nodeType == 3 && pTagChild.rawText.trim() != '') {
          pTags.push(`<p>${pTagChild.rawText.trim()}</p>`);
          currentPTags.push(`<p>${pTagChild.rawText.trim()}</p>`);
        }
      }
    }

    const nextAnchor = root.querySelector('p.next a')?.rawAttributes;
    if (!nextAnchor) {
      hasNextAnchor = false;
      continue;
    }

    const splitUrl = url.split('/');
    const currentUrlName = splitUrl[splitUrl.length - 1];
    splitUrl[splitUrl.length - 1] = nextAnchor['href'];
    url = splitUrl.join('/');

    data.push({
      name: currentUrlName,
      content: currentPTags.join('\n')
    })
  }
  
  // res.set('Content-Type', 'text/html');
  // return res.send(pTags.join('\n'));

  return res.json({
    success: true,
    data: data
  });
}
