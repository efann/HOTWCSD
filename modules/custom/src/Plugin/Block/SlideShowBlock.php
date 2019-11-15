<?php

// From http://valuebound.com/resources/blog/drupal-8-how-to-create-a-custom-block-programatically

namespace Drupal\custom\Plugin\Block;

use Drupal\Component\Utility\Html;
use Drupal\Core\Database\Database;
use Drupal\Core\Modules\Text;
use Drupal\Core\Url;
use Drupal\views\Views;

//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

/**
 * Provides an 'SlideShow' block.
 *
 * @Block(
 *   id = "hw_slideshow_block",
 *   admin_label = @Translation("HW Slideshow Block"),
 *   category = @Translation("Custom block for displaying the slideshow.")
 * )
 */
class SlideShowBlock extends BaseBlock
{
  const NO_DATA = 'Not much data to show here. . . .';
  const VIEW_NAME = 'views_for_custom_programmatically';
  const VIEW_BLOCK_ID = 'block_for_slideshow';

  //-------------------------------------------------------------------------------------------------

  /**
   * {@inheritdoc}
   */
  public function build()
  {

    $loViewExecutable = Views::getView(self::VIEW_NAME);
    if (!is_object($loViewExecutable))
    {
      return array(
          '#type' => 'markup',
          '#markup' => t(self::NO_DATA),
      );
    }

    $lcContent = "<div id='slideshow_block' style='overflow: hidden; clear: both;'>\n";

    $lcContent .= "<div class='flexslider'>\n";
    $lcContent .= "<ul class='slides'>\n";

    $loViewExecutable->execute(Self::VIEW_BLOCK_ID);
    foreach ($loViewExecutable->result as $lnIndex => $loRow)
    {
      $lcContent .= "<li>\n";

      $loNode = $loRow->_entity;
      $lnID = $loNode->id();
      $lcID = $lnID . '_slideshow';

      // If you don't convert to the appropriate HTML codes, then if you have an apostrophe,
      // then wrong title, Credits, will appear instead 'cause Drupal corrects HTML mistakes.
      // By the way, title has this problem as it's a plain text field with no conversion.
      $lcTitle = HTML::escape(BaseBlock::getNodeField($loNode, 'title'));

      $lcImage = BaseBlock::getNodeField($loNode, 'field_slide_link');

      $lcContent .= "<img id='$lcID' src='$lcImage' aria-label='$lcTitle' alt='$lcTitle' title='$lcTitle' />" . "\n";

      $lcContent .= "</li>\n";
    }

    $lcContent .= "</ul>\n";
    $lcContent .= "</div>\n";

    $lcContent .= "</div>\n";

    // From https://drupal.stackexchange.com/questions/184963/pass-raw-html-to-markup/243216
    // Normally, I would not like to use raw. However, it is stripping out the style.
    return (array(
        '#type' => 'inline_template',
        '#template' => '{{ generatedcontent|raw }}',
        '#context' => [
            'generatedcontent' => $lcContent
        ]
    ));

  }

  //-------------------------------------------------------------------------------------------------

}

//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
