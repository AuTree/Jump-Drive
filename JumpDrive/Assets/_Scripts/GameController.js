static var instance: GameController;

var gameLevel: int = 0;
var gameAsteriods: int = 0;
var asteriodPrefab:Asteriod;
var worldSize: float;
var maxAsteriodSize: int;
var minAsteriodSize : int;
var asteriodCount:int;
var starCount: int;
var players: int;

var startMatch: boolean;
var loadedMatch: boolean;

var playerPrefab: GameObject[];
var starPrefab: GameObject[];
var worldEdgesPrefab: GameObject;

var player1: GameObject;
//var player2: GameObject;
//var player3: GameObject;
//var player4: GameObject;
//var aiPlayer1: GameObject;
//var aiPlayer2: GameObject;
//var aiPlayer3: GameObject;

private var worldEdgesSpawned: boolean;

function Awake()
{
	instance = this;
	if(instance == null)
	{
		Debug.Log("Could not locate Game Controller!");
	}
	
	//Temp until menu and multiplayer is setup
	players = 0;
	loadedMatch = false;
	startMatch = true;
	
}

function Update()
{	
	if(startMatch)
	{	
		Debug.Log("We are starting the match!!");
		GameController.instance.gameLevel++;
		GameController.instance.NewLevel();
		startMatch = false;
		loadedMatch = true;
	}
}

function NewLevel()
{
	GameController.instance.GenerateAsteriods();
	//GameController.instance.GenerateStars();
	GameController.instance.GenerateWorldEdges();
	GameController.instance.GeneratePlayers();
}

function TimedGameRestart(timer:float)
{
	yield WaitForSeconds(timer);
	Application.LoadLevel(Application.loadedLevel);
}

function GenerateAsteriods()
{
	var spawnedAsteriod = 0;
	while(spawnedAsteriod < asteriodCount)
	{
		var halfWorldSize = worldSize * .5;
		//Get random number
		var rand = Random.Range(minAsteriodSize, maxAsteriodSize);
		var velocityScale = GameController.instance.gameLevel * 1.25;
		
		//Get random X and Z position based from the world size
		var xPos = Mathf.Lerp(-halfWorldSize, halfWorldSize, Random.value);
		var zPos = Random.Range(-halfWorldSize, halfWorldSize);
		
		//Get access to the Renderer to store object bounds size
		var rdr:Renderer = asteriodPrefab.GetComponent(Renderer);
		var rad: float =((rdr.bounds.max - rdr.bounds.min).magnitude * rand) *.5;
		
		//make new asteriod if not inside another asteriod
		if(!Physics.CheckSphere(Vector3(xPos,0.0,zPos), rad * 2))
		{
			var newAsteriod: Asteriod = Instantiate(asteriodPrefab, Vector3(xPos,0, zPos), transform.rotation);
			newAsteriod.Setup(rand, velocityScale);
			spawnedAsteriod++;
			GameController.instance.gameAsteriods ++;
		}
	}
}

function GenerateStars()
{
	for(var i = 0; i<starCount; i++)
	{
		var halfFieldSize = worldSize * .5;
		
		var xPos = Mathf.Lerp(-halfFieldSize, halfFieldSize, Random.value);
		var yPos = Mathf.Lerp(-halfFieldSize, -50, Random.value);
		var zPos = Mathf.Lerp(-halfFieldSize, halfFieldSize, Random.value);
		
		var starPicker = Random.Range(0,5);
		
		Instantiate(starPrefab[starPicker], Vector3(xPos,yPos,zPos), transform.rotation);
	}
}

function GenerateWorldEdges()
{
	Instantiate(worldEdgesPrefab, transform.position, transform.rotation);
}

function GeneratePlayers()
{
//Still need to add var for playerPrefab index number that correspond to different ships
//And a random var for the aiPrefab, to choose random ai ship
	switch(players)
	{
		case 0:
			//One player, make room for 3 AI
			player1 = Instantiate(playerPrefab[0], transform.position, transform.rotation);
			//aiPlayer1 = Instantiate(aiPrefab[0], transform.position, transform.rotation);
			//aiPlayer2 = Instantiate(aiPrefab[1], transform.position, transform.rotation);
			//aiPlayer3 = Instantiate(aiPrefab[2], transform.position, transform.rotation);
			break;
		case 1:
			//Two player, make room for 2 AI
			//player1 = Instantiate(playerPrefab[0], transform.position, transform.rotation);
			//player2 = Instantiate(playerPrefab[1], transform.position, transform.rotation);
			//aiPlayer1 = Instantiate(aiPrefab[0], transform.position, transform.rotation);
			//aiPlayer2 = Instantiate(aiPrefab[1], transform.position, transform.rotation);
			break;
		case 2:
			//Three player, make room for 1 AI
			//player1 = Instantiate(playerPrefab[0], transform.position, transform.rotation);
			//player2 = Instantiate(playerPrefab[1], transform.position, transform.rotation);
			//player3 = Instantiate(playerPrefab[2], transform.position, transform.rotation);
			//aiPlayer1 = Instantiate(aiPrefab[0], transform.position, transform.rotation);
			break;
		case 3:
			//Four player
			//player1 = Instantiate(playerPrefab[0], transform.position, transform.rotation);
			//player2 = Instantiate(playerPrefab[1], transform.position, transform.rotation)
			//player3 = Instantiate(playerPrefab[2], transform.position, transform.rotation);
			//player4 = Instantiate(playerPrefab[3], transform.position, transform.rotation);
			break;
	}
}

