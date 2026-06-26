// Copyright 2026, University of Colorado Boulder

/**
 * WaveInterferenceKeyboardHelpContent is the content for the keyboard-help dialog, shared by the wave-interference and
 * waves-intro simulations. Screens with draggable tools (measuring tape, stopwatch, wave meter) pass
 * includeToolControls: true to add the toolbox and movement sections; the Diffraction screen passes false.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import ToolboxToolsKeyboardHelpSection from './ToolboxToolsKeyboardHelpSection.js';

type SelfOptions = {

  // Whether to document the toolbox tools (measuring tape, stopwatch, wave meter) and their keyboard dragging. True for
  // the Waves/Interference/Slits screens, false for the Diffraction screen, which has no such tools.
  includeToolControls?: boolean;
};

export default class WaveInterferenceKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor( providedOptions?: SelfOptions ) {

    const options = optionize<SelfOptions>()( {
      includeToolControls: true
    }, providedOptions );

    const sliderSection = new SliderControlsKeyboardHelpSection();
    const basicActionsSection = new BasicActionsKeyboardHelpSection( {
      withCheckboxContent: true
    } );

    const leftSections: KeyboardHelpSection[] = [];
    const rightSections: KeyboardHelpSection[] = [];

    if ( options.includeToolControls ) {

      // Left column sections
      const toolsSection = new ToolboxToolsKeyboardHelpSection();
      const moveDraggableItemsSection = new MoveDraggableItemsKeyboardHelpSection();

      // Vertically align the icons of the stacked left-column sections.
      KeyboardHelpSection.alignHelpSectionIcons( [ toolsSection, moveDraggableItemsSection ] );

      leftSections.push( toolsSection, moveDraggableItemsSection );

      // Right column sections
      rightSections.push( sliderSection, basicActionsSection );
    }
    else {

      // The Diffraction screen has no draggable tools; show slider and basic actions only.
      leftSections.push( sliderSection );
      rightSections.push( basicActionsSection );
    }

    super( leftSections, rightSections, {
      isDisposable: false
    } );
  }
}
