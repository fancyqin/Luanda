import React, { Fragment } from 'react'
import UploadList from './uploadList';
import {isArray} from '@/utils';

const UPLOAD_ERR = {
  fileType: 'Supported file formats are jpg, jpeg, png, pdf, doc, docx, xls and xlsx.',
  size: 'Please upload files less than 10MB.',
  count: 'Please upload no more than 10 files.'
};
export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadList: [],//自身维护uploadList，改变时emit事件触发父组件的onchange
      errTip: ''
    };
  }

  onRetry(file) {
    if (this.uploader) {
      this.uploader.queue(file.data);
      this.uploader.initFileId = file.id;
      this.uploader.startUpload();
    }
  }
  checkCount() {
    let { max, data } = this.props;
    if(isArray(data)){
        if (data.length >= max) {
        this.uploader.turn(false);
        } else {
        this.uploader.turn(true);
        }
    }
    
  }
  changeUploadList(list) {
    let { onChange } = this.props;
    this.setState({uploadList:list},()=>{
      this.checkCount();
    })
    onChange && onChange(list);
    $(this.uploader.elems.holder).find('.J-upload-text').text(list.length);
  }
  uploadError(errTip) {
    let {uploadList} = this.state;
    this.changeUploadList(uploadList.filter(item=>item.status!='pending'));
    //上传失败重新打开上传。
    this.uploader.turn(true);
    if(this.props.onError){ //如果传了onError，就不再自行报错。
        this.props.onError(errTip);
    }else{
        this.setState({
            errTip
        });
    }
  }

  componentDidUpdate() {
    if (this.uploader.cfg.postParams.bBusiId != this.props.postParams.bBusiId) {
      this.uploader.cfg.postParams.bBusiId = this.props.postParams.bBusiId;
    }
    
    $(this.uploader.elems.holder).find('.J-upload-text').text(this.props.data ? this.props.data.length :0);

  }
  componentDidMount() {
    let {
      onQueued,
      data: attachment,
      postParams: postParams = {},
      fileTypes: fileTypes = '',
      sizeLimit: sizeLimit = '10MB',
      button,
      max,
      multiple: multiple = false
    } = this.props;
    this.setState({uploadList:attachment})
    // bus.on('attachmentOfFormInCerFormChange',(list)=>{
    //   this.changeUploadList(list)
    // })
    //TODO: did not work
    // let uploadedCount = 0;
    // if (attachment && attachment.length) {
    //   uploadedCount = attachment.length;
    //   if (max <= uploadedCount) {
    //     setTimeout(() => {
    //       this.uploader.turn(false);
    //     });
    //   }
    // }
    if ('FOCUS' in window) {
      let _this = this;
      let uploader = new FOCUS.widget.Upload({
        priority: ['html5', 'iframe'], // HTML5 模式默认可以使用 open 方法
        placeholder: '#uploader', // 占位元素
        multiple, //多选文件
        postParams: postParams || {
          type: '',
          absId: ''
        },
        button: button || {
          text: `
          <div class="btn" id="upload_btn">Upload</div>
          ${
            max
              ? `<span class="upload-limit">
                    <span class="J-upload-text">0</span>/${max}
                </span>`
              : ''
          }
          `
        },
        fileTypes:
          fileTypes ||
          '*.png, *.jpg, *.jpeg, *.gif, *.bmp, *.svg, *.eps, *.ai, *.cdr, *.tiff, *.xls, *.xlsx, *.doc, *.docx, *.txt, *.pdf, *rar, *.zip',
        //XXX: uploader 无法识别的mimetype ，会跳过类型验证
        sizeLimit: sizeLimit || '5MB',
        allowOpen: true // IE iframe 模式专属参数，允许在ie下手动调用open方法
      })
        .on('dialogComplete', function() {
          // console.log('dialogComplete');
          this.startUpload();
        })
        .on('queued', function(file) {
          // console.log('queued');
          onQueued && onQueued();
          uploader.dequeue(0);
        })
        .on('uploadStart', function(file) {
          // console.log('uploadStart',file);
          if(_this.uploader){
            setTimeout(()=>{_this.uploader.turn(false)})
          }
          if (
            this.mode === 'iframe' &&
            document.domain !== window.location.hostname
          ) {
            this.addPostParam('domain', document.domain);
          }
          let {id,name,suffix:ext,data} = file;
          _this.changeUploadList([..._this.state.uploadList, { fileId:id, name,ext,data,status: 'pending' }])
        })
        .on('uploadSuccess', function(file, data, xhr) {
          // console.log('uploadSuccess', file, data);
          if (data) {
            if (typeof data === 'string') {
              data = JSON.parse(data);
            }
            switch (data.code) {
              case '10001':
                //success
                let { id, name, ext, src, fileSize } = data.data;
                let newFile = {
                  fileId: id,
                  fileSize,
                  name,
                  ext,
                  status: fileSize==0?'error':'success',
                  uri:src
                };
                let list = [..._this.state.uploadList, newFile];
                list = list.filter(item => {
                  return item.fileId !== file.id&&item.status!='pending'
                });
                _this.changeUploadList(list);
                _this.setState({
                  errTip: ''
                });
                break;
              case '10002':
                _this.uploadError(data.msg || UPLOAD_ERR.size);
                break;
              case '10003':
                _this.uploadError(data.msg || UPLOAD_ERR.fileType);
                break;
              default:
                _this.uploadError(data.msg || 'Upload Failed!');
                break;
            }
          }
        })
        .on('uploadError', function(file) {
          // console.log('uploadError',file);
          let {uploadList} = _this.state;
          for(let i=0;i<uploadList.length;i++){
            let listItem = uploadList[i];
            if(listItem.fileId == file.id){
              listItem.status = 'error'
            }
          }
          _this.changeUploadList(uploadList);
        })
        .on('queueError', function(file, errorCode, message) {
          // console.log('queueError', file, errorCode, message);
          if (errorCode === -130) {
            _this.setState({
              errTip: UPLOAD_ERR.fileType
            });
          } else if (errorCode === -110) {
            _this.setState({
              errTip: UPLOAD_ERR.size
            });
          }
        });
      this.uploader = uploader;
      this.uploader.initFileId = '';
    } else {
      console.warn('warn from component upload: window.FOCUS is not defined!');
      return false;
    }
  }
  componentWillMount(){
    // bus.removeListener('attachmentOfFormInCerFormChange')
  }
  render() {
    let { placeholder, name, data } = this.props;
    return (
      <Fragment>
        <div id="uploader" />
        {placeholder && (
          <div className="upload-tips">
            <p>{placeholder}</p>
          </div>
        )}
        <UploadList
          data={this.state.uploadList}
          className="attach-list"
          namekey="name"
          extkey="ext"
          urikey="uri"
          fileIdkey="fileId"
          type="edit"
          onChange={data => {
            this.changeUploadList(data);
          }}
          onRetry={file => {
            this.onRetry(file);
          }}
          onRemoveItem={list => {
            this.changeUploadList(list)
          }}

        />
        {this.state.errTip && (
          <div className="feedback-block J-upload-error-wrap">
            <label className="form-error J-upload-error-text error">
              {this.state.errTip}
            </label>
          </div>
        )}
        <input
          type="hidden"
          name={'attachmentJson'}
          value={
            this.props.data&&this.props.data.length ? JSON.stringify(this.props.data) : ''
          }
        />
      </Fragment>
    );
  }
}
