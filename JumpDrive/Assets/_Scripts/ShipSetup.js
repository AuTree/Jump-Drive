static var instance: ShipSetup;

private var instanBoosters: GameObject;
private var instanBoostersExists: boolean;
private var childLights;
private var particles;
private var beam1: GameObject;
private var beam2: GameObject;

var numberParticles: int;
var numberLights: int;

var beamPosition: Vector3;
var beamPosition2: Vector3;
var beamPrefab: GameObject;
var boostersPreFab: GameObject;
var boostersPos: GameObject;
var beamPos: GameObject;
var beamPos2: GameObject;
var explosionPreFab : GameObject;
var mProbePrefab: GameObject;
var explosionSound: AudioClip;
var beamShot: AudioClip;

function Start () 
{
	instance = this;
	
	instanBoosters = Instantiate(boostersPreFab, boostersPos.transform.position, boostersPos.transform.rotation);
	beam1 = Instantiate(beamPos, beamPosition, transform.rotation);
	beam2 = Instantiate(beamPos2, beamPosition2, transform.rotation);
	instanBoosters.transform.parent = this.transform;
	beam1.transform.parent = this.transform;
	beam2.transform.parent = this.transform;
	
	particles = GetComponentsInChildren(ParticleEmitter);
	childLights = GetComponentsInChildren(Light);
	
	// Init the particles to not emit and switch off the spotlights:
	var x;
	var y;
	for (x =0; x < numberParticles; x++)
	{
		particles[x].emit = false;
	}
		
	for (y =0; y < numberLights; y++)
	{
		childLights[y].enabled = false;
	}
}


function ShipFire()
{
	var beamObject1: GameObject = Instantiate(beamPrefab, beam1.transform.position, transform.rotation);
	var beamObject2: GameObject = Instantiate(beamPrefab, beam2.transform.position, transform.rotation);
	AudioSource.PlayClipAtPoint(beamShot, transform.position, 4);
	var beam1 = beamObject1.GetComponent("Beam");
	var beam2 = beamObject2.GetComponent("Beam");
	beam1.Go(rigidbody.velocity, PlayerController.instance.powerLasers);
	beam2.Go(rigidbody.velocity, PlayerController.instance.powerLasers);
}

function CreateMProbe()
{
	Instantiate(mProbePrefab, beam1.transform.position, transform.rotation);
}

function Explode()
{
	var go = Instantiate(explosionPreFab, transform.position, transform.rotation);
	var det = go.GetComponent("Detonator");
	det.size = 25;
	
	AudioSource.PlayClipAtPoint(explosionSound, transform.position, 25);
	Destroy(this.gameObject);
}

function startBoosters()
{
	if(!instanBoostersExists)
	{
		var x;
		var y;
		for (x =0; x < numberParticles; x++)
		{
			particles[x].emit = true;
		}
		
		for (y =0; y < numberLights; y++)
		{
			childLights[y].enabled = true;
		}
		
		instanBoostersExists = true;
	}
}

function stopBoosters()
{
	if(instanBoostersExists)
	{
		var x;
		var y;
		for (x =0; x < numberParticles; x++)
		{
			particles[x].emit = false;
		}
		
		for (y =0; y < numberLights; y++)
		{
			childLights[y].enabled = false;
		}
		instanBoostersExists = false;
	}
	
	else
	{
		return;
	}	
}

function OnCollisionEnter(col: Collision)
{
	if (col.gameObject.tag == "Enemy")
	{
		Explode();
		Destroy(col.gameObject);
	}
}