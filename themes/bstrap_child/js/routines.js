var Routines =
  {
    CONTACT_BLOCK: "#contact-message-feedback-form",

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
      var lcForm = Routines.CONTACT_BLOCK;
      if (jQuery(lcForm).length == 0)
      {
        return;
      }

      Beo.setupWatermark(lcForm + " #edit-name", "Your Name");
      Beo.setupWatermark(lcForm + " #edit-mail", "Your@E-mail.com");
      Beo.setupWatermark(lcForm + " #edit-subject-0-value", "Subject of Question");
      Beo.setupWatermark(lcForm + " #edit-message-0-value", "Question for HOTWCSD");

    },

    //----------------------------------------------------------------------------------------------------
    // Only change the default behaviour of the logo if on the front page where you
    // should find the slogan.
    // And the slogan is in a block: #block-block-3
    setupLogo: function ()
    {
      if (jQuery('body.path-frontpage').length == 0)
      {
        return;
      }

      Beo.fnDialogImageTitleBarHeight = 20;
      Beo.createImageDialog();

      jQuery('#block-title .image a').click(function (toEvent)
      {
        toEvent.preventDefault();

        // Beo.onDialogImageClick will look for img inside of link.
        Beo.onDialogImageClick(jQuery(this));
      });
    },

    //----------------------------------------------------------------------------------------------------
    setupGoogleCalendar: function ()
    {
      var lcCalendar = '#Google-Calendar';

      if (jQuery(lcCalendar).length == 0)
      {
        return;
      }

      Routines.resizeGoogleCalendar(lcCalendar);
      jQuery(window).resize(function ()
      {
        Routines.resizeGoogleCalendar(lcCalendar);
      });
    },
//----------------------------------------------------------------------------------------------------
// From http://stackoverflow.com/questions/30083986/facebook-page-plugin-rerender-change-width-dynamically-responsive-rwd
  resizeGoogleCalendar: function (tcCalendar)
  {
    var lcSection = "div.row section";
    var lnWidth = jQuery(lcSection).width();
    lnWidth -= parseInt(jQuery(lcSection).css('padding-left'));
    lnWidth -= parseInt(jQuery(lcSection).css('padding-right'));

    var lcHTML = '<iframe src="https://www.google.com/calendar/embed?height=600&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=ucr8dfm35erc49t2nj23tq1j74%40group.calendar.google.com&amp;color=%2323164E&amp;ctz=America%2FChicago" style=" border-width:0 " width="' + lnWidth + '" height="600" frameborder="0" scrolling="no"></iframe>';

    jQuery(tcCalendar).html(lcHTML);
  },

  // -------------------------------------------------------------------------------------------------------------------
  setupTaxonomyTabs: function (tcViewContentBlock)
  {
    if (jQuery(tcViewContentBlock).length == 0)
    {
      return;
    }

    var lcWrapperID = "TaxonomyContentAndListforTabs";
    var lcListID = "TaxonomyListforTabs";

    // First let's generate the HTML list for jQuery tabs from the view.
    // By the way, you can't use a view to generate the list: too much extra HTML fluff.
    var lcList = "<ul id='" + lcListID + "'>\n";

    // http://stackoverflow.com/questions/8233604/use-jquery-to-get-descendants-of-an-element-that-are-not-children-of-a-container
    // This way, the sub-content rows will be excluded from the tabs.
    jQuery(tcViewContentBlock + " div.views-row").not(".views-row .views-row").each(function ()
    {
      var lcNode = "node_" + jQuery(this).find("div.views-field-nid span").html();
      var lcTitle = jQuery(this).find("div.views-field-title span").html();

      var lcHref = "<a href='#" + lcNode + "'>" + lcTitle + "</a>";
      lcList += "<li>" + lcHref + "</li>\n";

    });

    lcList += "</ul>\n";

    // For jQuery Tabs to work, you must wrap the entire section with an enclosing div.
    // This enclosing div will be used as such: jQuery("#" + lcListID).tabs().
    // Then, insert the ul list above the view block.
    jQuery(tcViewContentBlock).wrap("<div id='" + lcWrapperID + "'></div>");
    jQuery(lcList).insertBefore(tcViewContentBlock);

    var loTabs = jQuery("#" + lcWrapperID);
    loTabs.tabs({
      show: {effect: "slide", direction: "up"},
      hide: {effect: "fadeOut", duration: 400}
    });

    Beo.adjustTabsAlignment(loTabs);
    jQuery(window).resize(function ()
    {
      Beo.adjustTabsAlignment(loTabs);
    });

    jQuery(tcViewContentBlock + ", #" + lcWrapperID).fadeIn({duration: 250});
  },

  // -------------------------------------------------------------------------------------------------------------------
  setupSlideShowImageSlider: function ()
  {
    var loSlider = jQuery("#block-hwslideshowblock .flexslider");
    if (loSlider.length == 0)
    {
      return;
    }

    loSlider.flexslider(
      {
        directionNav: (jQuery(window).width() >= 768),
        controlNav: (jQuery(window).width() >= 768),
        prevText: "",
        nextText: "",
        animation: "fade",
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
    jQuery(".row img").each(function ()
    {
      var loImage = jQuery(this);
      var lcSrc = loImage.attr('src');
      // Linking to the PDF icon.
      if (lcSrc.includes('PDF-NonCommercialUsage.png'))
      {
        loImage.removeAttr('width');
        loImage.removeAttr('height');
        loImage.removeAttr('style');

        loImage.addClass('pdf');

        var loParent = loImage.parent();
        if (loParent.is('a'))
        {
          loParent.attr("target", "_blank");
        }
      }

    });

  },
  //----------------------------------------------------------------------------------------------------
  loadIPAddressAJAX: function ()
  {
    Routines.showAJAX(true);

    // To determine the URL. From http://css-tricks.com/snippets/javascript/get-url-and-url-parts-in-javascript/
    jQuery.ajax({
      url: window.location.protocol + "//" + window.location.host + "/ajax/ip_address/0"
    }).done(function (tcData)
    {
      var loIPAddress = jQuery("#ip_address");

      if (loIPAddress.length != 0)
      {
        // html vs text function. html does not convert raw text.
        loIPAddress.html(tcData);
      }

      Routines.showAJAX(false);
    });

  },
  //----------------------------------------------------------------------------------------------------
  showAJAX: function (tlShow)
  {
    var lcAJAX = "#ajax-loading";
    var loAJAX = jQuery(lcAJAX);
    if (loAJAX.length == 0)
    {
      alert("The HTML element " + lcAJAX + " does not exist!");
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
