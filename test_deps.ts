export {  config  } from "https://deno.land/x/dotenv/mod.ts";
export { assertEquals,assertArrayIncludes,assertExists } from "https://deno.land/std@0.95.0/testing/asserts.ts";

function makeid(length : number) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

export { makeid };
