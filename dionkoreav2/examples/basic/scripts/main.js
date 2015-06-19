/*              쨌~=�졻돖x#�졻돖=-                         쨌=�댿돖xxx�졻뎵~-쨌              
            쨌~��%&$$$$&%x��쨌                        ~=��%$$$$$&%x��           
          ~x&$$$$$$$x~쨌  -%~                        #��  -��$$$$$$$#�댟�       
        =%$$$$$$$$$$-  -��$-                        x$%=쨌  x$$$$$$$$$&��      
      -%$$$$$$$$$$$$$%%$$$��                        쨌&$$&%&$$$$$$$$$$$$&��    
     쨌&$$$$$$$$$$$$$$$$$&=                           쨌#$$$$$$$$$$$$$$$$$$��   
     ��$$$$$$$$$$$$$$$$#-                              ��$$$$$$$$$$$$$$$$$    
     ��$$$$$$$$$$$$$$$$                                 ��$$$$$$$$$$$$$$$$    
     쨌%$$$$$$$$$$$$$$$��                                 &$$$$$$$$$$$$$$$=    
      ~#$$$$$$$$$$$$&��                                  쨌#$$$$$$$$$$$$&x     
      #%%%&&$$$$$&%��     =-   쨌-=�댿뎵xxxxxx�졻돖=~-쨌  -=       =x%$$$$$$&&%%&-    
      ��$&&%###��-       쨌$&�늵%&$$$$$$$$$$$$$$$%#��$-        쨌-��##%&&$$%     
       #$$$$$$$x        쨌��$$$$$$$$$$$$$$$$$$$$$$$$$%��        -$$$$$$$$~     
       쨌x&$$&&%##��   ~x&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$#=쨌  쨌=x#%&&&$&%=      
         -%&$$$$$$$��%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&x��$$$$$$$&��       
           -=�쟸#%&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%#��~쨌         
             쨌~��$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%��-쨌          
��===�댿돖�졻돖xx#%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&%%#xx�졻돖����%&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&%
 쨌쨌-=x%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%x=-쨌쨌 
       -��&$$$$$$$$$$$$$$$$$$$$&$$$$$$$$$$$$$$&$$$$$$$$$$$$$$$$$$$$&#��       
          쨌=%$$$$$$$$$$$$$$$$$$%=x%$$$$$$$$%��%$$$$$$$$$$$$$$$$$$%=쨌          
     쨌-~�댿돖x#%$$$$$$$$$$$$$$$$$$$x  -x$$$$�졖� x$$$$$$$$$$$$$$$$$$$%#x�졻뎵~-쨌     
   =��$$$$$%%%&$&%$$$$$$$$$$$$$$$%�졻돖%$$$$%�졻돖&$$$$$$$$$$$$$$$%&$&%%%$$$$$&��   
  -$&$&#��=x&$$%%$$~~��&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&#��~$$%%$$&x==��%$%$=  
  ��$$~  ��$$#x&$$~    쨌-=��%&&$$$$$$$$$$$$$$$$&%%#��-쨌    ~$$&x#$$%�� -$$$x  
  ��$�� #$$%-~%$#~           쨌쨌-~~==========~~-쨌쨌           ~#$%~쨌%$$#  =$$#  
  ��%  쨌$$#쨌-$&��                                             ��$-쨌#$$쨌  #$#  
  ��=  ~$%  -$&                                                &$쨌  %$~  -$x  
  -&   ~$~   &��                                               #%   ~$~   #=*/




/*


	TWIST NOTATION

	UPPERCASE = Clockwise to next 90 degree peg
	lowercase = Anticlockwise to next 90 degree peg



	FACE & SLICE ROTATION COMMANDS

	F	Front
	S 	Standing (rotate according to Front Face's orientation)
	B 	Back
	
	L 	Left
	M 	Middle (rotate according to Left Face's orientation)
	R 	Right
	
	U 	Up
	E 	Equator (rotate according to Up Face's orientation)
	D 	Down



	ENTIRE CUBE ROTATION COMMANDS
	
	X   Rotate entire cube according to Right Face's orientation
	Y   Rotate entire cube according to Up Face's orientation
	Z   Rotate entire cube according to Front Face's orientation



	NOTATION REFERENCES

	http://en.wikipedia.org/wiki/Rubik's_Cube#Move_notation
	http://en.wikibooks.org/wiki/Template:Rubik's_cube_notation


*/

function setup(){
	var date = new Date(),
    time = date.getTime(),
    tempoSliderX = 0,
    masterGainKnobY = 0,
    centerFace,
    dsCube,
    drumTypeElement,
    stickerElement,
    activeSteps = { a : {}, b : {} }
    
    
}


 function has3d() {
    var el = document.createElement('p'), 
        has3d,
        transforms = {
            'webkitTransform':'-webkit-transform',
            'OTransform':'-o-transform',
            'msTransform':'-ms-transform',
            'MozTransform':'-moz-transform',
            'transform':'transform'
        }

    // Add it to the body to get the computed style.
    document.body.insertBefore(el, null);

    for (var t in transforms) {
        if (el.style[t] !== undefined) {
            el.style[t] = "translate3d(1px,1px,1px)";
            has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
        }
      }

      document.body.removeChild(el);

      return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
  }

$(document).ready( function(){ 
	if(!has3d()){
		console.log('not supported');
	}

	var useLockedControls = true,
		controls = useLockedControls ? ERNO.Locked : ERNO.Freeform;

	var ua = navigator.userAgent,
		isIe = ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1;

	window.cube = new ERNO.Cube({
		hideInvisibleFaces: true,
		controls: controls,
		renderer: isIe ? ERNO.renderers.IeCSS3D : null
	});

	var container = document.getElementById( 'container' );
	container.appendChild( cube.domElement );

	if( controls === ERNO.Locked ){
		var fixedOrientation = new THREE.Euler(  Math.PI * 0.1, Math.PI * -0.25, 0 );
		cube.object3D.lookAt( cube.camera.position );
		cube.rotation.x += fixedOrientation.x;
		cube.rotation.y += fixedOrientation.y;
		cube.rotation.z += fixedOrientation.z;
	}
	
	cube.camera.setLens(48);

	
	// loop through cube sides and setup center faces for sample title, selection, loader
    cube.faces.forEach( function( face, i ) {
      //get face object
      var centerFace = face.cubelets[ 4 ][ face.name ];
      //add class to id center face
      centerFace.element.classList.add( 'center' )
      //save face name to center element
      centerFace.element.dataset.faceName = face.name

      //get center sticker element
      var stickerElement = centerFace.element.querySelector( 'div.sticker' )
      
      var span = document.createElement("span");
      span.setAttribute("class", "dion_cube_text color" + (i+1));
      var textStr = '';
      
      if(i == 0){    	  
    	  textStr = 'USER<br/>EXPERIENCE';
      }else if(i == 1){
    	  textStr = 'WEB&MOBILE<br/>DESIGN';
      }else if(i == 2){
    	  textStr = 'UI/GUI<br/>DESIGN';
      }else if(i == 3){
    	  textStr = 'ADVERTISING&<br/>MARKETING';
      }else if(i == 4){
    	  textStr = 'WEB<br/>ACCESSIBILITY';
      }else if(i == 5){
    	  textStr = 'MAINTENANCE';
      }
      
      span.innerHTML = textStr;
      stickerElement.appendChild(span);
      
    });
    
    cube.cubelets.forEach( function( cubelet ) {    	
    	$(cubelet.children[0].element).children().wrapAll('<div class="cube_wrapper cubelet"/>');
    	
        faceNormals[ cubelet.address ] = [];
      
        cubelet.faces.forEach( function( face ) {
        	faceNormals[ cubelet.address ].push( face.normal );         
        });
    });
    
    // 디온코리아 텍스트
    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1500 );
	camera.position.set( 10, 40, 700 );

	cameraTarget = new THREE.Vector3( 0, 150, 0 );
	
	var textContainer = document.getElementById("w3dText");
	scene = new THREE.Scene();
	
	material = new THREE.MeshFaceMaterial( [ 
		new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
		new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
	] );
	
	group = new THREE.Object3D();
	group.position.y = 0;
	group.position.x = 0;
	
	
	var txt = ['D','I','O','N','K','O','R'];
	//var mrg = [-220, -160, -100, -15, 75, 155, 235];
	var mrg = [-235, -170, -105, -15, 80, 165, 250];
	
	for(var i = 0 ; i < 7; i++){
		var tx3d = createText(txt[i]);
		tx3d.position.x = mrg[i];
		group.add(tx3d);		
		txt_arr.push(tx3d);
	}
	
	scene.add( group );
	
	//debugaxis(300);
	
	
	var pointLight = new THREE.PointLight( 0x91fe56, 1.5 );
	pointLight.position.set( 0, 100, 90 );
	scene.add( pointLight );
	
	
	/*
	directionalLight = new THREE.DirectionalLight( 0x4f8935, 1.9 );	
	directionalLight.position.x = 0;
	directionalLight.position.y = -40;
	directionalLight.position.z = 30;
	directionalLight.position.normalize();
	scene.add( directionalLight ); 
	*/
	
	text_renderer = new THREE.WebGLRenderer({alpha :true, antialias: true});
	text_renderer.setClearColor( 0x000000, 0 );
	text_renderer.setSize( 400, 160 );
	
	textContainer.appendChild(text_renderer.domElement);
		
	txtRender();
	
	cuberotateInifinite();
});

function cuberotateInifinite(){
	cube.taskQueue.add(cubeRotate);
	setTimeout(cuberotateInifinite, 6000);
}


var scene, text_renderer, camera;
var group, textMesh1, textMesh2, textGeo, material;
var bevelEnabled = false, mirror = false;
var cameraTarget;
var txt_arr = new Array();

function createText(txt) {
	var height = 40, size = 70, hover = 30;
	textGeo = new THREE.TextGeometry( txt, {

		size: 100,
		height: 20,
		hover:30,
		curveSegments: 4,

		font: 'dinbol',
		weight: 'normal',
		style: 'normal',

		bevelThickness: 2,
		bevelSize: 1.0,
		bevelEnabled: true,

		material: 0,
		extrudeMaterial: 1

	});

	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();

	// "fix" side normals by removing z-component of normals for side faces
	// (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

	var triangleAreaHeuristics = 0.1 * ( height * size );

	for ( var i = 0; i < textGeo.faces.length; i ++ ) {

		var face = textGeo.faces[ i ];

		if ( face.materialIndex == 1 ) {

			for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
				face.vertexNormals[ j ].z = 0;				
				face.vertexNormals[ j ].normalize();
			}

			var va = textGeo.vertices[ face.a ];
			var vb = textGeo.vertices[ face.b ];
			var vc = textGeo.vertices[ face.c ];
			var s = THREE.GeometryUtils.triangleArea( va, vb, vc );
			
			if ( s > triangleAreaHeuristics ) {
				for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
					face.vertexNormals[ j ].copy( face.normal );
				}
			}
		}
	}

	THREE.GeometryUtils.center( textGeo );
	
	var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

	var textMesh1 = new THREE.Mesh( textGeo, material );

	textMesh1.position.x = centerOffset;
	textMesh1.position.y = hover;
	textMesh1.position.z = 0;

	textMesh1.rotation.x = 0;
	textMesh1.rotation.y = Math.PI * 2;

	return textMesh1;
}

function getRandomIdx(){	
	//var _numArr = [0,1,2,3,4,5,6];
	
	//console.log(_numArr);
	
	var cnt = Math.floor(Math.random() * 7) + 2; 
	if(cnt>7){
		cnt = 7;
	}
	var _idxArr = new Array();
	
	//console.log('cnt='+cnt);
	
	for( var i = 0 ; i < cnt ; i++){
		var _idx = Math.floor(Math.random() * 7);
		
		_idxArr.push(_idx);		
	}
	
	//console.log(_idxArr);
	
	return _idxArr;
}

var idx = getRandomIdx();
var curr_idx = 0;
var isAnimate = false;
var curr_step = 0;
var sequenceOrder = [ 8, 7, 6, 3, 0, 1,  2, 5  ];
var prev_sec = -1;

var faceNormals = [];

function txtRender(){

	requestAnimationFrame(txtRender);
	
	// 텍스트
	for(var i = 0 ; i < idx.length; i++){
		txt_arr[idx[i]].rotation.y += 0.02;
		if(txt_arr[idx[i]].rotation.y >= 6.4){
			txt_arr[idx[i]].rotation.y = 0;
			idx[i] =  Math.floor(Math.random() * 7);
		}
	}
	
	// 백그라운드
	var d = new Date();
	var n = d.getSeconds();	
	
	if(n % 5 == 0 ){				
		if(!isAnimate){
			isAnimate = true;
			
			var vis = $('.overlay').eq(curr_idx);		
			vis.fadeOut(2000, function(){
				isAnimate = false
			});
			
			if(curr_idx != 5){
				vis.next().fadeIn(2000);
				curr_idx++;
			}else{
				$('.overlay').eq(0).fadeIn(2000);
				curr_idx = 0;
			}
			
		}
				
	}
	
	// 큐브 색변경	
	if(n != prev_sec){
		
	    cube.faces.forEach( function( face, idx ) {  	
	    	var cubelet = face.cubelets;
	    	
	    	var color_num = idx + 1;
	    	
	    	var cube_dir = idx;
	    	
	    	var step = sequenceOrder[curr_step];
	    	
	    	for(var k = 0 ; k < cubelet.length; k++){
	    		$(cubelet[k].faces[cube_dir].element).find('.sticker').removeClass('cube_color color1 color2 color3 color4 color5 colo6').addClass('light_off');
	    		//$(cubelet[k].faces[cube_dir].element).find('.sticker').addClass('cube_color').addClass('color'+color_num);
	    	}
	    	
	    	$(cubelet[step].faces[cube_dir].element).find('.sticker').addClass('cube_color').addClass('color'+color_num).removeClass('light_off').addClass('light_on');	    		    	
	    	
	    });
	    
	    curr_step++;
	    if(curr_step > 7 ){
    		curr_step = 0;
    	}	    	    
	    prev_sec = n;	    
	    
	  //  cubeScaleAni();
	}
	
	text_renderer.render(scene, camera);
}

function cubeScaleAni(){
	cube.cubelets.forEach( function( cubelet ) {
        var size = cubelet.size,
          p = new THREE.Vector3( 0, 0, 0 ),
          s = new THREE.Vector3( 1, 1, 1 ),
        sOffset = 1,
        pOffset = 1;
        	
    	 var step = sequenceOrder[curr_step];
        
         var normal = cubelet.face;            
       
          //if( !drumCubeWrapper.classList.contains( 'center' ) ){
            cubelet.faces.forEach( function( face, idx ) {
             var cubelet_el = face.cubelets;
            	
              if ( face.element.classList.contains( 'faceExtroverted' ) ) {            	  
            	var rand = parseInt(Math.random() * 4 - 2);
            	
                sOffset = ( 0.05 * rand );
                pOffset = ( 0.5 * ( sOffset * size ) );
                 
                normal = faceNormals[ cubelet.address ][ face.id ];
                
                //console.log(pOffset);
                //console.log(sOffset);
                
                if ( normal == 'right' ) {
                  s.x = 1 + sOffset
                  p.x += pOffset
                } else if ( normal == 'left' ) {
                  s.x = 1 + sOffset
                  p.x -= pOffset
                } else if ( normal == 'down' ) {
                  s.y = 1 + sOffset
                  p.y += pOffset
                } else if ( normal == 'up' ) {
                  s.y = 1 + sOffset
                  p.y -= pOffset
                } else if ( normal == 'front' ) {
                  s.z = 1 + sOffset
                  p.z += pOffset
                } else if ( normal == 'back' ) {
                  s.z = 1 + sOffset
                  p.z -= pOffset
                }
                
                $('.light_on').css('transform', 'scale3d(' + s.x + ',' + s.y + ',' + s.z + ') translate3d(' + p.x + 'px, ' + p.y + 'px, ' + p.z + 'px)');
                $('.light_off').css('transform', 'scale3d(1,1,1) translate3d(1,1,1)');
              }
              
              
            } );
            
            //var el = $(cubelet.children[0].element).find('.cube_wrapper');
            //el.css('transform', 'scale3d(' + s.x + ',' + s.y + ',' + s.z + ') translate3d(' + p.x + 'px, ' + p.y + 'px, ' + p.z + 'px)');
      })
}

function cubeRotate(){
	var targetX = cube.rotation.x + Math.PI * 2,
	targetY = cube.rotation.y + Math.PI * 2

	cube.isReady = false		
	new TWEEN.Tween( cube.rotation )
		.to({
			y: targetY,
		}, 6000 )
		.easing( TWEEN.Easing.Quadratic.InOut )
		.onComplete( function(){

			cube.isReady = true
		})
		.start( cube.time )

	new TWEEN.Tween( cube.rotation )
		.to({
			x: targetX
		}, 4000 )
		.easing( TWEEN.Easing.Quartic.InOut )
		.onComplete( function(){

			cube.isReady = true
		})
		.delay( 2000 )
		.start( cube.time )
}

var debugaxis = function(axisLength){
    //Shorten the vertex function
    function v(x,y,z){ 
            return new THREE.Vector3(x,y,z); 
    }
    
    //Create axis (point1, point2, colour)
    function createAxis(p1, p2, color){
            var line, lineGeometry = new THREE.Geometry(),
            lineMat = new THREE.LineBasicMaterial({color: color, lineWidth: 1});
            lineGeometry.vertices.push(p1, p2);
            line = new THREE.Line(lineGeometry, lineMat);
            scene.add(line);
    }
    
    createAxis(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000); // x = red
    createAxis(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00); // y = green
    createAxis(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF); // z = blue
};


// 