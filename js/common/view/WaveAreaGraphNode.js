// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shows the semi-transparent graph over the lattice area (when selected).
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const DashedLineNode = require( 'WAVE_INTERFERENCE/common/view/DashedLineNode' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const SceneToggleNode = require( 'WAVE_INTERFERENCE/common/view/SceneToggleNode' );
  const Shape = require( 'KITE/Shape' );
  const SoundClip = require( 'TAMBO/sound-generators/SoundClip' );
  const soundManager = require( 'TAMBO/soundManager' );
  const Utils = require( 'DOT/Utils' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WaveInterferenceUtils = require( 'WAVE_INTERFERENCE/common/WaveInterferenceUtils' );
  const arrayRemove = require( 'PHET_CORE/arrayRemove' );
  const phetAudioContext = require( 'TAMBO/phetAudioContext' );

  // sounds
  // const sineSound = require( 'sound!TAMBO/ethereal-flute-for-meter-loop.mp3' );

  // sounds
  // const etherealFluteSound = require( 'sound!WAVE_INTERFERENCE/ethereal-flute-for-meter-loop.mp3' );
  // const organ2Sound = require( 'sound!WAVE_INTERFERENCE/organ-v2-for-meter-loop.mp3' );
  // const organSound = require( 'sound!WAVE_INTERFERENCE/organ-for-meter-loop.mp3' );
  // const sineSound = require( 'sound!TAMBO/220hz-saturated-sine-loop.mp3' );
  // const sineSound2 = require( 'sound!WAVE_INTERFERENCE/220hz-saturated-sine-playback-rate-75.mp3' );
  // const stringSound1 = require( 'sound!TAMBO/strings-loop-middle-c-oscilloscope.mp3' );
  // const windSound1 = require( 'sound!TAMBO/winds-loop-middle-c-oscilloscope.mp3' );
  // const windSound2 = require( 'sound!TAMBO/winds-loop-c3-oscilloscope.mp3' );
  // const windyTone4 = require( 'sound!WAVE_INTERFERENCE/windy-tone-for-meter-loop-rate-75-pitch-matched-fixed.mp3' );
  // const windyToneSound = require( 'sound!WAVE_INTERFERENCE/windy-tone-for-meter-loop.mp3' );

  // const etherealFluteSound = require( 'sound!WAVE_INTERFERENCE/shepherds-tone-loop-pitch-fall.mp3' );
  // const etherealFluteSound = require( 'sound!WAVE_INTERFERENCE/shepherds-tone-loop-single-notes.mp3' );
  // const etherealFluteSound = require( 'sound!WAVE_INTERFERENCE/melodic-graph-falling-tones-001.mp3' );
  // const melodicGraphFallingTones = require( 'sound!WAVE_INTERFERENCE/melodic-graph-falling-tones-001-fade1.mp3' );
  // const melodicGraphFallingTones = require( 'sound!WAVE_INTERFERENCE/oceanwave.mp3' );
  // const melodicGraphFallingTones = require( 'sound!WAVE_INTERFERENCE/noise-single.mp3' );

  const atonalSound = require( 'sound!WAVE_INTERFERENCE/fan-loop.wav' );
  // const atonalSound = require( 'sound!WAVE_INTERFERENCE/ocean-wave-loop.wav' );
  // const atonalSound = require( 'sound!WAVE_INTERFERENCE/rain-loop.wav' );
  // const atonalSound = require( 'sound!WAVE_INTERFERENCE/shhhh-loop.wav' );

  // const sounds = [ sineSound2, windyTone4, stringSound1, sineSound, windSound1, windSound2, etherealFluteSound, organ2Sound, organSound, windyToneSound ];
  // const selectedSound=windyTone4;
  // const selectedSound=stringSound1;
  // const selectedSound=windSound1;
  // const selectedSound=etherealFluteSound;// several votes!  :)  EM says it is a bit harsh,
  // const selectedSound=organSound;

  // constants
  const TEXT_MARGIN_X = 8;
  const TEXT_MARGIN_Y = 6;
  const getWaterSideShape = WaveInterferenceUtils.getWaterSideShape;

  // Curve radius for the roundings on corners and tabs
  const RADIUS = 5;

  const GRID_LINE_OPTIONS = { stroke: 'gray', lineWidth: 1, lineDash: [ 4, 4 ] };

  class WaveAreaGraphNode extends Node {

    /**
     * @param {WavesModel} model
     * @param {Bounds2} waveAreaBounds
     * @param {Object} [options]
     */
    constructor( model, waveAreaBounds, options ) {
      super();

      const graphWidth = WaveInterferenceConstants.WAVE_AREA_WIDTH;

      // Manually tuned so the graph is the appropriate height.  Note if you adjust graphHeight, you will
      // need to adjust the value of dy (argument to getWaterSideShape) accordingly.
      const graphHeight = WaveInterferenceConstants.WAVE_AREA_WIDTH * 0.3833333333333333;

      // Horizontal Axis Label, which updates when the scene changes.  Uses visibility instead of setChildren so that
      // the bottom tab will fit the largest label.
      const horizontalAxisLabel = new SceneToggleNode(
        model,
        scene => new WaveInterferenceText( scene.graphHorizontalAxisLabel )
      );

      // Scene-specific title of the chart.
      const titleNode = new SceneToggleNode( model, scene => new WaveInterferenceText( scene.graphTitle ) );

      const HORIZONTAL_LABEL_VERTICAL_MARGIN = 2;
      const sampleText = new WaveInterferenceText( '1' );
      const horizontalLineY = graphHeight - sampleText.height - HORIZONTAL_LABEL_VERTICAL_MARGIN * 2;

      // Create tick labels and grid lines
      const horizontalAxisTickLabels = [];
      const verticalGridLines = [];
      for ( let i = 0; i <= 10; i++ ) {
        const x = Utils.linear( 0, 10, 0, graphWidth, i );

        // Find the position of the tick mark in the units of the scene
        const horizontalAxisTickLabel = new SceneToggleNode(
          model,
          scene => new WaveInterferenceText( Utils.toFixed( scene.waveAreaWidth * x / graphWidth, 0 ), {
            centerX: x,
            top: horizontalLineY + HORIZONTAL_LABEL_VERTICAL_MARGIN
          } )
        );
        horizontalAxisTickLabels.push( horizontalAxisTickLabel );
        verticalGridLines.push( new Line( x, horizontalLineY, x, 0, GRID_LINE_OPTIONS ) );
      }

      const topTabBounds = new Bounds2(
        graphWidth / 2 - titleNode.width / 2 - TEXT_MARGIN_X,
        -TEXT_MARGIN_Y - titleNode.height,
        graphWidth / 2 + titleNode.width / 2 + TEXT_MARGIN_X,
        0
      );
      const bottomTabBounds = new Bounds2(
        graphWidth / 2 - horizontalAxisLabel.width / 2 - TEXT_MARGIN_X,
        graphHeight,
        graphWidth / 2 + horizontalAxisLabel.width / 2 + TEXT_MARGIN_X,
        graphHeight + TEXT_MARGIN_Y + horizontalAxisLabel.height
      );
      const lastTickLabel = horizontalAxisTickLabels[ horizontalAxisTickLabels.length - 1 ];
      const tickBubbleXMargin = 2;

      const verticalAxisLabel = new SceneToggleNode(
        model,
        scene => new WaveInterferenceText( scene.graphVerticalAxisLabel ), {
          rotation: 3 * Math.PI / 2,
          right: -TEXT_MARGIN_Y,
          centerY: graphHeight / 2
        }
      );

      // Nicknames to simplify the rounded corners in the chart
      const UP = 3 * Math.PI / 2;
      const DOWN = Math.PI / 2;
      const RIGHT = 0;
      const LEFT = Math.PI;
      const CLOCKWISE = false;
      const ANTICLOCKWISE = true;

      const outline = new Shape()

        .moveTo( RADIUS, 0 )  // start at the top left

        // Top tab with title
        .lineTo( topTabBounds.minX - RADIUS, topTabBounds.maxY )
        .arc( topTabBounds.minX - RADIUS, topTabBounds.maxY - RADIUS, RADIUS, DOWN, RIGHT, ANTICLOCKWISE )
        .lineTo( topTabBounds.minX, topTabBounds.minY + RADIUS )
        .arc( topTabBounds.minX + RADIUS, topTabBounds.minY + RADIUS, RADIUS, LEFT, UP, CLOCKWISE )
        .lineTo( topTabBounds.maxX - RADIUS, topTabBounds.minY )
        .arc( topTabBounds.maxX - RADIUS, topTabBounds.minY + RADIUS, RADIUS, UP, RIGHT, CLOCKWISE )
        .lineTo( topTabBounds.maxX, topTabBounds.maxY - RADIUS )
        .arc( topTabBounds.maxX + RADIUS, topTabBounds.maxY - RADIUS, RADIUS, LEFT, DOWN, ANTICLOCKWISE )

        // Right edge, and bubble out around the last horizontal axis tick label
        .lineTo( lastTickLabel.right + tickBubbleXMargin - RADIUS, 0 )
        .arc( lastTickLabel.right + tickBubbleXMargin - RADIUS, RADIUS, RADIUS, UP, RIGHT, CLOCKWISE )
        .lineTo( lastTickLabel.right + tickBubbleXMargin, graphHeight - RADIUS )
        .arc( lastTickLabel.right + tickBubbleXMargin - RADIUS, graphHeight - RADIUS, RADIUS, RIGHT, DOWN, CLOCKWISE )

        // Bottom tab with horizontal axis label
        .lineTo( bottomTabBounds.maxX + RADIUS, bottomTabBounds.minY )
        .arc( bottomTabBounds.maxX + RADIUS, bottomTabBounds.minY + RADIUS, RADIUS, UP, LEFT, ANTICLOCKWISE )
        .lineTo( bottomTabBounds.maxX, bottomTabBounds.maxY - RADIUS )
        .arc( bottomTabBounds.maxX - RADIUS, bottomTabBounds.maxY - RADIUS, RADIUS, RIGHT, DOWN, CLOCKWISE )
        .lineTo( bottomTabBounds.minX + RADIUS, bottomTabBounds.maxY )
        .arc( bottomTabBounds.minX + RADIUS, bottomTabBounds.maxY - RADIUS, RADIUS, DOWN, LEFT, CLOCKWISE )
        .lineTo( bottomTabBounds.minX, bottomTabBounds.minY + RADIUS )
        .arc( bottomTabBounds.minX - RADIUS, bottomTabBounds.minY + RADIUS, RADIUS, RIGHT, UP, ANTICLOCKWISE )

        // Left edge, and bubble out around the first horizontal axis tick label
        .lineTo( verticalAxisLabel.left - TEXT_MARGIN_Y + RADIUS, graphHeight )
        .arc( verticalAxisLabel.left - TEXT_MARGIN_Y + RADIUS, graphHeight - RADIUS, RADIUS, DOWN, LEFT, CLOCKWISE )
        .lineTo( verticalAxisLabel.left - TEXT_MARGIN_Y, RADIUS )
        .arc( verticalAxisLabel.left - TEXT_MARGIN_Y + RADIUS, RADIUS, RADIUS, LEFT, UP, CLOCKWISE )
        .close();

      const outlinePath = new Path( outline, { lineWidth: 1, stroke: 'black', fill: 'rgba(230,230,230,0.6)' } );
      this.addChild( outlinePath );
      horizontalAxisTickLabels.forEach( label => this.addChild( label ) );
      verticalGridLines.forEach( label => this.addChild( label ) );

      titleNode.centerX = graphWidth / 2;
      titleNode.bottom = 0;
      this.addChild( titleNode );

      horizontalAxisLabel.centerX = graphWidth / 2;
      horizontalAxisLabel.bottom = outlinePath.bottom - TEXT_MARGIN_Y;

      this.addChild( horizontalAxisLabel );

      const horizontalAxisLine = new Line( 0, horizontalLineY, graphWidth, horizontalLineY, { stroke: 'darkGray' } );
      this.addChild( horizontalAxisLine );

      // The part that displays the values (doesn't include axis labels)
      const plotHeight = horizontalLineY;

      this.addChild( new DashedLineNode( {
        centerY: plotHeight / 2
      } ) );

      // Display a minor grid line in the center of the lower and upper halves of the chart.
      [ 1 / 4, 3 / 4 ].forEach( horizontalGridLineFraction => {
        this.addChild( new Line(
          0, horizontalGridLineFraction * plotHeight,
          graphWidth, horizontalGridLineFraction * plotHeight,
          GRID_LINE_OPTIONS
        ) );
      } );

      this.addChild( verticalAxisLabel );

      // The path that shows the curve in the chart.
      const pathClipArea = Shape.rect( 0, 0, graphWidth, horizontalLineY );
      const path = new Path( new Shape(), {
        stroke: 'black',
        lineWidth: 2,
        lineJoin: WaveInterferenceConstants.CHART_LINE_JOIN, // Prevents artifacts at the wave source

        // prevent the shape from going outside of the chart area
        clipArea: pathClipArea,

        // prevent bounds computations during main loop
        boundsMethod: 'none',
        localBounds: pathClipArea.bounds
      } );
      this.addChild( path );

      // For debugging, show the peaks
      const derivativePath = new Path( new Shape(), {
        stroke: 'red',
        lineWidth: 2,
        lineJoin: WaveInterferenceConstants.CHART_LINE_JOIN, // Prevents artifacts at the wave source

        // prevent the shape from going outside of the chart area
        clipArea: pathClipArea,

        // prevent bounds computations during main loop
        boundsMethod: 'none',
        localBounds: pathClipArea.bounds
      } );
      this.addChild( derivativePath );

      // Created once and reused to avoid allocations
      const sampleArray = [];

      // Manually tuned to center the line in the graph, dy must be synchronized with graphHeight
      const dx = -options.x;
      const dy = -options.centerY / 2 + 7.5;

      const updateShape = () => {
        const shape = getWaterSideShape( sampleArray, model.sceneProperty.value.lattice, waveAreaBounds, dx, dy );
        path.setShape( shape );
      };
      model.scenes.forEach( scene => scene.lattice.changedEmitter.addListener( updateShape ) );

      // Update the curve when the scene is changed
      model.sceneProperty.link( updateShape );

      this.mutate( options );

      const melodicClips = [];

      model.stepEmitter.addListener( () => {
        melodicClips.forEach( soundClip => {
          const value = model.sceneProperty.value.oscillator1Property.value;
          const z = Utils.linear( -10, 10, 200, 750, value );
          soundClip.lowPassFilter.frequency.setValueAtTime( z, phetAudioContext.currentTime + 0.01 );
          const elapsedTime = Date.now() - soundClip.startTime;
          let outputLevel = Utils.linear( 0, 5000, 1, 0, elapsedTime );
          // console.log( outputLevel );
          if ( outputLevel < 0 ) {
            outputLevel = 0;
          }
          soundClip.setOutputLevel( outputLevel, 0 );
        } );
      } );

      // When a water drop is absorbed, play a water drop sound.
      if ( model.waterScene ) {
        model.waterScene.waterDropAbsorbedEmitter.addListener( waterDrop => {

          const lowPassFilter = phetAudioContext.createBiquadFilter();
          lowPassFilter.type = 'lowpass';
          lowPassFilter.frequency.setValueAtTime( 200, 0 ); // The cutoff frequency.
          lowPassFilter.Q.setValueAtTime( 10, 0 ); // Indicates how peaked the frequency is around the cutoff. The greater the value is, the greater is the peak.

          const bandpassFilter = phetAudioContext.createBiquadFilter();
          bandpassFilter.type = 'bandpass';
          bandpassFilter.frequency.setValueAtTime( 700, phetAudioContext.currentTime ); // The center of the range of frequencies.
          bandpassFilter.frequency.linearRampToValueAtTime( 400, phetAudioContext.currentTime + 4 ); // The center of the range of frequencies.
          bandpassFilter.Q.setValueAtTime( 4, 0 ); // Controls the width of the frequency band. The greater the Q value, the smaller the frequency band.

          const soundClip = new SoundClip( atonalSound, {
            initialOutputLevel: 0.3,
            // additionalNodes: [ lowPassFilter ]
            additionalNodes: [ bandpassFilter ]
          } );
          soundManager.addSoundGenerator( soundClip, {
            associatedViewNode: this
          } );

          soundClip.play();
          soundClip.startTime = Date.now();
          soundClip.lowPassFilter = lowPassFilter;
          melodicClips.push( soundClip );

          // TODO: can this use const?
          const listener = isPlaying => {
            if ( !isPlaying ) {
              soundClip.isPlayingProperty.unlink( listener );
              arrayRemove( melodicClips, soundClip );
            }
          };
          soundClip.isPlayingProperty.lazyLink( listener );
        } );
      }
    }
  }

  return waveInterference.register( 'WaveAreaGraphNode', WaveAreaGraphNode );
} );