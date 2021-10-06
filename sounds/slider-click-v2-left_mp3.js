/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAB4Q7OnWEgBEOj+0rMoACAJKY4LTo/xZKgCAMhDIAvhDKEhFBplWG4fl+UoBMNk+/3OaBgMQQBMP/B8P4IO+UdwQOf+sHAQBA5//3AAVKefuCUCgAAAACMM2USoCbVzORGiXrcx4qdqHvO1ilu/sLlm/gHAXgAUof/IeOPGix1z+p6RJqpt/9nGBcuOEv9yUAARklIk+D//syxAOCCGRVLV3EABC0A2MpjSRKA42M0mQOPxk5HmgkEdJexpMfBcKmKhiYZByjK7X558phl2QVA2O/KOFhVf/1/aRUFTol/Xo/7f/R/R/1AWw20lgmSZBlsRBg6uoXDGSAqZDZsSolQVKnSKh1bpL/lXeVd//Wd/5Z87/0qnXYrGAABAAwg7wMATwZUIUCZCTASQupAAFsGgL88P/7MsQPA8U4Jr2HpeIgAAA0gAAABFWyU///////+LCwjkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=';
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