import { Component, OnInit, Input, Optional, Inject, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';
import { ImageViewerConfig, CustomEvent } from './image-viewer-config.model';
import { SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

const DEFAULT_CONFIG: ImageViewerConfig = {
	btnClass: 'mat-mini-fab', // we observed that it was tricky to override the browser button
	zoomFactor: 0.1,
	containerBackgroundColor: '#ccc',
	allowCtrlWheelZoom: true,
	allowFullscreen: true,
	allowKeyboardNavigation: true,
	allowDrag: true,
	btnShow: {
		zoomIn: true,
		zoomOut: true,
		rotateClockwise: true,
		rotateCounterClockwise: true,
		next: true,
		prev: true
	},
	btnIcons: {
		zoomIn: 'material-icons zoom-in',
		zoomOut: 'material-icons zoom-out',
		rotateClockwise: 'material-icons rotate-clockwise',
		rotateCounterClockwise: 'material-icons rotate-counterclock',
		next: 'material-icons next',
		prev: 'material-icons prev',
		fullscreen: 'material-icons fullscreen',
	}
};

@Component({
    selector: 'ngx-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
    standalone: false
})
export class ImageViewerComponent implements OnInit {

	@Input()
	src: (string | SafeResourceUrl | SafeUrl)[];

	@Input()
	index = 0;

	@Input()
	config: ImageViewerConfig;

	@Output()
	indexChange: EventEmitter<number> = new EventEmitter();

	@Output()
	configChange: EventEmitter<ImageViewerConfig> = new EventEmitter();

	@Output()
	customEvent: EventEmitter<CustomEvent> = new EventEmitter();

	@ViewChild('fullscreenElement', { static: true })
	fullscreenElement: ElementRef;

	public style = { transform: '', msTransform: '', oTransform: '', webkitTransform: '' };
	private fullscreen = false;
	public loading = true;
	private scale = 1;
	private rotation = 0;
	private translateX = 0;
	private translateY = 0;
	private prevX: number;
	private prevY: number;
	private hovered = false;

	constructor(
		@Inject(DOCUMENT) private document: any,
		@Optional() @Inject('config') public moduleConfig: ImageViewerConfig,
	) { }

	ngOnInit() {
		const merged = this.mergeConfig(DEFAULT_CONFIG, this.moduleConfig);
		this.config = this.mergeConfig(merged, this.config);
		this.triggerConfigBinding();
	}

	@HostListener('document:fullscreenchange', ['$event'])
	@HostListener('document:webkitfullscreenchange', ['$event'])
	@HostListener('document:mozfullscreenchange', ['$event'])
	@HostListener('document:MSFullscreenChange', ['$event'])
	checkFullscreenmode(e: any){
		if(document.fullscreenElement){
			this.fullscreen = true;
		}else{
			this.fullscreen = false;
		}
	}

	@HostListener('window:keyup.ArrowRight', ['$event'])
	nextImage(event) {
		if (this.canNavigate(event) && this.index < this.src.length - 1) {
			this.loading = true;
			this.index++;
			this.triggerIndexBinding();
			this.reset();
		}
	}

	@HostListener('window:keyup.ArrowLeft', ['$event'])
	prevImage(event) {
		if (this.canNavigate(event) && this.index > 0) {
			this.loading = true;
			this.index--;
			this.triggerIndexBinding();
			this.reset();
		}
	}

	zoomIn() {
		this.scale *= (1 + this.config.zoomFactor);
		this.updateStyle();
	}

	zoomOut() {
		if (this.scale > this.config.zoomFactor) {
			this.scale /= (1 + this.config.zoomFactor);
		}
		this.updateStyle();
	}

	scrollZoom(evt: WheelEvent) {
		if (this.config.allowCtrlWheelZoom && evt.ctrlKey) {
			evt.deltaY > 0 ? this.zoomOut() : this.zoomIn();
			return false;
		}
	}

	rotateClockwise() {
		this.rotation += 90;
		this.updateStyle();
	}

	rotateCounterClockwise() {
		this.rotation -= 90;
		this.updateStyle();
	}

	onLoad() {
		this.loading = false;
	}

	onLoadStart() {
		this.loading = true;
	}

	onDragOver(evt) {
		if(this.config.allowDrag){
			this.translateX += (evt.clientX - this.prevX);
			this.translateY += (evt.clientY - this.prevY);
			this.prevX = evt.clientX;
			this.prevY = evt.clientY;
			this.updateStyle();
		}
	}

	onDragStart(evt) {
		if(this.config.allowDrag){
			if (evt.dataTransfer && evt.dataTransfer.setDragImage) {
				evt.dataTransfer.setDragImage(evt.target.nextElementSibling, 0, 0);
			}
			this.prevX = evt.clientX;
			this.prevY = evt.clientY;
		}
	}

	toggleFullscreen() {
		if (!this.fullscreen) {
			this.openFullscreen();
		} else {
			this.closeFullscreen();
		}
	}

	openFullscreen() {
		if (this.fullscreenElement.nativeElement.requestFullscreen) {
			this.fullscreenElement.nativeElement.requestFullscreen();
		} else if (this.fullscreenElement.nativeElement.mozRequestFullScreen) {
			/* Firefox */
			this.fullscreenElement.nativeElement.mozRequestFullScreen();
		} else if (this.fullscreenElement.nativeElement.webkitRequestFullscreen) {
			/* Chrome, Safari and Opera */
			this.fullscreenElement.nativeElement.webkitRequestFullscreen();
		} else if (this.fullscreenElement.nativeElement.msRequestFullscreen) {
			/* IE/Edge */
			this.fullscreenElement.nativeElement.msRequestFullscreen();
		} else {
			console.error("Unable to open in fullscreen");
		}
	}

	closeFullscreen() {
		if (this.document.exitFullscreen) {
			this.document.exitFullscreen();
		} else if (this.document.mozCancelFullScreen) {
			/* Firefox */
			this.document.mozCancelFullScreen();
		} else if (this.document.webkitExitFullscreen) {
			/* Chrome, Safari and Opera */
			this.document.webkitExitFullscreen();
		} else if (this.document.msExitFullscreen) {
			/* IE/Edge */
			this.document.msExitFullscreen();
		} else {
			console.error("Unable to close fullscreen");
		}
	}

	triggerIndexBinding() {
		this.indexChange.emit(this.index);
	}

	triggerConfigBinding() {
		this.configChange.next(this.config);
	}

	fireCustomEvent(name, imageIndex) {
		this.customEvent.emit(new CustomEvent(name, imageIndex));
	}

	reset() {
		this.scale = 1;
		this.rotation = 0;
		this.translateX = 0;
		this.translateY = 0;
		this.updateStyle();
	}

	@HostListener('mouseover')
	onMouseOver() {
		this.hovered = true;
	}

	@HostListener('mouseleave')
	onMouseLeave() {
		this.hovered = false;
	}

	private canNavigate(event: any) {
		return event == null || (this.config.allowKeyboardNavigation && this.hovered);
	}

	private updateStyle() {
		this.style.transform = `translate(${this.translateX}px, ${this.translateY}px) rotate(${this.rotation}deg) scale(${this.scale})`;
		this.style.msTransform = this.style.transform;
		this.style.webkitTransform = this.style.transform;
		this.style.oTransform = this.style.transform;
	}

	private mergeConfig(defaultValues: ImageViewerConfig, overrideValues: ImageViewerConfig): ImageViewerConfig {
		let result: ImageViewerConfig = { ...defaultValues };
		if (overrideValues) {
			result = { ...defaultValues, ...overrideValues };

			if (overrideValues.btnIcons) {
				result.btnIcons = { ...defaultValues.btnIcons, ...overrideValues.btnIcons };
			}
		}
		return result;
	}

}
