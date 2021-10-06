/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABkgZTTSRgDE4FC53MJADAAAoaagJ21AoCAIEjlxQKEByCAPn36z+AAQBCXB8P9YPwICAY/+CDv0A+D4Pg+BAQ/pIKTcibcFuu2w+AAAAASPNrXxMSnZL9hG1IF4qcOx7/5UrcatKJ9Oyrk5ltMsTf9AUAw61utV/1htDKajUfcb/ElJ69SVah+f//m8dXGmVAAr9pSIm//syxAMAB8w1N12zADB9gqd0ZhhOBkQKAjACk1aRPI8TtEcywlMaEzCAMu8nVAz/RqmpqbICciGJEiRIPnaPBrU+sNfWy7+j/5D+r1VghJKCjAWgMA00J0OQpC4zCIDz5bf7v/z3rO////loabf9d+AEpAP0QGiS4JRJHE4jEh9lrO0qTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqv/7MsQYA8LMIvCGMSK4AAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = simLauncher.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError ).catch( e => { console.warn( 'promise rejection caught for audio decode, error = ' + e ) } );
export default wrappedAudioBuffer;