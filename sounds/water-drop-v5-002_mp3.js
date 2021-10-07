/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//s0xAAABPgpA1SRADEro+y3HnADAAAJopUMBGjnOc50QAmG3qIMXboDA3kNxz1O4neD7+f/OFHf//6wQcMgFAhEAqFIhAYCAIAztARk4RukdsK8f4Xn6GKAOiuLUAMC/Yg4lixeQIQnEgd/IGSpM0buP/q78m7oY//+NNf///nnz///8wwmstAFrFbAMGch//s0xAQAB3w9aTzzADD/iCnpl5ic07aGoAzCHD1E5OlQstHyuZnxFiSW//XYUDQdxFBU7gqCoNVgrMYdDRUNO6wVez/+sFXYK+AftY47GBUtQI7rVDdwEBXznQtQq4/ZnxoACiMt1mTRH4yZR8FUAINGTg9YZLACVDpsOmnnfukcRcjJcl1uCTqwB2Wyy22g//s0xAOAB3SPX6ekSvD7D2f1tJlMAMqORA6oInZ4RmIxXw8lgskqFQ+IzJtCe7R2CiotWKNQCJLCtypFDqz/ZQaBWpDocp5nRGhgAxRNzVwAC9xyWrQ+YhGlDz1SG22jwSaA4LFUBY0KlGrmXznlb6OxXn65hpZq0ei+/tMG9TSTrh0blnizcfUMAFzSvXVg//s0xAOAR4yDP62kaWDmk6Ylsw2kAczeR9IUIhk5AaQsb6UjCILkAaRqmkDLt7GMvl2M9jZHpHKpKhEDJWFBVZjqx3EoXDaSxv1iENv31nKMs4QbBQabzNiUw46lrGmRQuxQhVAwBfN2SJmoc4Jmm89JeshhargnPWGvWTJSBD+k9W6JWa2NPxb4oCDAIvOv//s0xAYDR/hZHg5gxoD9D6QFtg2Ydc0gLzVJQkZMJFh+U2aFaMJBXDmSKxis3zUd9bX3oqYJSotaUUSWAUkYxpUQD3NZ//J/os+U3EcmUmBhZpoqetVnnlJhYmlEvVhEmnikXSMLh0MzArsIZ8oWNtIxDlYZ/KyBS15CWkTPimkHunn6Nn//6gAAZJtfAAVt//s0xAQAR6xFNYRsReDtDadkfJi+LANdBmwjPkeAaAqxrmQ0aKmurCpkxhBcSFR7LOwnDD00wYqBIKDgBMxfzuxxEBRgsUB38jLhIX8/HqAJDy5i4wGBSeTXGgn2eZc0LkLEJYhLEoTsfOdIRkqqOJC5XC5df//1hZBfcKBRQs4TCWFNETJwOiAai0uFAq1B//s0xAUABixDJiVh5NCvBud0FLCedQOECVDWkUS1MhiiNS+fwYS+S05UwpCXN7yLK3Kg1dTema/////zzhSbTUbYdBAWUtKqnQFBlng6JIDS2H+mLg4lmWmASHkQVO5Civ+nF/1f//TVljcckslrAACx1syWAY/lhUEolNpPlULcrrp1mH09JAAAEACFALK2//s0xBOAA8wpQ6CZhPClHSLoEwh2Y4fZGmPZLToOpRGX0ZmbRf/1Zf/0dP+T////6v8Ad/EStlbjkkssDYDmqLKfOgGKkLes8tT2/rtkU///2/6drcNbNbdbGA4kCrhlQFlWHYvdzzaVnZbW49v9/9/5KK/katuOBtttQBIARJAzZ1HZUBC7j3bYd/////5b//s0xC0AA7ABMaCERzCHACR0EIzm/JAKTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//s0xEqBw3QBC6CEQDAEgEAAYAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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