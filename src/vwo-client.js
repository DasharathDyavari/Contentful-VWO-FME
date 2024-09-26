const { init } = require('vwo-fme-node-sdk');

export default class VwoClient {
   constructor({ authToken, onReauth }){
      if(!authToken || typeof authToken !== 'string'){
         throw new Error('You have to provide a valid token id');
      }

      this.expires = Date.now() + 1 * 60 * 1000;
      this.accessToken = authToken;
      this.onReauth = onReauth;
      this.baseUrl = 'https://app.vwo.com/api/v2';
      this.onReauth = onReauth;
      this.vwoClient = null;
   }

   makeRequest = async url => {
      const response = await fetch(url, {
         headers: {
            Authorization: `Bearer ${this.accessToken}`
         }
      });

      if(response.ok){
         return await response.json();
      }

      this.onReauth();
      return Promise.reject(
         new Error(`request failed for url: ${url} with status: ${response.status}`)
      );
   };

   createFeatureFlag = async() => {

   }
}