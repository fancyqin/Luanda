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
	Button,
} from 'antd';

import {usUnit} from '@/utils/currency';
import {method} from '@/utils/rules';

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
    }
}


class ApplyCreditForm extends React.Component {

	constructor(props){
		super(props);
		
	}

	componentDidMount(){
		let {initValue,form} = this.props;
		let {setFieldsValue} = form;
		setFieldsValue({creditLimit:12313})
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
		const { getFieldDecorator,getFieldValue,getFieldError } = this.props.form;
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

		return (
			<Form {...formItemLayout} onSubmit={this.handleSubmit}>
				<Form.Item label="Desired Credit Limit">
					{getFieldDecorator('creditLimit',ApplyCreditRules.creditLimit)(
                        <div className="ant-col-sm-12">
							<Input addonBefore={usUnit} maxLength={7} />
                        </div>
                    )}
                </Form.Item>
                <Form.Item label="Application Description">
                    {getFieldDecorator('description',ApplyCreditRules.description)(
                        <div className={`ant-col-sm-16 textarea-with-number ${getFieldError('description') && 'textarea-with-number-error'}`}>
                            <Input.TextArea maxLength={4000} style={{height: 200}} />
                            <div className="textarea-span">{getFieldValue('description')?getFieldValue('description').length:0}/4000</div>
                        </div>
                    )}
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