import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Cover, Title, Label } from 'Component';
import { I, C, DataUtil, ObjectUtil, translate, analytics } from 'Lib';
import { commonStore, blockStore } from 'Store';
import { observer } from 'mobx-react';
import Constant from 'json/constant.json';
import Head from './head';

interface Props extends I.Popup, RouteComponentProps<any> {
	prevPage: string;
	onPage: (id: string) => void;
	setLoading: (v: boolean) => void;
};

const PopupSettingsPageWallpaper = observer(class PopupSettingsPageWallpaper extends React.Component<Props> {

	constructor (props: any) {
		super(props);

		this.onCover = this.onCover.bind(this);
		this.onFileClick = this.onFileClick.bind(this);
	};

	render () {
		const { cover } = commonStore;

		let covers = [];
		if (cover.type == I.CoverType.Upload) {
			covers.push(cover);
		};
		for (let i = 1; i <= Constant.coverCnt; ++i) {
			covers.push({ id: 'c' + i, image: '', type: I.CoverType.Image });
		};

		let sections = [
			{ name: translate('popupSettingsPicture'), children: covers },
			{ 
				name: translate('popupSettingsGradient'), 
				children: DataUtil.coverGradients().map((it: any) => { return { ...it, image: '' }; }), 
			},
			{ 
				name: translate('popupSettingsColor'), 
				children: DataUtil.coverColors().map((it: any) => { return { ...it, image: '' }; }),
			},
		];

		const Item = (item: any) => (
			<div className={'item ' + (item.active ? 'active': '')} onClick={() => { this.onCover(item); }}>
				<Cover {...item} preview={true} className={item.id} />
			</div>
		);

		return (
			<div>
				<Head {...this.props} returnTo="appearance" name={translate('popupSettingsAppearanceTitle')} />
				<Title text={translate('popupSettingsWallpaperTitle')} />

				<div className="row first">
					<Label text={translate('popupSettingsWallpaperText')} />
					<div className="fileWrap item" onClick={this.onFileClick}>
						<Cover className="upload" type={I.CoverType.Color} id="white" />
					</div>
				</div>

				{sections.map((section: any, i: number) => (
					<div key={i} className="row">
						<Label className="name" text={section.name} />
						<div className="covers">
							{section.children.map((item: any, i: number) => (
								<Item key={i} {...item} active={(item.id == cover.id) && (cover.type == item.type)} />
							))}
						</div>
					</div>
				))}
			</div>
		);
	};

	onFileClick (e: any) {
		const { root } = blockStore;
		const { setLoading } = this.props;
		const options: any = {
			properties: [ 'openFile' ],
			filters: [ { name: '', extensions: Constant.extension.cover } ]
		};

		window.Electron.showOpenDialog(options).then((result: any) => {
			const files = result.filePaths;
			if ((files == undefined) || !files.length) {
				return;
			};

			setLoading(true);

			C.FileUpload('', files[0], I.FileType.Image, (message: any) => {
				if (message.error.code) {
					return;
				};

				setLoading(false);

				commonStore.coverSet('', message.hash, I.CoverType.Upload);
				ObjectUtil.setCover(root, I.CoverType.Upload, message.hash);

				analytics.event('SettingsWallpaperUpload', { middleTime: message.middleTime });
			});
		});
	};

	onCover (item: any) {
		ObjectUtil.setCover(blockStore.root, item.type, item.image || item.id);
		commonStore.coverSet(item.id, item.image, item.type);

		analytics.event('SettingsWallpaperSet', { type: item.type, id: item.id });
	};

});

export default PopupSettingsPageWallpaper;