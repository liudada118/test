import logo from './logo.svg';
import './App.css';
// import 'antd/lib/button/style' 
import React, { Component, useState } from 'react'
import axios from 'axios'
import md5 from 'js-md5'
import Canvas from './Canvas'
import { Select } from 'antd';
const { Option } = Select;
const createUrl = 'http://cushion.bodyta.com:19356/rec/report'
const delUrl = 'http://cushion.bodyta.com:19356/rec/clear'
const key = '13a43a4fd27e4b9e8acee7b82c11e27c'
function App() {
  const [deviceId, setDeviceID] = useState('308201171')
  const [data, setData] = useState('')
  const [allData, setAllData] = useState('')
  const [timeArr, setTimeArr] = useState('')
  const [rp_id , setRp_id] = useState('')
  const create = () => {
    const timestamp = Date.parse(new Date()) / 1000
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()
    const date = `${year}-${month}-${day}`
    axios.post(createUrl, {
      sign: md5(key + timestamp),
      timestamp: timestamp,
      did: deviceId,
      date: date
    }).then(res => {
      if (res.data.msg) {
        window.alert(res.data.msg)
      }
      console.log(res)
      if(res.data.rp_id){
        setRp_id(res.data.rp_id)
      }
      if (Array.isArray(res.data.data)) {
        setData(res.data.data[res.data.data.length-1])
        setAllData(res.data.data)
        let timearr = []
        res.data.data.map((a, index) => {
          timearr.push(a.gobed_time + '-' + a.outbed_time)
        })
        setTimeArr(timearr)
      }


    })
  }
  const onDelete = () => {
    const timestamp = Date.parse(new Date()) / 1000
    axios.post(delUrl, {
      sign: md5(key + timestamp),
      timestamp: timestamp,
      rp_id : rp_id
    })
  }
  const handleChange = (value) => {
    console.log(value)
    setData(allData[value])
  }
  return (
    <div className="App">
      did:<input type="text" name="" id="" value={deviceId} onChange={(e) => { setDeviceID(e.target.value) }} />
      {timeArr ? <Select defaultValue={timeArr[timeArr.length-1]} style={{ width: 240 }} onChange={(e) => handleChange(e)}>
        {timeArr.map((a, index) => {
          return <Option key={index} value={index}>{a}</Option>
        })}
      </Select> : null}
      <button onClick={() => { create() }} >请求</button>
      <button onClick={() => { onDelete() }}>删除</button>
      {data ? <>
        <div style={{ fontSize: 30 }}>
          <p>  睡眠总时长 : {data.total_duration}</p>
          <p>   在床时间 : {data.inbed_duration}</p>
          <p>   上床时间 : {data.gobed_time}</p>
          <p>   离床时间 : {data.outbed_time}</p>
          <p>   离床次数 ： {data.outbed.n}</p>
          <p>   离床程度 : {data.outbed.s}</p>
          <p>  深睡时长 :  {data.deep_duration}</p>
          <p>   浅睡时长 : {data.light_duration}</p>
          <p>   清醒时长 : {data.awake_duration}</p>
          <p>   入睡时长 : {data.sleep_duration}</p>
          <p>   体动次数 : {data.movement.n}</p>
          <p>   体动程度 : {data.movement.s}</p>
          <p>睡眠效率百分比 : {data.sleep_eff.r}</p>
          <p> 睡眠效率程度 : {data.sleep_eff.s}</p>
        </div>
        <Canvas yData={data.hx_arr} xData={data.dt_arr} name='呼吸率数据集合' index={1} />
        <Canvas yData={data.outbed_arr} xData={data.dt_arr} index={2} name='离床数据集合' />
        <Canvas yData={data.move_arr} xData={data.dt_arr} index={3} name='体动数据集合' />
        <Canvas yData={data.sleep_arr} xData={data.dt_arr} index={4} name='睡眠状态数据集合' />
      </> : null}
    </div>
  );
}

export default App;
