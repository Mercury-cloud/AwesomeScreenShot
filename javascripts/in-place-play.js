var targetSites=[{name:"trello",reg:"trello.com",container:".js-desc,.js-comment"},{name:"github",reg:"github.com",container:".js-comment-body"},{name:"asana",reg:"app.asana.com",container:".TruncatedRichText-richText,#TaskDescription-textEditor"},{name:"jira",reg:"atlassian.net",container:".ak-renderer-document"},{name:"slack",reg:"app.slack.com",container:".p-rich_text_section"},{name:"gmail",reg:"mail.google.com",container:"div[role=listitem]"}],options=["expand-link","expand-link-slack","expand-link-trello","expand-link-asana","expand-link-github","expand-link-jira","expand-link-gmail"];function getLocalStorage(n){return new Promise(function(t,e){chrome.runtime.sendMessage({action:"getLocalStorage",what:n},function(e){t(e)})})}function detectUrl(e){for(var t=0;t<targetSites.length;t++){if(new RegExp(targetSites[t].reg).test(e))return targetSites[t]}return!1}function isMatchUrl(e){var t=decodeURIComponent(e);return/https:\/\/www.awesomescreenshot.com\/video\/(.*)/.test(t)}function getUrlInfo(e){e=decodeURIComponent(e),/slack-redir.net/.test(e)&&(e=e.match(/\?url=(.*)$/)[1]);var t=new URL(e),n=t.searchParams.get("key"),a=t.pathname.substr(7);return!(!a||!n)&&{id:a,shareKey:n}}function getIframeStr(e,t){var n="80%";return"slack"===t&&(n="40%","25%"),"gmail"===t&&(n="50%","30%"),'<div style="width:'+n+';position:relative;max-width:500px; min-width: 400px;"><iframe style="display:inline;position: absolute;top:0;left:0;width:100%;height:100%;" frameBorder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen src="https://www.awesomescreenshot.com/embed?id='+e.id+"&shareKey="+e.shareKey+'"></iframe></div>'}getLocalStorage(options).then(function(e){if(e["expand-link"]){var r=detectUrl(window.location.href);if(r)if(e["expand-link-"+r.name])new MutationObserver(function(e){e.forEach(function(e){"childList"!==e.type&&"subtree"!==e.type||$(r.container).find("a").each(function(e,t){if(isMatchUrl(t.href)){var n=getUrlInfo(t.href);if(n&&!$(t).hasClass("aws-expanded")){$("sdfsdf").insertBefore($(t));var a=$(getIframeStr(n,r.name));a.insertBefore($(t)),a.css({height:.7*a.width()}),$(t).addClass("aws-expanded")}}})})}).observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0})}});