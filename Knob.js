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
      // 'use strict'

class Knob {

    constructor(_parentElement) { //DOM element, data, options?
        
        this.parentElement = _parentElement
  
        this.initVis()
    }

initVis() {   // set up attributes and helper functions
    const vis = this
    vis.knobCenterX // x coordinate of knob's center
    vis.knobCenterY // y coordinate of knob's center

    vis.currentRadiansAngle
    vis.finalAngleInDegrees
    vis.volumeSetting
    vis.volumeValueIndicator
    vis.tickHighlightPosition

    vis.startingTickAngle = -135
    vis.numTicks = 28
    vis.boundingRectangle
    vis.tickContainer = document.getElementById("tickContainer")
    vis.volumeKnobD3Workaround = document.getElementById("knob") // d3 can't select a pseudo-element so we are stuck with this for now.
    vis.knobRange = [20, 35, 45, 55, 65, 70, 80, 95] // range of values for when we display different fun captions and change font weight.
    vis.fontSizeWeights = d3.scaleThreshold() // tweening between these weights as we crank
        .domain(vis.knobRange)
        .range([100, 200, 300, 400, 500, 600, 700, 800, 900])
    

    vis.funCaptionThresholds = d3.scaleThreshold() // values of funCaption based upon volumeValue
        .domain(vis.knobRange)
        .range(["Turn it up", "Looking good", "Good to go", "Hamster is running", "Impulse power", "Smoking now", "Warp Speed, Mr. Sulu", "Going to eleven", "I'm givin' it all she's got, Captain"])

    vis.knobScale = d3.scaleLinear()
        .domain([0,100])
        .range([100,10000])
        .clamp(true)

    const drag = d3.drag()
        .on("drag",vis.dragHandler.bind(this))        

    vis.knobWrapper = d3.select(vis.parentElement)
        // .append('svg')
        // .style('border', '1px solid purple')

        // vis.funCaption = d3.select('#funKnobCaption')
    // vis.funCaption = d3.select('#funKnobCaption')
    //     .append('text')
    //     .style('font-size'  , '2.25em')  // nice size for visibility
    //     .text(vis.funCaptionThresholds(0))
        
    // vis.knobWrapper.append('text')
    //     .attr('x', 25)
    //     .attr('y',25)
    //     .attr('transform','translate(10,10)')
    //     .style('fill', 'white')
    //     .text('(records per second)')
    
    vis.volumeKnob = d3.select('.knob')
        .call(drag)

    vis.formatNumber = d3.format(",")

    // vis.volumeValueIndicator = d3.select('.volumeValueIndicator')
    // vis.volumeValueIndicator = vis.knobWrapper.append('div').append('text')
        // .style('transform', 'translate(10, 15)')
 
        // .style('font-family','Inter')
        // .style('font-feature-settings', 'zero') // this font supports a slash in zero
        // .style('font-feature-settings', 'tnum') // digits are mono-spaced
        // .style('text-anchor', 'middle' ) // centered
        // .style('font-size'  , '3.25em')  // nice size for visibility
        // .style('font-weight', '100') // make it big
        // .style('color', 'purple')
        // .text(0)
    

    
    vis.boundingRectangle = vis.volumeKnob.node().getBoundingClientRect() //get rectangular geometric data of knob (x, y, width, height)
    vis.knobCenterX = vis.boundingRectangle.width / 2 + vis.boundingRectangle.left; //get global horizontal center position of knob relative to mouse position
    vis.knobCenterY = vis.boundingRectangle.height / 2 + vis.boundingRectangle.top; //get global vertical center position of knob relative to mouse position
    vis.createTicks(vis.numTicks, 0);
}

//compute mouse angle relative to center of volume knob
//For clarification, see my basic trig explanation at:
//https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
dragHandler(event, d) // drag is happening
{
    const vis = this 
 
    const coords = d3.pointer(event) //get mouse's x & y global positions; this is the way to do it in version 7. who knew?

    //arc-tangent function returns circular angle in radians
    //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
    //compute adjacent & opposite value of imaginary right angle triangle:
    vis.currentRadiansAngle = Math.atan2(vis.knobCenterX - coords[0], vis.knobCenterY - coords[1]);
    // vis.currentRadiansAngle = Math.atan2(vis.knobCenterX - event.x, vis.knobCenterY - event.y) * 180/Math.PI - 135;

    vis.finalAngleInDegrees = (vis.currentRadiansAngle * 180 / Math.PI) - 135; //convert radians into degrees
 //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction

    //only allow rotate if greater than zero degrees or lesser than 280 degrees
    if(vis.finalAngleInDegrees >= 0 && vis.finalAngleInDegrees <= 280) { // -2.35619 radians = -135 degrees

        vis.volumeKnobD3Workaround.style.transform = `rotate(${vis.finalAngleInDegrees}deg)`
        // vis.knob.style.transform = `rotate(${vis.finalAngleInDegrees}deg)` //use dynamic CSS transform to rotate volume knob
            //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
        vis.volumeSetting = Math.floor(vis.finalAngleInDegrees / (270 / 100));

        vis.tickHighlightPosition = Math.round((vis.volumeSetting * 2.8) / 10); //interpolate how many ticks need to be highlighted

        vis.createTicks(vis.numTicks, vis.tickHighlightPosition); //highlight ticks

            // actOnDatabase = volumeSetting / 100; //set db operations

            console.log('volumeSetting', vis.volumeSetting)

        vis.volumeValueIndicator
            .style('font-weight', d => vis.fontSizeWeights(vis.volumeSetting))
            .text(vis.formatNumber(vis.knobScale(vis.volumeSetting)))

        vis.funCaption.text(vis.funCaptionThresholds(vis.volumeSetting)) //update volume text
    }

}

//dynamically create volume knob "ticks"
    createTicks(numTicks, highlightNumTicks)
    {
        const vis = this
        //reset first by deleting all existing ticks
        while(vis.tickContainer.firstChild) {
            vis.tickContainer.removeChild(vis.tickContainer.firstChild);
        }

        //create ticks
        for(var i=0;i<numTicks;i++) {
            const tick = document.createElement("div");

            //highlight only the appropriate ticks using dynamic CSS
            if(i < highlightNumTicks)
            {
                tick.className = "tick activetick";
            } else {
                tick.className = "tick";
            }

            vis.tickContainer.appendChild(tick);
            tick.style.transform = `rotate(${vis.startingTickAngle}deg)`
            vis.startingTickAngle += 10;
        }

        vis.startingTickAngle = -135; //reset
    }

}
