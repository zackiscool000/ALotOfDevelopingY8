function CMenu(){
var _oBg;
var _oButPlay;
var _oFade;
var _oAudioToggle;
var _oButCredits;
var _oButFullscreen;
var _fRequestFullScreen = null;
var _fCancelFullScreen = null;

var _pStartPosAudio;
var _pStartPosCredits;
var _pStartPosFullscreen;

//Idnet Variables
var _loginText;
var _textGroup;

var _oLeaderboardBtn;
var _pLeaderboardBtn;

this._init = function(){

_oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
s_oStage.addChild(_oBg);

var oSprite = s_oSpriteLibrary.getSprite('but_play');
_oButPlay = new CGfxButton((CANVAS_WIDTH/2) + 280,CANVAS_HEIGHT/2 + 160,oSprite,s_oStage);
_oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
_oButPlay.inversePulse();

if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
_pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 10};
_oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
_oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
}

s_oMain.createY8Logo("g_menulogo", 320, CANVAS_HEIGHT-60)

var oSprite = s_oSpriteLibrary.getSprite('but_leaderboard');
_pLeaderboardBtn = {x: CANVAS_WIDTH - (oSprite.height+oSprite.height/2) - 20, y: (oSprite.height/2) + 10};
_oLeaderboardBtn = new CGfxButton(_pLeaderboardBtn.x,_pLeaderboardBtn.y,oSprite,s_oStage);
_oLeaderboardBtn.addEventListener(ON_MOUSE_UP, this._showLeaderboard, this);

var oSprite = s_oSpriteLibrary.getSprite('but_credits');
_pStartPosCredits = {x:(oSprite.height/2)+ 10, y:(oSprite.height/2) + 10};
_oButCredits = new CGfxButton(_pStartPosCredits.x, _pStartPosCredits.y, oSprite, s_oStage);
_oButCredits.addEventListener(ON_MOUSE_UP, this._onButCreditRelease, this);

var doc = window.document;
var docEl = doc.documentElement;
_fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
_fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

if(ENABLE_FULLSCREEN === false){
_fRequestFullScreen = false;
}

if (_fRequestFullScreen && inIframe() === false){
oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
_pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width/2 + 10,y:_pStartPosCredits.y};

_oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
_oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
}

_oFade = new createjs.Shape();
_oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

s_oStage.addChild(_oFade);

createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){_oFade.visible = false;});

_loginText = new createjs.Text("","bold 30px "+PRIMARY_FONT, "#FFFFFF");
_loginText.shadow = new createjs.Shadow("#000000", 3, 3, 3);
_loginText.x = CANVAS_WIDTH/2;
_loginText.y = CANVAS_HEIGHT/2-320;
_loginText.textBaseline = "alphabetic";
_loginText.lineWidth = 500;
_loginText.text = "Welcome Guest";
_loginText.textAlign = 'center';
_textGroup = new createjs.Container();
_textGroup.alpha = 1;
_textGroup.visible=true;
_textGroup.addChild(_loginText);
s_oStage.addChild(_textGroup);

this.refreshButtonPos();

};

this.unload = function(){
_oButPlay.unload();
_oButPlay = null;
_oButCredits.unload();

_oLeaderboardBtn.unload()
_oLeaderboardBtn = null;
s_oMain.removeY8Logo()

if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
_oAudioToggle.unload();
_oAudioToggle = null;
}
if (_fRequestFullScreen && inIframe() === false){
_oButFullscreen.unload();
}
s_oStage.removeAllChildren();
_oBg = null;
s_oMenu = null;
};

this.refreshButtonPos = function(){
_oButCredits.setPosition(_pStartPosCredits.x + s_iOffsetX, s_iOffsetY + _pStartPosCredits.y);
if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
_oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
}
if (_fRequestFullScreen && inIframe() === false){
_oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
}

_oLeaderboardBtn.setPosition(_pLeaderboardBtn.x - s_iOffsetX, _pLeaderboardBtn.y + s_iOffsetY);
s_oMain.logoReposition(s_iOffsetX+70, (CANVAS_HEIGHT-60) - s_iOffsetY)
};

this.getUserName = function () {
if(s_isLogin===true){
_loginText.text = 'Welcome '+s_userName;
}else{
_loginText.text = "Welcome Guest";
}
};

this._showLeaderboard = function()
{
console.log('_showLeaderboard')
ID.GameAPI.Leaderboards.list({table:'Leaderboard', mode:'newest'})
}

this._onAudioToggle = function(){
Howler.mute(s_bAudioActive);
s_bAudioActive = !s_bAudioActive;
};

this._onButPlayRelease = function(){
this.unload();

if (isIOS() && s_oSoundTrack === null) {
s_oSoundTrack = playSound("soundtrack",1,-1);
}

$(s_oMain).trigger("start_session");
s_oMain.gotoModePanel();
if(isFirstAdPlayed === false)
{
isFirstAdPlayed = true
try {
console.log('Showing Ads')
playAds()
}
catch (e) {
console.log(e + ' Error Showing Ads')
showMessage()
}
}
};

this._onButCreditRelease = function(){
new CCreditsPanel();
};

this._onFullscreenRelease = function(){
if(s_bFullscreen) {
_fCancelFullScreen.call(window.document);
s_bFullscreen = false;
}else{
_fRequestFullScreen.call(window.document.documentElement);
s_bFullscreen = true;
}

sizeHandler();
};

s_oMenu = this;

this._init();
}

var s_oMenu = null;
