
import React from 'react';
import axios from 'axios';
import {CalculatorData} from './Common';

interface VecUploadProps {
    vecData: CalculatorData,
    update: ((data:CalculatorData) => void)
}

interface VecUploadState {
    file: any
    vecData: CalculatorData
}

export default class VecUploadForm extends React.Component<VecUploadProps, VecUploadState> {

    public readonly state: VecUploadState = {
        file: null,
        vecData:  { consumption: [], generation: []},
       
    }

    constructor(props: any) {
        super(props);

        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
      }

    onFormSubmit(e:any){
        e.preventDefault() // Stop form submit
        this.fileUpload(this.state.file).then((response)=>{
          this.props.vecData.consumption = response.data.consumption;
          this.props.vecData.generation = response.data.generation;
          this.props.update(this.props.vecData);
        })
    }
      
    onChange(e:any) {
        console.log(e.target.files[0]);
        this.setState({file:e.target.files[0]})
    }
      
    fileUpload(file:any){
        const url = 'http://localhost:8080/process';
        const formData = new FormData();
        formData.append('file',file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return axios.post(url, formData,config)
    }

    render() {
      return (
        <form onSubmit={this.onFormSubmit}>
          <h1>File Upload</h1>
          <p>Select Victorian Energy Compare data:</p>
          <input type="file" onChange={this.onChange} />
          <button type="submit">Upload</button>
        </form>
      );
    }
  }

