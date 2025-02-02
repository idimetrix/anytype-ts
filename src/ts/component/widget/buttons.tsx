import * as React from 'react';
import { observer } from 'mobx-react';
import { Icon } from 'Component';
import { I, S, U, sidebar, translate } from 'Lib';

const WidgetButtons = observer(class WidgetSpace extends React.Component<I.WidgetComponent> {

	isSubcribed = false;

	constructor (props: I.WidgetComponent) {
		super(props);

		this.onClick = this.onClick.bind(this);
	};

	render (): React.ReactNode {
		const items = this.getItems();
		const space = U.Space.getSpaceview();
		const participants = U.Space.getParticipantsList([ I.ParticipantStatus.Active ]);

		return (
			<div className="body">
				{items.map((item, i) => {
					let button = null;
					let cnt = null;

					if (item.id == 'member') {
						if (space.isShared) {
							cnt = <div className="cnt">{participants.length}</div>;
						} else {
							button = <div className="btn">{translate('commonShare')}</div>;
						};
					};

					return (
						<div 
							key={i} 
							id={`item-${item.id}`} 
							className="item" 
							onClick={e => this.onClick(e, item)}
						>
							<div className="side left">
								<Icon className={item.id} />
								<div className="name">
									{item.name}
									{cnt}
								</div>
							</div>
							<div className="side right">
								{button}
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	getItems () {
		const space = U.Space.getSpaceview();
		const ret = [
			{ id: 'all', name: translate('commonAllContent') },
		];

		if (space.isShared) {
			ret.unshift({ id: 'member', name: translate('commonMembers') });
		};

		if (space.spaceMainChatId) {
			ret.push({ id: 'chat', name: translate('commonMainChat') });
		};

		return ret;
	};

	onClick (e: any, item: any) {
		e.preventDefault();
		e.stopPropagation();

		const space = U.Space.getSpaceview();

		switch (item.id) {
			case 'member': {
				S.Popup.open('settings', { data: { page: 'spaceShare', isSpace: true }, className: 'isSpace' });
				break;
			};

			case 'all': {
				sidebar.objectContainerToggle();
				break;
			};

			case 'chat': {
				U.Object.openAuto({ id: space.spaceMainChatId, layout: I.ObjectLayout.Chat });
				break;
			};
		};
	};

});

export default WidgetButtons;