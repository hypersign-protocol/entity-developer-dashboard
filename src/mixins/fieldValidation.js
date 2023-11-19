import validURL from 'valid-url'

export function isValidURL(str) {
    return  validURL.isUri(str);
}
// export function isDomain(str)
// {
// const regexp = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i;
  
//         if (regexp.test(str))
//           {
//             return true;
//           }
//         else
//           {
//             return false;
//           }
// }
export function isValidSchemaAttrName(str) {
  const regExp = /(?!^.*[A-Z]{2,}.*$)^[a-z][A-Za-z]*[0-9]*$/
  if(regExp.test(str)){
    return true
  } else {
    return false
  }
}
export function isValidOrigin(str) {
  const regex = /^(https?:\/\/[^ ]+|\*)$/
  if(regex.test(str)){
    return true
  } else {
    return false
  }
}
export function isEmpty(str) {
    if (str == " ") {
        return true;
    }
    if (!str) {
        return true;
    }
    return false;
}

export function isDate(date) {
    if (!date) {
        return false;
    }
    return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
}
export function ifSpaceExists(str) {
  str= str.trim()
  str = str.split(' ')
  if (str.length > 1) {
     return true
  }
  else return false 
}
 
export function isValidDid(str) {
  str = str.split(':')
  if (str[0]!=='did') {
    return false
  } else if(! (str.length==3 || str.length==4)) {
    return false
  }
   else {
    return true
  }
}

export function isFloat(n) {
  if(n === n && n % 1 !== 0){
      return true;
  }else{
      return false;
  }
  }