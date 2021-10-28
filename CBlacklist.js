/* global STATE_MENU */

function CBlacklist(istate){

this._init = function(){
_iState = istate
Howler.mute(true);
s_oMain.unloadScreens(_iState)
var oButtonBg = createBitmap( s_oSpriteLibrary.getSprite('bg_menu'));
var _oGroup = new createjs.Container();
_oGroup.addChild(oButtonBg)
s_oStage.addChild(_oGroup);
var y8logoMc = s_oSpriteLibrary.getSprite('y8logo');
var _y8logoMc = createBitmap(y8logoMc);
s_oStage.addChild(_y8logoMc)
_y8logoMc.x = CANVAS_WIDTH/2-50
_y8logoMc.y = CANVAS_HEIGHT/2 + 30
var graphics = new createjs.Graphics().beginFill("#FFFFFF").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT/4+50);
var shape = new createjs.Shape(graphics)
var tempText1 = new createjs.Text("This website is blacklisted, please go to ", "bold 25px Arial", "#000")
var tempText2 = new createjs.Text("to play this game. If you are a\n website owner, please unblock games link\n and request y8.com to remove your\n website from blacklisted list", "bold 25px Arial", "#000")
//var tempText3 = new createjs.Text("", "bold 22px "+FONT2, "#000")
var _blackListText = new createjs.Text("http://www.y8.com/games/"+s_gameName,"bold 25px Arial", "#990000");
tempText1.textAlign = 'center';
tempText2.textAlign = 'center';
tempText2.textAlign = 'center';
_blackListText.textAlign = 'center';
_oGroup.on("pressup" , this._blackListClick);
shape.x = 0;
shape.y = CANVAS_HEIGHT - 250;
shape.alpha = .8
tempText1.x = CANVAS_WIDTH/2;
tempText1.y = CANVAS_HEIGHT - 230;
_blackListText.x = CANVAS_WIDTH/2;
_blackListText.y = tempText1.y + 25
tempText2.x = CANVAS_WIDTH/2;
tempText2.y = tempText1.y + 50
s_oStage.addChild(shape)
s_oStage.addChild(tempText1);
s_oStage.addChild(tempText2);
s_oStage.addChild(_blackListText);
};

this._blackListClick = function()
{
window.open("http://www.y8.com/games/"+s_gameName, "_blank");
}

this._init();

return this;
}
