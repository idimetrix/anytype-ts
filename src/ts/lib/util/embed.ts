import { I, UtilCommon } from 'Lib';
import Constant from 'json/constant.json';

const DOMAINS: any  = {};
DOMAINS[I.EmbedProcessor.Youtube] = [ 'youtube.com', 'youtu.be' ];
DOMAINS[I.EmbedProcessor.Vimeo] = [ 'vimeo.com' ];
DOMAINS[I.EmbedProcessor.GoogleMaps] = [ 'google.[^\/]+/maps' ];
DOMAINS[I.EmbedProcessor.Miro] = [ 'miro.com' ];
DOMAINS[I.EmbedProcessor.Figma] = [ 'figma.com' ];
DOMAINS[I.EmbedProcessor.OpenStreetMap] = [ 'openstreetmap.org\/\#map' ];

class UtilEmbed {

	getHtml (processor: I.EmbedProcessor, content: any): string {
		const fn = UtilCommon.toCamelCase(`get-${I.EmbedProcessor[processor]}-html`)
		return this[fn] ? this[fn](content) : '';
	};

	getYoutubeHtml (content: string): string {
		return `<iframe src="${content}" frameborder="0" scrolling="no" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
	};

	getVimeoHtml (content: string): string {
		return `<iframe src="${content}" frameborder="0" scrolling="no" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
	};

	getGoogleMapsHtml (content: string): string {
		return `<iframe src="${content}" frameborder="0" scrolling="no" allowfullscreen loading="lazy"></iframe>`;
	};

	getMiroHtml (content: string): string {
		return `<iframe src="${content}" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>`;
	};

	getFigmaHtml (content: string): string {
		return `<iframe src="${content}" frameborder="0" scrolling="no" allowfullscreen></iframe>`;
	};

	getOpenStreetMapHtml (content: string): string {
		return `<iframe src="${content}" frameborder="0" scrolling="no" allowfullscreen></iframe>`;
	};

	getProcessorByUrl (url: string): I.EmbedProcessor {
		let p = null;
		for (let i in DOMAINS) {
			const reg = new RegExp(DOMAINS[i].join('|'), 'gi');
			if (url.match(reg)) {
				p = Number(i);
				break;
			};
		};

		console.log('getProcessorByUrl', url, p);
		return p;
	};

	getParsedUrl (url: string): string {
		const processor = this.getProcessorByUrl(url);

		console.log('getParsedUrl', url, processor);

		switch (processor) {
			case I.EmbedProcessor.Youtube: {
				url = `https://www.youtube.com/embed/${this.getYoutubeId(url)}`;
				break;
			};

			case I.EmbedProcessor.Vimeo: {
				const a = new URL(url);
				url = `https://player.vimeo.com/video${a.pathname}`;
				break;
			};

			case I.EmbedProcessor.GoogleMaps: {
				const place = url.match(/place\/([^\/]+)/);
				const param = url.match(/\/@([^\/\?]+)/);
				const search: any = {
					key: Constant.embed.googleMaps.key,
				};

				let endpoint = '';

				if (param && param[1]) {
					const [ lat, lon, zoom ] = param[1].split(',');

					search.center = [ lat, lon ].join(',');
					search.zoom = parseInt(zoom);

					endpoint = 'view';
				};

				if (place && place[1]) {
					search.q = place[1];

					delete(search.center);

					endpoint = 'place';
				};

				url = `https://www.google.com/maps/embed/v1/${endpoint}?${new URLSearchParams(search).toString()}`;
				break;
			};

			case I.EmbedProcessor.Miro: {
				const a = url.split('?');
				if (a.length) {
					url = a[0].replace(/\/board\/?\??/, '/live-embed/');
				};
				break;
			};

			case I.EmbedProcessor.Figma: {
				url = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
				break;
			};

			case I.EmbedProcessor.OpenStreetMap: {
				const coords = url.match(/#map=([-0-9\.\/]+)/);

				if (coords && coords.length) {
					const [ zoom, lat, lon ] = coords[1].split('/');
					url = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent([ lon, lat, lon, lat ].join(','))}&amp;layer=mapnik`;
				};
				break;
			};

		};

		return url;
	};

	getYoutubeId (url: string): string {
		const m = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
		return (m && m[2].length) ? m[2] : '';
	};

	allowSameOrigin (p: I.EmbedProcessor) {
		return [ 
			I.EmbedProcessor.Youtube, 
			I.EmbedProcessor.Vimeo, 
			I.EmbedProcessor.Soundcloud, 
			I.EmbedProcessor.GoogleMaps, 
			I.EmbedProcessor.Miro, 
			I.EmbedProcessor.Figma,
			I.EmbedProcessor.Twitter,
		].includes(p);
	};

	allowPresentation (p: I.EmbedProcessor) {
		return [ 
			I.EmbedProcessor.Youtube, 
			I.EmbedProcessor.Vimeo,
		].includes(p);
	};

	allowEmbedUrl (p: I.EmbedProcessor) {
		return [ 
			I.EmbedProcessor.Youtube, 
			I.EmbedProcessor.Vimeo, 
			I.EmbedProcessor.GoogleMaps, 
			I.EmbedProcessor.Miro, 
			I.EmbedProcessor.Figma,
			I.EmbedProcessor.OpenStreetMap,
		].includes(p);
	};

	allowJs (p: I.EmbedProcessor) {
		return [ I.EmbedProcessor.Chart ].includes(p);
	};

	allowPopup (p: I.EmbedProcessor) {
		return [].includes(p);
	};

	allowResize (p: I.EmbedProcessor) {
		return [ I.EmbedProcessor.Twitter ].includes(p);
	};

};

export default new UtilEmbed();
