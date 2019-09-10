import React from 'react'

export default class UploadListItem extends React.Component {
    constructor(props) {
      super(props);
    }
    _remove() {
      let { onRemove,file } = this.props;
      onRemove && onRemove(file);
    }
    _reUpload() {
      let { file, onReUpload } = this.props;
      onReUpload && onReUpload(file);
    }
    canDownload(ext) {
      let regx = /(jpg|jpeg|png|pdf)/;
      if (regx.test(ext)) return false;
      return true;
    }
    render() {
      //type: edit 编辑状态 , read 查看状态
      const {
        children,
        className: className = '',
        file,
        type,
        namekey,
        extkey,
        urikey,
        fileIdkey
      } = this.props;
      let name = file[namekey];
      let ext = file[extkey];
      let uri = file[urikey];
      let fileId = file[fileIdkey];
      let template;
      switch (file.status) {
        case 'pending':
          template = (
            <div className="loading-wrap J-loading">
              <div className="file-loading">
                <div className="loading-bar" />
              </div>
              <i
                className="ob-icon icon-delete J-attach-cancel"
                onClick={() => this._remove(file)}
              />
            </div>
          );
          break;
        case 'success':
          template = (
            <div className="info-wrap file-list J-info">
              <i className={`item-icon ico J-type ${ext ? 'ico-' + ext : ''}`} />
              <span className="item-name J-name">{name}</span>
              <span className="item-ext J-ext">.{ext}</span>
              {type === 'edit' ? (
                <i
                  className="ob-icon icon-delete J-attach-del wap-hide"
                  onClick={() => this._remove()}
                />
              ) : this.canDownload(ext) ? (
                <a href={uri} download={`${name}.${ext}`} className="fr">
                  Download
                </a>
              ) : (
                <a href={uri} target="_blank" className="fr">
                  View
                </a>
              )}
            </div>
          );
          break;
        case 'error':
          template = (
            <div className="info-wrap file-list J-info">
              <i className={`item-icon ico J-type ${ext ? 'ico-' + ext : ''}`} />
              <span className="item-name J-name">{name}</span>
              <span className="item-ext J-ext">.{ext}</span>
  
              <span className="upload-failed-wrap J-upload-error">
                <span className="upload-failed-text">Upload failed</span>
  
                <span
                  className="upload-failed-btn J-try-btn"
                  onClick={() => this._reUpload()}
                >
                  Try again
                </span>
              </span>
  
              <i
                className="ob-icon icon-delete J-attach-del wap-hide"
                onClick={() => this._remove()}
              />
            </div>
          );
          break;
      }
  
      return (
        <div
          className={`attach-item ${className}`}
          data-id={fileId}
          data-ext={ext}
        >
          {template}
        </div>
      );
    }
  }
  