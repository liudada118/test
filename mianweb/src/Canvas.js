import React, { Component } from 'react';
import * as echarts from 'echarts'
import './chart.css';

export default class App extends Component {
    constructor(props) {
        super(props);
        console.log(props, props.xData)
    }

    componentDidMount() {
        this.initCharts(this.props);
    }
    componentDidMount(prevProps, prevState, snapshot) {
        this.initCharts(this.props)
    }
    componentWillReceiveProps(nextProps) {
        // if(nextProps.yData[0] != this.props.yData[0]){

        // console.log(nextProps)
        this.initCharts(nextProps);
        // }
    }

    static getDerivedStateFromProps(props, state){
        // console.log(props,'props')
    }
    getSnapshotBeforeUpdate(prevProps, prevState) {
        // console.log(prevProps , 'prevProps')
        return prevProps
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        this.initCharts(snapshot)
    }
    // static get
    //初始化
    initCharts = (props) => {
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
                // data: [0,1,2,3,4,5,6],
                min: 0,
                minInterval: 1
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

    render() {
        return (
            <div >
                <div className="chart" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <div id={`myChart${this.props.index}`} style={{ width: '64%', height: 250 }}></div>
                </div>
            </div>
        )
    }
}
