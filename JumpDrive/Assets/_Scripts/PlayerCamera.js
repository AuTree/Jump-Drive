static var instance: PlayerCamera;
var targetLookAtObject: Transform;

var distance: float = 150;
var distanceMin: float = 75;
var distanceMax: float = 250;
var X_mouseSensitivity: float = 5;
var Y_mouseSensitivity: float = 5;
var mouseWheelSensitivity: float = 25;
var Y_minLimit: float = -40;
var Y_maxLimit: float = 80;
var distanceSmooth: float = 0.05;
var X_smooth: float = 0.05;
var Y_smooth: float = 0.1;


private var mouseX: float = 0;
private var mouseY: float = 0;
private var startDistance:float = 0;
private var desiredDistance: float = 0;
private var velocityDistance: float = 0;
private var velocityX: float = 0;
private var velocityY: float = 0;
private var velocityZ: float = 0;
private var desiredPos: Vector3 = Vector3.zero;
private var position: Vector3 = Vector3.zero;



function Awake()
{
	instance = this;	
}

function Start()
{
	distance =Mathf.Clamp(distance, distanceMin, distanceMax);
	startDistance = distance;
	ResetCamera();
}

function LateUpdate()
{
	if(targetLookAtObject == null)
	{
		return;
	}
	
	HandlePlayerInput();
	CalculateDesiredCamPos();
	UpdateCamPos();
}

function HandlePlayerInput()
{
	var deadZone:float = 0.01;
	
	if(Input.GetMouseButton(1))
	{
		//Allow orbit of Camera
		mouseX += Input.GetAxis("Mouse X") * X_mouseSensitivity;
		mouseY -= Input.GetAxis("Mouse Y") * Y_mouseSensitivity;
	}
	
	mouseY = ClampAngle(mouseY, Y_minLimit, Y_maxLimit);
	
	if(Input.GetAxis("MouseScrollWheel") < - deadZone || Input.GetAxis("MouseScrollWheel") > deadZone)
	{
		desiredDistance = Mathf.Clamp(distance - Input.GetAxis("MouseScrollWheel") * mouseWheelSensitivity, distanceMin, distanceMax );
	}
}

function CalculateDesiredCamPos()
{
	distance = Mathf.SmoothDamp(distance, desiredDistance, velocityDistance, distanceSmooth);
	
	desiredPos = CalculatePos(mouseY, mouseX, distance);
}

function CalculatePos(rotationX:float, rotationY: float, distance: float): Vector3
{
	var direction: Vector3 = Vector3(0,0, -distance);
	var rotation: Quaternion = Quaternion.Euler(rotationX,rotationY,0);
	
	return targetLookAtObject.position + rotation * direction;
}

function UpdateCamPos()
{
	var posX = Mathf.SmoothDamp(position.x, desiredPos.x, velocityX, X_smooth);
	var posY = Mathf.SmoothDamp(position.y, desiredPos.y, velocityY, Y_smooth);
	var posZ = Mathf.SmoothDamp(position.z, desiredPos.z, velocityZ, X_smooth);
	
	position = Vector3(posX,posY,posZ);
	
	transform.position = position;
	
	transform.LookAt(targetLookAtObject);
}

function ResetCamera()
{
	mouseX = 0;
	mouseY = 30;
	distance = startDistance;
	desiredDistance = distance;	
}

static function UseorCreateCamera()
{
	var tempCamera: GameObject;
	var tempTargetLookAt: GameObject;
	var myCamera: PlayerCamera;
	
	if(Camera.main != null)
	{
		tempCamera = Camera.main.gameObject;
	}
	else
	{
		tempCamera = GameObject("Main Camera");
		tempCamera.AddComponent("Camera");
		tempCamera.tag = "MainCamera";
	}
	
	tempCamera.AddComponent("PlayerCamera");
	myCamera = tempCamera.GetComponent("PlayerCamera");
	
	tempTargetLookAt = GameObject.Find("targetLookAt");
	
	if(tempTargetLookAt == null)
	{
		tempTargetLookAt = GameObject("targetLookAt");
		tempTargetLookAt.transform.position = Vector3.zero;
	}
	
	myCamera.targetLookAtObject = tempTargetLookAt.transform;
}

static function ClampAngle (angle : float, min : float, max : float) {
	if (angle < -360)
		angle += 360;
	if (angle > 360)
		angle -= 360;

	return Mathf.Clamp (angle, min, max);
}

