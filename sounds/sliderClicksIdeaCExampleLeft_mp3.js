/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAFAAAGngB9fX19fX19fX19fX19fX19fX19sbGxsbGxsbGxsbGxsbGxsbGxsbHQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0Ovr6+vr6+vr6+vr6+vr6+vr6+vr//////////////////////////8AAABQTEFNRTMuMTAwBLkAAAAAAAAAABUgJAM8QQAB4AAABp58cOzcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uwxAAACXwJPaEIACkniqZ1t5kVAAMlu2//+4DhxwCp2bw/MPQCAAAAz44eHgAAAAAGHh4eHgAAAACMPDw8PAAAAAAMPDw8PAAAAAAMPDx+wB3DPzDw8PAAAAAMw8PbHgANFuS3/4AAwAJOH7z3WMzVpOJbQclJwxdH+ErgGwapb1WvkrR5MCQPC1np1GO5Z57zFp7a6KawWtSVdMUpr0oouFUUeo5Tv8ttABABt399AABICRnJM50uIhhVHp3rOxgKEzG0TFtS0RiF1g3aDCgyAWkbgfEBL5W+S2haYsyGryKzqswZmX2LasOcBF1QFlbfMQVvU6lcVgNkDUSpW4hUChSc0EqKteVaH0//////////6v/pAB6EJUu9MXkQwDIDqo4M6bs46asxuENGJC1QZIIuUs4KAGga11oMFT4JCZXOQmaRELMYmSzSSKtQ4hgMgkUBqCgNFgbaCR6LsPC6W//////////q/+sABGQ4h334AAATpM/WOCBCrU3CuMzBiANU0RTSTdVcq6GG1B8bEITJRCFSFPNlbMbj6bCoacKA0E4GLf///////////Wrcj+66fcNqVQA8y1TEfgAwLY6ghN2j17YoYQKWhaNcZMECD+FoRxQzrg60s/Su50GgOp4KKcd/////////////6aMFZ1mYngAAAB5jAxHcKUOaqHgYCwNGQSQXwwwMJhJ4x3ITZyKZ+qX76newoPegAB/////////////////3SBvERDuDxAEcWMBzktgAsJujMkBrsiMQZROh9D+Yk89YRLf////////////////lFUxBTUUzLjEwMFVVahYIAAz/+2DE44BNgIUrruBp4VgKJXXOpGywWpDYQDUBNgHE1YgRg7Oj////p////////oqUqilLR/qQVYxlKWzgxIbVgz1KYplYMUqGMFBOLUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zDE+oBJlEcn7W0jIOWGJb2MvFRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+yDE+wDHxD8r7GniIMCE5TmMPJRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQxPSDx5nlEoiAU8gAAD/AAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
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