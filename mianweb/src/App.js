import logo from './logo.svg';
import './App.css';
// import 'antd/lib/button/style' 
import React, { Component, useState, useEffect } from 'react'
import axios from 'axios'
import md5 from 'js-md5'
import Canvas from './Canvas'
import { Select } from 'antd'
import * as echarts from 'echarts'
let breatheArr = []
let moveArr = []
let levelArr = []
let postureArr = []
let dateArr = []
let minArr = []
let ws

const { Option } = Select;
const createUrl = 'http://bah.bodyta.com:19356/rec/report'
const delUrl = 'http://bah.bodyta.com:19356/rec/clear'
const key = '13a43a4fd27e4b9e8acee7b82c11e27c'

// function useDebounceHook(value, delay) {
//   const [debounceValue, setDebounceValue] = useState(value);
//   useEffect(() => {
//     let timer = setTimeout(() => setDebounceValue(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);
//   return debounceValue;
// }

const initCharts = (props) => {
  // document.createElement('div' , {id : `myChart${props.index}`})
  let myChart = echarts.init(document.getElementById(`myChart${props.index}`));
  let option = {
    title: {
      text: props.name
    },
    tooltip: {
      trigger: 'axis'

    },
    xAxis: {
      type: 'category',
      data: props.xData,
      boundaryGap: false,
      // min:props.xData[0], // 起始
      // max:props.xData[props.xData.length -1] // 终止
    },
    yAxis: {
      type: 'value',
      data: props.index == 8 ? ["平躺", "爬睡", "侧躺"] : '',
      min: 0,
      minInterval: 1,
      axisLabel: {
        show: true,
        textStyle: {
          color: '#000'
        },
        // 这里重新定义就可以
        formatter: props.index == 8 ? function (value) {
          var texts = []
          if (value === 1 || value === '1') {
            texts.push('平躺')
          } else if (value === 2 || value === '2') {
            texts.push('爬睡')
          } else if (value === 3 || value === '3') {
            texts.push('侧躺')
          } else if (value === 4 || value === '4') {
            texts.push('V类')
          } else if (value === 5 || value === '5') {
            texts.push('Ⅵ类')
          }
          return texts
        } : null
      },


    },
    series: [
      {
        symbol: "none",
        data: props.yData,
        type: 'line',
        smooth: true,
        color: '#000',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [{
              offset: 1, color: '#e6e6e6' // 0% 处的颜色
            }, {
              offset: 0, color: '#fff' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },

      }
    ],
  };
  myChart.setOption(option);
  window.addEventListener("resize", function () {
    myChart.resize();
  });
}

function App() {

  const [breathe, setBreathe] = useState('')
  const [move, setMove] = useState('')
  const [level, setLevel] = useState('')


  const [deviceId, setDeviceID] = useState('308201171')
  const [data, setData] = useState('')
  const [allData, setAllData] = useState('')
  const [timeArr, setTimeArr] = useState('')
  const [rp_id, setRp_id] = useState('')
  const [dateStr, setDateStr] = useState('')
  const [dateNum, setDateNum] = useState('')
  console.log('re', breathe)
  // const deviceIddeb = useDebounceHook(deviceId, 1000);
  // useEffect(() => {

  //   axios.get('http://192.168.31.117/mi/deviceSub?_nonce=yLyaIM5XJi8BnMQj&app_id=10171&data=3nWzYPfeZmGDUGgrJIf0Qemz3vJESQSW0IEPsCjwwh%2B2qm7NOMoFTs72gg8wR20qFMl6sAW4PNHZTTI2jHbl29ASAPfXgtQr8sUkTsXl3OUXYQCMnXhqn5NfvbpAgepPFc6kbYt0zfIItwAHSKYR2TVinJShTVGaGYOEdCwhR%2B0TbW1BJ0B8t%2BsiIxyxbRCvHRm8Ul%2FFJH8awmCVpleNnJehxsQLGcara4%2Fs9g7GadXeVFt5SMWLQY%2FoBxFd6IzAJmD7g%2F7GeQnmvEiljqxJ0WR7AMncnnySxSYeWi4ipML%2BFLfg3jRFqQ%2BO%2FqNcge4Ql%2BI8Dh94PHK573m03uvsZg%3D%3D&signature=KlQMzVEGoWcbY63zGYrGQyJGoH8%3D')
  //   .then((res) => console.log(res))

  // }, [])

  const create = () => {
    ws = new WebSocket(`wss://bah.bodyta.com/bed/${deviceId}`)
    ws.onopen = (e) => {
      console.log('ws sussess')
    }
    ws.onmessage = (e) => {
      // console.log(dateArr ,breatheArr,levelArr )
      console.log(JSON.parse(e.data), '++++++++++++++++++++++++++++++')
      if (JSON.parse(e.data).value) {
        let dataArr = JSON.parse(e.data).value.split('-')
        breatheArr.push(parseInt(dataArr[2], 16))
        moveArr.push(parseInt(dataArr[0], 16))
        levelArr.push(parseInt(dataArr[1], 16))
        let nowDate = new Date()
        let hour = nowDate.getHours()
        let min = nowDate.getMinutes()
        let sec = nowDate.getSeconds()
        let date = hour + ':' + min + ':' + sec
        dateArr.push(date)

        // setBreathe(parseInt(dataArr[2],16))
        // setMove(parseInt(dataArr[0],16))
        // setLevel(parseInt(dataArr[1],16))
        initCharts({ yData: breatheArr, xData: dateArr, index: 5, name: '呼吸' })
        initCharts({ yData: moveArr, xData: dateArr, index: 6, name: '体动' })
        initCharts({ yData: levelArr, xData: dateArr, index: 7, name: '离床' })
      }
      ws.onclose = () => {
        ws = new WebSocket(`wss://bah.bodyta.com/bed/${deviceId}`)

      }


      if (JSON.parse(e.data).posture) {
        let nowDate = new Date()
        let hour = nowDate.getHours()
        let min = nowDate.getMinutes()
        let date = hour + ':' + min
        minArr.push(date)
        postureArr.push(JSON.parse(e.data).posture == '平躺' ? 1 : JSON.parse(e.data).posture == '爬睡' ? 2 : 3)
        initCharts({ yData: postureArr, xData: minArr, index: 8, name: '坐姿' })
      }

      // setBreathe(breatheArr)
      // setMove(moveArr)
      // setLevel(levelArr)



    }



    const timestamp = Date.parse(new Date()) / 1000
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()
    const date = `${year}-${month}-${day}`
    axios.post(createUrl, {
      sign: md5(key + timestamp),
      timestamp: timestamp,
      did: deviceId,
      date: dateStr ? dateStr : date
    }).then(res => {
      if (res.data.msg) {
        window.alert(res.data.msg)
      }
      console.log(res)
      if (res.data.rp_id) {
        setRp_id(res.data.rp_id)
        console.log(res.data.rp_id)
      }
      if (Array.isArray(res.data.data)) {
        setData(res.data.data[res.data.data.length - 1])

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
    console.log(rp_id)
    const timestamp = Date.parse(new Date()) / 1000
    axios.post(delUrl, {
      sign: md5(key + timestamp),
      timestamp: timestamp,
      rp_id: rp_id
    }).then(res => console.log(res, 'delete'))
  }
  const handleChange = (value) => {
    console.log(value)
    setData(allData[value])
  }
  return (
    <div className="App">
      did:<input type="text" name="" id="" value={deviceId} onChange={(e) => { setDeviceID(e.target.value) }} />
      date: <input type="date" onChange={(e) => { setDateStr(e.target.value); setDateNum(Date.parse(new Date(e.target.value)) / 1000); console.log(e.target.value, Date.parse(new Date(e.target.value))) }} />
      {timeArr ? <Select defaultValue={timeArr[timeArr.length - 1]} style={{ width: 240 }} onChange={(e) => handleChange(e)}>
        {timeArr.map((a, index) => {
          return <Option key={index} value={index}>{a}</Option>
        })}
      </Select> : null}
      <button onClick={() => { create() }} >请求</button>
      <button onClick={() => { onDelete() }}>删除</button>
      {/* {breathe !=='' ? <div>呼吸 {breathe}</div> : null }
      {move!=='' ? <div>体动 {move}</div> : null }
      {level!=='' ? <div>离床 {level}</div> : null } */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', flexDirection: 'column' }}>
        <div id="myChart5" style={{ width: '64%', height: 250 }}></div>
        <div id="myChart6" style={{ width: '64%', height: 250 }}></div>
        <div id="myChart7" style={{ width: '64%', height: 250 }}></div>
        <div id="myChart8" style={{ width: '64%', height: 250 }}></div></div>
      {/* {breathe !== '' ? <Canvas yData={breathe} xData={dateArr} index={5}/> : null} */}
      {move !== '' ? <Canvas yData={move} xData={dateArr} index={6} /> : null}
      {level !== '' ? <Canvas yData={level} xData={dateArr} index={7} /> : null}

      {data ? <>
        <div style={{ fontSize: 30 }}>
          <p>  睡眠总时长 : {data.total_duration}</p>
          <p>   在床时间 : {data.inbed_duration}</p>
          <p>   上床时间 : {data.gobed_time}</p>
          <p>   入睡时间 : {data.sleep_time}</p>
          <p>   离床时间 : {data.outbed_time}</p>
          <p>   离床次数 ： {data.outbed.n}</p>
          <p>   离床程度 : {data.outbed.s}</p>
          <p>  深睡时长 :  {data.deep_duration}</p>
          <p>   浅睡时长 : {data.light_duration}</p>
          <p>   清醒时长 : {data.awake_duration}</p>
          <p>   入睡时长 : {data.sleep_duration}</p>
          <p>   体动次数 : {data.movement.n}</p>
          <p>   体动程度 : {data.movement.s}</p>
          <p>   体位转动总次数 : {data.turn_num}</p>
          <p>   体位转动每小时平均次数 : {data.turn_svg_num}</p>
          <p>睡眠效率百分比 : {data.sleep_eff.r}</p>
          <p> 睡眠效率程度 : {data.sleep_eff.s}</p>
          <p>   呼吸平均值 : {data.hx_avg}</p>
          <p>呼吸最大值 : {data.hx_max}</p>
          <p> 呼吸最小值 : {data.hx_min}</p>
        </div>

        <Canvas yData={data.hx_arr} xData={data.dt_arr} name='呼吸率数据集合' index={1} />
        <Canvas yData={data.outbed_arr} xData={data.dt_arr} type={['离床', '在床']} index={2} name='离床数据集合' />
        <Canvas yData={data.move_arr} xData={data.dt_arr} index={3} type={['正常', '体动']} name='体动数据集合' />
        <Canvas yData={data.sleep_arr} xData={data.dt_arr} type={['清醒', '浅睡', '深睡']} index={4} name='睡眠状态数据集合' />
        <Canvas yData={data.hxsus_arr} xData={data.dt_arr} type={['正常', '暂停']} index={10} name='呼吸暂停' />
      </> : null}
    </div>
  );
}

export default App;
