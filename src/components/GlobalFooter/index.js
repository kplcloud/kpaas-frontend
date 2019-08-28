import React from 'react';
import classNames from 'classnames';
import styles from './index.less';
export default ({ className, links, copyright, wxcode }) => {
  const clsString = classNames(styles.globalFooter, className);
  return (

    <div className={clsString}>
      {wxcode && <img height="140" width="140" src="http://source.qiniu.cnd.nsini.com/images/2019/08/f2/7b/6a/20190827-5cc89dcf35c6a26e6a88c3e67b0f2950.jpeg" />}
      {links && (
        <div className={styles.links}>
          {links.map(link => (
            <a key={link.key} target={link.blankTarget ? '_blank' : '_self'} href={link.href}>
              {link.title}
            </a>
          ))}
        </div>
      )}
      {copyright && <div className={styles.copyright}>{copyright}</div>}
    </div>
  );
};
