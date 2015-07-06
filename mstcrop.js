var MstCrop = function(id) {
	if (!id) { console.log('No element id specified'); return; }

	this.image = document.getElementById(id);

	if (!this.image) { console.log('No element found for #'+id); return; }
	
	if (document.getElementById(id).getAttribute('mst-crop')) { console.log('Alraedy initialized for #'+id); return; }

	this.dragging = false;
	this.draggingCoordinates = {};

	this.resizing = false;
	this.resizingCoordinates = {};

	this.init();

	document.getElementById(id).setAttribute('mst-crop', true);
};

// This will make the sourounding div including overlays, resize buttons and such.
MstCrop.prototype.init = function() {
	this.image.style.display = 'block';

	this.souroundingDiv = document.createElement('div');
	this.souroundingDiv.style.display = 'inline-block';
	this.souroundingDiv.style.position = 'relative';

	this.souroundingDiv.appendChild(this.image.cloneNode(true));
	this.image.parentNode.replaceChild(this.souroundingDiv, this.image);

	this.createVisibleArea();

	var overlayDirections = ['top', 'right', 'bottom', 'left'];
	var resizeBlockDirections = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

	var _this = this;

	overlayDirections.forEach(function(item, i) {
		_this.createOverlay(item);
	});

	resizeBlockDirections.forEach(function(item, i) {
		_this.createResizeBlock(item);
	});
};

MstCrop.prototype.createOverlay = function(position) {
	var overlay = document.createElement('div');
	overlay.id = 'mst-overlay-'+position;
	overlay.style.backgroundColor = 'rgba(0, 0, 0, .5)';
	overlay.style.position = 'absolute';
	overlay.style.zIndex = '5';

	switch (position) {
		case 'top':
			overlay.style.height = '10px';
			overlay.style.left = '0px';
			overlay.style.right = '0px';
			overlay.style.top = '0px';
			break;

		case 'right':
			overlay.style.height = '300px';
			overlay.style.right = '0px';
			overlay.style.top = '10px';
			overlay.style.width = '10px';
			break;

		case 'bottom':
			overlay.style.bottom = '0px';
			overlay.style.height = '10px';
			overlay.style.left = '0px';
			overlay.style.right = '0px';
			break;

		case 'left':
			overlay.style.height = '300px';
			overlay.style.left = '0px';
			overlay.style.top = '10px';
			overlay.style.width = '10px';
			break;
	}

	this['overlay'+position] = overlay;
	this.souroundingDiv.appendChild(this['overlay'+position]);
};

MstCrop.prototype.createVisibleArea = function() {
	this.visibleArea = document.createElement('div');
	this.visibleArea.id = 'mst-visible-area';
	this.visibleArea.style.backgroundColor = 'transparent';
	this.visibleArea.style.border = '1px dashed #fff';
	this.visibleArea.style.bottom = '10px';
	this.visibleArea.style.cursor = 'move';
	this.visibleArea.style.left = '10px';
	this.visibleArea.style.position = 'absolute';
	this.visibleArea.style.right = '10px';
	this.visibleArea.style.top = '10px';

	this.souroundingDiv.appendChild(this.visibleArea);

	// Add events
	this.visibleArea.addEventListener('mousedown', this.startDrag.bind(this));
	this.visibleArea.addEventListener('mouseup', this.stopDrag.bind(this));
	this.visibleArea.parentNode.addEventListener('mouseleave', this.stopDrag.bind(this));
	this.visibleArea.parentNode.addEventListener('mousemove', this.moveVisibleArea.bind(this));
};

MstCrop.prototype.createResizeBlock = function(direction) {
	var resizeBlock = document.createElement('div');
	resizeBlock.id = 'mst-rblock-'+direction;
	resizeBlock.style.backgroundColor = '#fff';
	resizeBlock.style.cursor = direction+'-resize';
	resizeBlock.style.height = '5px';
	resizeBlock.style.position = 'absolute';
	resizeBlock.style.width = '5px';
	resizeBlock.style.zIndex = '6';
	resizeBlock.setAttribute('data-dir', direction);

	switch (direction) {
		case 'n':
			resizeBlock.style.left = '50%';
			resizeBlock.style.top = '0px';
			resizeBlock.style.transform = 'translate3d(-50%, -100%, 0)';
			resizeBlock.style.webkitTransform = 'translate3d(-50%, -100%, 0)';
			break;

		case 'ne':
			resizeBlock.style.right = '0px';
			resizeBlock.style.top = '0px';
			resizeBlock.style.transform = 'translate3d(100%, -100%, 0)';
			resizeBlock.style.webkitTransform = 'translate3d(100%, -100%, 0)';
			break;

		case 'e':
			resizeBlock.style.right = '0px';
			resizeBlock.style.top = '50%';
			resizeBlock.style.transform = 'translate3d(100%, -50%, 0)';
			resizeBlock.style.webkitTransform = 'translate3d(100%, -50%, 0)';
			break;

		case 'se':
			resizeBlock.style.bottom = '0px';
			resizeBlock.style.right = '0px';
			resizeBlock.style.transform = 'translate3d(100%, 100%, 0)';
			resizeBlock.style.webkitTransform = 'translate3d(100%, 100%, 0)';
			break;

		case 's':
			resizeBlock.style.bottom = '0px';
			resizeBlock.style.left = '50%';
			resizeBlock.style.transform = 'translate3d(-50%, 100%, 0)';
			resizeBlock.style.webkitTransform = 'translate3d(-50%, 100%, 0)';
			break;

		case 'sw':
			resizeBlock.style.bottom = '0px';
			resizeBlock.style.left = '0px';
			resizeBlock.style.transform = 'translate3d(-100%, 100%, 0)';
			resizeBlock.style.webkitTransform = 'translate3d(-100%, 100%, 0)';
			break;

		case 'w':
			resizeBlock.style.left = '0px';
			resizeBlock.style.top = '50%';
			resizeBlock.style.transform = 'translate3d(-100%, -50%, 0)';
			resizeBlock.style.webkitTransform = 'translate3d(-100%, -50%, 0)';
			break;

		case 'nw':
			resizeBlock.style.left = '0px';
			resizeBlock.style.top = '0px';
			resizeBlock.style.transform = 'translate3d(-100%, -100%, 0)';
			resizeBlock.style.webkitTransform = 'translate3d(-100%, -100%, 0)';
			break;
	}

	this['resizeBlock'+direction] = resizeBlock;
	this.visibleArea.appendChild(this['resizeBlock'+direction]);

	this['resizeBlock'+direction].addEventListener('mousedown', this.startResize.bind(this));
	this['resizeBlock'+direction].parentNode.parentNode.addEventListener('mouseleave', this.stopResize.bind(this));
	document.body.addEventListener('mouseup', this.stopResize.bind(this));
	document.body.addEventListener('mousemove', this.resize.bind(this));
};

MstCrop.prototype.startDrag = function(e) {
	var e = e || event;

	if (this.resizing) { return; }

	this.dragging = true;

	this.draggingCoordinates.startY = e.clientY;
	this.draggingCoordinates.startT = window.getComputedStyle(e.target).getPropertyValue('top');
	this.draggingCoordinates.startX = e.clientX;
	this.draggingCoordinates.startL = window.getComputedStyle(e.target).getPropertyValue('left');
};

MstCrop.prototype.stopDrag = function() {
	this.dragging = false;
};

MstCrop.prototype.moveVisibleArea = function(e) {
	var e = e || event;

	if (!this.dragging) { return; }

	var newTop = parseInt(this.draggingCoordinates.startT) + (e.clientY - this.draggingCoordinates.startY);
	var newLeft = parseInt(this.draggingCoordinates.startL) + (e.clientX - this.draggingCoordinates.startX);

	this.updateVisibleArea(newLeft, newTop);
};

MstCrop.prototype.updateVisibleArea = function(x, y, w, h) {
	var right, bottom;

	if (!w) { w = this.visibleArea.offsetWidth; }

	if (!h) { h = this.visibleArea.offsetHeight; }

	if (x === null) { x = parseInt(window.getComputedStyle(this.visibleArea).getPropertyValue('left')); }

	if (y === null) { y = parseInt(window.getComputedStyle(this.visibleArea).getPropertyValue('top')); }

	if (h > this.souroundingDiv.offsetHeight) { h = this.souroundingDiv.offsetHeight; }

	if (w > this.souroundingDiv.offsetWidth) { w = this.souroundingDiv.offsetWidth; }

	if (w + x > this.souroundingDiv.offsetWidth) { return; }

	if (h + y > this.souroundingDiv.offsetHeight) { return; }

	// Make sure the visible area is inside the size of the image
	if (x < 0) { x = 0; }

	if (y < 0) { y = 0; }

	right = this.souroundingDiv.offsetWidth - x - w;
	bottom = this.souroundingDiv.offsetHeight - y - h;

	// Set position of the visible area
	this.visibleArea.style.left = x + 'px';
	this.visibleArea.style.top = y + 'px';
	this.visibleArea.style.right = right + 'px';
	this.visibleArea.style.bottom = bottom + 'px';

	// Set position of the top overlay
	this['overlaytop'].style.height = y + 'px';

	// Set position of the right overlay
	this['overlayright'].style.top = y + 'px';
	this['overlayright'].style.width = right + 'px';
	this['overlayright'].style.height = h + 'px';

	// Set position of the bottom overlay
	this['overlaybottom'].style.height = bottom + 'px';

	// Set position of the left overlay
	this['overlayleft'].style.top = y + 'px';
	this['overlayleft'].style.width = x + 'px';
	this['overlayleft'].style.height = h + 'px';
};

MstCrop.prototype.startResize = function(e) {
	var e = e || event;

	this.resizing = e.target.getAttribute('data-dir');

	this.resizingCoordinates.startY = e.clientY;
	this.resizingCoordinates.startX = e.clientX;
};

MstCrop.prototype.stopResize = function() {
	this.resizing = false;
};

MstCrop.prototype.resize = function(e) {
	var e = e || event;

	if (!this.resizing) { return; }

	var visibleAreaStyle = window.getComputedStyle(this.visibleArea);

	switch (this.resizing) {
		case 'n':
			var dif = e.clientY - this.resizingCoordinates.startY;
			var newTop = parseInt(visibleAreaStyle.getPropertyValue('top')) + dif;

			this.updateVisibleArea(null, newTop, this.visibleArea.offsetWidth, this.visibleArea.offsetHeight-dif);

			this.resizingCoordinates.startY = e.clientY;
			break;

		case 'ne':
			var difY = e.clientY - this.resizingCoordinates.startY;
			var difX = e.clientX - this.resizingCoordinates.startX;
			var newTop = parseInt(visibleAreaStyle.getPropertyValue('top')) + difY;

			this.updateVisibleArea(null, newTop, this.visibleArea.offsetWidth+difX, this.visibleArea.offsetHeight-difY);

			this.resizingCoordinates.startY = e.clientY;
			this.resizingCoordinates.startX = e.clientX;
			break;

		case 'e':
			var dif = e.clientX - this.resizingCoordinates.startX;

			this.updateVisibleArea(null, null, this.visibleArea.offsetWidth+dif, this.visibleArea.offsetHeight);

			this.resizingCoordinates.startX = e.clientX;
			break;

		case 'se':
			var difY = e.clientY - this.resizingCoordinates.startY;
			var difX = e.clientX - this.resizingCoordinates.startX;

			this.updateVisibleArea(null, null, this.visibleArea.offsetWidth+difX, this.visibleArea.offsetHeight+difY);

			this.resizingCoordinates.startY = e.clientY;
			this.resizingCoordinates.startX = e.clientX;
			break;

		case 's':
			var dif = e.clientY - this.resizingCoordinates.startY;

			this.updateVisibleArea(null, null, this.visibleArea.offsetWidth, this.visibleArea.offsetHeight+dif);

			this.resizingCoordinates.startY = e.clientY;
			break;

		case 'sw':
			var difY = e.clientY - this.resizingCoordinates.startY;
			var difX = e.clientX - this.resizingCoordinates.startX;
			var newLeft = parseInt(visibleAreaStyle.getPropertyValue('left')) + difX;

			this.updateVisibleArea(newLeft, null, this.visibleArea.offsetWidth-difX, this.visibleArea.offsetHeight+difY);

			this.resizingCoordinates.startY = e.clientY;
			this.resizingCoordinates.startX = e.clientX;
			break;

		case 'w':
			var dif = e.clientX - this.resizingCoordinates.startX;
			var newLeft = parseInt(visibleAreaStyle.getPropertyValue('left')) + dif;

			this.updateVisibleArea(newLeft, null, this.visibleArea.offsetWidth-dif, this.visibleArea.offsetHeight);

			this.resizingCoordinates.startX = e.clientX;
			break;

		case 'nw':
			var difY = e.clientY - this.resizingCoordinates.startY;
			var difX = e.clientX - this.resizingCoordinates.startX;
			var newTop = parseInt(visibleAreaStyle.getPropertyValue('top')) + difY;
			var newLeft = parseInt(visibleAreaStyle.getPropertyValue('left')) + difX;

			this.updateVisibleArea(newLeft, newTop, this.visibleArea.offsetWidth-difX, this.visibleArea.offsetHeight-difY);

			this.resizingCoordinates.startY = e.clientY;
			this.resizingCoordinates.startX = e.clientX;
			break;
	} 
};

MstCrop.prototype.crop = function() {
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	var visibleAreaStyle = window.getComputedStyle(this.visibleArea);
	var x = parseInt(visibleAreaStyle.getPropertyValue('left'));
	var y = parseInt(visibleAreaStyle.getPropertyValue('top'));

	canvas.width = this.visibleArea.offsetWidth;
	canvas.height = this.visibleArea.offsetHeight;

	context.drawImage(image, x, y, this.visibleArea.offsetWidth, this.visibleArea.offsetHeight, 0, 0, this.visibleArea.offsetWidth, this.visibleArea.offsetHeight);

	document.body.appendChild(canvas);
};