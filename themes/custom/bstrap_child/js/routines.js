var Routines =
  {
    CONTACT_BLOCK: '#contact-message-feedback-form',
    FACEBOOK_BLOCK: '#block-fblikebox .fb-page',
    foFacebookTimer: null,

    //----------------------------------------------------------------------------------------------------
    initializeRoutines: function ()
    {
      Beo.initializeBrowserFixes();

      // I no longer paste the Google Analytics here as I'm tired of tracking whatever changes
      // Google adds. Plus, their code does not format correctly when I auto-format javascript.
      // So now I'm just using the Drupal Module, Google Analytics:
      //   https://www.drupal.org/project/google_analytics
    },

    //----------------------------------------------------------------------------------------------------
    setupWatermarks: function ()
    {
      let lcForm = Routines.CONTACT_BLOCK;
      if (jQuery(lcForm).length == 0)
      {
        return;
      }

      Beo.setupWatermark(lcForm + ' #edit-name', 'Your Name');
      Beo.setupWatermark(lcForm + ' #edit-mail', 'Your@E-mail.com');
      Beo.setupWatermark(lcForm + ' #edit-subject-0-value', 'Subject of Question');
      Beo.setupWatermark(lcForm + ' #edit-message-0-value', 'Question for HOTWCSD');

    },

    //----------------------------------------------------------------------------------------------------
    // Only change the default behaviour of the logo if NOT on the front page.
    // If not on the front page, then change the href to the home page.
    // Otherwise, leave alone in order to work with Lightbox.
    setupLogo: function ()
    {
      if (jQuery('body.path-frontpage').length == 0)
      {
        let loLink = jQuery('#block-title div.image a');
        loLink.removeAttr('data-lightbox');
        loLink.removeAttr('data-alt');
        loLink.removeAttr('data-title');

        loLink.attr('href', '/');
      }

    },

    //----------------------------------------------------------------------------------------------------
    setupGoogleCalendar: function ()
    {
      let lcCalendar = '#Google-Calendar';
      let loCalender = jQuery(lcCalendar);

      if (loCalender.length == 0)
      {
        return;
      }

      let lcHTML = '<iframe title="Calendar for HOTWCSD" src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23B39DDB&ctz=America%2FChicago&showTitle=1&showNav=1&showTz=1&src=dWNyOGRmbTM1ZXJjNDl0Mm5qMjN0cTFqNzRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23AD1457&color=%230B8043" height="600" frameBorder="0" scrolling="no"></iframe>';
      loCalender.html(lcHTML);
    },

    // -------------------------------------------------------------------------------------------------------------------
    setupTaxonomyTabs: function (tcViewContentBlock)
    {
      if (jQuery(tcViewContentBlock).length == 0)
      {
        return;
      }

      let lcWrapperID = 'TaxonomyContentAndListforTabs';
      let lcListID = 'TaxonomyListforTabs';

      // First let's generate the HTML list for jQuery tabs from the view.
      // By the way, you can't use a view to generate the list: too much extra HTML fluff.
      let lcList = '<ul id=\'' + lcListID + '\'>\n';

      // http://stackoverflow.com/questions/8233604/use-jquery-to-get-descendants-of-an-element-that-are-not-children-of-a-container
      // This way, the sub-content rows will be excluded from the tabs.
      jQuery(tcViewContentBlock + ' div.views-row').not('.views-row .views-row').each(function ()
      {
        let lcNode = 'node_' + jQuery(this).find('div.views-field-nid span').html();
        let lcTitle = jQuery(this).find('div.views-field-title span').html();

        let lcHref = '<a href=\'#' + lcNode + '\'>' + lcTitle + '</a>';
        lcList += '<li>' + lcHref + '</li>\n';

      });

      lcList += '</ul>\n';

      // For jQuery Tabs to work, you must wrap the entire section with an enclosing div.
      // This enclosing div will be used as such: jQuery("#" + lcListID).tabs().
      // Then, insert the ul list above the view block.
      jQuery(tcViewContentBlock).wrap('<div id=\'' + lcWrapperID + '\'></div>');
      jQuery(lcList).insertBefore(tcViewContentBlock);

      let loTabs = jQuery('#' + lcWrapperID);
      loTabs.tabs({
        show: {effect: 'slide', direction: 'up'},
        hide: {effect: 'fadeOut', duration: 400}
      });

      Beo.adjustTabsAlignment(loTabs);
      jQuery(window).resize(function ()
      {
        Beo.adjustTabsAlignment(loTabs);
      });

      jQuery(tcViewContentBlock + ', #' + lcWrapperID).fadeIn({duration: 250});
    },

    // -------------------------------------------------------------------------------------------------------------------
    setupSlideShowImageSlider: function ()
    {
      let loSlider = jQuery('#block-hwslideshowblock .flexslider');
      if (loSlider.length == 0)
      {
        return;
      }

      loSlider.flexslider(
        {
          directionNav: (jQuery(window).width() >= 768),
          controlNav: true,
          prevText: '',
          nextText: '',
          animation: 'fade',
          slideshow: false
        });

      loSlider.fadeIn('slow');
    },

    // -------------------------------------------------------------------------------------------------------------------
    // On many of the PDF icons, I set the width and height which tends to be removed in Views, etc.
    // So this routine should fix the problem by tagging with a class defined in style.css.
    // Must be called before Beo.setupImageDialogBox.
    fixPDFDisplay: function ()
    {
      jQuery('.row img').each(function ()
      {
        let loImage = jQuery(this);
        let lcSrc = loImage.attr('src');
        // Linking to the PDF icon.
        if (lcSrc.includes('PDF-NonCommercialUsage.png'))
        {
          loImage.removeAttr('width');
          loImage.removeAttr('height');
          loImage.removeAttr('style');

          loImage.addClass('pdf');

          let loParent = loImage.parent();
          if (loParent.is('a'))
          {
            loParent.attr('target', '_blank');
          }
        }

      });

    },

    //----------------------------------------------------------------------------------------------------
    setupVideos: function ()
    {
      let loView = jQuery('.view-display-id-page_youtube_videos');
      if (loView.length == 0)
      {
        return;
      }

      let lcProtocol = ('https:' == document.location.protocol) ? 'https' : 'http';
      loView.find('.views-field-field-youtube-video-id').each(function ()
      {
        let lcVideoID = jQuery(this).find('.field-content').html();
        let lcIFrame = '<div><iframe class="youtube-embedded" src="' + lcProtocol + '://www.youtube.com/embed/' + lcVideoID + '"></iframe></div>';
        jQuery(this).after(lcIFrame);
      });

    },

    //----------------------------------------------------------------------------------------------------
    setupFacebook: function ()
    {
      let loFront = jQuery('.path-frontpage');
      if (loFront.length === 0)
      {
        return;
      }

      let loFB = jQuery(Routines.FACEBOOK_BLOCK);
      if (loFB.length !== 0)
      {
        // Reset the tab order inside the sidebar.
        loFB.attr('data-tabs', 'events,timeline,messages');
      }

      // No need to call initially as the Facebook Module sizes correctly.
      jQuery(window).resize(function ()
      {
        if (Routines.foFacebookTimer != null)
        {
          clearTimeout(Routines.foFacebookTimer);
        }

        Routines.foFacebookTimer = setTimeout(function ()
        {
          Routines.resizeFacebook();
        }, 1000);

      });
    },
    //----------------------------------------------------------------------------------------------------
    // From http://stackoverflow.com/questions/30083986/facebook-page-plugin-rerender-change-width-dynamically-responsive-rwd
    resizeFacebook: function ()
    {
      let loSide = jQuery('.path-frontpage aside.col-sm-3');
      if (loSide.length === 0)
      {
        return;
      }

      let loFB = jQuery(Routines.FACEBOOK_BLOCK);
      if (loFB.length === 0)
      {
        return;
      }

      let lnWidth = loSide.width() - 2.0;
      if (lnWidth < 180)
      {
        lnWidth = 180;
      }

      let lnHeight = (jQuery(window).width() >= 768) ? 1200 : 700;

      loFB.attr('data-width', Math.floor(lnWidth));
      loFB.attr('data-height', Math.floor(lnHeight));

      loFB.css('width', lnWidth + 'px');

      try
      {
        // Sometimes a ReferenceError: FB is not defined
        // is thrown.
        if (typeof FB !== 'undefined')
        {
          FB.XFBML.parse();
        }
      }
      catch (loErr)
      {
      }

    },

    //----------------------------------------------------------------------------------------------------
    setupAnnouncements: function ()
    {
      let loAnnoucementBlock = jQuery('.view-display-id-block_announcements_current');

      if (loAnnoucementBlock.length == 0)
      {
        return;
      }

      let loRows = loAnnoucementBlock.find('.views-row .views-field-title a');
      if (loRows.length == 0)
      {
        return;
      }

      let lcDialog = '#ShowAnnoucementForFrontPage';
      if (jQuery(lcDialog).length == 0)
      {
        jQuery('body').append('<div id="' + lcDialog.substring(1) + '"></div>');
      }

      let loDialog = jQuery(lcDialog);

      loRows.click(function (toEvent)
      {
        toEvent.preventDefault();

        let loThis = jQuery(this);

        let loParentRow = loThis.closest('.views-row');

        // All links from the announcement pop-up should redirect to a new tab.
        let loBody = loParentRow.find('.views-field-body');
        loBody.find('a').attr('target', '_blank');

        loDialog.html(loBody.html());

        let lcTitle = loThis.html();

        loDialog.dialog(
          {
            width: '90%',
            height: 'auto',
            autoOpen: true,
            show: {
              effect: 'fade',
              duration: 300
            },
            hide: {
              effect: 'fade',
              duration: 300
            },
            create: function (toEvent, toUI)
            {
              let loParent = jQuery(this).parent();
              // The maxWidth property doesn't really work.
              // From http://stackoverflow.com/questions/16471890/responsive-jquery-ui-dialog-and-a-fix-for-maxwidth-bug
              // And id="ShowTellQuote" gets enclosed in a ui-dialog wrapper. So. . . .
              loParent.css('maxWidth', '800px');

              // Problems with HTML entities in title: they are encoded. So < becomes &lt; and > becomes &gt;
              // http://stackoverflow.com/questions/14488774/using-html-in-a-dialogs-title-in-jquery-ui-1-10
              loParent.find('span.ui-dialog-title').append('<span class=\'title\'>' + lcTitle + '</span>');
            }
          });
      });

    },

    //----------------------------------------------------------------------------------------------------
    showAJAX: function (tlShow)
    {
      let lcAJAX = '#ajax-loading';
      let loAJAX = jQuery(lcAJAX);
      if (loAJAX.length == 0)
      {
        alert('The HTML element ' + lcAJAX + ' does not exist!');
        return;
      }

      if (tlShow)
      {
        loAJAX.show();
      }
      else
      {
        loAJAX.hide();
      }

    }
    //----------------------------------------------------------------------------------------------------
  };
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
