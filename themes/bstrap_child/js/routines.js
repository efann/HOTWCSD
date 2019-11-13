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
