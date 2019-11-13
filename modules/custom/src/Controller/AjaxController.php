<?php

namespace Drupal\custom\Controller;

use Symfony\Component\HttpFoundation\Response;
use Drupal\Core\Database\Database;

//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
class AjaxController
{
  // The controller method receives these parameters as arguments.
  // The parameters are mapped to the arguments with the same name.
  // So in this case, the page method of the NodeController has one argument: $tcCustomCategory. There may be multiple parameters in a
  // route, but their names should be unique.
  //-------------------------------------------------------------------------------------------------
  public function getContent($tcType, $tnNodeID)
  {
    $lcGeneratedContent = '';
    $lcContentType = '';

    try
    {
      if (($tcType === 'node') && (isset($tnNodeID)))
      {
        $lcContentType = 'text/html; utf-8';
        $lcGeneratedContent = "Unknown type, $tcType, with ID # of $tnNodeID.";
      }
      else if ($tcType == 'ip_address')
      {
        $lcContentType = "text/plain; charset=us-ascii";
        $lcGeneratedContent = $_SERVER['REMOTE_ADDR'] . '<br /><em>IP address</em>';;
      }
    }
    catch (\Exception $loErr)
    {
      $lcContentType = 'text/html; utf-8';
      $lcGeneratedContent = $loErr->getMessage();
    }

    /*
       Awesome!!!!
       From https://drupal.stackexchange.com/questions/182022/how-to-output-from-custom-module-without-rest-of-theme
    */
    $loResponse = new Response();
    // From https://symfony.com/doc/2.1/components/http_foundation/introduction.html
    $loResponse->headers->set('Content-Type', $lcContentType);
    $loResponse->setContent($lcGeneratedContent);

    return ($loResponse);
  }

  //-------------------------------------------------------------------------------------------------
}

//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
