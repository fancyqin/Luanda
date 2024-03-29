import React, { Fragment } from 'react'
import UploadListItem  from './uploadListItem';
export default class UploadList extends React.Component {
  constructor(props) {
    super(props);
  }
  removeItem(file) {
    let {fileIdkey} = this.props;
    let fileList = this.props.data.filter(item => {
      return item[fileIdkey] != file[fileIdkey];
    });
    this.props.onRemoveItem && this.props.onRemoveItem(fileList);
    // bus.emit('attachmentOfFormInCerFormChange',fileList)
  }
  _change(data) {
    this.props.onChange(data);
  }

  render() {
    //   console.log('data-++++++++++________+++++',this.props.data)
    const { children, className: className = '', data , type='edit',namekey='name',extkey='ext',urikey='src',fileIdkey='id',onRetry} = this.props;
    if (!data || data.length <1) return <Fragment />

    return (
      <div className={className}>
        {data &&
          data.map((file, idx) => (
            <UploadListItem
              key={`uploadListItem_${file.fileId}_${idx}`}
              file={file}
              onRemove={file => this.removeItem(file)}
              onReUpload={file=>onRetry(file)}
              type={type}
              namekey={namekey}
              extkey={extkey}
              urikey={urikey}
              fileIdkey={fileIdkey}
            />
          ))}

      </div>
    );
  }
}
