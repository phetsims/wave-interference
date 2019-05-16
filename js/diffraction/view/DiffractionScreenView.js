// Copyright 2017-2019, University of Colorado Boulder

/**
 * Shows the Diffraction Screen
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const CircleSquareSceneControlPanel = require( 'WAVE_INTERFERENCE/diffraction/view/CircleSquareSceneControlPanel' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const DisorderSceneControlPanel = require( 'WAVE_INTERFERENCE/diffraction/view/DisorderSceneControlPanel' );
  const EllipseSceneControlPanel = require( 'WAVE_INTERFERENCE/diffraction/view/EllipseSceneControlPanel' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Image = require( 'SCENERY/nodes/Image' );
  const LaserPointerNode = require( 'SCENERY_PHET/LaserPointerNode' );
  const LengthScaleIndicatorNode = require( 'WAVE_INTERFERENCE/common/view/LengthScaleIndicatorNode' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const Matrix3 = require( 'DOT/Matrix3' );
  const MatrixCanvasNode = require( 'WAVE_INTERFERENCE/diffraction/view/MatrixCanvasNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RectangleSceneControlPanel = require( 'WAVE_INTERFERENCE/diffraction/view/RectangleSceneControlPanel' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const SceneCanvasNode = require( 'WAVE_INTERFERENCE/diffraction/view/SceneCanvasNode' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Shape = require( 'KITE/Shape' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const ToggleNode = require( 'SUN/ToggleNode' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VisibleColor = require( 'SCENERY_PHET/VisibleColor' );
  const waveInterference = require( 'WAVE_INTERFERENCE/waveInterference' );
  const WaveInterferenceConstants = require( 'WAVE_INTERFERENCE/common/WaveInterferenceConstants' );
  const WaveInterferencePanel = require( 'WAVE_INTERFERENCE/common/view/WaveInterferencePanel' );
  const WaveInterferenceText = require( 'WAVE_INTERFERENCE/common/view/WaveInterferenceText' );
  const WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );
  const WavingGirlSceneControlPanel = require( 'WAVE_INTERFERENCE/diffraction/view/WavingGirlSceneControlPanel' );

  // images
  const wavingGirlIconImage = require( 'image!WAVE_INTERFERENCE/waving_girl_icon.png' );

  // strings
  const mmValueString = require( 'string!WAVE_INTERFERENCE/mmValue' );
  const wavelengthString = require( 'string!WAVE_INTERFERENCE/wavelength' );

  // constants
  const MATRIX_CANVAS_NODE_SCALE = 1.43; // scale factor for showing the large aperture and diffraction patterns
  const MINI_DIFFRACTION_SCALE = 0.2; // scale factor for showing the mini diffraction pattern at the top of the screen
  const MATRIX_DIMENSION = WaveInterferenceConstants.DIFFRACTION_MATRIX_DIMENSION;
  const MARGIN = WaveInterferenceConstants.MARGIN;
  const DISORDER_SCENE_ICON_DOTS_SPACING = 2.4;

  // Options for the control panels
  const PANEL_OPTIONS = {
    yMargin: 14
  };

  class DiffractionScreenView extends ScreenView {

    /**
     * @param {DiffractionModel} model
     */
    constructor( model ) {
      super();

      // @private
      this.model = model;

      const laserPointerNode = new LaserPointerNode( model.onProperty, {
        left: MARGIN,
        centerY: 50,
        bodySize: new Dimension2( 88, 50 ),
        nozzleSize: new Dimension2( 16, 38 ),
        buttonRadius: 17.6
      } );

      // Reset All button
      const resetAllButton = new ResetAllButton( {
        listener: () => model.reset(),
        right: this.layoutBounds.maxX - MARGIN,
        bottom: this.layoutBounds.maxY - MARGIN
      } );
      this.addChild( resetAllButton );

      // Disorder scene icon
      const createCircle = () => new Circle( 1.65, { fill: 'black' } );
      const createRow = () => new HBox( {
        spacing: DISORDER_SCENE_ICON_DOTS_SPACING,
        children: _.times( 4, createCircle )
      } );
      const disorderSceneIcon = new VBox( {
        spacing: DISORDER_SCENE_ICON_DOTS_SPACING,
        children: _.times( 4, createRow )
      } );

      // Scene radio buttons
      const sceneRadioButtonContent = [ {
        value: model.ellipseScene,
        node: new Circle( 10, { fill: 'black' } )
      }, {
        value: model.rectangleScene,
        node: new Rectangle( 0, 0, 20, 20, { fill: 'black' } )
      }, {
        value: model.circleSquareScene,
        node: new Node( {
          children: [
            new Circle( 5, { fill: 'black' } ),
            new Rectangle( 0, 0, 10, 10, { fill: 'black', x: 10, y: 8 } )
          ]
        } )
      }, {
        value: model.disorderScene,
        node: disorderSceneIcon
      }, {
        value: model.wavingGirlScene,
        node: new Image( wavingGirlIconImage, { maxHeight: 25 } )
      } ];

      // @private - Main (large) aperture node
      this.apertureNode = new SceneCanvasNode( model.sceneProperty, { scale: MATRIX_CANVAS_NODE_SCALE } );
      this.apertureNode.top = 120;
      this.addChild( this.apertureNode );

      // @private - Main (large) diffraction node
      this.diffractionNode = new MatrixCanvasNode( model.diffractionMatrix, { scale: MATRIX_CANVAS_NODE_SCALE } );
      this.diffractionNode.right = this.layoutBounds.right - 20;
      this.diffractionNode.top = this.apertureNode.top;
      model.wavelengthProperty.link( wavelength => this.diffractionNode.setBaseColor( VisibleColor.wavelengthToColor( wavelength, {
        reduceIntensityAtExtrema: false
      } ) ) );
      this.addChild( this.diffractionNode );

      this.apertureNode.right = this.diffractionNode.left - 50;

      // Length scale indicator on the aperture
      const apertureScaleIndicatorNode = new LengthScaleIndicatorNode( this.apertureNode.width * 0.075, StringUtils.fillIn( mmValueString, { value: 0.1 } ), {
        leftBottom: this.apertureNode.leftTop.plusXY( 0, -5 )
      } );
      this.addChild( apertureScaleIndicatorNode );

      // Length scale indicator on the diffraction pattern
      const diffractionScaleIndicatorNode = new LengthScaleIndicatorNode( this.diffractionNode.width * 0.1, StringUtils.fillIn( mmValueString, { value: 10 } ), {
        leftBottom: this.diffractionNode.leftTop.plusXY( 0, -5 )
      } );
      this.addChild( diffractionScaleIndicatorNode );

      const sceneRadioButtonGroup = new RadioButtonGroup( model.sceneProperty, sceneRadioButtonContent, {
        baseColor: 'white',
        selectedStroke: '#419ac9',
        selectedLineWidth: 2,
        right: this.apertureNode.left - 20,
        bottom: this.apertureNode.bottom
      } );

      // The mini aperture node has a small background
      const miniApertureNodeBackground = new Rectangle( 0, 0, MATRIX_DIMENSION, MATRIX_DIMENSION, {
        fill: 'black',
        scale: MINI_DIFFRACTION_SCALE / 2,
        centerY: laserPointerNode.centerY,
        centerX: this.apertureNode.centerX,
        matrix: Matrix3.affine( 1, 0, 0, 0.25, 1, 0 )
      } );

      // @private - The mini aperture node has an even smaller pattern rendering
      this.miniApertureNode = new SceneCanvasNode( model.sceneProperty, {
        scale: MINI_DIFFRACTION_SCALE / 4,
        centerY: laserPointerNode.centerY,
        centerX: this.apertureNode.centerX,
        matrix: Matrix3.affine( 1, 0, 0, 0.25, 1, 0 )
      } );

      // @private - The mini diffraction pattern at the top of the screen
      this.miniDiffractionNode = new MatrixCanvasNode( model.diffractionMatrix, {
        scale: MINI_DIFFRACTION_SCALE,
        centerY: laserPointerNode.centerY,
        centerX: this.diffractionNode.centerX,
        matrix: Matrix3.affine( 1, 0, 0, 0.25, 1, 0 )
      } );

      model.wavelengthProperty.link( wavelength => this.miniDiffractionNode.setBaseColor( VisibleColor.wavelengthToColor( wavelength, {
        reduceIntensityAtExtrema: false
      } ) ) );

      const updateCanvases = this.updateCanvases.bind( this );
      model.sceneProperty.lazyLink( updateCanvases );

      this.addChild( sceneRadioButtonGroup );
      model.scenes.forEach( scene => scene.link( updateCanvases ) );
      model.onProperty.lazyLink( updateCanvases );

      // Nickname so everything fits on one line.
      const OPTS = PANEL_OPTIONS;
      const controlPanelToggleNode = new ToggleNode( model.sceneProperty, [
        { value: model.ellipseScene, node: new EllipseSceneControlPanel( model.ellipseScene, OPTS ) },
        { value: model.rectangleScene, node: new RectangleSceneControlPanel( model.rectangleScene, OPTS ) },
        { value: model.circleSquareScene, node: new CircleSquareSceneControlPanel( model.circleSquareScene, OPTS ) },
        { value: model.disorderScene, node: new DisorderSceneControlPanel( model.disorderScene, OPTS ) },
        { value: model.wavingGirlScene, node: new WavingGirlSceneControlPanel( model.wavingGirlScene, OPTS ) }
      ], {
        alignChildren: ToggleNode.CENTER_BOTTOM,
        centerX: this.apertureNode.centerX,
        bottom: this.layoutBounds.bottom - MARGIN
      } );
      this.addChild( controlPanelToggleNode );

      const BEAM_WIDTH = 22;
      const incidentBeam = new Rectangle(
        laserPointerNode.right, laserPointerNode.centerY - BEAM_WIDTH / 2,
        this.miniApertureNode.centerX - laserPointerNode.right, BEAM_WIDTH, {
          opacity: 0.7
        } );

      model.wavelengthProperty.link( wavelength => incidentBeam.setFill( VisibleColor.wavelengthToColor( wavelength ) ) );

      // The diffracted beam makes a cone shape emanating from the aperture.
      const coneSize = 8;
      const transmittedBeam = new Path(
        new Shape()
          .moveTo( this.miniApertureNode.centerX, this.miniApertureNode.centerY - coneSize / 2 )
          .lineToPoint( this.miniDiffractionNode.leftTop )
          .lineTo( this.miniDiffractionNode.right, this.miniDiffractionNode.top + this.miniDiffractionNode.height * 0.2 )
          .lineToPoint( this.miniDiffractionNode.rightBottom )
          .lineTo( this.miniApertureNode.centerX, this.miniApertureNode.centerY + coneSize / 2 )
          .close(), {
          opacity: 0.7
        } );

      // There is a symmetrical gradient which is strong in the center and fades out toward the top and bottom
      model.wavelengthProperty.link( wavelength => {

        const color = VisibleColor.wavelengthToColor( wavelength );

        const a = 0.3;
        const b = 0.45;
        const bOpacity = 0.8;
        const aOpacity = 0.4;
        const gradient = new LinearGradient(
          0, this.miniDiffractionNode.top,
          0, this.miniDiffractionNode.bottom )
          .addColorStop( 0, color.withAlpha( 0 ) )
          .addColorStop( a, color.withAlpha( aOpacity ) )
          .addColorStop( b, color.withAlpha( bOpacity ) )
          .addColorStop( 0.5, color )
          .addColorStop( 1 - b, color.withAlpha( bOpacity ) )
          .addColorStop( 1 - a, color.withAlpha( aOpacity ) )
          .addColorStop( 1, color.withAlpha( 0 ) );

        transmittedBeam.setFill( gradient );
      } );

      model.onProperty.linkAttribute( incidentBeam, 'visible' );
      model.onProperty.linkAttribute( transmittedBeam, 'visible' );

      const wavelengthPanel = new WaveInterferencePanel( new VBox( {
        children: [
          new WaveInterferenceText( wavelengthString ),
          new WavelengthSlider( model.wavelengthProperty, {
            trackWidth: 100,
            trackHeight: 30,

            // thumb
            thumbWidth: 25,
            thumbHeight: 25,

            valueFont: WaveInterferenceConstants.DEFAULT_FONT
          } )
        ]
      } ), _.extend( {
        left: laserPointerNode.left,
        top: apertureScaleIndicatorNode.top
      }, PANEL_OPTIONS ) );


      this.addChild( incidentBeam );
      this.addChild( transmittedBeam );
      this.addChild( miniApertureNodeBackground );
      this.addChild( this.miniApertureNode );
      this.addChild( this.miniDiffractionNode );

      this.addChild( laserPointerNode );
      this.addChild( wavelengthPanel );

      updateCanvases();
    }

    /**
     * @private - update the main/mini aperture/diffraction patterns.
     */
    updateCanvases() {
      this.apertureNode.invalidatePaint();
      this.miniApertureNode.invalidatePaint();
      this.diffractionNode.invalidatePaint();
      this.miniDiffractionNode.invalidatePaint();
    }
  }

  return waveInterference.register( 'DiffractionScreenView', DiffractionScreenView );
} );