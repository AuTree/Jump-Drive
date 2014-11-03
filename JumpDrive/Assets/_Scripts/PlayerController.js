static var instance: PlayerController;

var pawnSpawned: boolean = false;
var money: int;
var income: int;
var incMoney: int;
var gas: int;
var health:int = 100;
var keyLasers: String;
var keyEngines: String;
var keyShields: String;
var keyIncrease: String;
var keyDecrease: String;

var currentSelection: Transform;

//Touched in PlayerGUI////
var powerSelection: String;
var powerLasers: int;
var powerEngines: int;
var powerShields: int;
var totalPower: float;
var pawn: GameObject;
//////////////////////////

private var fireTimer: float;
private var fireRate: float;
private var lastUpdate: float = 1;


//Prefabs//////////////
var shipPrefab: GameObject[];
var cameraTargetPrefab: GameObject;
////////////////////////


function Awake () 
{
	instance = this;
	CreatePawn();
	PlayerCamera.UseorCreateCamera();
	
}

function Start()
{
	//Setup Var's
	fireTimer = 3;
	fireRate = 1;
	powerLasers = 1;
	powerEngines = 1;
	powerShields = 1; 
	
	cameraTarget = Instantiate(cameraTargetPrefab, Camera.main.transform.position, Camera.main.transform.rotation);
	cameraTarget.transform.parent = Camera.main.transform;
	
}

function Update () 
{
	//Do we have a camera; if not return or Do we have a ship; if not return
	if(Camera.main == null || pawn == null)
	{
		return;
	}
	
	//Handle left mouse selection (targeting)
	if ( Input.GetMouseButtonDown(0))
	{
		var hit : RaycastHit;
		var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);
		if (Physics.Raycast (ray, hit, 1000.0))
		{
		 	var selected = GameObject.FindWithTag("Selected");
			
			if(selected != null)
			{
				selected.tag = "Unselected";
			}
			
			hit.collider.transform.tag = "Selected";
			currentSelection = hit.collider.transform;
			Debug.Log("You selected something!!");
		}
		else
		{
			Debug.Log("You didn't hit anything!!");
			
			if(currentSelection != null)
			{
				currentSelection.tag = "Unselected";
				currentSelection = null;
				Debug.Log("Current target was Unselected!!");
			}
			
			currentSelection = null;
		}
	}
	
	//Fires a mining Probe at current selection if an asteriod
	if(Input.GetButtonDown("MineProbe"))
	{
		if(currentSelection != null)
		{
			var ast: Asteriod = currentSelection.GetComponent("Asteriod");
			if(ast != null && ast.minedOut == false)
			{
				Debug.Log("Current Selection is an Asteriod, mining Probe launched!!");
				ShipSetup.instance.CreateMProbe();
			}
		}
	}
	
	//Handles the Firing of the main lasers	
	if(Input.GetButtonDown("Fire"))
	{
		if(powerLasers > 0)
		{
				Fire();
		}
	}
	
	
	//Check for power selection change
	if(Input.GetKey(keyLasers))
	{
		powerSelection = "Lasers";
	}
		else if (Input.GetKey(keyEngines))
		{
			powerSelection = "Engines";
		}
			else if (Input.GetKey(keyShields))
			{
				powerSelection = "Shields";
			}
	//Add changes to the selection
	if(Input.GetKeyDown(keyIncrease))
	{	
		//Debug.Log("Increase Power 33");
		if(totalPower < 4)
		switch(powerSelection)
		{
			case "Lasers":
				powerLasers++;
				break;
			case "Engines":
				powerEngines++;
				break;
			case "Shields":
				powerShields++;
				break;
		}
	}
		else if(Input.GetKeyDown(keyDecrease))
		{
			//Debug.Log("Decrease Power 33");
			switch(powerSelection)
			{
				case "Lasers":
					if(powerLasers > 0)
						powerLasers--;
					break;
				case "Engines":
					if(powerEngines > 0)
						powerEngines--;
					break;
				case "Shields":
					if(powerShields > 0)
						powerShields--;
					break;
			}
		}
		
	//For display only; Turns the boosters on
	if(PlayerMove.instance.thrust > 0.0 && powerEngines > 0)
	{
		ShipSetup.instance.startBoosters();
	}
		else
		{
			ShipSetup.instance.stopBoosters();
		}
		
	if(Time.time - lastUpdate >= 1f)
	{
	    UpdateResources();
	    lastUpdate = Time.time;
  	}
	
	totalPower = powerLasers + powerEngines + powerShields;
}

function CreatePawn()
{
	if(!pawnSpawned)
	{
		pawn = Instantiate(shipPrefab[0], transform.position, transform.rotation);
		pawn.transform.parent = this.transform;
		pawnSpawned = true;
	}
}

function UpdateResources()
{	
	money += incMoney;
	incMoney = 0;
	gas += 10;
}

function Fire()
{
	ShipSetup.instance.ShipFire();
}
