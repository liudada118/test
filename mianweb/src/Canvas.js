import React, { Component } from 'react';
import * as echarts from 'echarts'
import './chart.css';

export default class App extends Component {
    constructor(props) {
        super(props);
        console.log(props, props.xData)
    }

    componentDidMount() {
        this.initCharts();
    }
    //初始化
    initCharts = () => {
        let myChart = echarts.init(document.getElementById(`myChart${this.props.index}`));
        let option = {
            title: {
                text: this.props.name
            },
            tooltip: {
                trigger: 'axis'

            },
            xAxis: {
                type: 'category',
                data: this.props.xData,
                boundaryGap: false,
                // min:this.props.xData[0], // 起始
                // max:this.props.xData[this.props.xData.length -1] // 终止
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
                    data: this.props.yData,
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
                    <div id={`myChart${this.props.index}`} style={{width: '64%',height: 250}}></div>
                </div>
            </div>
        )
    }
}
