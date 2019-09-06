import React from 'react'
import {
	Form,
    Input,
    
	Tooltip,
	Icon,
	Cascader,
	Select,
	Row,
	Col,
    Checkbox,
    Upload,
	Button,
} from 'antd';

import {usUnit} from '@/utils/currency';
import {method} from '@/utils/rules';
import CONST from '@/utils/const';
const { Option } = Select;


const ApplyCreditRules = {
    creditLimit:{
        rules: [
            {
                required: true,
                message: 'Please enter desired credit limit.',
            },
            {
                max: 7,
                message:'Desired credit limit may enter up to 7 digits.'  
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
                message:'Application description may enter up to 4000 character.'
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
                message: 'Please enter you bank address.'
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
                message: 'Please enter you account number.'
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
                message: 'Please enter you owner name.'
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
        ]
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
                message: 'Please enter you contact name.'
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
                message:'Email address: You may enter up to 160 characters.'
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
        ]
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
            message:'Please fsfe fe f '
        }]
    }
}


class ApplyCreditForm extends React.Component {

	constructor(props){
		super(props);
		
	}

	componentDidMount(){
		let {initValue={},form} = this.props;
        let {setFieldsValue} = form;
        setFieldsValue(initValue)
	}

	state = {
		confirmDirty: false
	};

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
		});
	};


	render() {
        const {initValue,form} = this.props;
        const { getFieldDecorator,getFieldValue,getFieldError } = form;
        const nowYear = new Date().getFullYear();
        let yearOptions = [<Option key={'option-0'} value=''>Please Select</Option>];
        for(let i = nowYear; i> nowYear - 200;i--){
            yearOptions.push(<Option key={'option-'+i} value={i}>{i}</Option>)
        }
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
        
        let agreementText = initValue.agreement ? initValue.agreement.replace(/\r\n/g,'<br/>'):'';

		return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            
				<Form.Item label="Desired Credit Limit">
                    <div className="ant-col-sm-12">
                        {getFieldDecorator('creditLimit',ApplyCreditRules.creditLimit)(
                            <Input addonBefore={usUnit} maxLength={7} />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="Application Description">
                    <div className={`ant-col-sm-16 textarea-with-number ${getFieldError('description') && 'textarea-with-number-error'}`}>
                        {getFieldDecorator('description',ApplyCreditRules.description)(
                            <Input.TextArea maxLength={4000} style={{height: 200}} />
                        )}
                        <div className="textarea-span">{getFieldValue('description')?getFieldValue('description').length:0}/4000</div>
                    </div>
                </Form.Item>


                <h2 className="form-block-title">Company Information</h2>
                <Form.Item label="Business Name" required>
                    <div>{initValue.businessName}</div>
                </Form.Item>
                <Form.Item label="Year Founeded">
                    <div className="ant-col-sm-12">
                        {getFieldDecorator('yearFounded',ApplyCreditRules.yearFounded)(
                            <Select>
                                {yearOptions}
                            </Select>
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="EIN">
                    <div className="ant-col-sm-12">
                        {getFieldDecorator('ein',ApplyCreditRules.ein)(
                            <Input maxLength={12} />
                        )}
                    </div>
                </Form.Item>


                <h2 className="form-block-title">Bank Information</h2>
                <Form.Item label="Bank Name">
                    <div className="ant-col-sm-12">
                        {getFieldDecorator('bankName',ApplyCreditRules.bankName)(
                            <Input maxLength={200} />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="Bank Address">
                    <div className="ant-col-sm-18">
                        {getFieldDecorator('bankAddress',ApplyCreditRules.bankAddress)(
                            <Input maxLength={500} />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="Bank Name">
                    <div className="ant-col-sm-18">
                        {getFieldDecorator('bankAccountNumber',ApplyCreditRules.bankAccountNumber)(
                            <Input />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="Bank Name">
                    <div className="ant-col-sm-12">
                        {getFieldDecorator('bankEstablishYear',ApplyCreditRules.bankEstablishYear)(
                            <Select>
                                {yearOptions}
                            </Select>
                        )}
                    </div>
                </Form.Item>

                <h2 className="form-block-title">Owner Information</h2>
                <Form.Item label="Owner Name">
                    <div className="ant-col-sm-12">
                        {getFieldDecorator('ownerName',ApplyCreditRules.ownerName)(
                            <Input maxLength={100} />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="Email">
                    <div className="ant-col-sm-12">
                        {getFieldDecorator('ownerEmail',ApplyCreditRules.ownerEmail)(
                            <Input maxLength={160} />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="Phone">
                    <div className="ant-col-sm-12">
                        {getFieldDecorator('ownerPhone',ApplyCreditRules.ownerPhone)(
                            <Input addonBefore={'+1'} maxLength={20} />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="SSN">
                    <div className="ant-col-sm-12">
                        {getFieldDecorator('ownerSsn',ApplyCreditRules.ownerSsn)(
                            <Input maxLength={50} />
                        )}
                    </div>
                </Form.Item>


                <h2 className="form-block-title">Contact Information</h2>
                <Form.Item label="Contact Name">
                    <div className="ant-col-sm-12">
                        {getFieldDecorator('contactName',ApplyCreditRules.contactName)(
                            <Input maxLength={100} />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="Email">
                    <div className="ant-col-sm-12">
                        {getFieldDecorator('contactEmail',ApplyCreditRules.contactEmail)(
                            <Input maxLength={160} />
                        )}
                    </div>
                </Form.Item>
                <Form.Item label="Phone">
                    <div className="ant-col-sm-12">
                        {getFieldDecorator('contactPhone',ApplyCreditRules.contactPhone)(
                            <Input addonBefore={'+1'} maxLength={20} />
                        )}
                    </div>
                </Form.Item>
                

                <h2 className="form-block-title">Documents</h2>
                <div className="doc-info">
                    - Less than 10MB for each file.<br/>
                    - Supported formats: PDF, Doc, Docx, Xls, Xlsx, JPG, JPEG, PNG.
                </div>
                <Form.Item label="IRS">
                    {getFieldDecorator('fileIrs',ApplyCreditRules.fileRule)(
                        <Upload name="fileIrs" action="//upload-u.crov.com/uploadFile" accept="image/*,.pdf" beforeUpload={file=>{
                            console.log(file)
                        }}>
                            <Button>
                            Upload
                            </Button>
                        </Upload>
                    )}
                </Form.Item>

                <h2 className="form-block-title">Agreement</h2>
                <Form.Item {...tailFormItemLayout} style={{marginBottom: 0}}>
                    <div className="ant-col-sm-18">
                        <Input.TextArea style={{height: 300,resize:'none'}} value={agreementText} readOnly />
                    </div>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <div className ="ant-col-sm-18" style={{display:'flex',justifyContent:'space-between',lineHeight:1.5}}>
                        {getFieldDecorator('agreementCheck', ApplyCreditRules.agreement)(
                            <Checkbox>I have read and agree to the above Terms and Conditions.</Checkbox>
                        )}
                        <a style={{whiteSpace:'nowrap',marginLeft: 20}} href={initValue.agreementPdfUrl} target="_blank"><i className="ob-icon icon-print"></i> Print</a>
                    </div>
                </Form.Item>

                
                
				<Form.Item {...tailFormItemLayout}>
					<Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button style={{marginLeft: 10,}}>
                        Save Draft
                    </Button>
				</Form.Item>
			</Form>
		);
	}
}


export default Form.create({ name: 'applyCredit' })(ApplyCreditForm);