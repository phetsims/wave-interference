// Copyright 2018, University of Colorado Boulder

/**
 * Shows the toolbox from whence tools (measuring tape, timer, probe) can be dragged.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Vector2 = require( 'DOT/Vector2' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );

  class ToolboxPanel extends WaveInterferencePanel {

    /**
     * @param {MeasuringTapeNode} measuringTapeNode
     * @param {WaveInterferenceTimerNode} timerNode
     * @param {WaveMeterNode} waveMeterNode
     * @param {AlignGroup} alignGroup - to align with neighbors
     * @param {Property.<Boolean>} isMeasuringTapeInPlayAreaProperty
     * @param {Property.<Vector2>} measuringTapeTipPositionProperty
     * @param {Property.<Boolean>} isTimerInPlayAreaProperty
     * @param {Property.<Boolean>} isWaveMeterInPlayAreaProperty
     */
    constructor( measuringTapeNode, timerNode, waveMeterNode, alignGroup, isMeasuringTapeInPlayAreaProperty,
                 measuringTapeTipPositionProperty, isTimerInPlayAreaProperty, isWaveMeterInPlayAreaProperty ) {

      // Capture image for icon
      isMeasuringTapeInPlayAreaProperty.value = true;
      measuringTapeNode.setTextVisible( false );
      measuringTapeTipPositionProperty.value = new Vector2( 220, 200 ); // Shorter tape for icon
      const measuringTapeIcon = measuringTapeNode.rasterized( { wrap: true } ).mutate( { scale: 0.65 } );
      measuringTapeTipPositionProperty.reset();
      isMeasuringTapeInPlayAreaProperty.value = false;
      measuringTapeNode.setTextVisible( true );

      initializeIcon( measuringTapeIcon, isMeasuringTapeInPlayAreaProperty, event => {

        // When clicking on the measuring tape icon, pop it out into the play area
        const targetPosition = this.globalToParentPoint( event.pointer.point );
        const currentPosition = measuringTapeNode.basePositionProperty.value;
        const delta = targetPosition.minus( currentPosition );
        measuringTapeNode.basePositionProperty.set( measuringTapeNode.basePositionProperty.value.plus( delta ) );
        measuringTapeNode.tipPositionProperty.set( measuringTapeNode.tipPositionProperty.value.plus( delta ) );
        measuringTapeNode.startBaseDrag( event );
        isMeasuringTapeInPlayAreaProperty.value = true;
      } );

      // Node used to create the icon
      isTimerInPlayAreaProperty.value = true;
      const timerNodeIcon = timerNode.rasterized().mutate( { scale: 0.45 } );
      isTimerInPlayAreaProperty.value = false;

      // The draggable icon, which has an overlay to make the buttons draggable instead of pressable
      initializeIcon( timerNodeIcon, isTimerInPlayAreaProperty, event => {
        timerNode.center = this.globalToParentPoint( event.pointer.point );

        // timerNode provided as targetNode in the DragListener constructor, so this press will target it
        timerNode.timerNodeDragListener.press( event );
        isTimerInPlayAreaProperty.value = true;
      } );

      // Make sure the probes have enough breathing room so they don't get shoved into the WaveMeterNode icon.  Anything
      // above 60 seems to work equally well, closer than that causes the probes to overlap each other or the meter
      // body. The true translation is set when dragged out of the toolbox.
      waveMeterNode.backgroundNode.translate( 60, 0 );

      // The draggable icon, which has an overlay to make the buttons draggable instead of pressable
      // Temporarily show the node so it can be rasterized for an icon
      isWaveMeterInPlayAreaProperty.value = true;
      const waveMeterIcon = waveMeterNode.rasterized().mutate( { scale: 0.25 } );
      isWaveMeterInPlayAreaProperty.value = false;

      initializeIcon( waveMeterIcon, isWaveMeterInPlayAreaProperty, event => {

        // Fine-tuned empirically to set the drag point to be the center of the chart.
        waveMeterNode.backgroundNode.setTranslation( this.globalToParentPoint( event.pointer.point ).plusXY( -60, -66 ) );

        // Set the internal flag that indicates the probes should remain in alignment during the drag
        waveMeterNode.synchronizeProbeLocations = true;
        waveMeterNode.startDrag( event );
        isWaveMeterInPlayAreaProperty.value = true;
      } );

      // Layout for the toolbox
      super( alignGroup.createBox( new HBox( {
          spacing: 10,
          children: [
            measuringTapeIcon,
            timerNodeIcon,
            waveMeterIcon
          ]
        } ) ), {

          // Panel options
          yMargin: 9.55,
          maxWidth: WaveInterferenceConstants.PANEL_MAX_WIDTH
        }
      );
    }
  }

  /**
   * Initialize the icon for use in the toolbox.
   * @param {Node} node
   * @param {Property.<boolean>} inPlayAreaProperty
   * @param {Object} forwardingListener
   */
  const initializeIcon = ( node, inPlayAreaProperty, forwardingListener ) => {
    node.cursor = 'pointer';
    inPlayAreaProperty.link( inPlayArea => { node.visible = !inPlayArea; } );
    node.addInputListener( DragListener.createForwardingListener( forwardingListener, {
      allowTouchSnag: false
    } ) );
  };

  return waveInterference.register( 'ToolboxPanel', ToolboxPanel );
} );