import express from 'express';
import React from 'react'
import {renderToString} from "react-dom/server";
import {ReactCompanyList} from "../components/company";

export const renderCompanyList = express.Router();

/* GET home page. */
renderCompanyList.get('/', (req, res, next) => {
  const jsx = (
      <ReactCompanyList primary>test</ReactCompanyList>
  );
  const reactDom = renderToString( jsx );

  res.writeHead( 200, { "Content-Type": "text/html" } );
  res.end( htmlTemplate( reactDom) );
});

function htmlTemplate( reactDom ) {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>React SSR</title>
        </head>
        
        <body>
            <div id="app">${ reactDom }</div>
        </body>
        </html>
    `;
}