@script RequireComponent (Rigidbody)
static var instance: PlayerMove;

var hoverHeight : float = 3;
var hoverHeightStrictness : float = 1.0;
var bankAmount : float = 0.1;
var bankSpeed : float = 0.2;
var thrust : float = 0;
var mainThrust: float = 50;
var reverseThrust: float = 25;
var turningSpeed: float = 80;
var mass : float = 5.0;
// positional drag
var sqrdSpeedThresholdForDrag : float = 25.0;
var superDrag : float = 2.0;
var fastDrag : float = 0.5;
var slowDrag : float = 0.01;
// angular drag
var sqrdAngularSpeedThresholdForDrag : float = 5.0;
var superADrag : float = 32.0;
var fastADrag : float = 16.0;
var slowADrag : float = 0.1;

var playerControl : boolean = true;

// thrust
private var forwardDirection : Vector3 = Vector3(0.0, 0.0, 1.0);
private var forwardThrust : float = mainThrust * 100;
private var backwardThrust : float = reverseThrust * 100;
private var bankAxis : Vector3 = Vector3(-1.0, 0.0, 0.0);
private var turn : float = 0;    
private var thrustGlowOn : boolean = false;
private var bank : float = 0.0;
private var turnSpeed : float = turningSpeed * 100;


function Awake() 
{
	instance = this;
}

function Start()
{
    gameObject.rigidbody.mass = mass;
}

function FixedUpdate()
{
    if (Mathf.Abs(thrust) > 0.01)
    {
        if (rigidbody.velocity.sqrMagnitude > sqrdSpeedThresholdForDrag)
            rigidbody.drag = fastDrag;
	        else
	            rigidbody.drag = slowDrag;
    }
	    else
	        rigidbody.drag = superDrag;
                
    if (Mathf.Abs(turn) > 0.01)
    {
        if (rigidbody.angularVelocity.sqrMagnitude > sqrdAngularSpeedThresholdForDrag)
            rigidbody.angularDrag = fastADrag;
	        else
	            rigidbody.angularDrag = slowADrag;
    }
	    else
	        rigidbody.angularDrag = superADrag;
    
    transform.position = Vector3.Lerp(transform.position, new Vector3(transform.position.x, hoverHeight, transform.position.z), hoverHeightStrictness);
    
    var amountToBank : float = rigidbody.angularVelocity.y * bankAmount;

    bank = Mathf.Lerp(bank, amountToBank, bankSpeed);
    
    var rotation : Vector3 = transform.rotation.eulerAngles;
    rotation *= Mathf.Deg2Rad;
    rotation.x = 0;
    rotation.z = 0;
    rotation += bankAxis * bank;
    rotation *= Mathf.Rad2Deg;
    transform.rotation = Quaternion.Euler(rotation);
}

function Update ()
{
    var theThrust : float = thrust;
    
    if (playerControl)
    {
        thrust = Input.GetAxis("Thrust");
        turn = Input.GetAxis("Torque") * turnSpeed;
    }
            
    if (thrust > 0.0)
    {
        theThrust *= forwardThrust * PlayerController.instance.powerEngines;
    }
	    else
	    {
	    	if(PlayerController.instance.powerEngines != 0)
	        	theThrust *= backwardThrust;
	    }
	    
    rigidbody.AddRelativeTorque(Vector3.up * turn * Time.deltaTime);
    rigidbody.AddRelativeForce(forwardDirection * theThrust * Time.deltaTime);
}

function SetPlayerControl(control : boolean)
{
    playerControl = control;
}

function Thrust( t : float )
{
    thrust = Mathf.Clamp( t, -1.0, 1.0 );
}

function Turn(t : float)
{
    turn = Mathf.Clamp( t, -1.0, 1.0 ) * turnSpeed;
}


