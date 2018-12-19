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
     * @param {WavesScreenModel} model
     */
    constructor( measuringTapeNode, timerNode, waveMeterNode, alignGroup, model ) {

      // Capture image for icon
      model.isMeasuringTapeInPlayAreaProperty.value = true;
      measuringTapeNode.setTextVisible( false );
      model.measuringTapeTipPositionProperty.value = new Vector2( 220, 200 ); // Shorter tape for icon
      const measuringTapeIcon = measuringTapeNode.rasterized( { wrap: true } ).mutate( { scale: 0.65 } );
      model.measuringTapeTipPositionProperty.reset();
      model.isMeasuringTapeInPlayAreaProperty.value = false;
      measuringTapeNode.setTextVisible( true );

      initializeIcon( measuringTapeIcon, model.isMeasuringTapeInPlayAreaProperty, event => {

        // When clicking on the measuring tape icon, pop it out into the play area
        const targetPosition = this.globalToParentPoint( event.pointer.point );
        const currentPosition = measuringTapeNode.basePositionProperty.value;
        const delta = targetPosition.minus( currentPosition );
        measuringTapeNode.basePositionProperty.set( measuringTapeNode.basePositionProperty.value.plus( delta ) );
        measuringTapeNode.tipPositionProperty.set( measuringTapeNode.tipPositionProperty.value.plus( delta ) );
        measuringTapeNode.startBaseDrag( event );
        model.isMeasuringTapeInPlayAreaProperty.value = true;
      } );

      // Node used to create the icon
      model.isTimerInPlayAreaProperty.value = true;
      const timerNodeIcon = timerNode.rasterized().mutate( { scale: 0.45 } );
      model.isTimerInPlayAreaProperty.value = false;

      // The draggable icon, which has an overlay to make the buttons draggable instead of pressable
      initializeIcon( timerNodeIcon, model.isTimerInPlayAreaProperty, event => {
        timerNode.center = this.globalToParentPoint( event.pointer.point );

        // timerNode provided as targetNode in the DragListener constructor, so this press will target it
        timerNode.timerNodeDragListener.press( event );
        model.isTimerInPlayAreaProperty.value = true;
      } );

      // Make sure the probes have enough breathing room so they don't get shoved into the WaveMeterNode icon
      // The true value is set when dragging
      waveMeterNode.backgroundNode.translate( 100, 0 ); //REVIEW^ magic number?

      // The draggable icon, which has an overlay to make the buttons draggable instead of pressable
      // Temporarily show the node so it can be rasterized for an icon
      model.isWaveMeterInPlayAreaProperty.value = true;
      const waveMeterIcon = waveMeterNode.rasterized().mutate( { scale: 0.25 } );
      model.isWaveMeterInPlayAreaProperty.value = false;

      initializeIcon( waveMeterIcon, model.isWaveMeterInPlayAreaProperty, event => {

        // Fine-tuned empirically to set the drag point to be the center of the chart.
        waveMeterNode.backgroundNode.setTranslation( this.globalToParentPoint( event.pointer.point ).plusXY( -60, -66 ) );

        // Set the internal flag that indicates the probes should remain in alignment during the drag
        waveMeterNode.synchronizeProbeLocations = true;
        waveMeterNode.startDrag( event );
        model.isWaveMeterInPlayAreaProperty.value = true;
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
    node.addInputListener( DragListener.createForwardingListener( forwardingListener ) );
  };

  return waveInterference.register( 'ToolboxPanel', ToolboxPanel );
} );