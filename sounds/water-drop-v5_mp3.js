/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//s0xAAABPgpA1SRADEro+y3HnADAAAJopUMBGjnOc50QAmG3qIMXboDA3kNxz1O4neD7+f/OFHf//6wQcMgFAhEAqFIhAYCAIAztARk4RukdsK8f4Xn6GKAOiuLUAMC/Yg4lixeQIQnEgd/IGSpM0buP/q78m7oY//+NNf///nnz///8wwmstAFrFbAMGch//s0xAQAB3w9aTzzADD+CCmplhjc07aGoAzCHD1E5OlQstHyuZnxFiSW//XYUDQdxFBU7gqCoNVgrMYdDRUNO6wVez/+sFXYK+AfrIo5EBMWnka6xo5ekuYNBMPyaTg5iXMmB8EzTJGTRH4ybHxKgBBoy4esMlgBKh02HTTzv3SOR5GS4K9bglVABE3/wCWy//s0xAOAB3B/Py2YTWD5D2t0F5gveAF7FnTBZUBRiAKAkgbUDVnamHIli0UyIbpXJpJk7l1fko8ybnKkULUr07KFBkbB45Ts+NdATs11u1oACRykNuEJKzozrTY0wl4GNM6gEaNOsiR86eBV6ORzz9cw0staLKfezIwb1dDGDHFNu/4z40/+lQwAXZXNrGAB//s0xAQAB7BvPa28ZuD3EKs0F6A2zN7HYhYgDQmAUsK5hYEch6sQpXvVoAVGCiKpzQx9mFIeXKowUEuDGUMwUJB0ApB1YlpAVPkXmNN9tttY4ApyiSJMIYU7hGMReP5NxGEynzEHNbWSKkacBCsS6touoxLGyS7XN/czPEUTlPE0rJJd/r/1elVRhO23S2Ng//s0xAOAB0xnS6G8wTjmDKepgaWmADU/lsog0gByF+I29KBlJmqZh0JHFuKROQZCFvK5mute2c4XZWu6+/0xxH6yT+Vw/9irZIf/qNkkAc+MyiWvUnGcvlloeMB6GekuXBgSAKjGuXdJoVLCM1j1MIOz76zwAJBwnPAJF1h5NHp/1FIgtbdbYwwAsUPO1QNC//s0xAcABqxNTaDgw3EBDackF5h+eqHVQuednFoGuQBFbG3OYXodRbqe1TOWWwQHBcRk1CzyBxqbv//9M2M9XSmBE71DRykhTwwSQNo/VgAfgKA6JhJwj4KtC1Gr9swDC7PMZsNsxrtkOzwZf/dGIGFigYOGE6OXiX//8RUAgkgBz8rlq27TDWqxdzYPY4CR//s0xAmCB7SBJsykcICzjCRInA2QDHePtoxbUQBgZCBx3lANACAqSSIVEW93+xyWl7NGc18EdWZAwoZX1t/8gMLAf3UFT0g0hMKkMyVNExLNj1VzN9kgQOVbzDl/nY0pme0bMMKUXqfr2f1ehYAkok/AdokyS1VWKFUhDiBuU4koakFSLgrEq71N0HnrdkfU//s0xBGABUw5IOGl6lCAhuW2gmAG+1P3//+7xPCkyiSko22wEduc3ZqFFv+0kSDLpr6KHdWsr/zrf/0+tRweAAIhYNBmQ1UquAAOPDjwH/1nHhRP4jPZXk+Fi/wyE7OOeofVN6/iBKy+OoY1gH0DfDoOH/X////PJkaGOcz7X6aOjr5K4wBAB4AwAgUhDdJC//s0xCmACPCVUbgXsFFho6S7AtABDAC/JeRsWYt6SkuypUXUFUuiJ6BkgXocp1p3XWjEaHMSRLI9dutHNuv6DGhc9JHrTdkHYwNCgcGEIBTSnBxE01Jximgg36kFlxvl1hQAAAAYeyAFAf/ncRA0DWWBrxF////gr+tx1UxBTUUzLjk5LjVVVVVVVVVVVVVV//s0xBcDwxQBDbwBABACAEAAEAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
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