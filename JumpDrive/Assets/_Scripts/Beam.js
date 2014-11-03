var deathTimer: float = 5;
var beamVelocity : float = 100;
var damage: int;
var miniExplosion: GameObject;
var miniExplosionSound: AudioClip;


function Update()
{
	 deathTimer -= 1 * Time.deltaTime;
	 
	 if(deathTimer <= 0)
	 {
	 	Destroy(this.gameObject);
	 }
}
function FixedUpdate()
{
	rigidbody.AddForce(transform.forward * beamVelocity, ForceMode.Acceleration);
}

function OnTriggerEnter (other: Collider)
{
	if((other.gameObject.tag == "Asteriod") || (other.gameObject.tag == "Enemy"))
	{
		var takeDamage = other.GetComponent(Asteriod);
		takeDamage.Hit(damage);
		var go = Instantiate(miniExplosion, transform.position, transform.rotation);
		var det = go.GetComponent("Detonator");
		det.size = 5;
		
		AudioSource.PlayClipAtPoint(miniExplosionSound, transform.position, 10);
		Destroy(this.gameObject);
	}
}

function Go (shipVelocity:Vector3, damagepower:int)
{
	rigidbody.AddForce(transform.forward + shipVelocity, ForceMode.VelocityChange);
	damage += damagepower;
}
