var maxAsteriodVelocity: float;
var minAsteriodVelocity: float;
var crystalAmount: int;

var crystalColor: String;
var crystalType: String;

var minedOut: boolean = false;
var happened: boolean = false;

var mineralIcons: GameObject[];
var explosionPreFab : GameObject;
var explosionSound: AudioClip;
var target: Transform;
var icon: GameObject;

var beingMined: boolean = false;

private var selected: boolean = false;
private var iconSpawned: boolean = false;
private var randomDirection: Vector3;
private var asteriodSize: int;
private var velocity : Vector3;
private var asteriodHitPoints: int;
private var asteriodExplosionSize: int;
private var distanceToPlayer: float;
private var crystalPayout: float;
private var iconHeight: float;
private var mineralPicker: int;
private var debugCounter: int = 0;
private var crystalCounter: int = 60;

function FixedUpdate()
{
	if(!happened)
	{
		happened = true;
		rigidbody.AddForce(velocity, ForceMode.Impulse);
	}
}

function Update()
{
	if(!target)
	{
		target = GameObject.FindWithTag("Player").transform;
	}
	
	//Are we selected
	if(this.tag == "Selected" && selected == false)
	{
		selected = true;
		debugCounter ++;
	}
		//Did we get Unselected
		else if (this.tag == "Unselected")
		{
			selected = false;
			this.tag = "Asteriod";
			icon = GameObject.FindGameObjectWithTag("AsteriodIcon");
			Destroy(icon);
			iconSpawned = false;
			Debug.Log("This Asteriod is Unselected and Icon destroyed");
		}
		
	if(selected)
	{
		//if we are selected display info
		//var viewportPos: Vector3 = Camera.main.WorldToViewportPoint(transform.position);
		
		if(!iconSpawned)
		{
			if(asteriodSize <=2)
					iconHeight = 15;
				else if (asteriodSize <= 4)
					iconHeight = 25;
					else
					iconHeight = 35;
					
			
			var minIcon: GameObject = Instantiate(mineralIcons[mineralPicker], Vector3(transform.position.x , transform.position.y + iconHeight, transform.position.z),transform.rotation);
			minIcon.transform.parent = transform;
			iconSpawned = true;
		}
	 	
	 	if(debugCounter > 0)
	 	{
	 		Debug.Log("This Asteriod is selected");
	 		debugCounter --;
	 	}
	}
	
	if(beingMined)
	{
		StartMining();
		beingMined = false;
	}
	
	CheckDistance();
	
}

function CheckDistance()
{
	yield WaitForSeconds(2);
	distanceToPlayer = Vector3.Distance(target.position, transform.position);
	
	if(distanceToPlayer >= 500)
	{
		rigidbody.Sleep();
	}
	else
		{
			rigidbody.WakeUp();
		}
}

function Setup (size: int, velocityScale: float) 
{
	var rdmCrystalColor = Random.Range(1,100);
	var rdmCrystalAmount = Random.Range(1,100);
	
	asteriodSize = size;
	asteriodHitPoints = size * 2;
	asteriodExplosionSize = size * 10;
	this.transform.localScale = transform.localScale * size;
	
	if(rdmCrystalColor > 0 && rdmCrystalColor < 11)
	{
		//Make blue crystals
		this.renderer.material.color = Color.blue;
		crystalColor = "Blue";
	}
		else if (rdmCrystalColor > 10 && rdmCrystalColor < 26)
		{
			//Make red crystals
			this.renderer.material.color = Color.red;
			crystalColor = "Red";
		}
			else
			{
				//Make crystals yellow
				this.renderer.material.color = Color.yellow;
				crystalColor = "Yellow";
			}
	
	if(rdmCrystalAmount > 0 && rdmCrystalAmount < 11)
	{
		//Make Rich crystals
		crystalType = "Rich";
		switch(crystalColor)
		{
			case "Blue":
				crystalAmount = 1800;
				crystalPayout = 25;
				mineralPicker = 6;
				break;
			
			case "Red":
				crystalAmount = 1200;
				crystalPayout = 20;
				mineralPicker = 7;
				break;
			
			case "Yellow":
				crystalAmount = 900;
				crystalPayout = 15;
				mineralPicker = 8;
				break;
			
			default:
				Debug.Log("Crystal Color not Set!!");
				break;
		}
	}
		else if (rdmCrystalAmount > 10 && rdmCrystalAmount < 26)
		{
			//Make poor crystals
			crystalType = "Poor";
			switch(crystalColor)
			{
				case "Blue":
					crystalAmount = 600;
					crystalPayout = 10;
					mineralPicker = 3;
					break;
				
				case "Red":
					crystalAmount = 300;
					crystalPayout = 5;
					mineralPicker = 4;
					break;
				
				case "Yellow":
					crystalAmount = 150;
					crystalPayout = 3;
					mineralPicker = 5;
					break;
				
				default:
					Debug.Log("Crystal Color not Set!!");
					break;
			}
		}
			else
			{
				//Make moderate yellow
				crystalType = "Moderate";
				switch(crystalColor)
				{
					case "Blue":
						crystalAmount = 1200;
						crystalPayout = 20;
						mineralPicker = 0;
						break;
					
					case "Red":
						crystalAmount = 600;
						crystalPayout = 10;
						mineralPicker = 1;
						break;
					
					case "Yellow":
						crystalAmount = 300;
						crystalPayout = 5;
						mineralPicker = 2;
						break;
					
					default:
						Debug.Log("Crystal Color not Set!!");
						break;
				}
			}
	
	randomDirection = Vector3(Random.value, 0 , Random.value);
	var asteriodVelocity = Mathf.Lerp(minAsteriodVelocity, maxAsteriodVelocity, Random.value);
	asteriodVelocity *= velocityScale;
	
	velocity = randomDirection * asteriodVelocity;
}

function Hit(damage: int)
{
	asteriodHitPoints -= damage;
	if(asteriodHitPoints <= 0)
	{
		Explode();
	}
}
function StartMining()
{
	if(mineralPicker != 10)
			mineralPicker = 10;
			
	InvokeRepeating("Mining",1,1);
	yield WaitForSeconds(60);
	CancelInvoke("Mining");
	this.renderer.material.color = Color.gray;
	mineralPicker = 9;
	minedOut = true;
}

function Mining()
{
	//Decrease amount of minerals left in crystal
	crystalAmount -= crystalPayout; 
	
	//Increase Player money by crystal Amount
	PlayerController.instance.incMoney +=  crystalPayout;   
}

function Explode()
{
	var go = Instantiate(explosionPreFab, transform.position, transform.rotation);
	var det = go.GetComponent("Detonator");
	det.size = asteriodExplosionSize;
	
	AudioSource.PlayClipAtPoint(explosionSound, transform.position, 25);
	GameController.instance.gameAsteriods --;
	Destroy(this.gameObject);
}