var guiSkin : GUISkin;


function OnGUI()
{
	GUI.skin = guiSkin;
	if(GameController.instance.mainMenu)
	{
		if(GUI.Button(Rect(Screen.width * .5 -650 ,Screen.height * .5 - 50,300,50), "Start Game")) 
		{
			Application.LoadLevel(1);
		}
		
		 if(GUI.Button(Rect(Screen.width * .5 -650,Screen.height * .5 + 100,300,50), "Quit"))
		{
			Application.Quit();
		}
	}
}