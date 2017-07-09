function moveThings() {
    // stuff below move around in desktop view, as user scrolls down
    if(window.innerWidth > 960) {
        if(window.pageYOffset>window.minimizeTriggerPosition-300){
            jQuery('#video-navigation').addClass('minimized');
            jQuery('#video-frame').addClass('minimized');
            jQuery('#video').addClass('minimized');
            jQuery('.entry-content').addClass('shifted');
            if(window.pageYOffset>window.videoHiddenTriggerPosition){
                jQuery('#video-frame').addClass('hidden');
            }else{
                jQuery('#video-frame').removeClass('hidden');
            }
        }else{
            jQuery('#video-navigation').removeClass('minimized');
            jQuery('#video-frame').removeClass('minimized');
            jQuery('#video').removeClass('minimized');
            jQuery('.entry-content').removeClass('shifted');
        }
    }else{
        // mobile view is simpler
        if(window.pageYOffset>window.mobileVideoMinimizePosition && window.pageYOffset<window.mobileVideoMinimizeEndPosition){
            jQuery('#video-navigation').addClass('minimized');
            jQuery('#video').addClass('minimized');
        }else{
            jQuery('#video-navigation').removeClass('minimized');
            jQuery('#video').removeClass('minimized');
        }
        jQuery('#video-frame').removeClass('minimized');
        jQuery('.entry-content').removeClass('shifted');
    }
}

window.onscroll=function(){
    moveThings();
};

window.onresize=function(){
    if(window.innerWidth <= 960){
        jQuery('#container').css("height", "");
        jQuery('#video-frame').css("height", window.innerWidth*0.725 + "px");
        jQuery('#phoneme-container').css("height", window.innerWidth*0.725 + window.videoNavHeight + "px");
    } else {
        jQuery('#video-frame').css("height", "");        
        jQuery('#phoneme-container').css("height", "");
        jQuery('#container').css("height", document.getElementById("video-frame").offsetHeight+document.getElementById("phoneme-explanation").offsetHeight+60+"px");
    }
    moveThings();
};

function findPosY(obj) {
    var curtop = 0;
    if (typeof (obj.offsetParent) != 'undefined' && obj.offsetParent) {
        while (obj.offsetParent) {
            curtop += obj.offsetTop;
            obj = obj.offsetParent;
        }
        curtop += obj.offsetTop;
    }
    else if (obj.y)
        curtop += obj.y;
    return curtop;
}

/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.browser.mobile will be true if the browser is a mobile device
 *
 **/
(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

// add current page's title (which should be the phoneme) to navigation menu
jQuery(document).ready(function($) {
    $('.current-phoneme').html(document.title);
    $("div#video-phoneme-explanation").html($("div#phoneme-explanation").html());

    $('.trigger-hover').on('click mouseover', function() {
        $('button.recorder').css("background-color", "#ffc438");
        $('button.recorder').addClass("button-hover-effect");
        setTimeout(function() {
            $('button.recorder').removeClass("button-hover-effect");
            $('button.recorder').css("background-color", "#f0f0f0");
        }, 300);
    });

    // smooth scroll to inner links instead of jumps
    $('a[href^="#"]').on('click',function (e) {
        e.preventDefault();

        var target = this.hash;
        var $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': ($target.offset().top)
        }, 500, 'swing', function () {
            window.location.hash = target;
        });
    });

    // if iOS: do not use custom play button, because native button is not hidden despite video settings
    // if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    //     $(".vjs-big-play-button").css("display", "none !important");
    // }

    // if mobile browser: hide recorder buttons and related text
    if(jQuery.browser.mobile){
        $("span.recorder").html($("span#top").html());
        $("span.recorder").addClass("mobile");
        $("span.mobile-instruction").addClass("mobile");
        $("div#flashcontent").addClass("display-none");
        $("#video-navigation").addClass("mobile");
        window.videoNavHeight = 336;
    }else{window.videoNavHeight = 351;}

    if(window.innerWidth <= 960){
        $('#video-frame').css("height", window.innerWidth*0.725 + "px");
        $('#phoneme-container').css("height", window.innerWidth*0.725 + window.videoNavHeight + "px");
    }else{$('#container').css("height", document.getElementById("video-frame").offsetHeight+document.getElementById("phoneme-explanation").offsetHeight+60+"px");}

    // adapted from Jim W's code: http://stackoverflow.com/a/17494943
    // change layout based on amount of Y scroll
    window.minimizeTriggerPosition=-1;
    // window.vid = document.getElementById('video-frame');
    window.minimizeTrigger = document.getElementById('phoneme-explanation');
    window.videoHiddenTriggerPosition = findPosY(document.getElementById('whats-next'));

    if(window.minimizeTriggerPosition<0)window.minimizeTriggerPosition=findPosY(window.minimizeTrigger);

    window.mobileVideoMinimizePosition = findPosY(document.getElementById("video-frame")) + window.innerWidth;
    window.mobileVideoMinimizeEndPosition = findPosY(document.getElementsByClassName("phoneme-grid")[0]);

});