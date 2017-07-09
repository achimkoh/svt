// from https://github.com/michalstocki/FlashWavRecorder/
// adapted for use in Baruch College's TfCS Wordpress website

jQuery(function () {

  var RECORDER_APP_ID = "recorderApp";

  var appWidth = 240;
  var appHeight = 180;
  var flashvars = {'upload_image': 'http://michalstocki.github.io/FlashWavRecorder/html/images/upload.png'};
  var params = { allowScriptAccess: 'always', wmode: 'transparent'};
  var attributes = {'id': RECORDER_APP_ID, 'name': RECORDER_APP_ID};
  swfobject.embedSWF("../files/2016/06/recorder.jpg", "flashcontent", appWidth, appHeight, "11.0.0", "", flashvars, params, attributes);

  window.fwr_event_handler = function fwr_event_handler() {
    var name, $controls;
    switch (arguments[0]) {
      case "ready":
        FWRecorder.uploadFormId = "#uploadForm";
        FWRecorder.uploadFieldName = "upload_file[filename]";
        FWRecorder.connect(RECORDER_APP_ID, 0);
        FWRecorder.recorderOriginalWidth = appWidth;
        FWRecorder.recorderOriginalHeight = appHeight;
        break;

      case "microphone_user_request":
        FWRecorder.showPermissionWindow();
        break;

      case "permission_panel_closed":
        // FWRecorder.defaultSize();
        FWRecorder.resize(1, 1);
        FWRecorder.hide();
        break;

      case "recording":
        FWRecorder.observeLevel();
        break;

      case "recording_stopped":
        // FWRecorder.show();
        window.duration = arguments[2].toFixed(2) * 1000;

        FWRecorder.stopObservingLevel();
        jQuery(".audiolevel").css({height: 0});
        break;

      case "microphone_level":
      	var curLevel = jQuery(".audiolevel").height();
        jQuery(".audiolevel").css({height: (arguments[1]*90 + curLevel*10/40) + '%'});
        break;
    }
  };

  function recorderEl() {
    return jQuery('#' + RECORDER_APP_ID);
  }
});

jQuery(document).ready(function(){
  if (document.getElementById('recorderApp')) {
    if (FWRecorder.isMicrophoneAccessible()) {
      FWRecorder.resize(1, 1);
    } else {
      FWRecorder.showPermissionWindow();
    }
  }
});

// pressing the record button first asks permission or triggers recording
jQuery(document).on('click', '.record', function () {
	if (!FWRecorder.isMicrophoneAccessible()) {
		FWRecorder.showPermissionWindow();
	} else {
	    jQuery(".record").toggleClass('recording'); 
	}
    if (jQuery(this).hasClass('recording')) {
	    FWRecorder.configure(22, 80, 1, 0);
        FWRecorder.setUseEchoSuppression(true); 
        jQuery(".progress").css({ width: '0%' });   	
    	setTimeout(function() { FWRecorder.record('audio', 'audio.wav'); }, 1);

    } else {
    	setTimeout(function() { FWRecorder.stopRecording('audio');}, 1);
    }
});

// animates play button
jQuery(document).on('click', '.playback', function () {
  if (jQuery(".record").hasClass('recording')) {
    FWRecorder.stopRecording();
    setTimeout(function() { jQuery(".record").removeClass('recording'); }, 5);
  }
	jQuery(".progress").css({ width: '0%' });
	setTimeout(function() { FWRecorder.playBack('audio'); }, 5);
	jQuery(".progress").animate({width: '100%'}, window.duration+10, function() {} );
  setTimeout(function() { jQuery(".progress").animate({width: '0%'}, 10, function() {} ); }, 5);
});