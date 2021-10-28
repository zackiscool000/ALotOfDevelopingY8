function CEndPanel(){
var _iScore;

var _oBg;
var _oGroup;
var _oMsgText;
var _oTotScoreText;
var _oScoreTimeText;
var _oScoreWin;
var _oButHome;
var _oButRestart;
var _oListener;
var _oThis;

var _pLeaderboardBtn;
var _oLeaderboardBtn;
var _oLeaderboardBtn1;

this._init = function(){

_oGroup = new createjs.Container();
_oGroup.visible=false;

_oBg = createBitmap(s_oSpriteLibrary.getSprite("msg_box"));
_oListener = _oBg.on("click",function(){});
_oGroup.addChild(_oBg);

_oMsgText = new createjs.Text(""," 50px "+PRIMARY_FONT, "#fff");
_oMsgText.x = CANVAS_WIDTH/2;
_oMsgText.y = (CANVAS_HEIGHT/2)-142;
_oMsgText.textAlign = "center";
_oMsgText.textBaseline = "alphabetic";
_oMsgText.lineWidth = 600;
_oGroup.addChild( _oMsgText);

/*_oScoreTimeText = new createjs.Text(""," 30px "+PRIMARY_FONT, "#fff");
_oScoreTimeText.x = CANVAS_WIDTH/2;
_oScoreTimeText.y = (CANVAS_HEIGHT/2) - 60;
_oScoreTimeText.textAlign = "center";
_oScoreTimeText.textBaseline = "alphabetic";
_oScoreTimeText.lineWidth = 700;
_oGroup.addChild(_oScoreTimeText);

_oScoreWin = new createjs.Text(""," 30px "+PRIMARY_FONT, "#fff");
_oScoreWin.x = CANVAS_WIDTH/2;
_oScoreWin.y = (CANVAS_HEIGHT/2)-20;
_oScoreWin.textAlign = "center";
_oScoreWin.textBaseline = "alphabetic";
_oScoreWin.lineWidth = 700;
_oGroup.addChild(_oScoreWin);*/

_oTotScoreText = new createjs.Text(""," 40px "+PRIMARY_FONT, "#fff");
_oTotScoreText.x = CANVAS_WIDTH/2;
_oTotScoreText.y = (CANVAS_HEIGHT/2) - 20;

_oTotScoreText.textAlign = "center";
_oTotScoreText.textBaseline = "alphabetic";
_oTotScoreText.lineWidth = 700;
_oGroup.addChild(_oTotScoreText);

_oButHome = new CGfxButton(CANVAS_WIDTH/2 - 200,CANVAS_HEIGHT/2 + 120,s_oSpriteLibrary.getSprite("but_home"),_oGroup);
_oButHome.addEventListener(ON_MOUSE_UP,this._onButHome,this);

_oButRestart = new CGfxButton(CANVAS_WIDTH/2 + 200,CANVAS_HEIGHT/2 + 120,s_oSpriteLibrary.getSprite("but_restart"),_oGroup);
_oButRestart.addEventListener(ON_MOUSE_UP,this._onButRestart,this);


s_oStage.addChild(_oGroup);

if(s_isLogin === false)
{
s_oEndPanel.createSubmitScoreBtn()
}
else
{
s_oEndPanel.createLeaderboardBtn()
}

};

this.createSubmitScoreBtn = function()
{
var oSprite = s_oSpriteLibrary.getSprite('but_submit_score');
_pLeaderboardBtn = {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT/2 + 120};
_oLeaderboardBtn1 = new CGfxButton(_pLeaderboardBtn.x,_pLeaderboardBtn.y,oSprite, _oGroup);
_oLeaderboardBtn1.addEventListener(ON_MOUSE_UP, this._showLeaderboard, this);
}
this.createLeaderboardBtn = function()
{
var oSprite = s_oSpriteLibrary.getSprite('but_leaderboard');
_pLeaderboardBtn = {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT/2 + 120};
_oLeaderboardBtn = new CGfxButton(_pLeaderboardBtn.x,_pLeaderboardBtn.y,oSprite, _oGroup);
_oLeaderboardBtn.addEventListener(ON_MOUSE_UP, this._showLeaderboard, this);
}

this._showLeaderboard = function()
{
console.log('_showLeaderboard')
if(s_isLogin === false)
{
this._onLoginClicked()
}
else
{
ID.GameAPI.Leaderboards.list({table:'Leaderboard'})
}
}

this._onLoginClicked = function () {
ID.login(this.idCallback);
};

this.refreshButtonPos = function(){
s_oMain.logoReposition(s_iOffsetX+70, (CANVAS_HEIGHT-60) - s_iOffsetY)
}

this.idCallback = function(response){
if (response) {
if(response.status === 'ok')
{
_oLeaderboardBtn1.unload()
s_oEndPanel.createLeaderboardBtn()
s_oMain.getUserName(response.authResponse.details.nickname, true)
s_oMain.submitScore(s_iScore)

}
else
{
ID.login(this.idCallback);
}
}
}

this.unload = function(){
_oBg.on("click",_oListener);
s_oStage.removeChild(_oGroup);
_oButHome.unload();
_oButRestart.unload();
if(s_isLogin === false)
{
_oLeaderboardBtn1.unload()
}
else
{
_oLeaderboardBtn.unload()
}

};

this.show = function(iDiscWinner,iPlayerColor,iScoreTime){
s_oMain.createY8Logo("g_menulogo", CANVAS_WIDTH/2, CANVAS_HEIGHT-100)

var iScoreWin = 0;
if(s_iCurMode === MODE_HUMAN){
//iScoreWin += POINTS_FOR_WIN;
playSound("win",1,0);
if(iDiscWinner === DISC_RED){
_oMsgText.text = TEXT_RED_WINS;
_oMsgText.y= (CANVAS_HEIGHT/2) - 20;
}else{
_oMsgText.text = TEXT_YELLOW_WINS;
_oMsgText.y= (CANVAS_HEIGHT/2) - 20;
}
s_iScore = s_iScore + 1;
s_oMain.submitScore(s_iScore)
saveDataItem()
}else{
if(iDiscWinner === iPlayerColor){
playSound("win",1,0);
iScoreWin += POINTS_FOR_WIN;
_oMsgText.text = TEXT_CONGRATS;
s_iScore = s_iScore + 1;
}else{
playSound("game_over",1,0);
_oMsgText.text = TEXT_YOU_LOSE;
}
s_oMain.submitScore(s_iScore)
saveDataItem()
_oTotScoreText.text = TEXT_SCORE + " " + s_iScore;
}


//_oScoreTimeText.text = TEXT_BONUS_TIME + ": "+iScoreTime;
//_oScoreWin.text = TEXT_BONUS_WIN + ": " + iScoreWin;
var iScore = (iScoreTime+iScoreWin);
//_oTotScoreText.text = TEXT_SCORE + " " + s_iScore;

_oGroup.visible = true;
_oGroup.alpha = 0;
createjs.Tween.get(_oGroup).to({alpha: 1}, 500,createjs.Ease.cubicOut).call(function(){$(s_oMain).trigger("show_interlevel_ad");});

if(iScore>0){
$(s_oMain).trigger("save_score",iScore);
$(s_oMain).trigger("share_event",_iScore);
}

setVolume("soundtrack",1);
try {
console.log('Showing Ads')
showNextAd()
}
catch (e) {
console.log(e + ' Error Showing Ads')
showMessage()
}
};

this._onButHome = function(){
_oThis.unload();
s_oMain.removeY8Logo()
$(s_oMain).trigger("end_session");

s_oGame.onExit();
};

this._onButRestart = function(){
_oGroup.visible = false;
s_oMain.removeY8Logo()
s_oGame.restart();
};

_oThis = this;
s_oEndPanel = this;
this._init();

return this;
}

var s_oEndPanel;
