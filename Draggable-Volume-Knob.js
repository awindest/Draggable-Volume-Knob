/*                                 
╭━━╮╱╱╱╱╭╮╱╱╱╱╱╭╮╱╭╮╱╱╱╱╱╭╮            ━╮ ╭━
╰┫┣╯╱╱╱╱┃┃╱╱╱╱╭╯╰╮┃┃╱╱╱╱╱┃┃             | |
╱┃┃╭━╮╭━╯┣━━┳━┻╮╭╯┃┃╱╱╭━━┫╰━┳━━╮       ╱ o \
╱┃┃┃╭╮┫╭╮┃┃━┫━━┫┃╱┃┃╱╭┫╭╮┃╭╮┃━━┫      ╱_____\
╭┫┣┫┃┃┃╰╯┃┃━╋━━┃╰╮┃╰━╯┃╭╮┃╰╯┣━━┃     ╱    o  \  
╰━━┻╯╰┻━━┻━━┻━━┻━╯╰━━━┻╯╰┻━━┻━━╯    (__o______)  

Yet another science experiment from Indest Labs.

Recommend viewing in Visual Source Code.
*/
'use strict'

let knobPositionX
let knobPositionY
let mouseX
let mouseY
let knobCenterX
let knobCenterY
let adjacentSide
let oppositeSide
let currentRadiansAngle
let getRadiansInDegrees
let finalAngleInDegrees
let volumeSetting
let tickHighlightPosition
let audio = new Audio("https://www.cineblueone.com/maskWall/audio/skylar.mp3") //Celine Dion's "Ashes"
let startingTickAngle = -135
const numTicks = 28
let tickContainer = document.getElementById("tickContainer")
let volumeKnob = document.getElementById("knob")
let boundingRectangle = volumeKnob.getBoundingClientRect() //get rectangular geometric data of knob (x, y, width, height)
let funCaption
const knobRange = [20, 35, 45, 55, 65, 70, 80, 95] // range of values for when we display different fun captions.
const fontSizeWeights = d3.scaleThreshold() // tweening between these weights as we crank
        .domain(knobRange)
        .range([100, 200, 300, 400, 500, 600, 700, 800, 900])
const funCaptionThresholds = d3.scaleThreshold() // values of funCaption based upon volumeValue
        .domain(knobRange)
        .range(["Turn it up", "Looking good", "Good to go", "Hamster is running", "Impulse power", "Smoking now", "Warp Speed, Mr. Sulu", "Going to eleven", "I'm givin' it all she's got, Captain"])
const volumeValueIndicator = d3.select('#volumeValue')
//         // .attr('transform', 'translate(0, .95)')
//             .style('font-family','Inter')
//             .style('font-feature-settings', 'zero') // this font supports a slash in zero
//             .style('font-feature-settings', 'tnum') // digits are mono-spaced
//             .style('text-anchor', 'middle' ) // centered
//             .style('font-size'  , '5em')  // nice size for visibility
//             .style('font-weight', '900') // make it big
//             // .attr("font-weight",function(d,i) {return i*100+100;})
//             // .style('fill', '#8b8ba7')
            .style('color', 'purple')
function main()
{
    audio.volume = 0; //start at zero volume

    volumeKnob.addEventListener(getMouseDown(), onMouseDown); //listen for mouse button click
    volumeKnob.addEventListener('mousemove', onMouseDown); //listen for mouse button click
    document.addEventListener(getMouseUp(), onMouseUp); //listen for mouse button release
    funCaption = d3.select('#funKnobCaption').text(funCaptionThresholds(0))

    
    createTicks(numTicks, 0);
}

//on mouse button down
function onMouseDown()
{
    //start audio if not already playing
    if(audio.paused == true)
    {
        //mobile users must tap anywhere to start audio
        //https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
        var promise = audio.play();
        if (promise !== undefined) {
          promise.then(_ => {
            audio.play();
          }).catch(error => {
          });
        }
    }

    document.addEventListener(getMouseMove(), onMouseMove); //start drag
}

//on mouse button release
function onMouseUp()
{
    document.removeEventListener(getMouseMove(), onMouseMove); //stop drag
}

//compute mouse angle relative to center of volume knob
//For clarification, see my basic trig explanation at:
//https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
function onMouseMove(event)
{
    knobPositionX = boundingRectangle.left; //get knob's global x position
    knobPositionY = boundingRectangle.top; //get knob's global y position

    mouseX = event.pageX; //get mouse's x global position
    mouseY = event.pageY; //get mouse's y global position
    knobCenterX = boundingRectangle.width / 2 + knobPositionX; //get global horizontal center position of knob relative to mouse position
    knobCenterY = boundingRectangle.height / 2 + knobPositionY; //get global vertical center position of knob relative to mouse position

    adjacentSide = knobCenterX - mouseX; //compute adjacent value of imaginary right angle triangle
    oppositeSide = knobCenterY - mouseY; //compute opposite value of imaginary right angle triangle

    //arc-tangent function returns circular angle in radians
    //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
    currentRadiansAngle = Math.atan2(adjacentSide, oppositeSide);

    getRadiansInDegrees = currentRadiansAngle * 180 / Math.PI; //convert radians into degrees

    finalAngleInDegrees = -(getRadiansInDegrees - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction
console.log('list of angles - final, getRads, currentRadians', finalAngleInDegrees, getRadiansInDegrees, currentRadiansAngle)
    //only allow rotate if greater than zero degrees or lesser than 280 degrees
    if(finalAngleInDegrees >= 0 && finalAngleInDegrees <= 280)
    {
        volumeKnob.style.transform = `rotate(${finalAngleInDegrees}deg)`; //use dynamic CSS transform to rotate volume knob

        //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
        volumeSetting = Math.floor(finalAngleInDegrees / (260 / 100));

        tickHighlightPosition = Math.round((volumeSetting * 2.8) / 10); //interpolate how many ticks need to be highlighted

        createTicks(numTicks, tickHighlightPosition); //highlight ticks

        audio.volume = volumeSetting / 100; //set audio volume
        // actOnDatabase = volumeSetting / 100; //set db operations

        document.getElementById("volumeValue").innerHTML = volumeSetting 
 
        volumeValueIndicator.text(volumeSetting)

        funCaption.text(funCaptionThresholds(volumeSetting))
        //+ "%"; //update volume text
    }
}

//dynamically create volume knob "ticks"
function createTicks(numTicks, highlightNumTicks)
{
    //reset first by deleting all existing ticks
    while(tickContainer.firstChild)
    {
        tickContainer.removeChild(tickContainer.firstChild);
    }

    //create ticks
    for(var i=0;i<numTicks;i++)
    {
        var tick = document.createElement("div");

        //highlight only the appropriate ticks using dynamic CSS
        if(i < highlightNumTicks)
        {
            tick.className = "tick activetick";
        } else {
            tick.className = "tick";
        }

        tickContainer.appendChild(tick);
        tick.style.transform = `rotate(${startingTickAngle}deg)`
        startingTickAngle += 10;
    }

    startingTickAngle = -135; //reset
}

function getMouseDown()
{

        return "mousedown";

}

function getMouseUp()
{
        return "mouseup";

}

function getMouseMove()
{

        return "mousemove";

}

main();