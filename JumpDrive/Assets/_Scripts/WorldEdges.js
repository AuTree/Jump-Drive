var edgeheight: int = 50;
var edgedepth : int = 5;
var worldSize : float = 128.0;
var up: GameObject;
var down: GameObject;
var left: GameObject;
var right: GameObject;



function Start () 
{
	var centerX = transform.position.x + (worldSize *.5);
	var centerZ = transform.position.z + (worldSize * .5);
	
	left.transform.position = Vector3(transform.position.x - edgedepth * .5, 0, centerZ);
	right.transform.position = Vector3(transform.position.x + worldSize + edgedepth * .5, 0, centerZ);
	
	up.transform.position = Vector3(centerX, 0, transform.position.z - edgedepth * .5);
	down.transform.position = Vector3(centerX, 0, transform.position.z + worldSize + edgedepth * .5);
	
	left.transform.localScale = Vector3(edgedepth, edgeheight, worldSize);
	right.transform.localScale = Vector3(edgedepth, edgeheight, worldSize);
	
	up.transform.localScale = Vector3(worldSize, edgeheight, edgedepth);
	down.transform.localScale = Vector3(worldSize, edgeheight, edgedepth);
	
	transform.position = Vector3(-(worldSize * .5), 0, -(worldSize* .5));
	
}

 