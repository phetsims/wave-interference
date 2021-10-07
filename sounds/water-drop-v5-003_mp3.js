/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//s0xAAABPgpA1SRADEro+y3HnADAAAJopUMBGjnOc50QAmG3qIMXboDA3kNxz1O4neD7+f/OFHf//6wQcMgFAhEAqFIhAYCAIAztARk4RukdsK8f4Xn6GKAOiuLUAMC/Yg4lixeQIQnEgd/IGSpM0buP/q78m7oY//+NNf///nnz///8wwmstAFrFbAMGch//s0xAQAB3w9aTzzADD/iCnpl5ic07aGoAzCHD1E5OlQstHyuZnxFiSW//XYUDQdxFBU7gqCoNVgrMYdDRUNO6wVez/+sFXYK+AftY47GBUtQI7rVDdwEBXznQtQq4/ZnxoACiMt1mTRH4yZR8FUAINGTg9YZLACVDpsOmnnfukcRcjJcl1uCTqAJt1JLQAJ//s0xAOAR7iPQ00kauDsj2h1pg0cbFo42yJoF3grAmFGlu0zfLBZKJCdEZk2hPdpyCisW5KNwCTVQpfrMULqnz8qDgVeMHY5TzOiNEABrrk115xyWoxsw2kis+zTYuTEZ4TiUcrIVJ8olnVaWHBNsGEjMJzoS2nYX/FQLjHyRi4ckblnizcfAAJWqwAvV2oO//s0xASAR8iDLy1wZQjvE+Xlsw2kQnmZLmfMNgGLA8HlVWjNefeGH6jcpgYAVDoBRLMYgx8MwEV1OWEqF1VZgpRjJYdAdd8WJyXEAWaWZ3KUrEQbHhk8XVEnlqTuqHKpQuxMhVHAFH1ppEzxlDUWb/pV6xGFKnD+sducyUgQ//5TonAifWpViu3b7ayNgIz0//s0xAUAB7hZU6C8wTDdDOn08ZmuVa4LuBqwCcHQpFSs3NrRhJfcyQowpANtIpK++loh2NC4ICVirUKasAlwywJNQxemwq7/pUgM1l2usEgGu9hK0uSfBSiN6Qs8TCVqm2Sf3ooSCrAEGHCWCz+cYvAsjyiC7x2EMiWW3/d/9upuISS222ONgLJtXCRn4Q4s//s0xAgABoxPSaC8wXDUjedkF4xmmQHtIsSRIexd4r5rEGfM1AZLdPkDjBMIVHLlY/ZK3fTnf/ktQ2Nf/7+CkdS4jJBuiTACUCcHwNRz0syLAnBjAXGVQgpdAZzXk/BHxgYCDsZfz3lP2f/Janl1ALJLbkkjggC+NCMkKohoALgIpXPIpRbg0kKICpotFsP9//s0xBCARRghM6Cx4uC6kGUk8JocnN/s7f///nQACRaTX+fiFJo5U7Z8qi3APIgR0KOfG5+/4cv/Nu75AzYQQcHC6IJpqBD////9Sq5ADX/+6vnyITmkWTsV8A3AD59F7WlGKFVlB2prd1dDaPW2uwe08dHZKJ2MiCHpCA9Gueaet0wDCAAQSiSxwFOZVpqg//s0xCIABuSFJEeVkMDEBuS0E2DKFLpKwFMVyCsqcTuv7Z5Vq2fvJUhQ8S1gqCoLPNh3JfiL///0VS5QGTaVYA3ZHk7AhYeeIrt2e2pWIn7vskZ7+qpUpN1IASxSJawEH0yOGvln1bqn1+eX/pLf/X1Kutkjd211AADHFSLXWjyVEc/cz6auSYgEakxBTUUz//s0xCsBA2glJUCASjBwgGHoAIgGLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//s0xEyBwuABCaCEQDAFAEAAkAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
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