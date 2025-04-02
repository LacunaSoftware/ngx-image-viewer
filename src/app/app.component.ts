import { Component } from '@angular/core';
import { ImageViewerConfig, CustomEvent } from 'lacuna-image-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { TestImageBase64 } from './test-image-base-64';

@Component({
    selector: 'ngx-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
	title = 'app';

	images = [
		'/assets/pexels-photo-352093.jpeg',
		'https://i.ytimg.com/vi/nlYlNF30bVg/hqdefault.jpg',
		this.sanitizer.bypassSecurityTrustResourceUrl(TestImageBase64),
	];

	imageIndexOne = 0;
	imageIndexTwo = 0;

	config: ImageViewerConfig = { customBtns: [{ name: 'print', icon: 'material-icons print' }, { name: 'link', icon: 'material-icons link' }] };

	constructor(private sanitizer: DomSanitizer) { }

	handleEvent(event: CustomEvent) {
		console.log(`${event.name} has been click on img ${event.imageIndex + 1}`);

		switch (event.name) {
			case 'print':
				console.log('run print logic');
				break;
		}
	}
}
