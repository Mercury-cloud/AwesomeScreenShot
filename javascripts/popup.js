var Bg=chrome.extension.getBackgroundPage(),mediaDevices=null,camDevices=[],baseURL="https://www.awesomescreenshot.com",isSignIn=!1,meter=null,rafID=null,volumeStream=null,premiumLevel=0,prepareInterval=null,isAllowedMic=!1,isAllowedCam=!1;function sendMessageToTab(e,o,t){chrome.tabs.sendMessage(e,o,t)}function getCurrentTab(e,o){chrome.tabs.query(Object.assign({active:!0},e),function(e){o(e[0])})}function createAudioMeter(e,o,t,a){var r=e.createScriptProcessor(512);return r.onaudioprocess=volumeAudioProcess,r.clipping=!1,r.lastClip=0,r.volume=0,r.clipLevel=o||.98,r.averaging=t||.95,r.clipLag=a||750,r.connect(e.destination),r.checkClipping=function(){return!!this.clipping&&(this.lastClip+this.clipLag<window.performance.now()&&(this.clipping=!1),this.clipping)},r.shutdown=function(){this.disconnect(),this.onaudioprocess=null},r}function volumeAudioProcess(e){for(var o,t=e.inputBuffer.getChannelData(0),a=t.length,r=0,c=0;c<a;c++)o=t[c],Math.abs(o)>=this.clipLevel&&(this.clipping=!0,this.lastClip=window.performance.now()),r+=o*o;var i=Math.sqrt(r/a);this.volume=Math.max(i,this.volume*this.averaging)}function closeVolume(){$("#volume-canvas").hide(),rafID&&window.cancelAnimationFrame(rafID),meter=null,volumeStream&&(volumeStream.getTracks().forEach(function(e){e.stop()}),volumeStream=null)}function getVolume(){if("true"===localStorage.record_mic&&isAllowedMic&&!1!==$("#main-menu").is(":visible")){closeVolume(),$("#volume-canvas").show();var o=new AudioContext,e={googEchoCancellation:"false",googAutoGainControl:"false",googNoiseSuppression:"false",googHighpassFilter:"false"};localStorage["mic-deviceId"]&&(e.diviceId=localStorage["mic-deviceId"]);try{navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia,navigator.getUserMedia({audio:e},function(e){volumeStream=e,mediaStreamSource=o.createMediaStreamSource(e),meter=createAudioMeter(o),mediaStreamSource.connect(meter),drawLoop()},function(){})}catch(e){}}}function drawLoop(e){var o=document.getElementById("volume-canvas").getContext("2d");o.clearRect(0,0,5,18),meter.checkClipping()?o.fillStyle="red":o.fillStyle="#47d892",o.fillRect(0,0,5,18*meter.volume*5),rafID=window.requestAnimationFrame(drawLoop)}"true"===localStorage["dark-mode"]&&$("body").addClass("dark-mode");var recordingTimer=null;function updateTime(){$("#recording-view").find(".time").text(Bg.recordingTime)}function showPopup(e){$("#"+e).show()}chrome.cookies.getAll({url:"https://www.awesomescreenshot.com"},function(e){if(e){for(var o=0,t=e.length;o<t;o++)if("screenshot_personal_fullname"===e[o].name)var a=decodeURI(e[o].value);else if("screenshot_personal_type"===e[o].name)var r=e[o].value;else if("screenshot_personal_premium_level"===e[o].name)var c=e[o].value;c?premiumLevel=c:$.ajax({method:"GET",url:"https://www.awesomescreenshot.com/api/v1/user/einfo"}).done(function(e){premiumLevel=e.data.premiumLevel}),a?(isSignIn=!0,$(".aws-info").find(".user-name").text(a).attr("title",a),$(".aws-user").show(),$(".aws-login").hide(),$(".more-links").show()):($(".aws-user").hide(),$(".aws-login").show()),"0"==r?$(".aws-user").removeClass("premium"):void 0===r?($(".aws-premium-icon").hide(),$(".aws-upgrade").hide()):$(".aws-user").addClass("premium")}}),$(document).ready(function(){"record"===localStorage.popupTab&&$(".tab-header").addClass("default-record"),chrome.windows.getCurrent(function(o){getCurrentTab({windowId:o.id},function(e){chrome.browserAction.getBadgeText({tabId:e.id},function(e){"New"==e&&(chrome.browserAction.setBadgeText({text:""}),chrome.tabs.create({url:"https://blog.awesomescreenshot.com/2020/04/03/keep-social-distance-and-work-together/"}),localStorage.newClickVersion=Bg.newClickVersion,o.close())})})}),$("#stop-entire-capture").on("click",function(){getCurrentTab({},function(e){sendMessageToTab(e.id,{action:"stop-entire-capture"})})}),$(".tab-header-item").on("click",function(){var e=$(this).attr("data-tab");$(".tab-header").removeClass("screenshot record").addClass(e),$(".tab-header-item").removeClass("active"),$(this).addClass("active"),$(".tab-item").removeClass("active"),$(".tab-item.tab-"+e).addClass("active"),"record"===e?getVolume():"screenshot"===e&&closeVolume()}),"record"===localStorage.popupTab&&$(".tab-header-item[data-tab='record']").trigger("click"),$(".action-btn").on("click",function(){var e=$(this);e.hasClass("option")?chrome.tabs.create({url:"/option-react.html"}):e.hasClass("feedback")?chrome.tabs.create({url:"/feedback.html"}):e.hasClass("more")?(e.toggleClass("expand"),$(".more-links").toggle()):e.hasClass("recording")&&chrome.tabs.create({url:"/video-list.html"})}),$(".more-links-item").on("click",function(){var e=$(this);if(e.hasClass("mp"))var o=baseURL+"/getProjectList";else if(e.hasClass("mv"))o=baseURL+"/myVideos";else if(e.hasClass("logout"))o=baseURL+"/user/loginOut";chrome.tabs.create({url:o})});var a,r=!0;function t(e){"main-menu"!==e&&closeVolume(),$(".layout-view").hide(),$("#"+e).show()}function d(e){chrome.runtime.sendMessage(e)}$(".i18n").each(function(){var e=this.id;$(this).html(chrome.i18n.getMessage(e.replace(/-/,"")))}),$(".title").each(function(){var e=this.id;$(this).attr({title:chrome.i18n.getMessage(e.replace(/-/,"")+"_title")})}),function(){if(localStorage.msObj){var e=JSON.parse(localStorage.msObj),o=1==e.visible.enable?"Ctrl+Shift+"+e.visible.key:"Not set",t=1==e.selected.enable?"Ctrl+Shift+"+e.selected.key:"Not set",a=1==e.entire.enable?"Ctrl+Shift+"+e.entire.key:"Not set";$("#visible").find(".shortcut").remove().end().append("<span class='shortcut'>"+o+"</span>"),$("#selected").find(".shortcut").remove().end().append("<span class='shortcut'>"+t+"</span>"),$("#entire").find(".shortcut").remove().end().append("<span class='shortcut'>"+a+"</span>")}}(),!localStorage.capture_desktop||localStorage.capture_desktop,$("#show-advanced").on("click",function(){$("#advanced-option-container").is(":visible")?$(this).removeClass("hide").find("span").text("Show Advanced Options"):$(this).addClass("hide").find("span").text("Hide Advanced Options"),$("#advanced-option-container").toggle()}),chrome.tabs.query({active:!0,currentWindow:!0},function(e){var o=e[0];(null==(a=o.url).match(/https?:\/\/*\/*/gi)||a.match(/https:\/\/chrome.google.com\/extensions/i)||a.match(/https:\/\/chrome.google.com\/webstore/i))&&$("#visible,#selected, #delay-capture, #entire").attr({title:"Not available in this page."}).addClass("disabled").unbind("click"),"complete"!=o.status&&($("#selected").attr({title:"Page still loading! Please wait."}).addClass("disabled"),r=!1),/http|https|file|ftp/.test(a.slice(0,5))||$("#visible").addClass("disabled").unbind("click")}),"recording"===Bg.recordingStatus&&(t("recording-view"),Bg.isRecordingPaused&&($("#recording-view").find(".recording-action").addClass("paused"),Bg.socketClient&&Bg.socketClient.paused&&$("#recording-error").show()),recordingTimer=setInterval(updateTime,100)),"preparing"===Bg.recordingStatus&&(t("video-prepare-view"),prepareInterval=setInterval(function(){"recording"===Bg.recordingStatus&&(t("recording-view"),clearInterval(prepareInterval),prepareInterval=null,recordingTimer=setInterval(updateTime,100))},1e3)),chrome.runtime.onMessage.addListener(function(e,o,t){switch(e.action){case"enable_selected":if(a.match(/https:\/\/*\/*/gi))return void $("#selected").attr({title:"For security reason, Capture Selected Area doesn't work in https pages!"});r=!0,$("#selected").attr({title:""}).css({color:"#000"});break;case"shownew":case"closeWin":window.close();break;case"entireCaptureProgress":$("#entire-progress-percentage").text(e.percentage),$("#entire-progress").css("width",e.percentage),e.scrollNum&&9===e.scrollNum&&$("#stop-msg").show()}}),$("a").click(function(){var e=this.id;if("visible"==e&&(-1!=navigator.appVersion.indexOf("Chrome/11")&&/^file:\/\/*/.test(o)?alert("You can't capture local page's in Chrome beta!"):(d({action:e}),Bg.googleEvent("capture visible","capture")),window.close()),"delay-capture"!=e){if("entire"==e&&(d({action:e}),t("capturing-view"),Bg.googleEvent("capture entire","capture")),"selected"==e&&(d(r?{action:e}:{action:"https"}),Bg.googleEvent("capture selected","capture"),window.close()),"upload"==e){var o=chrome.runtime.getURL("")+"upload.html";chrome.tabs.create({url:o}),Bg.googleEvent("capture local","capture"),window.close()}if("record-video"==e&&t("record-menu"),"my-videos"==e&&chrome.tabs.create({url:"/video-list.html"}),"option"==e){o=chrome.runtime.getURL("")+"option-react.html";chrome.tabs.create({url:o}),window.close()}if("help"==e){o=chrome.runtime.getURL("")+"feedback.html";chrome.tabs.create({url:o}),window.close()}"desktop"==e&&(Bg.beginDesktop(),Bg.googleEvent("capture desktop","capture"),window.close()),"collage"==e&&(chrome.tabs.create({url:chrome.runtime.getURL("")+"collage.html"}),window.close()),"donate"==e&&(chrome.tabs.create({url:chrome.runtime.getURL("")+"purchase.html"}),window.close()),"my-project"==e&&(chrome.tabs.create({url:"https://www.awesomescreenshot.com/getProjectList"}),window.close()),"my-account"==e&&(chrome.tabs.create({url:"https://www.awesomescreenshot.com/account"}),window.close()),"log-out"==e&&(chrome.tabs.create({url:"https://www.awesomescreenshot.com/user/loginOut"}),window.close()),"aws-login"==e&&(chrome.tabs.create({url:"https://www.awesomescreenshot.com/user/login"}),window.close()),"aws-info-upgrade"==e&&(Bg.googleEvent("upgrade from main menu","upgrade"),chrome.tabs.create({url:"https://www.awesomescreenshot.com/pricing?from=extMenu"}),window.close())}else-1!=navigator.appVersion.indexOf("Chrome/11")&&/^file:\/\/*/.test(o)?alert("You can't capture local page's in Chrome beta!"):(d({action:e}),Bg.googleEvent("capture delay","capture"),window.close())}),function(){function r(e){return e.filter(function(o,e,t){return""!==o.label&&t.findIndex(function(e){return e.deviceId===o.deviceId})===e})}function c(e,o){if(o.length){var t=$("#"+e+"-source");o.forEach(function(e){$("<option value='"+e.deviceId+"'>"+e.label+"</option>").appendTo(t)}),localStorage[e+"-deviceId"]&&t.val(localStorage[e+"-deviceId"]),t.trigger("change")}}function o(){var e=$("#record-mic").prop("checked"),o=$("input[name=record-type]:checked").val(),t=$("#countdown-input").val(),a=$("#v-res").val(),r=$("input[name=s-location]:checked").val(),c=$("#record-cam").prop("checked"),i="camera"!==o?$("#cam-source").val():$("#cam-only-source").val(),n=$("#mic-source").val(),s=$("#record-tabsound").prop("checked"),l={isRecordMic:e,recordType:o,countdown:t,saveLocation:r,resolution:a,isRecordCam:c,camDeviceId:i,micDeviceId:n,isRecordTabSound:s};isSignIn||"cloud"!==localStorage["save-location"]?(d({action:"record",options:l}),window.close()):confirm("Please sign in to save video to cloud!")&&chrome.tabs.create({url:"https://www.awesomescreenshot.com/user/login?redirect_url=https://www.awesomescreenshot.com/myVideos"})}navigator.permissions.query({name:"microphone"}).then(function(e){"granted"===e.state&&(isAllowedMic=!0,"true"==localStorage.record_mic&&($("#record-mic").prop("checked",!0),$("#record-mic").parents(".record-option-item").find(".source-part").show(),$("volume-canvas").show()))}).catch(function(e){}),navigator.permissions.query({name:"camera"}).then(function(e){"granted"===e.state&&(isAllowedCam=!0,"true"==localStorage.record_cam&&($("#record-cam").prop("checked",!0),$("#record-cam").parents(".record-option-item").find(".source-part").show()))}).catch(function(e){}),$(".device-select").find("select").on("change",function(){var e=$(this).attr("data-source"),o=$(this).val();localStorage[e+"-deviceId"]=o,"true"==localStorage.record_mic&&$(".tab-record").hasClass("active")&&"mic"===e&&getVolume()}),getAllAudioVideoDevices(function(e){var o=0<(mediaDevices=e).audioInputDevices.length,t=0<mediaDevices.videoInputDevices.length;if($("input[name=record-type]").on("change",function(){"camera"!==this.value||(camDevices=r(mediaDevices.videoInputDevices)).length?(localStorage.record_type=this.value,$(".record-type-item").find("label").removeClass("selected"),$("#record-type-"+this.value).parent().addClass("selected"),"tab"!==this.value?$(".record-option-tabsound").hide():$(".record-option-tabsound").show(),"camera"===this.value?($(".record-option-camera").hide(),$(".record-option-camera-only").show()):($(".record-option-camera").show(),$(".record-option-camera-only").hide())):chrome.tabs.create({url:"/getAccess.html"})}),$("#record-type-"+localStorage.record_type).trigger("click").trigger("change"),o){var a=r(mediaDevices.audioInputDevices);c("mic",a)}else $(".record-option-microphone").find(".record-option-title").text("No Microphone detected").addClass("no").end().find(".action").hide();t?((camDevices=r(mediaDevices.videoInputDevices)).length&&!Bg.cameraStream||$("#toggle-camera").hide(),c("cam",camDevices),c("cam-only",camDevices)):$(".record-option-camera").find(".record-option-title").addClass("no").text("No camera detected").end().find(".action").hide()}),$("#countdown-input").val(localStorage.record_countdown),$("#v-res").val(localStorage.max_resolution),$("input[name='s-location'][value="+localStorage["save-location"]+"]").prop("checked",!0),$("#countdown-input").on("change",function(){localStorage.record_countdown=$(this).val()}),$("#record-tabsound").prop("checked","true"===localStorage.record_tabsound),$("#record-tabsound").on("change",function(){localStorage.record_tabsound=$(this).prop("checked")}),$("#local-recording").on("click",function(){chrome.tabs.create({url:"/video-list.html"})}),$("#v-res").on("change",function(e){var o=$(this).val();0==premiumLevel||1==premiumLevel?"4k"===o?($(this).val(localStorage.max_resolution),showPopup("res-upgrade")):localStorage.max_resolution=$(this).val():2!=premiumLevel&&3!=premiumLevel||(localStorage.max_resolution=$(this).val())}),$("input[name=s-location]").on("change",function(){localStorage["save-location"]=$("input[name=s-location]:checked").val(),Bg.getPremium().then(function(e){e?$(".record-tip").hide():($(".record-tip").show(),"local"===$("input[name=s-location]:checked").val()?$(".record-tip").find(".local").show().end().find(".cloud").hide():$(".record-tip").find(".cloud").show().end().find(".local").hide(),$("input[name=s-location]:checked").val())})}).trigger("change"),Bg.getPremium().then(function(e){e&&$(".record-tip").hide()}),$(".record-option-checkbox").on("change",function(){var e=$(this).attr("data-type");if($(this).prop("checked")){if("mic"===e)var o=isAllowedMic;else if("cam"===e)var o=isAllowedCam;localStorage["record_"+e]="true",!0===o?($("#"+e+"-source-part").show(),"cam"===e&&"true"!==localStorage.record_mic&&isAllowedMic&&(localStorage.record_mic="true",$("#record-mic").prop("checked",!0),$("#mic-source-part").show()),getVolume()):chrome.tabs.create({url:"/getAccess.html"})}else localStorage["record_"+e]="false",$("#"+e+"-source-part").hide(),"mic"===e&&closeVolume()}),$(".popup").find(".close").on("click",function(){$(this).parents(".popup").hide()}),$("#request-notification").on("click",function(){chrome.permissions.request({permissions:["notifications"]},function(e){$("#grant-notification").hide(),o()})}),$("#back-to-main").on("click",function(){t("main-menu")}),$("#record-stop").on("click",function(){Bg.stopStream()}),$("#record-pause").on("click",function(){$(this).parent().addClass("paused"),Bg.pauseScreenRecording()}),$("#record-resume").on("click",function(){$(this).parent().removeClass("paused"),Bg.resumeScreenRecording()}),$("#record-discard").on("click",function(){$("#discard-popup").show()}),$("#discard-cancel").on("click",function(){$("#discard-popup").hide()}),$("#discard-confirm").on("click",function(){Bg.stopStream(!0),window.close()}),$("#record-start").on("click",function(){o()}),$(".upgrade-btn").on("click",function(){var e=$(this).attr("data-reason");Bg.googleEvent("upgrade from recording menu ("+e+")","upgrade"),Bg.goToUpgrade(e)}),$("#toggle-camera").on("click",function(){d({action:"init-camera"}),window.close()})}()});