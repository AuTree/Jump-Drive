static var instance:PlayerGUI; 

var guiSkin : GUISkin;
var basicUI: Texture2D;
var radarTexture: Texture;

var mapSize: float;
var mapCenter: Vector2;
var worldSize: float;

private var velAlginWidth: float = 910;
private var velAlginHeight: float = -227;
private var crtBlockAlginWidth: float = -540.5;
private var crtBlockAlginHeigth: float = 228;
private var displayLasers: float;
private var displayEngines: float;
private var displayShields: float;
private var displayTotalPower: float;
private var mph : float;

function Awake()
{
	instance = this;
}
function Start () 
{
	mapSize = Screen.width * 15/100;
}

function Update () 
{
	displayTotalPower = (PlayerController.instance.totalPower *.33)*100;
	displayTotalPower = Mathf.Round(displayTotalPower * 100)/100;
	displayLasers = (PlayerController.instance.powerLasers * .33)*100; 
	displayEngines = (PlayerController.instance.powerEngines * .33)*100;
	displayShields = (PlayerController.instance.powerShields * .33)*100;
	mph = PlayerController.instance.pawn.rigidbody.velocity.magnitude * 2.237;
	mph = Mathf.Round(mph * 100)* .01;
}

function OnGUI()
{
	GUI.skin = guiSkin;
	GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height),basicUI);
	
	GUI.Label(Rect((Screen.width* 0.5) - velAlginWidth, Screen.height * 0.5 - velAlginHeight, 400, 100), ("Velocity "+ mph.ToString()+ "\n" +  PlayerController.instance.powerSelection));
	
	GUI.Label(Rect((Screen.width* 0.5) - crtBlockAlginWidth, Screen.height * 0.5 + crtBlockAlginHeigth, 500, 200), ("Ship Power "+ displayTotalPower.ToString() + " Pct\n" 
		+ "Lasers " + displayLasers.ToString() + " Pct.\n" + "Engines " +displayEngines.ToString()+ " Pct.\n" + "Shields " +displayShields.ToString()+ " Pct." + "\n" + "Money  "
		+ PlayerController.instance.money.ToString() + "\n" + "Gas  " + PlayerController.instance.gas.ToString()));
	
}