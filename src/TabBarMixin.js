import React, { cloneElement } from 'react';
import classnames from 'classnames';
import warning from 'warning';
import { getDataAttr } from './utils';

export default {
  getDefaultProps() {
    return {
      styles: {},
    };
  },
  onTabClick(key, e) {
    this.props.onTabClick(key, e);
  },
  getTabs() {
    const { panels: children, activeKey, prefixCls, tabBarGutter } = this.props;
    const rst = [];

    React.Children.forEach(children, (child, index) => {
      if (!child) {
        return;
      }
      const key = child.key;
      let cls = activeKey === key ? `${prefixCls}-tab-active` : '';
      cls += ` ${prefixCls}-tab`;
      let events = {};
      if (child.props.disabled) {
        cls += ` ${prefixCls}-tab-disabled`;
      } else {
        events = {
          onClick: (e) => this.onTabClick.call(this, key, e),
        };
      }
      const ref = {};
      if (activeKey === key) {
        ref.ref = this.saveRef('activeTab');
      }
      warning('tab' in child.props, 'There must be `tab` property on children of Tabs.');
      rst.push(
        <div
          role="tab"
          aria-disabled={child.props.disabled ? 'true' : 'false'}
          aria-selected={activeKey === key ? 'true' : 'false'}
          {...events}
          className={cls}
          key={key}
          style={{ marginRight: tabBarGutter && index === children.length - 1 ? 0 : tabBarGutter }}
          {...ref}
        >
          {child.props.tab}
        </div>
      );
    });

    return rst;
  },
  getRootNode(contents) {
    const {
      prefixCls, onKeyDown, className, extraContent, style, tabBarPosition,
      ...restProps,
    } = this.props;
    const cls = classnames(`${prefixCls}-bar`, {
      [className]: !!className,
    });
    const topOrBottom = (tabBarPosition === 'top' || tabBarPosition === 'bottom');
    const tabBarExtraContentStyle = topOrBottom ? { float: 'right' } : {};
    const extraContentStyle = (extraContent && extraContent.props) ? extraContent.props.style : {};
    let children = contents;
    if (extraContent) {
      children = [
        cloneElement(extraContent, {
          key: 'extra',
          style: {
            ...tabBarExtraContentStyle,
            ...extraContentStyle,
          },
        }),
        cloneElement(contents, { key: 'content' }),
      ];
      children = topOrBottom ? children : children.reverse();
    }
    return (
      <div
        role="tablist"
        className={cls}
        tabIndex="0"
        ref={this.saveRef('root')}
        onKeyDown={onKeyDown}
        style={style}
        {...getDataAttr(restProps)}
      >
        {children}
      </div>
    );
  },
};
