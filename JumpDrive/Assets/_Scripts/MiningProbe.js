var MoveSpeed: int; 
var RotationSpeed: int;
var MaxDistance: float;

private var go: Transform;
private var target: Transform; 
private var myTransform: Transform;
	
//First thing that gets called 
function Awake() 
{
	myTransform = transform;
	go = PlayerController.instance.currentSelection;
	target = go.transform;
}


function Update () 
{
	//look at target
    if (target != null) 
    {
	    myTransform.rotation = Quaternion.Slerp(myTransform.rotation, Quaternion.LookRotation(target.position - myTransform.position),RotationSpeed * Time.deltaTime);
	
	    //move to target if not within range
	    if (Vector3.Distance(target.position, myTransform.position) > MaxDistance) 
	    {
		    myTransform.position += myTransform.forward * MoveSpeed * Time.deltaTime;
	    }
    } 
    //Find new target if player died, will be the new player clone
    else 
    {
		Debug.Log("There is no target!!");
    }
}

function OnTriggerEnter (other: Collider)
{	
	Debug.Log("We hit the target");
	
	if(target == other.collider.transform)
	{
		Debug.Log("Succesful hit, able to mine!!");
		var ast = other.collider.transform.GetComponent("Asteriod");
		ast.beingMined = true;
		Destroy(this.gameObject,2);
	}
	
}