import {useStrict, observable, action, toJS} from 'mobx';
import fetch from 'r-cmui/components/utils/fetch';
import API from '../configs/api';

useStrict(true); // 使用严格模式

export default class Job {
    orignData = {
        actuator: '',
        desc: '',
        person: '',
        strategy: '',
        runMode: ''
    };
    @observable initFormData;
    @observable jobInfo = {};

    async putJob (params) {
        const ret = fetch(API.JOB.ADD_JOB, params, 'post');
        return ret;
    }

    async deleteJob (id) {
        const ret = fetch(API.JOB.DELETE_JOB, {id});
        return ret;
    }

    async fetchJobInfo (id) {
        const info = await fetch(API.JOB.GET_JOB, {id});
        this.setJobInfo(info);
    }

    async updateJob (params) {
        const ret = fetch(API.JOB.UPDATE_JOB, params, 'post');
        return ret;
    }

    @action
    initAddFormData () {
        this.initFormData = JSON.parse(JSON.stringify(this.orignData));
    }

    @action
    setFetchBegin () {
        this.isFetching = true;
    }

    @action
    setFetchDone () {
        this.isFetching = false;
    }

    @action
    setJobInfo (data) {
        this.jobInfo = data;
    }
}

