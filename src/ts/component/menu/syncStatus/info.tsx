import * as React from 'react';
import { MenuItemVertical, Button, Title, Label } from 'Component';
import { I, UtilCommon, Onboarding, keyboard, analytics, Renderer, Highlight, Storage, UtilSpace, translate } from 'Lib';
import { popupStore, blockStore, menuStore } from 'Store';
const Url = require('json/url.json');

class MenuSyncStatusInfo extends React.Component<I.Menu> {

	n = -1;

	constructor (props: I.Menu) {
		super(props);

		this.getItems = this.getItems.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onMouseEnter = this.onMouseEnter.bind(this);
	};

	render () {
		const { param } = this.props;
		const { data } = param;
		const { title, message } = data;
		const items = this.getItems();

		return (
			<React.Fragment>
				<div className="data">
					<Title text={title} />
					<Label text={message} />
				</div>

				{items.length ? (
					<div className="items">
						{items.map((item: any, i: number) => (
							<MenuItemVertical
								key={i}
								{...item}
								onClick={e => this.onClick(e, item)}
								onMouseEnter={e => this.onMouseEnter(e, item)}
							/>
						))}
					</div>
				) : ''}
			</React.Fragment>
		);
	};

	componentDidMount () {
		this.rebind();
	};

	componentWillUnmount () {
		this.unbind();
	};

	rebind () {
		this.unbind();
		$(window).on('keydown.menu', e => this.props.onKeyDown(e));
		window.setTimeout(() => this.props.setActive(), 15);
	};

	unbind () {
		$(window).off('keydown.menu');
	};

	onClick (e, item) {
		menuStore.closeAll();
		switch (item.id) {
			case 'updateApp': {
				Renderer.send('updateCheck');
				break;
			};
			case 'upgradeMembership': {
				popupStore.open('settings', { data: { page: 'membership' } });
				break;
			};
		};
	};

	onMouseEnter (e: any, item: any) {
		const { setActive } = this.props;

		if (!keyboard.isMouseDisabled) {
			setActive(item, false);
		};
	};



	getItems () {
		const { param } = this.props;
		const { data } = param;
		const { buttons } = data;

		return buttons;
	};

};

export default MenuSyncStatusInfo;
