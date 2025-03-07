function removeSlash(url = '') {
  let newUrl = url;

  if(url[url.length - 1] === '/') {
    newUrl = url.slice(0, -1);
  }
  return newUrl;
}

function removeDollarSign(price = '') {
  let newPrice = price;

  if(price[0] === '$') {
    newPrice = price.slice(1);
  }
  return newPrice;
}

function checkurl(url = '') {
  let newUrl = url;

 
  return newUrl;
}

module.exports = {
    removeSlash,
    removeDollarSign,
    checkurl,
    };