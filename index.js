const fs = require('fs')
const http = require('http');
// const { json } = require('stream/consumers');
const url = require('url');

const replaceTemplate = require('./module/replaceTemplate');

// Files /////////////////

// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `this is what we know about the avocado; ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log('File written!');

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt'), `${data2}\n${data3}`, 'utf-8', err=> {
//         console.log('Your file has been written😀');
//       } 
//     });
//   });
// });  
// console.log('Will read file!')

// server /////////////////



const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
  const dataObj = JSON.parse(data);

const server = http.createServer((req , res) => {
  
  const {query, pathname} = (url.parse(req.url, true))
  //  const pathname = req.url

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {'content-type': 'text/html'});

    const CardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}',CardsHtml);

    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    // console.log (query)
    res.writeHead(200, {'content-type': 'text/html'});
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct,product)
    res.end(output);
    // API  
  } else if (pathname === '/api' ) {
      res.writeHead(200, {'content-type': 'application/json'});
        res.end(data);

        // Not found
  } else {
    res.writeHead(404, {
      'content-type':'text/html',
      'my-own-header':'hello-world'
    });
    res.end('<h1>Page not found!</h1>');
  }
});
  
server.listen(8000,'127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
}) 