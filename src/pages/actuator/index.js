import React from 'react';
import Breadcrumb from 'r-cmui/components/Breadcrumb';
import Card from 'r-cmui/components/Card';
import MessageBox from 'r-cmui/components/MessageBox';
import Dialog from 'r-cmui/components/Dialog';
import SimpleListPage from 'r-cmui/components/Business/SimpleListPage';
import Button from 'r-cmui/components/Button';
import API from '../../configs/api';
import Form from './Form';

import { inject, observer } from 'mobx-react';

@inject('actuator')
@observer
class Actuator extends React.Component {
    displayName = 'Actuator';

    columns = [
        {name: 'ordering', text: '排序'},
        {name: 'AppName', text: 'AppName'},
        {name: 'name', text: '名称'},
        {name: 'registerType', text: '注册方式', format:(value) => {
            return this.props.actuator.registerType[value];
        }},
        {name: 'ips', text: 'OnLine 机器'},
        {name: 'op', text: '操作', format: (value, column, row) => {
            return <span>
                <a className='text-blue mr-5' href='javascript:void(0)' onClick={this.openEditDialog.bind(this, row.id)}>编辑</a>
                <a className='text-danger mr-5' href='javascript:void(0)' onClick={this.openDeleteConfirm.bind(this, row.id)}>删除</a>
            </span>;
        }}
    ];

    openDeleteConfirm (id) {
        this.deleteConfirm.show('确认删除该执行器？');
        this.deleteConfirm.setData(id);
    }

    doDelete = async () => {
        const id = this.deleteConfirm.getData();
        this.props.actuator.deleteActuator(id, (ret) => {
            if (ret && ret.success) {
                this.tip.show('删除成功');
                this.table.refresh();
            } else {
                this.tip.show('删除失败');
            }
        });
    }

    openDialog = () => {
        this.props.actuator.changeInitFormData();
        this.addDialog.open();
    }

    openEditDialog (id) {
        this.props.actuator.getActuatorInfo(id);
        this.addDialog.open();
    }

    saveForm = (flag) => {
        if (flag) {
            this.submit();
            return false;
        }
        return true;
    }

    async submit () {
        if (this.form.isValid()) {
            const params = this.form.getParams();
            if  (params.id ) {
                this.props.actuator.editActuator(params, (ret) => {
                    if (ret && ret.success) {
                        this.tip.show('编辑成功');
                        this.table.refresh();
                    } else {
                        this.tip.show('编辑失败');
                    }
                    this.addDialog.close();
                });
            }  else {
                this.props.actuator.saveActuator(params, (ret) => {
                    if (ret && ret.success) {
                        this.tip.show('保存成功');
                        this.table.refresh();
                    } else {
                        this.tip.show('保存失败');
                    }
                    this.addDialog.close();
                });
            }
        }
    }

    render () {
        const formData = this.props.actuator.getInitFormData();
        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item>执行器管理</Breadcrumb.Item>
                    <Breadcrumb.Item>执行器列表</Breadcrumb.Item>
                </Breadcrumb>

                <Card className='mt-30' title='执行器列表' tools={[
                    <Button style={{color: '#fff'}} key='plus' theme='primary' icon='plus' onClick={this.openDialog}>添加执行器</Button>
                ]}>
                    <SimpleListPage pagination ref={(f) => this.table = f} columns={this.columns} action={API.ACTUATOR.LIST}/>
                </Card>

                <Dialog ref={(f) => this.addDialog = f} title={formData.id ? '编辑执行器' : '新增执行器'}
                    onConfirm={this.saveForm} 
                    content={<Form ref={(f) => this.form = f} data={formData}/>} />
                <MessageBox ref={(f) => this.deleteConfirm = f} title='提示' type='confirm' confirm={this.doDelete}/>
                <MessageBox ref={(f) => this.tip = f} title='提示' />
            </div>
        );
    }
}
export default Actuator;
