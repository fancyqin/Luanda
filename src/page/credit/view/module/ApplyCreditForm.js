import React, { Fragment } from 'react'
import {
	Form,
    Input,
	Select,
    Checkbox,
} from 'antd';

import Upload from '@/components/upload';
import UploadList from '@/components/upload/uploadList'
import currency,{usUnit} from '@/utils/currency';
import {method} from '@/utils/rules';
import CONST from '@/utils/const';
import Button from '@/components/button/Button';
import CreditDao from '@/dao/CreditDao';
const { Option } = Select;
import {isArray} from '@/utils'
import agreementText from './agreementText';
import message from '@/components/message'

const ApplyCreditRules = {
    creditLimit:{
        rules: [
            {
                required: true,
                message: 'Please enter your expected credit limit.',
            },
            {
                max: 7,
                message:'Expected credit limit: You may enter up to 7 digits.'  
            },
            method.digits('Please enter in digits only.')
		],
		validateFirst:true,
    },
    description:{
        rules: [
            {
                required: true,
                message:'Please enter the application description.'
            },
            method.enOnly('Please enter in English only.'),
            {
                max: 4000,
                message:'Crov Credit application description: You may enter up to 4000 characters.'
            }
		],
		validateFirst:true
    },
    yearFounded:{
        rules:[
            {
                required: true,
                message: 'Please select Year Founded.'
            }
        ]
    },
    ein:{
        rules:[
            {
                required: true,
                message: 'Please enter a valid EIN.'
            },
            method.ein('Must be 9 digit number, e.g. 00-0000000.')
        ],
        validateFirst:true
    },
    bankName:{
        rules:[
            {
                required: true,
                message: 'Please enter your bank name.'
            },
            {
                max: 200,
                message:'Bank name: You may enter up to 200 characters.'
            },
            // method.enOnly('Please enter in English only.')
        ]
    },
    bankAddress:{
        rules:[
            {
                required: true,
                message: 'Please enter your bank address.'
            },
            {
                max: 500,
                message:'Bank address: You may enter up to 500 characters.'
            },
            method.enOnly('Please enter in English only.')
        ]
    },
    bankAccountNumber:{
        rules:[
            {
                required: true,
                message: 'Please enter your account number.'
            },
            {
                max: 50,
                message:'Account number: You may enter up to 50 characters.'
            },
            method.enOnly('Please enter in English only.')
        ]
    },
    bankEstablishYear:{
        rules:[
            {
                required: true,
                message: 'Please select Years Account Established.'
            }
        ]
    },
    ownerName:{
        rules:[
            {
                required: true,
                message: 'Please enter your owner name.'
            },
            {
                max: 100,
                message:'Owner name: You may enter up to 100 characters.'
            },
        ]
    },
    ownerEmail:{
        rules:[
            {
                required: true,
                message: 'Please enter a valid email address.'
            },
            {
                max: 160,
                message:'Email address: You may enter up to 160 character.'
            },
            {
                type:'email',
                message:'Please enter a valid email address.'
            }
        ]
    },
    ownerPhone:{
        rules:[
            {
                required: true,
                message: 'Please enter your phone number.'
            },
            {
                max: 20,
                message:'Please provide a valid phone number.'
            },
            method.phone('Please provide a valid phone number.',CONST.US_COUNTRY_CODE)
        ],
        validateFirst:true,
    },
    ownerSsn:{
        rules:[
            {
                required: true,
                message:'Please enter a valid SSN.'
            },
            method.ssn('Must be 9 digit number, e.g. 000-00-0000.')
        ]
    },
    contactName:{
        rules:[
            {
                required: true,
                message: 'Please enter your contact name.'
            },
            {
                max: 100,
                message:'Contact name: You may enter up to 100 characters.'
            },
        ]
    },
    contactEmail:{
        rules:[
            {
                required: true,
                message: 'Please enter a valid email address.'
            },
            {
                max: 160,
                message:'Email address: You  may enter up to 160 characters.'
            },
            {
                type:'email',
                message:'Please enter a valid email address.'
            }
        ]
    },
    contactPhone:{
        rules:[
            {
                required: true,
                message: 'Please enter your phone number.'
            },
            {
                max: 20,
                message:'Please provide a valid phone number.'
            },
            method.phone('Please provide a valid phone number.',CONST.US_COUNTRY_CODE)
        ],
        validateFirst:true,
    },
    agreement:{
        rules:[
            (rule, value, callback)=>{
                callback(value?undefined:'Please read term carefully and select to agree.')
            }
        ],
        valuePropName:'checked',
        initialValue: false
    },
    fileRule:{
        rules:[{
            required: true,
            message:'Please upload files.'
        }]
    }
}


class ApplyCreditForm extends React.Component {

	constructor(props){
        super(props);
    }
    
    state = {
        fileEin:[],
        fileW9:[],
        fileCompanyAuth:[],
        fileBalanceSheet:[],
        fileOthers:[]
    };


	componentDidMount(){
		let {initValue={},form} = this.props;
        let {setFieldsValue} = form;
        if(!initValue.yearFounded){
            initValue.yearFounded = ''
        }
        if(!initValue.bankEstablishYear){
            initValue.bankEstablishYear = ''
        }
        
        this.setState({
            fileEin: (initValue.fileEin && initValue.fileEin.map(item => {item.status = 'success';return item})) || [],
            fileW9: initValue.fileW9 || [],
            fileCompanyAuth:initValue.fileCompanyAuth || [],
            fileBalanceSheet:initValue.fileBalanceSheet || [],
            fileOthers:initValue.fileOthers || []
        })

        initValue.creditStatus !== '2' &&  setFieldsValue(initValue);
	}

	
    
    submitApplyCredit(submitData){
        CreditDao.postApplyCredit(submitData).then(data =>{
            let result = data.data;
            if(result){
                if(result.code === '10001'){
                    message.success(submitData.draft === '0' ? 'Submitted successfully.':'The draft was submitted successfully.',3,()=>{
                        submitData.draft === '0' && window.location.reload();
                    });
                }else{
                    message.error(result.msg||'Unknown Error')
                }
            
                
            }
        })
    }

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
                values.draft = '0';
                
                Object.keys(values).forEach(key => {
            
                    if(key.indexOf('file')> -1 && isArray(values[key])){
                        values[key] = JSON.stringify(values[key])
                    }
                })
                console.log('submit values of form: ', values);
                this.submitApplyCredit(values);
			}
		});
    };
    
    handleSaveDraft = e=>{
        e.preventDefault();
        let values = this.props.form.getFieldsValue();
        values.draft = '1';
        console.log(Object.keys(values))
        Object.keys(values).forEach(key => {
            
            if(key.indexOf('file')> -1 && isArray(values[key])){
                values[key] = JSON.stringify(values[key])
            }
        })
        console.log('draft values of form: ', values);
        this.submitApplyCredit(values);
    }

    renderEnter = str =>{
        let html2Escape = (sHtml) =>{
            let temp = document.createElement("div");
            (temp.textContent != null) ? (temp.textContent = sHtml) : (temp.innerText = sHtml);
            let output = temp.innerHTML;
            temp = null;
            return output;
        }

        return str? html2Escape(str).replace(/\r?\n/g,'<br/>'):''
    }

    getApplyingFieldDecorator= (name,options)=> {
        return () => {
            let {initValue} = this.props;
            if(name.indexOf('file')> -1){
                let fileData = (initValue[name] && initValue[name].length > 0)? initValue[name].map(item=>{item.stutus = 'success';return item}):[];
                return fileData.length > 0 ? <div className="upload-list-show">
                <UploadList
                data={fileData}
                className="attach-list"
                namekey="name"
                extkey="ext"
                urikey="src"
                fileIdkey="id"
                type="read"
              />
              </div>:<div className="applying-inner">-</div>
            }else{
                if(name === 'creditLimit'){
                    return <div className="applying-inner">{usUnit + ' ' + currency(initValue[name], { precision: 0 }).format()}</div>
                }
                if(name === 'ownerPhone' || name=== 'contactPhone'){

                    return <div className="applying-inner">{'+1 '+ initValue[name]}</div>
                }
                return <div className="applying-inner">{initValue[name]}</div>
            }
            
        }
    } 
    

	render() {
        const {initValue,form} = this.props;
        const { getFieldDecorator,getFieldValue,getFieldError,setFields} = form;
        let applying = initValue.creditStatus === '2' || initValue.creditStatus === '5' ;
        let unApply =  initValue.creditStatus === '3'
        let getApplyFieldDecorator = applying ?this.getApplyingFieldDecorator:getFieldDecorator;
        const nowYear = new Date().getFullYear();
        let yearOptions = [<Option key={'option-0'} value=''>Please Select</Option>];
        for(let i = nowYear; i> nowYear - 200;i--){applying
            yearOptions.push(<Option key={'option-'+i} value={i}>{i}</Option>)
        }
        const uploadParams = {abIds:initValue.currentBusi,type:'pcf'}
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 4 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 20 },
			},
		};
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0,
				},
				sm: {
					span: 20,
					offset: 4,
				},
			},
        };
        
        let renderUpload = (name,max = 1)=>{
            return <Upload
                fileTypes="*.png, *.jpg, *.jpeg, *.xls, *.xlsx, *.doc, *.docx, *.pdf"
                max={max}
                postParams={uploadParams}
                onChange={list => {
                    let obj = {}
                    obj[name]= {value: list.length>0 ?JSON.stringify(list):''}
                    setFields(obj);
                    let file ={};
                    file[name] = list
                    this.setState(file);
                }}
                onError={err=>{
                    let obj = {};
                    obj[name] = {value:getFieldValue(name),errors:[new Error(err)]}
                    setFields(obj);
                }}
                sizeLimit="10MB"
                name={name}
                data={this.state[name]}
            />
        }
        




		return (
            <Form {...formItemLayout}>
                {applying && (
                    <div className="credit-status" style={{borderBottom:0}}>
                        {initValue.creditStatus === '2'?
                            <div className="status-text status-pending">Pending</div>
                            :
                            <div className="status-text status-deleted">Deleted</div>
                        }
                    </div>
                )}
                {initValue.creditStatus === '4' && (
                    <div className="credit-status">
                        <Form.Item label="Status">
                            <div>Rejected</div>
                        </Form.Item>
                        <Form.Item label="Review Opinion">
                            <div className="ant-col-sm-16" >
                            <div className="applying-inner" dangerouslySetInnerHTML={{__html:this.renderEnter(initValue.reviewOpinion)}}></div>
                            </div>
                        </Form.Item>
                    </div>
                )}
				<Form.Item label="Expected Credit Limit">
                    <div className="ant-col-sm-12">
                        {getApplyFieldDecorator('creditLimit',ApplyCreditRules.creditLimit)(
                            <Input addonBefore={usUnit} maxLength={7} />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="Application Description">
                    {!applying?<div className={`ant-col-sm-16 textarea-with-number ${getFieldError('description') && 'textarea-with-number-error'}`}>
                    {getApplyFieldDecorator('description',ApplyCreditRules.description)(
                        <Input.TextArea maxLength={4000} style={{height: 200}} placeholder="Crov Credit application description: Why do you want to apply for it?" />
                    )}
                    <div className="textarea-span">{getFieldValue('description')?getFieldValue('description').length:0}/4000</div>
                </div>:<div className="applying-inner" dangerouslySetInnerHTML={{__html:this.renderEnter(initValue.description)}} ></div>}
                    
                </Form.Item>


                <h2 className="form-block-title">Company Information</h2>
                <Form.Item label="Business Name" required={!applying}>
                    <div className="applying-inner">{initValue.businessName}</div>
                </Form.Item>
                <Form.Item label="Year Founded">
                    <div className="ant-col-sm-12">
                        {getApplyFieldDecorator('yearFounded',ApplyCreditRules.yearFounded)(
                            <Select>
                                {yearOptions}
                            </Select>
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="EIN">
                    <div className="ant-col-sm-12">
                        {getApplyFieldDecorator('ein',ApplyCreditRules.ein)(
                            <Input maxLength={12} />
                        )}
                    </div>
                </Form.Item>


                <h2 className="form-block-title">Bank Information</h2>
                <Form.Item label="Bank Name">
                    <div className="ant-col-sm-12">
                        {getApplyFieldDecorator('bankName',ApplyCreditRules.bankName)(
                            <Input maxLength={200} />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="Bank Address">
                    <div className="ant-col-sm-18">
                        {getApplyFieldDecorator('bankAddress',ApplyCreditRules.bankAddress)(
                            <Input maxLength={500} />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="Account Number">
                    <div className="ant-col-sm-18">
                        {getApplyFieldDecorator('bankAccountNumber',ApplyCreditRules.bankAccountNumber)(
                            <Input />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="Years Account Established">
                    <div className="ant-col-sm-12">
                        {getApplyFieldDecorator('bankEstablishYear',ApplyCreditRules.bankEstablishYear)(
                            <Select>
                                {yearOptions}
                            </Select>
                        )}
                    </div>
                </Form.Item>

                <h2 className="form-block-title">Owner Information</h2>
                <Form.Item label="Owner Name">
                    <div className="ant-col-sm-12">
                        {getApplyFieldDecorator('ownerName',ApplyCreditRules.ownerName)(
                            <Input maxLength={100} />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="Email">
                    <div className="ant-col-sm-12">
                        {getApplyFieldDecorator('ownerEmail',ApplyCreditRules.ownerEmail)(
                            <Input maxLength={160} />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="Phone">
                    <div className="ant-col-sm-12">
                        {getApplyFieldDecorator('ownerPhone',ApplyCreditRules.ownerPhone)(
                            <Input addonBefore={'+1'} maxLength={20} />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="SSN">
                    <div className="ant-col-sm-12">
                        {getApplyFieldDecorator('ownerSsn',ApplyCreditRules.ownerSsn)(
                            <Input maxLength={50} />
                        )}
                    </div>
                </Form.Item>


                <h2 className="form-block-title">Contact Information</h2>
                <Form.Item label="Contact Name">
                    <div className="ant-col-sm-12">
                        {getApplyFieldDecorator('contactName',ApplyCreditRules.contactName)(
                            <Input maxLength={100} />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="Email">
                    <div className="ant-col-sm-12">
                        {getApplyFieldDecorator('contactEmail',ApplyCreditRules.contactEmail)(
                            <Input maxLength={160} />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="Phone">
                    <div className="ant-col-sm-12">
                        {getApplyFieldDecorator('contactPhone',ApplyCreditRules.contactPhone)(
                            <Input addonBefore={'+1'} maxLength={20} />
                        )}
                    </div>
                </Form.Item>
                

                <h2 className="form-block-title">Documents</h2>
                {!applying &&(
                    <div className="doc-info">
                        - Less than 10MB for each file.<br/>
                        - Supported formats: PDF, Doc, Docx, Xls, Xlsx, JPG, JPEG, PNG.
                    </div>
                )}
                <Form.Item label="EIN Confirmation Letter">
                    {getApplyFieldDecorator('fileEin',ApplyCreditRules.fileRule)(
                        <Fragment>
                            {renderUpload('fileEin')}
                        </Fragment>
                    )}
                </Form.Item>
                <Form.Item label="W9">
                    {getApplyFieldDecorator('fileW9',ApplyCreditRules.fileRule)(
                        <Fragment>
                            {renderUpload('fileW9')}
                        </Fragment>
                    )}
                </Form.Item>
                <Form.Item label="Company Authorization Document">
                    {getApplyFieldDecorator('fileCompanyAuth',ApplyCreditRules.fileRule)(
                        <Fragment>
                            {renderUpload('fileCompanyAuth')}
                            <span className="upload-tip"><a href={initValue.companyAuthTempUrl}>Download Template</a></span>
                        </Fragment>
                    )}
                </Form.Item>
                
                <Form.Item label="Balance Sheet">
                    {getApplyFieldDecorator('fileBalanceSheet')(
                        <Fragment>
                            {renderUpload('fileBalanceSheet')}
                            <span className="upload-tip">Previous 6 months</span>
                        </Fragment>
                    )}
                </Form.Item>
                <Form.Item label="Others">
                    {getApplyFieldDecorator('fileOthers')(
                        <Fragment>
                            {renderUpload('fileOthers',10)}
                            <span className="upload-tip">For example: Bank Statement, Imcome Statement, Cash flow analysis, Other Comprehensive Income Report<br></br> –Previous 6 months.</span>
                        </Fragment>
                    )}
                </Form.Item>

                {
                    !applying && <Fragment>

                        {unApply && (
                            <Fragment>
                                <h2 className="form-block-title">Agreement</h2>
                                <Form.Item {...tailFormItemLayout} style={{marginBottom: 0}}>
                                    <div className="ant-col-sm-18">
                                        <div className="agreement-wrap">
                                            {agreementText}
                                        </div>
                                    </div>
                                </Form.Item>
                                <Form.Item {...tailFormItemLayout}>
                                    <div className ="ant-col-sm-18" style={{display:'flex',justifyContent:'space-between',lineHeight:1.5}}>
                                        {getApplyFieldDecorator('agreementCheck', ApplyCreditRules.agreement)(
                                            <Checkbox>I have read and agree to the above Terms and Conditions.</Checkbox>
                                        )}
                                        <a style={{whiteSpace:'nowrap',marginLeft: 20}} href={initValue.agreementPdfUrl} target="_blank"><i className="ob-icon icon-print"></i> Print</a>
                                    </div>
                                </Form.Item>
                            </Fragment>
                        )}

                        <Form.Item {...tailFormItemLayout}>
                            <Button type="main" htmlType="submit" onClick={this.handleSubmit}>
                                Submit
                            </Button>
                            {unApply && (
                                <Button style={{marginLeft: 10,}} onClick={this.handleSaveDraft} >
                                    Save Draft
                                </Button>
                            )}
                        </Form.Item>
                    
                    </Fragment> 
                }

                
			</Form>
		);
	}
}


export default Form.create({ name: 'applyCredit'})(ApplyCreditForm);