var canvasSize = this.view.size;
var maxSize = Math.min(canvasSize.width, canvasSize.height);
var center = this.view.center;
var strokeWidth = maxSize * 0.02;

function Badge(){
this.states = {
    idle:     {duration:150, target: 'easeOut'},
    easeOut:  {degrees: 20,  target: 'twirling', increment:1},
    twirling: {degrees:320,  target: 'easeIn',   increment: 5},
    easeIn:   {degrees:20,   target: 'idle',     increment:1},
};

this.state = this.states.idle;
}

Badge.prototype = {
    constructor: Badge,
    draw: function(){
        var rectSize = new Size(maxSize * 0.6, maxSize * 0.6);
        var topLeftPositionForRect = new Point(center.x - rectSize.width/2,
        center.y - rectSize.height/2);
        var rectangle = new Rectangle(topLeftPositionForRect, rectSize);
        this.path = new Path.Rectangle(rectangle);
        this.path.style = {
            fillColor: '#272727',
            strokeColor: '#fff',
            strokeWidth: strokeWidth
        };
        this.path.rotate(45);

        return this;
    },

    isLastFrameForCurrentState: function(){
        return this.state.duration == this.state.frameCount || this.state.degrees == this.state.rotation;
    },

    rotate: function(){
        this.state.frameCount = this.state.frameCount || 0;
        this.state.frameCount++;

        if(this.state.increment){
            this.path.rotate(this.state.increment);
            this.state.rotation = this.state.rotation || 0;
            this.state.rotation += this.state.increment;
        }

        if(this.isLastFrameForCurrentState()){
            this.state.frameCount = 0;
            this.state.rotation = 0;
            this.state = this.states[this.state.target];
        }
    }
}

var badge = new Badge().draw();

function Branch(args){
    this.size = args.size;
    this.origin = args.origin;
    this.position = args.position;
    this.rectTop = badge.path.bounds.topLeft.y;
    this.angle = this.calculateAngle(args.position);
    this.color = args.color;
}

Branch.prototype = {
    constructor: Branch,
    draw: function(){
        var resolvedOrigin = new Point(center.x, this.rectTop + (maxSize * this.origin));
        var rectangle = new Rectangle(resolvedOrigin, new Size(maxSize * this.size, strokeWidth));
        this.path= new Path.Rectangle(rectangle);
        this.path.rotate(this.angle, new Point(resolvedOrigin.x, resolvedOrigin.y + strokeWidth/2));
        this.path.style = {
            fillColor: this.color || '#fff'
        }
        return this;
    },

    calculateAngle: function(position){
        var angles = {
            left: -135,
            right: -45,
            center: -90
        };

        return angles[position];
    }
}

var rightBottomBranch = new Branch({size: 0.3, origin: 0.58, position: 'right'}).draw();
var leftBottomBranch = new Branch({size: 0.3, origin: 0.58, position: 'left'}).draw();

var rightMiddleBranch = new Branch({size: 0.178, origin: 0.42, position: 'right'}).draw();
var leftMiddleBranch = new Branch({size: 0.178, origin: 0.42, position: 'left'}).draw();

var rightTopBranch = new Branch({size: 0.07, origin: 0.28, position: 'right', color: '#39b54a'}).draw();
var leftTopBranch = new Branch({size: 0.07, origin: 0.28, position: 'left', color: '#39b54a'}).draw();

var trunk = new Branch({size: 0.47, origin: 0.65, position: 'center'}).draw();


function onFrame(event){
    badge.rotate();
}