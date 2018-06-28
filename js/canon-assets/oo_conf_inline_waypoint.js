/*
OnlineOpinion v5.9.3
Released: 09/21/2015. Compiled 09/30/2015 12:09:31 PM -0500
Branch: 5.9.3 efe6bf2541deb563c2a9884b2a3034c881047acf
Components: Full
UMD: disabled
The following code is Copyright 1998-2015 Opinionlab, Inc. All rights reserved. Unauthorized use is prohibited. This product and other products of OpinionLab, Inc. are protected by U.S. Patent No. 6606581, 6421724, 6785717 B1 and other patents pending. http://www.opinionlab.com
*/

/*
Inline configuration
*********************
Object is now being instantiated against the OOo object (1 global class)
To call this object, place the below in the click event
OOo.oo_feedback.show(event)
*/
(function (w, o) {
    'use strict';

    var rp  = '://usa.canon.com';

    if (window.location.href.search(/cusa\/consumer|cusa\/professional|cusa\/broadcast/i) != -1) {
        rp = '://consumer.www.canon.com';
    }

    var OpinionLabInit = function () {

        o.oo_waypoint = new o.Waypoint({
        /* REQUIRED - Asset identification */
            pathToAssets: '/NewWebThemeStatic/themes/NewWebTheme/onlineopinionV5/',
            companySlogan: 'Give us feedback',
            companyLogo: '/NewWebThemeStatic/themes/NewWebTheme/onlineopinionV5/waypoint_logo.png',
        /* OPTIONAL - Configuration */
            categories: {
            	WEBSITE: {
                    oCode: {
                        referrerRewrite: {
                            searchPattern: /:\/\/[^\/]*/,
                            replacePattern: rp
                        }
                    },
                    icon: 'icon_web.png'
                },
                SERVICE: {
                    oCode: {
                        referrerRewrite: {
                            searchPattern: /:\/\/[^\/]*/,
                            replacePattern: '://service.usa.canon.com'
                        }
                    },
                    icon: 'icon_store.png'
                },
                PRODUCT: {
                    oCode: {
                        referrerRewrite: {
                            searchPattern: /:\/\/[^\/]*/,
                            replacePattern: '://product.usa.canon.com'
                        }
                    },
                    icon: 'icon_product.png'
                }
                
            },
            disableMobile: false,
            disableNoniOS: false,
            wpmarkup: "<div id='oo_waypoint_prompt' role='dialogue' aria-describedby='oo_waypoint_message'><div id='oo_company_logo'></div><div id='oo_waypoint_content'><p id='oo_waypoint_message'>SELECT A CATEGORY</p><p id='waypoint_icons'></p><p id='ol_brand_logo'><a href='http://www.opinionlab.com/company/' target='_blank' aria-label='Powered by OpinionLab. This will open a new window'></a></p></div><a id='oo_close_prompt' href='#' aria-label='Close dialog'><div class='screen_reader'>Close dialogue</div><span aria-hidden='true'>&#10006;</span></a></div><!--[if IE 8]><style>/* IE 8 does not support box-shadow */#oo_waypoint_prompt #oo_waypoint_content { width: 400px; padding: 40px 49px 20px 49px; border: 1px solid #ccc; }</style><![endif]-->"
        });

        o.appendWaypoint('feedbackLinkHead');
        o.appendWaypoint('feedbackLinkFooter');

        o.oo_searchfeedback = new o.Ocode({
            referrerRewrite: {
                searchPattern: /:\/\/[^\/]*/,
                replacePattern: '://search.www.canon.com'
            }
        });

        o.oo_launch = function(e, feedback) {
            var evt = e || window.event;
            o[feedback].show(evt);
        };
    };

    o.addEventListener(w, 'load', OpinionLabInit, false);

})(window, OOo);
