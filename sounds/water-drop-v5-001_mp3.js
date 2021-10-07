/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//s0xAAABPgpA1SRADEro+y3HnADAAAJopUMBGjnOc50QAmG3qIMXboDA3kNxz1O4neD7+f/OFHf//6wQcMgFAhEAqFIhAYCAIAztARk4RukdsK8f4Xn6GKAOiuLUAMC/Yg4lixeQIQnEgd/IGSpM0buP/q78m7oY//+NNf///nnz///8wwmstAFrFbAMGch//s0xAQAB3w9aTzzADD+CCnpl5ic07aGoAzCHD1E5OlQstHyuZnxFiSW//XYUDQdxFBU7gqCoNVgrMYdDRUNO6wVez/+sFXYK+AftY45GBUtQI7rVDdwEBXznQtQq4/ZnxoACgmW6zJoj8ZMo+CqAEGjJwesMlgBKh02HTTzv3U5HkZLkutwSdWwF2Wyy22g//s0xAOAB4SPX6ekSvDyDybpxg1UAMqORA6oInYlGZiMViHksFklQqHxsybQnu0eFAotWKNQCJLAW5Uih1Z6dlBoFakOhynmdEaABuBKaUAHLD+vay8xpASKIw+GAzNXz1BmqFQhJTirpkolntyw4JtgxFlnZbTsKvOKgPCazFCWIbh2K6SSDACktts0DAGt//s0xASAB+x9Pa2YbuD1E6e1ow3ct4/kDChCdYKIGMeiL6Q86bsONT4xYIRirISRSrUNWx1EktptYVQurWHCkGhkFgPhNzUPeb/9YZEW0u1trAAx7VchuaEk4MEiGtTWK+DYm/sQC/WdMRz1RpEzx6Gotrz5K9YjCqrw/rHb8IqQId//KdEzn23gHNbKtpzy//s0xAODx1RhJC4kapDpjGPBjhiYACBcanXOaYsFSCj+AQBI4mwrBo5JyL7hLJkRwSYiHw1FlR3EI56rUKasqXDMY28V/ZZ/S02A3JjyCUxkNXjg8xyzhZLEhIDgukC3aUzRw4gKKec7nTDtFMuLZf5tW3L5MjYEXPBpEUexKVn0DOwEgDACVZwRH2PpumAp//s0xAaACBCHHnWzABEFEagjMsAAxwNEYNjGfEACQGXy2PTmErpSeYg8kIQ9zDYgr0PKaCBBUXVnnnIT735HybZSEHLq3Hf5MABljFmAAD8db+4SAOQ8wcw0wXM5YfyC3MrYs0OulQeVJqllq3/N4MMZt/3+bIw7DPg+5j7M07rzchrCqmjXOo+hCAK/NwA///s0xAMARwh3LT2hgAjSjeTUbIyq+4UylSxmjggeEHjoPzEiyYCWASXEFzdUEGJhwisK34plz/4bBlc/zYj4GAoRTa+jXXxALwN4nD518Fb0LjHcN1w1+A1w+kgwhibB4ZYQrhEhRBI4w6mrqXkaRVwg9P0GYUMA+UN/1GAABkvCzs2qVuq9VSrKNDIN2FAY//s0xAoABuR/IkFoxYiQhqh0FhkeU35dXVeKxlqjL6PJId8an7/X37bNX79v6OPOJeTQkoKsKo7aI5EnIJHAAFfmjUCUmLSJcchyWyQiGEtlbt32WjTpGDT/dfvqCBV52ajgmTOvotZnJeYv0lqCBhv4gqNT7hq/KXZa9Kew0t6wC7iL68qe3ZH/4adSKAAL//s0xBmABdA9CCCbQQCNhiL0EaWOaiUgE1PJ2GTalwCCwavYDU9hose6YVoEPbnt3/9n05bqGkZthAAARFnrXCT1Tp01sDtfCbv/QFlMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//s0xC4BwvQBB6CEYDAEgEAAkAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;