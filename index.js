const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
    //console.log("Accessed the server");
    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    //console.log(pathName);

    // PRODUCTS OVERVIEW
    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        //res.end('This is the PRODUCTS page');

        fs.readFile(`${__dirname}/template/template_overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;

            fs.readFile(`${__dirname}/template/template_card.html`, 'utf-8', (err, data) => {
                const cardOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARD%}', cardOutput);
                res.end(overviewOutput);
            });

        });
    }

    // LAPTOP DETAILS
    else if (pathName === '/laptops' && id < laptopData.length) {
        res.writeHead(200, { 'Content-type': 'text/html' });
        //res.end(`This is the LAPTOP page for laptop id- ${id}`);

        fs.readFile(`${__dirname}/template/template_laptop.html`, 'utf-8', (err, data) => {
            //Replacing the placeholders
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            res.end(output);
        });
    } else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img/${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg' });
            res.end(data);
        });
    }
    // ERROR MSG FOR ERROR IN ROUTE
    else {
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('URL not found...');
    }

});

server.listen(1400, '127.0.0.1', () => {
    console.log("Server is listening to request");
});

function replaceTemplate(originalHTML, laptop) {
    let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);

    return output;
}