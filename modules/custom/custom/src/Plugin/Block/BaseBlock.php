<?php

namespace Drupal\custom\Plugin\Block;

use Drupal\Core\Block\BlockBase;

//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

abstract class BaseBlock extends BlockBase
{

  //-------------------------------------------------------------------------------------------------
  public static function getNodeField($toNode, $tcField)
  {
    // And yes, you want to use ==
    if ($toNode == null)
    {
      return ("Node does not exist for $tcField. A linked / used image was probably deleted.");
    }

    $lcValue = '';
    if ($toNode->hasField($tcField))
    {
      $loField = $toNode->get($tcField);

      if ($loField->entity instanceof \Drupal\file\Entity\File)
      {
        $lcPublicValue = $loField->entity->uri->value;
        $lcURL = \Drupal::service('stream_wrapper_manager')->getViaUri($lcPublicValue)->getExternalUrl();

        $laURL = parse_url($lcURL);
        $lcValue = $laURL['path'];
      }
      else
      {
        $lcValue = $loField->value;
      }
    }

    return ($lcValue);
  }

  //-------------------------------------------------------------------------------------------------
  public static function getNode($tnNodeID)
  {
    // From https://drupal.stackexchange.com/questions/225209/load-term-by-name
    $loNode = \Drupal::entityTypeManager()
        ->getStorage('node')
        ->load($tnNodeID);

    return ($loNode);
  }

  //-------------------------------------------------------------------------------------------------
  public static function getReferencedEntity($toNode, $tcField)
  {
    // From https://drupal.stackexchange.com/questions/186315/how-to-get-instance-of-referenced-entity
    // Geesh. . . .
    $loParagraphItem = $toNode->get($tcField)->first();
    $loEntityReference = $loParagraphItem->get('entity');
    $loEntityAdapter = $loEntityReference->getTarget();
    if ($loEntityAdapter == null)
    {
      return (null);
    }

    $loReferencedEntity = $loEntityAdapter->getValue();
    return ($loReferencedEntity);
  }
  //-------------------------------------------------------------------------------------------------

}

//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
